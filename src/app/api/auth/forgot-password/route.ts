import { NextResponse } from 'next/server';
import { getUsers, saveUsers, hashPassword } from '@/lib/serverStore';

export async function POST(req: Request) {
  try {
    const { usn, email, newPassword } = await req.json();

    if (!usn || !email || !newPassword) {
      return NextResponse.json(
        { success: false, message: 'College USN, registered email, and new password are required.' },
        { status: 400 }
      );
    }

    const cleanUsn = usn.trim().toUpperCase();
    const cleanEmail = email.trim().toLowerCase();
    const users = getUsers();

    const user = users.find(u => u.usn.toUpperCase() === cleanUsn && u.email.toLowerCase() === cleanEmail);

    if (!user) {
      return NextResponse.json(
        { success: false, message: 'No matching user account found for the provided USN and Email.' },
        { status: 404 }
      );
    }

    user.passwordHash = hashPassword(newPassword);
    saveUsers(users);

    return NextResponse.json({
      success: true,
      message: `Password reset successfully for USN ${cleanUsn}. You can now log in with your new password.`
    });

  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: `Password reset failed: ${error.message}` },
      { status: 500 }
    );
  }
}
