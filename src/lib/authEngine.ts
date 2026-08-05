import { UserProfile, Department } from '@/types';

export interface CountryCode {
  code: string;
  name: string;
  dialCode: string;
  flag: string;
}

export const COUNTRY_CODES: CountryCode[] = [
  { code: 'US', name: 'United States', dialCode: '+1', flag: '🇺🇸' },
  { code: 'CA', name: 'Canada', dialCode: '+1', flag: '🇨🇦' },
  { code: 'GB', name: 'United Kingdom', dialCode: '+44', flag: '🇬🇧' },
  { code: 'IN', name: 'India', dialCode: '+91', flag: '🇮🇳' },
  { code: 'DE', name: 'Germany', dialCode: '+49', flag: '🇩🇪' },
  { code: 'FR', name: 'France', dialCode: '+33', flag: '🇫🇷' },
  { code: 'JP', name: 'Japan', dialCode: '+81', flag: '🇯🇵' },
  { code: 'AU', name: 'Australia', dialCode: '+61', flag: '🇦🇺' },
  { code: 'SG', name: 'Singapore', dialCode: '+65', flag: '🇸🇬' },
  { code: 'AE', name: 'United Arab Emirates', dialCode: '+971', flag: '🇦🇪' }
];

export interface AuthUser {
  id: string;
  fullName: string;
  usn?: string;
  email: string;
  phoneNumber: string;
  countryCode: string;
  passwordHash: string;
  googleId?: string;
  emailVerified: boolean;
  phoneVerified: boolean;
  profilePhoto: string;
  createdAt: string;
  lastLogin: string;
  accountStatus: 'Active' | 'Suspended' | 'Pending';
  role: 'Admin' | 'Analyst' | 'Editor' | 'Viewer';
  department: Department;
}

export interface PasswordStrengthResult {
  score: number; // 0 to 5
  label: 'Too Short' | 'Weak' | 'Medium' | 'Strong';
  hasMinLength: boolean;
  hasUppercase: boolean;
  hasLowercase: boolean;
  hasNumber: boolean;
  hasSpecial: boolean;
}

export function evaluatePasswordStrength(password: string): PasswordStrengthResult {
  const hasMinLength = password.length >= 8;
  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);

  let score = 0;
  if (hasMinLength) score += 1;
  if (hasUppercase) score += 1;
  if (hasLowercase) score += 1;
  if (hasNumber) score += 1;
  if (hasSpecial) score += 1;

  let label: 'Too Short' | 'Weak' | 'Medium' | 'Strong' = 'Weak';
  if (!hasMinLength) {
    label = 'Too Short';
  } else if (score <= 2) {
    label = 'Weak';
  } else if (score <= 4) {
    label = 'Medium';
  } else {
    label = 'Strong';
  }

  return {
    score,
    label,
    hasMinLength,
    hasUppercase,
    hasLowercase,
    hasNumber,
    hasSpecial
  };
}

// Initial Mock Users Database
export const INITIAL_USERS: AuthUser[] = [
  {
    id: 'usr-1001',
    fullName: 'Alexandra Wright',
    usn: '1MS21CS001',
    email: 'alexandra.wright@enterprise.ai',
    phoneNumber: '5550192831',
    countryCode: '+1',
    passwordHash: 'Password123!',
    googleId: 'google-1001',
    emailVerified: true,
    phoneVerified: true,
    profilePhoto: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    createdAt: '2026-01-10T10:00:00Z',
    lastLogin: new Date().toISOString(),
    accountStatus: 'Active',
    role: 'Admin',
    department: 'Executive'
  }
];

// USN + Password Login via Server API
export async function loginUserWithUsn(usn: string, password: string): Promise<{ success: boolean; message: string; user?: any }> {
  try {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ usn, password })
    });
    const data = await res.json();
    return {
      success: data.success ?? false,
      message: data.message || 'Login attempt completed.',
      user: data.user
    };
  } catch (err: any) {
    return {
      success: false,
      message: 'Failed to connect to authentication server. Please try again.'
    };
  }
}

// Register User via Server API
export async function registerUserWithUsn(payload: {
  fullName: string;
  usn: string;
  email: string;
  phoneNumber: string;
  password: string;
}): Promise<{ success: boolean; message: string; user?: any }> {
  try {
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const data = await res.json();
    return {
      success: data.success ?? false,
      message: data.message || 'Registration completed.',
      user: data.user
    };
  } catch (err: any) {
    return {
      success: false,
      message: 'Failed to register account with server. Please try again.'
    };
  }
}

// Reset Password via Server API
export async function resetPasswordWithUsn(payload: {
  usn: string;
  email: string;
  newPassword: string;
}): Promise<{ success: boolean; message: string }> {
  try {
    const res = await fetch('/api/auth/forgot-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const data = await res.json();
    return {
      success: data.success ?? false,
      message: data.message || 'Password reset request processed.'
    };
  } catch (err: any) {
    return {
      success: false,
      message: 'Failed to reset password. Please try again.'
    };
  }
}
