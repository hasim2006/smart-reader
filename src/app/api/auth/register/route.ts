import { NextResponse } from 'next/server';
import { getUsers, saveUsers, hashPassword, StoredUserAccount } from '@/lib/serverStore';

export async function POST(req: Request) {
  try {
    const { fullName, usn, email, phoneNumber, password } = await req.json();

    if (!fullName || !usn || !email || !phoneNumber || !password) {
      return NextResponse.json(
        { success: false, message: 'All fields (Full Name, College USN, Email, Phone, Password) are required.' },
        { status: 400 }
      );
    }

    const cleanUsn = usn.trim().toUpperCase();
    const cleanEmail = email.trim().toLowerCase();

    const users = getUsers();

    // Check if USN or Email already registered
    const existingUsn = users.find(u => u.usn.toUpperCase() === cleanUsn);
    if (existingUsn) {
      return NextResponse.json(
        { success: false, message: `An account with College USN "${cleanUsn}" already exists.` },
        { status: 409 }
      );
    }

    const existingEmail = users.find(u => u.email.toLowerCase() === cleanEmail);
    if (existingEmail) {
      return NextResponse.json(
        { success: false, message: `An account with Email "${cleanEmail}" already exists.` },
        { status: 409 }
      );
    }

    const newUser: StoredUserAccount = {
      id: `usr-${Date.now()}`,
      fullName: fullName.trim(),
      usn: cleanUsn,
      email: cleanEmail,
      phoneNumber: phoneNumber.trim(),
      passwordHash: hashPassword(password),
      role: 'User',
      createdAt: new Date().toISOString(),
      lastLogin: new Date().toISOString()
    };

    saveUsers([newUser, ...users]);

    return NextResponse.json({
      success: true,
      message: `Account created successfully for ${cleanUsn}. You can now sign in with your USN and password.`,
      user: {
        id: newUser.id,
        fullName: newUser.fullName,
        usn: newUser.usn,
        email: newUser.email,
        role: newUser.role
      }
    });

  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: `Server error during registration: ${error.message}` },
      { status: 500 }
    );
  }
}
