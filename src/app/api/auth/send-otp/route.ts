import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import crypto from 'crypto';

export interface StoredOtpRecord {
  hashedCode: string;
  expiresAt: number;
  requestCount: number;
  firstRequestWindowAt: number;
  failedAttempts: number;
  lockedUntil: number;
  deliveryStatus: 'Sent' | 'Delivered' | 'Failed' | 'Expired';
  providerUsed?: string;
}

declare global {
  var otpStore: Record<string, StoredOtpRecord> | undefined;
}

if (!global.otpStore) {
  global.otpStore = {};
}

const otpStore = global.otpStore;

// Helper to SHA-256 hash OTP code
function hashOtp(code: string): string {
  return crypto.createHash('sha256').update(code.trim()).digest('hex');
}

// Automatic single retry wrapper for gateway dispatch
async function executeWithRetry<T>(fn: () => Promise<T>): Promise<T> {
  try {
    return await fn();
  } catch (firstErr) {
    console.warn('[WhatsApp Gateway] First dispatch attempt failed. Retrying once in 500ms...');
    await new Promise(res => setTimeout(res, 500));
    return await fn();
  }
}

export async function POST(req: Request) {
  try {
    const { channel, target } = await req.json();

    if (!target || typeof target !== 'string' || !target.trim()) {
      return NextResponse.json(
        { success: false, message: 'Invalid target email address or WhatsApp phone number.' },
        { status: 400 }
      );
    }

    const normalizedTarget = target.trim().toLowerCase();
    const now = Date.now();
    const existing = otpStore[normalizedTarget];

    // -------------------------------------------------------------
    // 1. Lockout & Abuse Prevention Rate Limiting
    // -------------------------------------------------------------
    // Rule: Check if currently locked out due to 5 failed verification attempts
    if (existing && existing.lockedUntil > now) {
      const remainingMins = Math.ceil((existing.lockedUntil - now) / 60000);
      return NextResponse.json(
        {
          success: false,
          message: `Account verification locked due to multiple failed attempts. Please try again in ${remainingMins} minutes.`,
          deliveryStatus: 'Failed'
        },
        { status: 423 } // 423 Locked
      );
    }

    // Rule: Rate limit maximum 5 OTP requests per hour (3,600,000 ms)
    let requestCount = existing?.requestCount || 0;
    let firstRequestWindowAt = existing?.firstRequestWindowAt || now;

    if (now - firstRequestWindowAt > 60 * 60 * 1000) {
      // 1 hour window elapsed: reset counter
      requestCount = 0;
      firstRequestWindowAt = now;
    }

    if (requestCount >= 5) {
      return NextResponse.json(
        {
          success: false,
          message: 'Too many OTP requests. Maximum 5 requests allowed per hour. Please wait before retrying.',
          deliveryStatus: 'Failed'
        },
        { status: 429 } // 429 Too Many Requests
      );
    }

    // -------------------------------------------------------------
    // 2. Generate Secure 6-Digit Code & Invalidate Previous OTP
    // -------------------------------------------------------------
    const rawOtpCode = Math.floor(100000 + Math.random() * 900000).toString();
    const hashedCode = hashOtp(rawOtpCode);
    const expiresAt = now + 5 * 60 * 1000; // 5-minute expiration

    // Store hashed OTP record (Invalidates any previous code)
    otpStore[normalizedTarget] = {
      hashedCode,
      expiresAt,
      requestCount: requestCount + 1,
      firstRequestWindowAt,
      failedAttempts: existing?.failedAttempts && existing.lockedUntil <= now ? 0 : (existing?.failedAttempts || 0),
      lockedUntil: existing?.lockedUntil && existing.lockedUntil > now ? existing.lockedUntil : 0,
      deliveryStatus: 'Sent',
      providerUsed: channel === 'whatsapp' ? 'WhatsApp' : 'SMTP'
    };

    console.log(`[OTP Engine] Secure OTP generated for ${normalizedTarget}. SHA256=${hashedCode.slice(0, 10)}... Valid for 5 mins.`);

    const isDevMode = process.env.NODE_ENV === 'development' || process.env.ENABLE_DEV_OTP_FALLBACK === 'true';

    // -------------------------------------------------------------
    // 3. WHATSAPP CHANNEL DISPATCH (Meta Cloud API & Twilio)
    // -------------------------------------------------------------
    if (channel === 'whatsapp' || channel === 'phone') {
      const cleanPhone = target.replace(/[^\d+]/g, '');
      const whatsappToken = process.env.WHATSAPP_CLOUD_API_TOKEN;
      const whatsappPhoneId = process.env.WHATSAPP_PHONE_NUMBER_ID;
      const whatsappTemplateName = process.env.WHATSAPP_TEMPLATE_NAME || 'verification_code';

      const twilioAccountSid = process.env.TWILIO_ACCOUNT_SID;
      const twilioAuthToken = process.env.TWILIO_AUTH_TOKEN;
      const twilioWhatsappNumber = process.env.TWILIO_WHATSAPP_NUMBER || '+14155238886';

      // A) Primary Provider: Official Meta WhatsApp Cloud API
      if (whatsappToken && whatsappPhoneId) {
        try {
          await executeWithRetry(async () => {
            const metaRes = await fetch(
              `https://graph.facebook.com/v19.0/${whatsappPhoneId}/messages`,
              {
                method: 'POST',
                headers: {
                  'Authorization': `Bearer ${whatsappToken}`,
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                  messaging_product: 'whatsapp',
                  recipient_type: 'individual',
                  to: cleanPhone.replace('+', ''),
                  type: 'text',
                  text: {
                    body: `*Track Report Enterprise*\n\nYour security verification code is: *${rawOtpCode}*\n\nThis code will expire in 5 minutes. Do not share it with anyone.`
                  }
                })
              }
            );

            const metaData = await metaRes.json();
            if (!metaRes.ok) {
              throw new Error(metaData.error?.message || 'Meta Cloud API dispatch error');
            }
            return metaData;
          });

          console.log(`[Meta WhatsApp API] OTP message delivered to ${cleanPhone}`);
          otpStore[normalizedTarget].deliveryStatus = 'Delivered';
          otpStore[normalizedTarget].providerUsed = 'Meta Cloud API';

          return NextResponse.json({
            success: true,
            message: `Verification code sent to WhatsApp (${cleanPhone}). Please check your WhatsApp messages.`,
            deliveryStatus: 'Delivered',
            devOtp: isDevMode ? rawOtpCode : undefined
          });
        } catch (metaErr: any) {
          console.error('[Meta WhatsApp API Error]', metaErr);
          otpStore[normalizedTarget].deliveryStatus = 'Failed';
          return NextResponse.json(
            {
              success: false,
              message: `Failed to deliver WhatsApp OTP via Meta Cloud API: ${metaErr.message || 'API error'}`,
              deliveryStatus: 'Failed',
              devOtp: isDevMode ? rawOtpCode : undefined
            },
            { status: 500 }
          );
        }
      }

      // B) Alternative Provider: Twilio WhatsApp API
      if (twilioAccountSid && twilioAuthToken) {
        try {
          await executeWithRetry(async () => {
            const authHeader = 'Basic ' + Buffer.from(`${twilioAccountSid}:${twilioAuthToken}`).toString('base64');
            const params = new URLSearchParams();
            params.append('To', `whatsapp:${cleanPhone}`);
            params.append('From', `whatsapp:${twilioWhatsappNumber}`);
            params.append('Body', `*Track Report Enterprise*\nYour verification code is: *${rawOtpCode}*. Valid for 5 minutes.`);

            const twilioRes = await fetch(
              `https://api.twilio.com/2010-04-01/Accounts/${twilioAccountSid}/Messages.json`,
              {
                method: 'POST',
                headers: {
                  'Authorization': authHeader,
                  'Content-Type': 'application/x-www-form-urlencoded'
                },
                body: params.toString()
              }
            );

            const twilioData = await twilioRes.json();
            if (!twilioRes.ok) {
              throw new Error(twilioData.message || twilioData.detail || 'Twilio WhatsApp API Error');
            }
            return twilioData;
          });

          console.log(`[Twilio WhatsApp] OTP dispatched to ${cleanPhone}`);
          otpStore[normalizedTarget].deliveryStatus = 'Delivered';
          otpStore[normalizedTarget].providerUsed = 'Twilio WhatsApp';

          return NextResponse.json({
            success: true,
            message: `Verification code sent to WhatsApp (${cleanPhone}). Please check your messages.`,
            deliveryStatus: 'Delivered',
            devOtp: isDevMode ? rawOtpCode : undefined
          });
        } catch (twilioErr: any) {
          console.error('[Twilio WhatsApp Error]', twilioErr);
          otpStore[normalizedTarget].deliveryStatus = 'Failed';
          return NextResponse.json(
            {
              success: false,
              message: `Twilio WhatsApp Delivery Error: ${twilioErr.message || 'Gateway error'}`,
              deliveryStatus: 'Failed',
              devOtp: isDevMode ? rawOtpCode : undefined
            },
            { status: 500 }
          );
        }
      }

      // C) Unconfigured Gateway Fallback (Development & Testing)
      console.log(`[WhatsApp Gateway Unconfigured] Returning OTP in response for testing. Target=${normalizedTarget}`);
      otpStore[normalizedTarget].deliveryStatus = 'Sent';
      otpStore[normalizedTarget].providerUsed = 'Dev Fallback';

      return NextResponse.json({
        success: true,
        message: `WhatsApp OTP generated for ${target}. (Configure Meta Cloud API or Twilio credentials in environment for live WhatsApp messages)`,
        deliveryStatus: 'Sent',
        devOtp: isDevMode ? rawOtpCode : undefined
      });
    }

    // -------------------------------------------------------------
    // 4. EMAIL CHANNEL DISPATCH
    // -------------------------------------------------------------
    const smtpUser = process.env.SMTP_USER;
    const smtpPass = process.env.SMTP_PASS;
    const smtpHost = process.env.SMTP_HOST || 'smtp.gmail.com';
    const smtpPort = parseInt(process.env.SMTP_PORT || '587');
    const smtpFrom = process.env.SMTP_FROM || `"Track Report Enterprise" <${smtpUser || 'auth@trackreport.ai'}>`;

    if (smtpUser && smtpPass) {
      try {
        await executeWithRetry(async () => {
          const transporter = nodemailer.createTransport({
            host: smtpHost,
            port: smtpPort,
            secure: smtpPort === 465,
            auth: { user: smtpUser, pass: smtpPass },
            tls: { rejectUnauthorized: false }
          });

          await transporter.sendMail({
            from: smtpFrom,
            to: normalizedTarget,
            subject: 'Track Report Enterprise - Verification Code',
            html: `
              <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 12px; padding: 24px; background-color: #ffffff;">
                <h2 style="color: #0f172a; font-size: 20px; margin-bottom: 8px;">Track Report Enterprise</h2>
                <p style="color: #475569; font-size: 14px; margin-bottom: 20px;">Use the verification code below to complete your authentication request:</p>
                <div style="background-color: #f1f5f9; border-radius: 8px; padding: 16px; text-align: center; margin-bottom: 20px;">
                  <span style="font-family: monospace; font-size: 34px; font-weight: bold; letter-spacing: 8px; color: #2563eb;">${rawOtpCode}</span>
                </div>
                <p style="color: #64748b; font-size: 12px; line-height: 1.5;">This code will expire in 5 minutes. If you did not request this code, please ignore this message.</p>
              </div>
            `
          });
        });

        console.log(`[SMTP Mailer] OTP Email dispatched to ${normalizedTarget}`);
        otpStore[normalizedTarget].deliveryStatus = 'Delivered';

        return NextResponse.json({
          success: true,
          message: `Verification code sent to ${target}. Please check your email inbox.`,
          deliveryStatus: 'Delivered',
          devOtp: isDevMode ? rawOtpCode : undefined
        });
      } catch (smtpErr: any) {
        console.error('[SMTP Error]', smtpErr);
        otpStore[normalizedTarget].deliveryStatus = 'Failed';
        return NextResponse.json(
          {
            success: false,
            message: `SMTP Email Delivery Failed: ${smtpErr.message}`,
            deliveryStatus: 'Failed',
            devOtp: isDevMode ? rawOtpCode : undefined
          },
          { status: 500 }
        );
      }
    } else {
      // Ethereal or Dev Mode Fallback
      otpStore[normalizedTarget].deliveryStatus = 'Sent';
      return NextResponse.json({
        success: true,
        message: `Verification code generated for ${target}.`,
        deliveryStatus: 'Sent',
        devOtp: isDevMode ? rawOtpCode : undefined
      });
    }

  } catch (error: any) {
    console.error('[OTP API Error]', error);
    return NextResponse.json(
      { success: false, message: `Internal server error: ${error.message}` },
      { status: 500 }
    );
  }
}
