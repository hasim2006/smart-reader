import { NextResponse } from 'next/server';
import { getUsers, saveUsers, verifyPassword } from '@/lib/serverStore';

export async function POST(req: Request) {
  try {
    const { usn, password } = await req.json();

    if (!usn || !password) {
      return NextResponse.json(
        { success: false, message: 'Please enter both College USN and Password.' },
        { status: 400 }
      );
    }

    const cleanUsn = usn.trim().toUpperCase();
    const users = getUsers();

    const user = users.find(u => u.usn.toUpperCase() === cleanUsn);

    if (!user) {
      return NextResponse.json(
        { success: false, message: `No account found with College USN "${cleanUsn}". Please verify your USN or register.` },
        { status: 401 }
      );
    }

    const isValidPassword = verifyPassword(password, user.passwordHash);

    if (!isValidPassword) {
      return NextResponse.json(
        { success: false, message: 'Invalid password. Please check your password and try again.' },
        { status: 401 }
      );
    }

    // Update last login timestamp
    user.lastLogin = new Date().toISOString();
    saveUsers(users);

    return NextResponse.json({
      success: true,
      message: `Welcome back, ${user.fullName}!`,
      user: {
        id: user.id,
        fullName: user.fullName,
        usn: user.usn,
        email: user.email,
        phoneNumber: user.phoneNumber,
        role: user.role
      }
    });

  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: `Authentication error: ${error.message}` },
      { status: 500 }
    );
  }
}
