'use client';

import React, { useState, useEffect } from 'react';
import { useApp } from '@/context/AppContext';
import {
  COUNTRY_CODES,
  CountryCode,
  evaluatePasswordStrength,
  loginUserWithUsn,
  registerUserWithUsn,
  resetPasswordWithUsn
} from '@/lib/authEngine';
import {
  X,
  FileSearch,
  Lock,
  Mail,
  Phone,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  User,
  Check,
  GraduationCap
} from 'lucide-react';

export default function AuthModal() {
  const { isAuthModalOpen, setIsAuthModalOpen, setIsAuthenticated, setCurrentView, addNotification, updateUserProfile } = useApp();

  // Mode: 'sign_in' | 'sign_up' | 'forgot_password'
  const [mode, setMode] = useState<'sign_in' | 'sign_up' | 'forgot_password'>('sign_in');

  // Form Field Inputs
  const [usnInput, setUsnInput] = useState<string>('1MS21CS001');
  const [passwordInput, setPasswordInput] = useState<string>('hasim2602');
  const [confirmPasswordInput, setConfirmPasswordInput] = useState<string>('');
  const [fullNameInput, setFullNameInput] = useState<string>('');
  const [emailInput, setEmailInput] = useState<string>('');
  const [phoneInput, setPhoneInput] = useState<string>('');
  const [countryCode, setCountryCode] = useState<CountryCode>(COUNTRY_CODES[0]);
  const [rememberMe, setRememberMe] = useState<boolean>(true);
  const [termsAccepted, setTermsAccepted] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);

  // Status & Error
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    if (isAuthModalOpen) {
      setErrorMessage('');
    }
  }, [isAuthModalOpen, mode]);

  if (!isAuthModalOpen) return null;

  const passStrength = evaluatePasswordStrength(passwordInput);

  // 1. SIGN IN SUBMIT (College USN + Password)
  const handleSignInSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!usnInput.trim() || !passwordInput) {
      setErrorMessage('Please enter both College USN and Password.');
      return;
    }

    setIsLoading(true);
    const res = await loginUserWithUsn(usnInput, passwordInput);
    setIsLoading(false);

    if (res.success && res.user) {
      updateUserProfile({
        name: res.user.fullName,
        email: res.user.email
      });
      setIsAuthenticated(true);
      setIsAuthModalOpen(false);
      setCurrentView('dashboard');
      addNotification('Welcome Back!', `Logged in successfully as ${res.user.fullName} (${res.user.usn}).`, 'success');
    } else {
      setErrorMessage(res.message);
    }
  };

  // 2. SIGN UP SUBMIT (Full Name, USN, Email, Phone, Password)
  const handleSignUpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!fullNameInput.trim()) {
      setErrorMessage('Please enter your Full Name.');
      return;
    }
    if (!usnInput.trim()) {
      setErrorMessage('Please enter your College USN (e.g. 1MS21CS001).');
      return;
    }
    if (!emailInput.trim()) {
      setErrorMessage('Please enter a valid Email address.');
      return;
    }
    if (!phoneInput.trim()) {
      setErrorMessage('Please enter your Phone Number.');
      return;
    }
    if (passStrength.score < 2) {
      setErrorMessage('Password is too weak. Please use at least 8 characters with letters and numbers.');
      return;
    }
    if (passwordInput !== confirmPasswordInput) {
      setErrorMessage('Passwords do not match.');
      return;
    }
    if (!termsAccepted) {
      setErrorMessage('You must accept the Terms & Conditions and Privacy Policy.');
      return;
    }

    setIsLoading(true);
    const res = await registerUserWithUsn({
      fullName: fullNameInput,
      usn: usnInput,
      email: emailInput,
      phoneNumber: `${countryCode.dialCode} ${phoneInput}`,
      password: passwordInput
    });
    setIsLoading(false);

    if (res.success && res.user) {
      updateUserProfile({
        name: res.user.fullName,
        email: res.user.email
      });
      setIsAuthenticated(true);
      setIsAuthModalOpen(false);
      setCurrentView('dashboard');
      addNotification('Account Created!', `Welcome to Track Report Enterprise, ${res.user.fullName}!`, 'success');
    } else {
      setErrorMessage(res.message);
    }
  };

  // 3. FORGOT PASSWORD SUBMIT
  const handleResetPasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!usnInput.trim() || !emailInput.trim() || !passwordInput) {
      setErrorMessage('College USN, registered email, and new password are required.');
      return;
    }

    if (passwordInput !== confirmPasswordInput) {
      setErrorMessage('Passwords do not match.');
      return;
    }

    setIsLoading(true);
    const res = await resetPasswordWithUsn({
      usn: usnInput,
      email: emailInput,
      newPassword: passwordInput
    });
    setIsLoading(false);

    if (res.success) {
      setMode('sign_in');
      addNotification('Password Reset Successful', 'Your password has been updated. Please sign in with your USN.', 'success');
    } else {
      setErrorMessage(res.message);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-950/75 backdrop-blur-md z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto selection:bg-brand-500">
      <div className="w-full max-w-lg max-h-[92vh] overflow-y-auto bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-enterprise-lg relative my-auto animate-in fade-in zoom-in-95 duration-150">
        
        {/* Close Button */}
        <button
          onClick={() => setIsAuthModalOpen(false)}
          className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors z-10"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="p-6 sm:p-8 space-y-6">
          
          {/* Header Brand */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-brand-600 to-accent-500 flex items-center justify-center text-white font-bold shadow-glow-primary">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">Track Report Enterprise</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">College USN & Identity Authentication</p>
            </div>
          </div>

          {/* Mode Switcher Tabs */}
          <div className="flex items-center p-1 rounded-2xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700">
            <button
              onClick={() => setMode('sign_in')}
              className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
                mode === 'sign_in' ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs' : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => setMode('sign_up')}
              className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
                mode === 'sign_up' ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs' : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Create Account
            </button>
            <button
              onClick={() => setMode('forgot_password')}
              className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
                mode === 'forgot_password' ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs' : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Reset Password
            </button>
          </div>

          {/* Alert Message Banner */}
          {errorMessage && (
            <div className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs font-medium flex items-start gap-2.5 animate-in fade-in duration-150">
              <AlertCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* ------------------------------------------------------------- */}
          {/* MODE 1: SIGN IN WITH COLLEGE USN & PASSWORD */}
          {/* ------------------------------------------------------------- */}
          {mode === 'sign_in' && (
            <form onSubmit={handleSignInSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">College USN</label>
                <div className="relative">
                  <GraduationCap className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    required
                    value={usnInput}
                    onChange={e => setUsnInput(e.target.value.toUpperCase())}
                    placeholder="e.g. 1MS21CS001"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold uppercase text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Password</label>
                  <button
                    type="button"
                    onClick={() => setMode('forgot_password')}
                    className="text-[11px] font-semibold text-brand-600 dark:text-brand-400 hover:underline"
                  >
                    Forgot Password?
                  </button>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={passwordInput}
                    onChange={e => setPasswordInput(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-500 focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-2.5 p-1 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs">
                <label className="flex items-center gap-2 text-slate-600 dark:text-slate-400 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={e => setRememberMe(e.target.checked)}
                    className="rounded text-brand-600 focus:ring-brand-500"
                  />
                  <span>Remember Session</span>
                </label>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold shadow-enterprise-md transition-all flex items-center justify-center gap-2"
              >
                {isLoading ? <span>Authenticating USN...</span> : <><span>Sign In with College USN</span> <ArrowRight className="w-4 h-4" /></>}
              </button>
            </form>
          )}

          {/* ------------------------------------------------------------- */}
          {/* MODE 2: SIGN UP / REGISTER ACCOUNT */}
          {/* ------------------------------------------------------------- */}
          {mode === 'sign_up' && (
            <form onSubmit={handleSignUpSubmit} className="space-y-4 animate-in fade-in duration-150">
              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Full Name</label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    required
                    value={fullNameInput}
                    onChange={e => setFullNameInput(e.target.value)}
                    placeholder="Hasim"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">College USN</label>
                <div className="relative">
                  <GraduationCap className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    required
                    value={usnInput}
                    onChange={e => setUsnInput(e.target.value.toUpperCase())}
                    placeholder="e.g. 1MS21CS001"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold uppercase text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Email Address</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="email"
                    required
                    value={emailInput}
                    onChange={e => setEmailInput(e.target.value)}
                    placeholder="hasim@college.edu"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Phone Number</label>
                <div className="flex gap-2">
                  <select
                    value={countryCode.code}
                    onChange={e => {
                      const found = COUNTRY_CODES.find(c => c.code === e.target.value);
                      if (found) setCountryCode(found);
                    }}
                    className="px-2.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-900 dark:text-white focus:outline-none shrink-0"
                  >
                    {COUNTRY_CODES.map(c => (
                      <option key={c.code} value={c.code}>{c.flag} {c.dialCode}</option>
                    ))}
                  </select>

                  <div className="relative flex-1">
                    <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                    <input
                      type="tel"
                      required
                      value={phoneInput}
                      onChange={e => setPhoneInput(e.target.value)}
                      placeholder="9876543210"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-500 focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Password</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={passwordInput}
                    onChange={e => setPasswordInput(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-500 focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-2.5 p-1 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Confirm Password</label>
                <input
                  type="password"
                  required
                  value={confirmPasswordInput}
                  onChange={e => setConfirmPasswordInput(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-500 focus:outline-none"
                />
              </div>

              <div className="pt-2">
                <label className="flex items-start gap-2.5 text-xs text-slate-600 dark:text-slate-400 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={termsAccepted}
                    onChange={e => setTermsAccepted(e.target.checked)}
                    className="mt-0.5 rounded text-brand-600 focus:ring-brand-500"
                  />
                  <span>I agree to the <a href="#" className="text-brand-600 dark:text-brand-400 font-bold underline">Terms & Conditions</a> and <a href="#" className="text-brand-600 dark:text-brand-400 font-bold underline">Privacy Policy</a>.</span>
                </label>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold shadow-enterprise-md transition-all flex items-center justify-center gap-2"
              >
                {isLoading ? <span>Registering Account...</span> : <span>Complete Registration & Sign In</span>}
              </button>
            </form>
          )}

          {/* ------------------------------------------------------------- */}
          {/* MODE 3: FORGOT PASSWORD VIA VERIFIED EMAIL */}
          {/* ------------------------------------------------------------- */}
          {mode === 'forgot_password' && (
            <form onSubmit={handleResetPasswordSubmit} className="space-y-4 animate-in fade-in duration-150">
              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">College USN</label>
                <input
                  type="text"
                  required
                  value={usnInput}
                  onChange={e => setUsnInput(e.target.value.toUpperCase())}
                  placeholder="e.g. 1MS21CS001"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold uppercase text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Registered Email Address</label>
                <input
                  type="email"
                  required
                  value={emailInput}
                  onChange={e => setEmailInput(e.target.value)}
                  placeholder="name@college.edu"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Create New Password</label>
                <input
                  type="password"
                  required
                  value={passwordInput}
                  onChange={e => setPasswordInput(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Confirm New Password</label>
                <input
                  type="password"
                  required
                  value={confirmPasswordInput}
                  onChange={e => setConfirmPasswordInput(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-500 focus:outline-none"
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold shadow-enterprise-md transition-colors"
              >
                {isLoading ? <span>Resetting Password...</span> : <span>Save & Reset Password</span>}
              </button>
            </form>
          )}

        </div>
      </div>
    </div>
  );
}
