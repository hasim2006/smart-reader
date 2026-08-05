import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { adminLockoutStore, addAuditLog } from '@/lib/serverStore';

export async function POST(req: Request) {
  try {
    const { username, password } = await req.json();

    const expectedUsername = process.env.ADMIN_USERNAME || 'Hasim';
    const expectedPassword = process.env.ADMIN_PASSWORD || 'hasim2602';

    const clientIp = req.headers.get('x-forwarded-for') || '127.0.0.1';
    const lockoutKey = `${clientIp}_${username || 'anon'}`;
    const now = Date.now();

    const record = adminLockoutStore[lockoutKey] || { failedAttempts: 0, lockedUntil: 0, lastAttemptAt: 0 };

    // 1. Check if currently locked out
    if (record.lockedUntil > now) {
      const remainingSeconds = Math.ceil((record.lockedUntil - now) / 1000);
      const remainingMins = Math.ceil(remainingSeconds / 60);

      addAuditLog(
        username || 'Unknown',
        'Admin Login Locked Out',
        `Attempt blocked due to active lockout (${remainingSeconds}s remaining).`,
        clientIp
      );

      return NextResponse.json(
        {
          success: false,
          message: `Admin access locked due to 5 consecutive failed attempts. Please wait ${remainingMins} minute(s) before trying again.`,
          lockedUntil: record.lockedUntil,
          remainingSeconds
        },
        { status: 423 } // 423 Locked
      );
    }

    if (!username || !password) {
      return NextResponse.json(
        { success: false, message: 'Please enter both Administrator Username and Password.' },
        { status: 400 }
      );
    }

    // Constant-time string comparison to prevent side-channel timing attacks
    const userBuf = Buffer.from(username.trim());
    const expUserBuf = Buffer.from(expectedUsername);
    const passBuf = Buffer.from(password);
    const expPassBuf = Buffer.from(expectedPassword);

    const isValidUser = userBuf.length === expUserBuf.length && crypto.timingSafeEqual(userBuf, expUserBuf);
    const isValidPass = passBuf.length === expPassBuf.length && crypto.timingSafeEqual(passBuf, expPassBuf);

    if (isValidUser && isValidPass) {
      // Reset lockout counter on success
      adminLockoutStore[lockoutKey] = { failedAttempts: 0, lockedUntil: 0, lastAttemptAt: now };

      const tokenPayload = `${expectedUsername}:${now}:${process.env.JWT_SECRET || 'secret'}`;
      const sessionToken = crypto.createHash('sha256').update(tokenPayload).digest('hex');

      addAuditLog(
        expectedUsername,
        'Admin Login Success',
        'Administrator authenticated successfully to Secret Admin Portal.',
        clientIp
      );

      const response = NextResponse.json({
        success: true,
        message: 'Administrator authentication successful.',
        adminToken: sessionToken,
        adminUser: {
          username: expectedUsername,
          role: 'SuperAdmin',
          authenticatedAt: new Date().toISOString()
        }
      });

      // Set secure HTTP cookie
      response.cookies.set('admin_session', sessionToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 8 * 60 * 60 // 8 hours
      });

      return response;
    } else {
      // Increment failed attempts
      const newFailCount = record.failedAttempts + 1;
      let lockedUntil = 0;

      if (newFailCount >= 5) {
        lockedUntil = now + 15 * 60 * 1000; // 15-minute lockout
      }

      adminLockoutStore[lockoutKey] = {
        failedAttempts: newFailCount,
        lockedUntil,
        lastAttemptAt: now
      };

      addAuditLog(
        username,
        'Admin Login Failed',
        `Failed attempt ${newFailCount}/5. ${newFailCount >= 5 ? 'ACCOUNT LOCKED FOR 15 MINS.' : ''}`,
        clientIp
      );

      if (newFailCount >= 5) {
        return NextResponse.json(
          {
            success: false,
            message: 'Too many failed login attempts. Admin access has been locked for 15 minutes to protect system security.',
            lockedUntil,
            remainingSeconds: 900
          },
          { status: 423 }
        );
      }

      return NextResponse.json(
        {
          success: false,
          message: `Invalid admin credentials. Failed attempts: ${newFailCount}/5. (Account will lock after 5 failures).`,
          failedAttempts: newFailCount,
          attemptsRemaining: 5 - newFailCount
        },
        { status: 401 }
      );
    }

  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: `Admin login server error: ${error.message}` },
      { status: 500 }
    );
  }
}
