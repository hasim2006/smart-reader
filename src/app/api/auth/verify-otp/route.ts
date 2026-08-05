import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { StoredOtpRecord } from '../send-otp/route';

declare global {
  var otpStore: Record<string, StoredOtpRecord> | undefined;
}

const otpStore = global.otpStore || {};

// Helper to hash user input code with SHA-256
function hashOtp(code: string): string {
  return crypto.createHash('sha256').update(code.trim()).digest('hex');
}

export async function POST(req: Request) {
  try {
    const { target, code } = await req.json();

    if (!target || !code) {
      return NextResponse.json(
        { success: false, message: 'Target address and 6-digit verification code are required.' },
        { status: 400 }
      );
    }

    const normalizedTarget = target.trim().toLowerCase();
    const record = otpStore[normalizedTarget];
    const now = Date.now();

    // 1. Check if record exists
    if (!record) {
      return NextResponse.json(
        { success: false, message: 'No active OTP request found for this account. Please request a new code.' },
        { status: 404 }
      );
    }

    // 2. Check 15-minute Lockout Window (5 failed attempts)
    if (record.lockedUntil > now) {
      const remainingMins = Math.ceil((record.lockedUntil - now) / 60000);
      return NextResponse.json(
        {
          success: false,
          message: `Too many invalid attempts. Verification locked for ${remainingMins} more minutes.`
        },
        { status: 423 } // 423 Locked
      );
    }

    // 3. Check 5-minute OTP Expiration
    if (now > record.expiresAt) {
      record.deliveryStatus = 'Expired';
      return NextResponse.json(
        { success: false, message: 'OTP code has expired (5-minute validity). Please request a new code.' },
        { status: 400 }
      );
    }

    // 4. SHA-256 Hash Matching Verification
    const inputHash = hashOtp(code);
    if (record.hashedCode !== inputHash) {
      record.failedAttempts = (record.failedAttempts || 0) + 1;

      if (record.failedAttempts >= 5) {
        // Lock out verification for 15 minutes
        record.lockedUntil = now + 15 * 60 * 1000;
        console.warn(`[OTP Engine Security] 5 failed attempts for ${normalizedTarget}. Locked for 15 minutes.`);
        return NextResponse.json(
          {
            success: false,
            message: '5 incorrect attempts reached. Verification locked for 15 minutes to protect your account.'
          },
          { status: 423 }
        );
      }

      const remainingAttempts = 5 - record.failedAttempts;
      return NextResponse.json(
        {
          success: false,
          message: `Invalid 6-digit code. ${remainingAttempts} attempt${remainingAttempts === 1 ? '' : 's'} remaining before 15-minute lockout.`
        },
        { status: 400 }
      );
    }

    // 5. Success! Delete OTP record immediately from memory
    delete otpStore[normalizedTarget];
    console.log(`[OTP Engine Security] OTP verified successfully for ${normalizedTarget}. Record deleted.`);

    return NextResponse.json({
      success: true,
      message: 'OTP verified successfully.'
    });

  } catch (error: any) {
    console.error('[Verify OTP API Error]', error);
    return NextResponse.json(
      { success: false, message: 'Server error processing verification request.' },
      { status: 500 }
    );
  }
}
