'use client';

import React, { useState } from 'react';
import { useApp, AppView } from '@/context/AppContext';
import {
  Search,
  Bell,
  UploadCloud,
  Layers,
  Sparkles,
  Command,
  ChevronDown,
  Check,
  ShieldCheck,
  Plus,
  LogOut,
  User,
  Menu,
  LayoutDashboard,
  FileText,
  FolderKanban,
  MessageSquare,
  BarChart3,
  Settings,
  FileSearch
} from 'lucide-react';
import NotificationDrawer from './NotificationDrawer';

interface HeaderProps {
  onToggleMobileSidebar?: () => void;
}

export default function Header({ onToggleMobileSidebar }: HeaderProps) {
  const {
    currentView,
    setCurrentView,
    collections,
    documents,
    setIsGlobalSearchOpen,
    notifications,
    addDocument,
    isAuthenticated,
    setIsAuthModalOpen,
    userProfile,
    logoutUser
  } = useApp();

  const [isNotifOpen, setIsNotifOpen] = useState<boolean>(false);
  const [selectedWorkspace, setSelectedWorkspace] = useState<string>('All Enterprise Workspaces');
  const [isWsDropdownOpen, setIsWsDropdownOpen] = useState<boolean>(false);
  const [isPageDropdownOpen, setIsPageDropdownOpen] = useState<boolean>(false);

  const navTabs: { id: AppView; label: string; icon: React.ElementType; badge?: string }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'documents', label: 'Documents', icon: FileText, badge: `${documents.length}` },
    { id: 'collections', label: 'Collections', icon: FolderKanban },
    { id: 'search', label: 'Hybrid Search', icon: Search },
    { id: 'chat', label: 'AI RAG Chat', icon: MessageSquare, badge: 'Live' },
    { id: 'ai-tools', label: 'AI Tools', icon: Sparkles, badge: 'AI' },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'admin', label: 'Governance', icon: ShieldCheck },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const handleQuickUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      addDocument(file.name, file.size);
      setCurrentView('documents');
    }
  };

  const getPageTitle = () => {
    switch (currentView) {
      case 'dashboard': return 'Executive Dashboard';
      case 'documents': return 'Document Management';
      case 'collections': return 'Knowledge Base Workspaces';
      case 'search': return 'Hybrid Semantic Search';
      case 'chat': return 'Enterprise AI RAG Chat';
      case 'ai-tools': return 'Document Intelligence';
      case 'analytics': return 'Performance & Analytics';
      case 'admin': return 'Governance & Admin Panel';
      case 'settings': return 'System Preferences';
      default: return 'Track Report Enterprise';
    }
  };

  return (
    <div className="sticky top-0 z-20 flex flex-col bg-white/95 dark:bg-[#0B0F19]/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors">
      <header className="h-16 px-3 sm:px-6 flex items-center justify-between">
        {/* Left Side: Brand & Page Dropdown Selector */}
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          {onToggleMobileSidebar && (
            <button
              onClick={onToggleMobileSidebar}
              className="lg:hidden p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors shrink-0"
              title="Open Navigation"
            >
              <Menu className="w-5 h-5" />
            </button>
          )}

          {/* Mobile Workspace Brand Logo */}
          <div 
            onClick={() => setCurrentView('home')}
            className="flex lg:hidden items-center gap-2 cursor-pointer shrink-0"
          >
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-brand-600 to-accent-500 flex items-center justify-center text-white shadow-glow-primary">
              <FileSearch className="w-4 h-4" />
            </div>
          </div>

          {/* Mobile Page Selector Dropdown */}
          <div className="relative lg:hidden">
            <button
              onClick={() => setIsPageDropdownOpen(!isPageDropdownOpen)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-extrabold text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700"
            >
              <span className="truncate max-w-[120px] sm:max-w-[160px]">{getPageTitle()}</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            </button>

            {isPageDropdownOpen && (
              <div className="absolute left-0 mt-2 w-56 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-enterprise-lg p-1.5 z-50 animate-in fade-in zoom-in-95 duration-100">
                <div className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Switch Platform View
                </div>
                {navTabs.map(tab => {
                  const Icon = tab.icon;
                  const isActive = currentView === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => {
                        setCurrentView(tab.id);
                        setIsPageDropdownOpen(false);
                      }}
                      className={`w-full text-left px-2.5 py-2 rounded-xl text-xs font-bold flex items-center justify-between transition-colors ${
                        isActive
                          ? 'bg-brand-600 text-white'
                          : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <Icon className="w-4 h-4" />
                        <span>{tab.label}</span>
                      </div>
                      {isActive && <Check className="w-3.5 h-3.5" />}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Desktop Page Title */}
          <div className="hidden lg:block">
            <h1 className="text-base font-extrabold text-slate-900 dark:text-white tracking-tight">
              {getPageTitle()}
            </h1>
          </div>

          {/* Workspace Dropdown (Desktop) */}
          <div className="relative hidden md:block">
            <button
              onClick={() => setIsWsDropdownOpen(!isWsDropdownOpen)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-200 border border-slate-200/80 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
            >
              <Layers className="w-3.5 h-3.5 text-brand-600 dark:text-brand-400" />
              <span>{selectedWorkspace}</span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>

            {isWsDropdownOpen && (
              <div className="absolute left-0 mt-2 w-64 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-enterprise-lg p-1.5 z-50">
                <div className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Switch Knowledge Scope
                </div>
                <button
                  onClick={() => { setSelectedWorkspace('All Enterprise Workspaces'); setIsWsDropdownOpen(false); }}
                  className="w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-between"
                >
                  <span>All Enterprise Workspaces</span>
                  {selectedWorkspace === 'All Enterprise Workspaces' && <Check className="w-3.5 h-3.5 text-brand-500" />}
                </button>
                {collections.map(col => (
                  <button
                    key={col.id}
                    onClick={() => { setSelectedWorkspace(col.name); setIsWsDropdownOpen(false); }}
                    className="w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-between"
                  >
                    <span className="truncate">{col.name}</span>
                    {selectedWorkspace === col.name && <Check className="w-3.5 h-3.5 text-brand-500" />}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Side: Global Search, Quick Ingest, Notifications, Auth */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <button
            onClick={() => setIsGlobalSearchOpen(true)}
            className="flex items-center gap-2 p-2 sm:px-3 sm:py-1.5 rounded-xl bg-slate-100/80 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 text-xs font-medium hover:border-brand-500 transition-colors"
          >
            <Search className="w-4 h-4 text-slate-400" />
            <span className="hidden md:inline">Search chunks...</span>
            <kbd className="hidden md:inline px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-700 text-[10px] font-mono text-slate-600 dark:text-slate-300">
              Ctrl+K
            </kbd>
          </button>

          {/* Quick Upload Button */}
          <label className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-semibold shadow-enterprise-sm cursor-pointer transition-all active:scale-[0.98]">
            <Plus className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Ingest</span>
            <input type="file" className="hidden" onChange={handleQuickUpload} />
          </label>

          {/* Notifications Button */}
          <div className="relative">
            <button
              onClick={() => setIsNotifOpen(!isNotifOpen)}
              className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 relative transition-colors"
            >
              <Bell className="w-4.5 h-4.5" />
              {notifications.length > 0 && (
                <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-brand-600 animate-ping" />
              )}
              {notifications.length > 0 && (
                <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-brand-600" />
              )}
            </button>

            {isNotifOpen && (
              <NotificationDrawer onClose={() => setIsNotifOpen(false)} />
            )}
          </div>

          {/* User Auth Controls */}
          {isAuthenticated ? (
            <div className="flex items-center gap-2 pl-2 border-l border-slate-200 dark:border-slate-800">
              <img
                src={userProfile.avatarUrl}
                alt={userProfile.name}
                className="w-7 h-7 rounded-full object-cover border border-brand-500 cursor-pointer"
                onClick={() => setCurrentView('settings')}
                title={`${userProfile.name} (${userProfile.role})`}
              />
              <button
                onClick={logoutUser}
                className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                title="Sign Out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => setIsAuthModalOpen(true)}
              className="px-3 py-1.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-semibold shadow-enterprise-xs flex items-center gap-1.5 transition-all"
            >
              <User className="w-3.5 h-3.5" />
              <span>Sign In</span>
            </button>
          )}
        </div>
      </header>

      {/* Upper Top Side Horizontal Page Navigation Bar (Mobile / Phone View - lg:hidden) */}
      <div className="lg:hidden flex items-center gap-1.5 px-3 py-2 border-t border-slate-200/80 dark:border-slate-800/80 overflow-x-auto scrollbar-none bg-slate-50/80 dark:bg-[#0B0F19]/90">
        {navTabs.map(tab => {
          const Icon = tab.icon;
          const isActive = currentView === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setCurrentView(tab.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-extrabold whitespace-nowrap shrink-0 transition-all ${
                isActive
                  ? 'bg-brand-600 text-white shadow-enterprise-xs'
                  : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-slate-400'}`} />
              <span>{tab.label}</span>
              {tab.badge && (
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${isActive ? 'bg-white/20 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'}`}>
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
