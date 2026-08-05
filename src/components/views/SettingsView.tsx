'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { Department } from '@/types';
import {
  User,
  Save,
  Mail,
  Briefcase,
  Shield
} from 'lucide-react';

const PRESET_AVATARS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80'
];

export default function SettingsView() {
  const { userProfile, updateUserProfile, addNotification } = useApp();

  // User Profile Form State
  const [userName, setUserName] = useState<string>(userProfile.name);
  const [userEmail, setUserEmail] = useState<string>(userProfile.email);
  const [userAvatar, setUserAvatar] = useState<string>(userProfile.avatarUrl || PRESET_AVATARS[0]);
  const [userRole, setUserRole] = useState<'Admin' | 'Analyst' | 'Editor' | 'Viewer'>(userProfile.role || 'Admin');
  const [userDepartment, setUserDepartment] = useState<Department>(userProfile.department || 'Executive');

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateUserProfile({
      name: userName,
      email: userEmail,
      avatarUrl: userAvatar,
      role: userRole,
      department: userDepartment
    });
    addNotification('Profile Updated', 'Your user profile and identity settings have been saved.', 'success');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div>
        <h2 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">User Profile & Personal Preferences</h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
          Manage your personal user account profile details, avatar, department, and identity settings.
        </p>
      </div>

      {/* USER PROFILE & ACCOUNT INFORMATION */}
      <form onSubmit={handleSaveProfile} className="p-6 rounded-3xl glass-panel border border-slate-200 dark:border-slate-800 shadow-enterprise-sm space-y-5">
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
          <h3 className="text-sm font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <User className="w-4.5 h-4.5 text-brand-600 dark:text-brand-400" />
            <span>User Profile & Account Information</span>
          </h3>
          <span className="text-[11px] font-bold text-slate-500 bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-lg">
            Active Account
          </span>
        </div>

        {/* Avatar Photo Selector */}
        <div>
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-2">Profile Avatar Photo</label>
          <div className="flex items-center gap-4">
            <img
              src={userAvatar}
              alt="Avatar Preview"
              className="w-16 h-16 rounded-full object-cover border-2 border-brand-500 shadow-enterprise-xs shrink-0"
            />
            <div className="space-y-2 flex-1">
              <div className="flex items-center gap-2">
                {PRESET_AVATARS.map((url, idx) => (
                  <img
                    key={idx}
                    src={url}
                    alt={`Preset ${idx + 1}`}
                    onClick={() => setUserAvatar(url)}
                    className={`w-9 h-9 rounded-full object-cover cursor-pointer border-2 transition-transform hover:scale-110 ${
                      userAvatar === url ? 'border-brand-600 ring-2 ring-brand-500/50' : 'border-transparent opacity-70 hover:opacity-100'
                    }`}
                  />
                ))}
              </div>
              <input
                type="url"
                value={userAvatar}
                onChange={e => setUserAvatar(e.target.value)}
                placeholder="Or paste custom image URL..."
                className="w-full max-w-md px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Profile Inputs Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs pt-2">
          <div>
            <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Full Name</label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="text"
                required
                value={userName}
                onChange={e => setUserName(e.target.value)}
                placeholder="Enter your full name"
                className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 font-semibold text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Corporate Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="email"
                required
                value={userEmail}
                onChange={e => setUserEmail(e.target.value)}
                placeholder="name@company.com"
                className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 font-semibold text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Department</label>
            <div className="relative">
              <Briefcase className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <select
                value={userDepartment}
                onChange={e => setUserDepartment(e.target.value as Department)}
                className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 font-semibold text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-500 focus:outline-none"
              >
                {['Executive', 'Finance', 'Legal', 'Engineering', 'HR', 'Sales', 'R&D'].map(d => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Access Role & Governance Title</label>
            <div className="relative">
              <Shield className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <select
                value={userRole}
                onChange={e => setUserRole(e.target.value as any)}
                className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 font-semibold text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-500 focus:outline-none"
              >
                <option value="Admin">Admin (Full System Access)</option>
                <option value="Analyst">Analyst (RAG Query & Document Analysis)</option>
                <option value="Editor">Editor (Upload & Workspace Management)</option>
                <option value="Viewer">Viewer (Read Only)</option>
              </select>
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs shadow-enterprise-xs transition-all active:scale-95"
          >
            <Save className="w-4 h-4" />
            <span>Save Profile Details</span>
          </button>
        </div>
      </form>
    </div>
  );
}
