'use client';

import React from 'react';
import { useApp, AppView } from '@/context/AppContext';
import {
  LayoutDashboard,
  FileText,
  FolderKanban,
  Search,
  MessageSquare,
  Sparkles,
  BarChart3,
  ShieldCheck,
  Settings,
  Moon,
  Sun,
  FileSearch,
  LogOut,
  X
} from 'lucide-react';

interface NavItem {
  id: AppView;
  label: string;
  icon: React.ElementType;
  badge?: string;
  badgeColor?: string;
}

interface SidebarProps {
  isOpenMobile?: boolean;
  onCloseMobile?: () => void;
}

export default function Sidebar({ isOpenMobile = false, onCloseMobile }: SidebarProps) {
  const { currentView, setCurrentView, isDarkMode, toggleDarkMode, userProfile, documents, logoutUser } = useApp();

  const handleNavClick = (view: AppView) => {
    setCurrentView(view);
    if (onCloseMobile) onCloseMobile();
  };

  const navItems: NavItem[] = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'documents', label: 'Documents', icon: FileText, badge: `${documents.length}` },
    { id: 'collections', label: 'Collections', icon: FolderKanban },
    { id: 'search', label: 'Hybrid Search', icon: Search },
    { id: 'chat', label: 'AI RAG Chat', icon: MessageSquare, badge: 'Live', badgeColor: 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400' },
    { id: 'ai-tools', label: 'Document AI Tools', icon: Sparkles, badge: 'AI', badgeColor: 'bg-violet-500/20 text-violet-600 dark:text-violet-400' },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'admin', label: 'Admin Governance', icon: ShieldCheck },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const sidebarContent = (
    <div className="flex flex-col justify-between h-full p-4 select-none">
      <div>
        {/* Workspace Brand Logo & Mobile Close */}
        <div className="flex items-center justify-between mb-6">
          <div 
            onClick={() => handleNavClick('home')}
            className="flex items-center gap-3 px-2 py-1 cursor-pointer group"
          >
            <div className="w-9 h-9 rounded-enterprise bg-gradient-to-tr from-brand-600 to-accent-500 flex items-center justify-center text-white shadow-glow-primary group-hover:scale-105 transition-transform">
              <FileSearch className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-base tracking-tight text-slate-900 dark:text-white">Track Report</span>
                <span className="text-[10px] font-bold bg-brand-100 dark:bg-brand-900/60 text-brand-700 dark:text-brand-300 px-1.5 py-0.2 rounded border border-brand-200 dark:border-brand-800">
                  PRO
                </span>
              </div>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">Enterprise Engine</p>
            </div>
          </div>

          {onCloseMobile && (
            <button
              onClick={onCloseMobile}
              className="lg:hidden p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Navigation List */}
        <div className="space-y-1">
          <p className="px-3 text-[10px] font-extrabold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2">
            Platform Navigation
          </p>
          {navItems.map(item => {
            const IconComp = item.icon;
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-enterprise text-sm font-semibold transition-all ${
                  isActive
                    ? 'bg-brand-600 text-white shadow-enterprise-sm'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/80 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  <IconComp className={`w-4.5 h-4.5 ${isActive ? 'text-white' : 'text-slate-400 dark:text-slate-500'}`} />
                  <span>{item.label}</span>
                </div>

                {item.badge && (
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      isActive
                        ? 'bg-white/20 text-white'
                        : item.badgeColor || 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Footer Section */}
      <div className="pt-4 border-t border-slate-200 dark:border-slate-800 space-y-3">
        {/* Dark Mode Toggle Bar */}
        <button
          onClick={toggleDarkMode}
          className="w-full flex items-center justify-between px-3 py-2 rounded-enterprise text-xs font-semibold text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          <div className="flex items-center gap-2">
            {isDarkMode ? <Moon className="w-3.5 h-3.5 text-accent-400" /> : <Sun className="w-3.5 h-3.5 text-amber-500" />}
            <span>{isDarkMode ? 'Dark Mode' : 'Light Mode'}</span>
          </div>
          <span className="text-[10px] text-slate-400 font-normal">Toggle</span>
        </button>

        {/* User Profile Card */}
        <div className="flex items-center justify-between p-2 rounded-enterprise hover:bg-slate-100 dark:hover:bg-slate-800/80 transition-colors group">
          <div 
            onClick={() => handleNavClick('settings')}
            className="flex items-center gap-3 min-w-0 flex-1 cursor-pointer"
          >
            <img src={userProfile.avatarUrl} alt={userProfile.name} className="w-8 h-8 rounded-full object-cover border border-brand-500" />
            <div className="truncate flex-1">
              <div className="text-xs font-bold text-slate-900 dark:text-white truncate flex items-center gap-1">
                <span>{userProfile.name}</span>
              </div>
              <div className="text-[10px] text-slate-500 dark:text-slate-400 truncate">{userProfile.role} • {userProfile.department}</div>
            </div>
          </div>

          <button
            onClick={logoutUser}
            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
            title="Sign Out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Permanent Vertical Sidebar (>= lg screen) */}
      <aside className="hidden lg:flex w-64 h-screen bg-white dark:bg-[#0B0F19] border-r border-slate-200 dark:border-slate-800 flex-col sticky top-0 shrink-0 z-30">
        {sidebarContent}
      </aside>

      {/* Mobile Slide-Over Drawer Overlay (< lg screen) */}
      {isOpenMobile && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div 
            className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm transition-opacity" 
            onClick={onCloseMobile} 
          />
          <div className="relative flex-1 max-w-xs w-full bg-white dark:bg-[#0B0F19] shadow-2xl h-full z-10 animate-in slide-in-from-left duration-200">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
}
