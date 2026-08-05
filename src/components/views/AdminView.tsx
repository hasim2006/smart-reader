'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '@/context/AppContext';
import { SiteContent, AdminAuditLog, VersionSnapshot } from '@/lib/serverStore';
import {
  ShieldCheck,
  Lock,
  User,
  Key,
  LogOut,
  Sparkles,
  LayoutDashboard,
  FileText,
  MessageSquare,
  Building2,
  HelpCircle,
  UploadCloud,
  History,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
  RefreshCw,
  Plus,
  Trash2,
  Edit3,
  Save,
  Send,
  Upload,
  UserPlus,
  Users,
  Search,
  Check,
  X,
  FileSearch,
  ExternalLink,
  ChevronRight,
  Shield,
  Clock,
  Activity,
  Database,
  Unlock,
  Mail,
  Cpu
} from 'lucide-react';

export default function AdminView() {
  const { addNotification, fetchSiteContent, modelConfig, updateModelConfig } = useApp();

  // Authentication State
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(false);
  const [adminUsernameInput, setAdminUsernameInput] = useState<string>('Hasim');
  const [adminPasswordInput, setAdminPasswordInput] = useState<string>('');
  const [authError, setAuthError] = useState<string>('');
  const [failedAttempts, setFailedAttempts] = useState<number>(0);
  const [isLockedOut, setIsLockedOut] = useState<boolean>(false);
  const [lockoutCountdown, setLockoutCountdown] = useState<number>(0);
  const [isLoadingAuth, setIsLoadingAuth] = useState<boolean>(false);

  // Admin Dashboard & Content State
  const [activeTab, setActiveTab] = useState<'dashboard' | 'hero' | 'testimonials' | 'logos_banners' | 'faqs' | 'system_gateway' | 'media' | 'versions'>('dashboard');
  const [content, setContent] = useState<SiteContent | null>(null);
  const [draftContent, setDraftContent] = useState<SiteContent | null>(null);
  const [auditLogs, setAuditLogs] = useState<AdminAuditLog[]>([]);
  const [versionHistory, setVersionHistory] = useState<VersionSnapshot[]>([]);
  const [isPublishing, setIsPublishing] = useState<boolean>(false);
  const [publishSuccess, setPublishSuccess] = useState<string>('');
  const [isPreviewOpen, setIsPreviewOpen] = useState<boolean>(false);
  const [isUploadingMedia, setIsUploadingMedia] = useState<boolean>(false);

  // Protected Gateway Credentials State inside Admin Panel
  const [isGatewayUnlocked, setIsGatewayUnlocked] = useState<boolean>(false);
  const [vectorProvider, setVectorProvider] = useState<any>(modelConfig.vectorDbProvider || 'Qdrant');
  const [openaiKey, setOpenaiKey] = useState<string>('sk-proj-91823719283719283712938123');
  const [anthropicKey, setAnthropicKey] = useState<string>('sk-ant-812371928371928371928371');
  const [geminiKey, setGeminiKey] = useState<string>('AIzaSyD823719283719283719283712');
  const [showOpenaiKey, setShowOpenaiKey] = useState<boolean>(false);
  const [showAnthropicKey, setShowAnthropicKey] = useState<boolean>(false);
  const [showGeminiKey, setShowGeminiKey] = useState<boolean>(false);

  const [smtpHost, setSmtpHost] = useState<string>('smtp.gmail.com');
  const [smtpPort, setSmtpPort] = useState<string>('587');
  const [smtpUser, setSmtpUser] = useState<string>('auth@trackreport.ai');
  const [smtpPass, setSmtpPass] = useState<string>('app-password-secret-1234');
  const [showSmtpPass, setShowSmtpPass] = useState<boolean>(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchContent();
  }, []);

  // Lockout countdown timer
  useEffect(() => {
    let timer: any = null;
    if (lockoutCountdown > 0) {
      timer = setInterval(() => {
        setLockoutCountdown(prev => {
          if (prev <= 1) {
            setIsLockedOut(false);
            setAuthError('');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [lockoutCountdown]);

  const fetchContent = async () => {
    try {
      const res = await fetch('/api/admin/content');
      const data = await res.json();
      if (data.success && data.content) {
        setContent(data.content);
        setDraftContent(JSON.parse(JSON.stringify(data.content)));
      }
    } catch (err) {
      console.error('Failed to load site content', err);
    }
  };

  const fetchAuditLogs = async () => {
    try {
      const res = await fetch('/api/admin/audit-logs');
      const data = await res.json();
      if (data.success && data.logs) {
        setAuditLogs(data.logs);
      }
    } catch (err) {}
  };

  const fetchVersionHistory = async () => {
    try {
      const res = await fetch('/api/admin/version-history');
      const data = await res.json();
      if (data.success && data.versions) {
        setVersionHistory(data.versions);
      }
    } catch (err) {}
  };

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    setIsLoadingAuth(true);

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: adminUsernameInput,
          password: adminPasswordInput
        })
      });

      const data = await res.json();
      setIsLoadingAuth(false);

      if (res.ok && data.success) {
        setIsAdminAuthenticated(true);
        setIsGatewayUnlocked(true); // Unlock credentials when admin logs into admin panel
        setFailedAttempts(0);
        addNotification('Admin Verified', 'Authenticated as Administrator (Hasim).', 'success');
        fetchAuditLogs();
        fetchVersionHistory();
      } else {
        if (res.status === 423) {
          setIsLockedOut(true);
          setLockoutCountdown(data.remainingSeconds || 900);
        }
        if (data.failedAttempts) setFailedAttempts(data.failedAttempts);
        setAuthError(data.message || 'Invalid administrator credentials.');
      }
    } catch (err: any) {
      setIsLoadingAuth(false);
      setAuthError('Connection error. Could not reach server.');
    }
  };

  const handlePublishContent = async () => {
    if (!draftContent) return;
    setIsPublishing(true);
    setPublishSuccess('');

    try {
      const res = await fetch('/api/admin/content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: draftContent,
          adminUser: adminUsernameInput || 'Hasim',
          actionDescription: 'Updated website content live from Admin Panel.'
        })
      });

      const data = await res.json();
      setIsPublishing(false);

      if (data.success) {
        setContent(JSON.parse(JSON.stringify(draftContent)));
        updateModelConfig({ vectorDbProvider: vectorProvider });

        // INSTANT REAL-TIME ON-THE-SPOT SYNC TO MAIN WEBSITE
        await fetchSiteContent();

        setPublishSuccess('Website content updated live on the spot for all users!');
        addNotification('Published Live', 'Changes updated on the spot across the main website.', 'success');
        fetchAuditLogs();
        fetchVersionHistory();
        setTimeout(() => setPublishSuccess(''), 4000);
      } else {
        alert(`Publish failed: ${data.message}`);
      }
    } catch (err: any) {
      setIsPublishing(false);
      alert(`Publish error: ${err.message}`);
    }
  };

  const handleRestoreVersion = async (versionId: string) => {
    if (!confirm('Are you sure you want to restore this previous content snapshot live?')) return;
    try {
      const res = await fetch('/api/admin/version-history', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ versionId, adminUser: adminUsernameInput || 'Hasim' })
      });
      const data = await res.json();
      if (data.success && data.restoredContent) {
        setContent(data.restoredContent);
        setDraftContent(JSON.parse(JSON.stringify(data.restoredContent)));
        
        // INSTANT REAL-TIME ON-THE-SPOT SYNC TO MAIN WEBSITE
        await fetchSiteContent();

        setPublishSuccess('Restored previous snapshot live on the spot!');
        addNotification('Version Restored', 'Snapshot restored successfully.', 'info');
        fetchAuditLogs();
        setTimeout(() => setPublishSuccess(''), 4000);
      }
    } catch (err: any) {
      alert(`Restore failed: ${err.message}`);
    }
  };

  const handleFileUploadMedia = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !e.target.files[0]) return;
    const file = e.target.files[0];
    setIsUploadingMedia(true);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('mediaType', file.type.startsWith('image') ? 'image' : 'pdf');

    try {
      const res = await fetch('/api/admin/upload-media', {
        method: 'POST',
        body: formData
      });
      const data = await res.json();
      setIsUploadingMedia(false);

      if (data.success && data.mediaUrl) {
        alert(`File uploaded successfully!\nPath: ${data.mediaUrl}`);
        addNotification('Media Uploaded', `File ${file.name} saved to ${data.mediaUrl}`, 'success');
        fetchAuditLogs();
      } else {
        alert(`Upload error: ${data.message}`);
      }
    } catch (err: any) {
      setIsUploadingMedia(false);
      alert(`Upload failed: ${err.message}`);
    }
  };

  // -------------------------------------------------------------
  // STATE 1: UNAUTHENTICATED ADMIN VERIFICATION GATE
  // -------------------------------------------------------------
  if (!isAdminAuthenticated) {
    return (
      <div className="py-12 px-4 max-w-md mx-auto animate-in fade-in duration-200">
        <div className="p-8 rounded-3xl glass-panel border border-slate-200/80 dark:border-slate-800 shadow-enterprise-lg space-y-6 relative overflow-hidden text-slate-900 dark:text-white">
          <div className="text-center space-y-2">
            <div className="w-14 h-14 rounded-2xl bg-brand-50 dark:bg-brand-950/60 text-brand-600 dark:text-brand-400 flex items-center justify-center mx-auto shadow-glow-primary">
              <ShieldCheck className="w-7 h-7" />
            </div>
            <h2 className="text-xl font-extrabold tracking-tight">Admin Governance Access</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              Enter administrator credentials to unlock website management & gateway settings.
            </p>
          </div>

          {authError && (
            <div className={`p-4 rounded-2xl border text-xs font-semibold flex items-start gap-2.5 ${
              isLockedOut
                ? 'bg-rose-50 dark:bg-rose-950/60 border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300'
                : 'bg-amber-50 dark:bg-amber-950/60 border-amber-200 dark:border-amber-800 text-amber-700 dark:text-amber-300'
            }`}>
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <div>
                <p>{authError}</p>
                {isLockedOut && (
                  <p className="mt-1 font-mono text-sm font-extrabold text-rose-600 dark:text-rose-400">
                    Lockout Countdown: {Math.floor(lockoutCountdown / 60)}m {lockoutCountdown % 60}s
                  </p>
                )}
              </div>
            </div>
          )}

          <form onSubmit={handleAdminLogin} className="space-y-4">
            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Administrator Username</label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="text"
                  required
                  disabled={isLockedOut}
                  value={adminUsernameInput}
                  onChange={e => setAdminUsernameInput(e.target.value)}
                  placeholder="Admin Username (Hasim)"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-500 focus:outline-none disabled:opacity-50"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Security Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="password"
                  required
                  disabled={isLockedOut}
                  value={adminPasswordInput}
                  onChange={e => setAdminPasswordInput(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-500 focus:outline-none disabled:opacity-50"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoadingAuth || isLockedOut}
              className="w-full py-3 rounded-xl bg-brand-600 hover:bg-brand-700 disabled:opacity-50 text-white font-bold text-xs shadow-enterprise-md transition-all flex items-center justify-center gap-2"
            >
              {isLoadingAuth ? (
                <span>Verifying Credentials...</span>
              ) : (
                <>
                  <Key className="w-4 h-4" />
                  <span>Authenticate & Unlock Admin Panel</span>
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // STATE 2: AUTHENTICATED ADMIN MANAGEMENT PANEL
  // -------------------------------------------------------------
  return (
    <div className="space-y-6 animate-in fade-in duration-200 text-slate-900 dark:text-white">
      {/* Hidden File Input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileUploadMedia}
        className="hidden"
      />

      {/* Top Header Bar */}
      <div className="p-4 rounded-2xl glass-panel border border-slate-200/80 dark:border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-brand-600 to-accent-500 flex items-center justify-center text-white font-bold shadow-glow-primary">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-extrabold tracking-tight">Admin Governance & Content Management</h2>
              <span className="text-[10px] font-bold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 px-2 py-0.5 rounded border border-emerald-200 dark:border-emerald-800">
                INSTANT ON-THE-SPOT SYNC
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium">Logged in as {adminUsernameInput} (SuperAdmin)</p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
          {publishSuccess && (
            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1 bg-emerald-50 dark:bg-emerald-950/60 px-3 py-1.5 rounded-xl border border-emerald-200 dark:border-emerald-800">
              <CheckCircle2 className="w-4 h-4" /> {publishSuccess}
            </span>
          )}

          <button
            onClick={() => setIsPreviewOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-bold text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
          >
            <Eye className="w-4 h-4 text-brand-500" />
            <span>Live Preview</span>
          </button>

          <button
            onClick={handlePublishContent}
            disabled={isPublishing}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 disabled:opacity-50 text-xs font-bold text-white shadow-enterprise-md transition-all active:scale-95"
          >
            <Send className="w-4 h-4" />
            <span>{isPublishing ? 'Publishing...' : 'Publish Live On-the-Spot'}</span>
          </button>

          <button
            onClick={() => setIsAdminAuthenticated(false)}
            className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
            title="Lock Admin Session"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Workspace Layout */}
      <div className="flex flex-col md:flex-row gap-6">
        {/* Navigation Tabs */}
        <div className="w-full md:w-64 space-y-1 shrink-0">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'dashboard' ? 'bg-brand-600 text-white shadow-enterprise-sm' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <LayoutDashboard className="w-4 h-4" />
            <span>Overview & Users</span>
          </button>

          <button
            onClick={() => setActiveTab('hero')}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'hero' ? 'bg-brand-600 text-white shadow-enterprise-sm' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Homepage & Hero Editor</span>
          </button>

          <button
            onClick={() => setActiveTab('testimonials')}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'testimonials' ? 'bg-brand-600 text-white shadow-enterprise-sm' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            <span>Reviews & Testimonials</span>
          </button>

          <button
            onClick={() => setActiveTab('logos_banners')}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'logos_banners' ? 'bg-brand-600 text-white shadow-enterprise-sm' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <Building2 className="w-4 h-4" />
            <span>Logos & Banners</span>
          </button>

          <button
            onClick={() => setActiveTab('faqs')}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'faqs' ? 'bg-brand-600 text-white shadow-enterprise-sm' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <HelpCircle className="w-4 h-4" />
            <span>FAQs & Announcements</span>
          </button>

          <button
            onClick={() => setActiveTab('system_gateway')}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'system_gateway' ? 'bg-brand-600 text-white shadow-enterprise-sm' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <Database className="w-4 h-4" />
            <span>System & Gateway Config</span>
          </button>

          <button
            onClick={() => setActiveTab('media')}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'media' ? 'bg-brand-600 text-white shadow-enterprise-sm' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <UploadCloud className="w-4 h-4" />
            <span>Media & Gallery Manager</span>
          </button>

          <button
            onClick={() => setActiveTab('versions')}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'versions' ? 'bg-brand-600 text-white shadow-enterprise-sm' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <History className="w-4 h-4" />
            <span>Version History & Restore</span>
          </button>
        </div>

        {/* Tab Workspace Content */}
        <div className="flex-1 space-y-6">
          {/* TAB 1: DASHBOARD & AUDIT LOGS */}
          {activeTab === 'dashboard' && (
            <div className="space-y-6 animate-in fade-in duration-150">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-5 rounded-2xl glass-panel border border-slate-200/80 dark:border-slate-800 space-y-2">
                  <div className="flex items-center justify-between text-slate-500 text-xs font-bold">
                    <span>Total Registered Users</span>
                    <Users className="w-4 h-4 text-brand-500" />
                  </div>
                  <div className="text-3xl font-extrabold text-slate-900 dark:text-white">128</div>
                  <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold">+14 new College USN accounts</p>
                </div>

                <div className="p-5 rounded-2xl glass-panel border border-slate-200/80 dark:border-slate-800 space-y-2">
                  <div className="flex items-center justify-between text-slate-500 text-xs font-bold">
                    <span>Published Snapshots</span>
                    <Edit3 className="w-4 h-4 text-emerald-500" />
                  </div>
                  <div className="text-3xl font-extrabold text-slate-900 dark:text-white">{versionHistory.length}</div>
                  <p className="text-[10px] text-slate-500">Live 1-click restore enabled</p>
                </div>

                <div className="p-5 rounded-2xl glass-panel border border-slate-200/80 dark:border-slate-800 space-y-2">
                  <div className="flex items-center justify-between text-slate-500 text-xs font-bold">
                    <span>Audit Log Entries</span>
                    <Activity className="w-4 h-4 text-purple-500" />
                  </div>
                  <div className="text-3xl font-extrabold text-slate-900 dark:text-white">{auditLogs.length}</div>
                  <p className="text-[10px] text-slate-500">Security history active</p>
                </div>
              </div>

              {/* Audit Log Stream */}
              <div className="p-6 rounded-2xl glass-panel border border-slate-200/80 dark:border-slate-800 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                    <Shield className="w-4 h-4 text-brand-500" /> Administrator Audit Activity Log
                  </h3>
                  <button onClick={fetchAuditLogs} className="text-xs text-brand-600 dark:text-brand-400 font-bold hover:underline flex items-center gap-1">
                    <RefreshCw className="w-3 h-3" /> Refresh Logs
                  </button>
                </div>

                <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
                  {auditLogs.map(log => (
                    <div key={log.id} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex items-center justify-between text-xs">
                      <div>
                        <div className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                          <span>{log.action}</span>
                          <span className="text-[10px] font-mono text-slate-500">({log.adminUser})</span>
                        </div>
                        <p className="text-[11px] text-slate-600 dark:text-slate-300 mt-0.5">{log.details}</p>
                      </div>
                      <div className="text-[10px] font-mono text-slate-400 text-right shrink-0">
                        <div>{new Date(log.timestamp).toLocaleTimeString()}</div>
                        <div>{log.ipAddress}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: HERO EDITOR */}
          {activeTab === 'hero' && draftContent && (
            <div className="p-6 rounded-2xl glass-panel border border-slate-200/80 dark:border-slate-800 space-y-6 animate-in fade-in duration-150">
              <h3 className="text-base font-extrabold text-slate-900 dark:text-white">Homepage & Hero Section Content Editor</h3>

              <div className="space-y-4 text-xs">
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Top Badge Text</label>
                  <input
                    type="text"
                    value={draftContent.hero.badgeText}
                    onChange={e => setDraftContent({
                      ...draftContent,
                      hero: { ...draftContent.hero, badgeText: e.target.value }
                    })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-semibold"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Headline Main Title</label>
                    <input
                      type="text"
                      value={draftContent.hero.headlineTitle}
                      onChange={e => setDraftContent({
                        ...draftContent,
                        hero: { ...draftContent.hero, headlineTitle: e.target.value }
                      })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-semibold"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Headline Gradient Highlight</label>
                    <input
                      type="text"
                      value={draftContent.hero.headlineGradient}
                      onChange={e => setDraftContent({
                        ...draftContent,
                        hero: { ...draftContent.hero, headlineGradient: e.target.value }
                      })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-semibold"
                    />
                  </div>
                </div>

                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Subheadline Description</label>
                  <textarea
                    rows={3}
                    value={draftContent.hero.subheadline}
                    onChange={e => setDraftContent({
                      ...draftContent,
                      hero: { ...draftContent.hero, subheadline: e.target.value }
                    })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-semibold"
                  />
                </div>

                {/* Hero Stats */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                  <div>
                    <label className="font-bold text-slate-500 block mb-1">Stat 1</label>
                    <input
                      type="text"
                      value={draftContent.hero.stat1Value}
                      onChange={e => setDraftContent({
                        ...draftContent,
                        hero: { ...draftContent.hero, stat1Value: e.target.value }
                      })}
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-bold"
                    />
                    <input
                      type="text"
                      value={draftContent.hero.stat1Label}
                      onChange={e => setDraftContent({
                        ...draftContent,
                        hero: { ...draftContent.hero, stat1Label: e.target.value }
                      })}
                      className="w-full mt-1 px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-800 text-slate-500 text-[11px]"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-slate-500 block mb-1">Stat 2</label>
                    <input
                      type="text"
                      value={draftContent.hero.stat2Value}
                      onChange={e => setDraftContent({
                        ...draftContent,
                        hero: { ...draftContent.hero, stat2Value: e.target.value }
                      })}
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-bold"
                    />
                    <input
                      type="text"
                      value={draftContent.hero.stat2Label}
                      onChange={e => setDraftContent({
                        ...draftContent,
                        hero: { ...draftContent.hero, stat2Label: e.target.value }
                      })}
                      className="w-full mt-1 px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-800 text-slate-500 text-[11px]"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-slate-500 block mb-1">Stat 3</label>
                    <input
                      type="text"
                      value={draftContent.hero.stat3Value}
                      onChange={e => setDraftContent({
                        ...draftContent,
                        hero: { ...draftContent.hero, stat3Value: e.target.value }
                      })}
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-bold"
                    />
                    <input
                      type="text"
                      value={draftContent.hero.stat3Label}
                      onChange={e => setDraftContent({
                        ...draftContent,
                        hero: { ...draftContent.hero, stat3Label: e.target.value }
                      })}
                      className="w-full mt-1 px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-800 text-slate-500 text-[11px]"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-slate-500 block mb-1">Stat 4</label>
                    <input
                      type="text"
                      value={draftContent.hero.stat4Value}
                      onChange={e => setDraftContent({
                        ...draftContent,
                        hero: { ...draftContent.hero, stat4Value: e.target.value }
                      })}
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-bold"
                    />
                    <input
                      type="text"
                      value={draftContent.hero.stat4Label}
                      onChange={e => setDraftContent({
                        ...draftContent,
                        hero: { ...draftContent.hero, stat4Label: e.target.value }
                      })}
                      className="w-full mt-1 px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-800 text-slate-500 text-[11px]"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: TESTIMONIALS */}
          {activeTab === 'testimonials' && draftContent && (
            <div className="p-6 rounded-2xl glass-panel border border-slate-200/80 dark:border-slate-800 space-y-6 animate-in fade-in duration-150">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-extrabold text-slate-900 dark:text-white">Customer Reviews & Testimonials</h3>
                <button
                  onClick={() => setDraftContent({
                    ...draftContent,
                    testimonials: [
                      ...draftContent.testimonials,
                      {
                        id: `test-${Date.now()}`,
                        name: 'New Reviewer',
                        role: 'Product Lead',
                        company: 'Enterprise Corp',
                        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
                        text: 'Great platform experience!',
                        rating: 5
                      }
                    ]
                  })}
                  className="px-3 py-1.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-xs font-bold text-white flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" /> Add Testimonial
                </button>
              </div>

              <div className="space-y-4">
                {draftContent.testimonials.map((test, idx) => (
                  <div key={test.id} className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-3 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-brand-600 dark:text-brand-400">Testimonial #{idx + 1}</span>
                      <button
                        onClick={() => setDraftContent({
                          ...draftContent,
                          testimonials: draftContent.testimonials.filter(t => t.id !== test.id)
                        })}
                        className="text-slate-400 hover:text-rose-500"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="text-[11px] font-bold text-slate-500 block mb-1">Name</label>
                        <input
                          type="text"
                          value={test.name}
                          onChange={e => {
                            const updated = [...draftContent.testimonials];
                            updated[idx].name = e.target.value;
                            setDraftContent({ ...draftContent, testimonials: updated });
                          }}
                          className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-semibold"
                        />
                      </div>

                      <div>
                        <label className="text-[11px] font-bold text-slate-500 block mb-1">Role</label>
                        <input
                          type="text"
                          value={test.role}
                          onChange={e => {
                            const updated = [...draftContent.testimonials];
                            updated[idx].role = e.target.value;
                            setDraftContent({ ...draftContent, testimonials: updated });
                          }}
                          className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-semibold"
                        />
                      </div>

                      <div>
                        <label className="text-[11px] font-bold text-slate-500 block mb-1">Company</label>
                        <input
                          type="text"
                          value={test.company}
                          onChange={e => {
                            const updated = [...draftContent.testimonials];
                            updated[idx].company = e.target.value;
                            setDraftContent({ ...draftContent, testimonials: updated });
                          }}
                          className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-semibold"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-[11px] font-bold text-slate-500 block mb-1">Testimonial Text</label>
                      <textarea
                        rows={2}
                        value={test.text}
                        onChange={e => {
                          const updated = [...draftContent.testimonials];
                          updated[idx].text = e.target.value;
                          setDraftContent({ ...draftContent, testimonials: updated });
                        }}
                        className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-semibold"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: LOGOS & BANNERS */}
          {activeTab === 'logos_banners' && draftContent && (
            <div className="p-6 rounded-2xl glass-panel border border-slate-200/80 dark:border-slate-800 space-y-6 animate-in fade-in duration-150">
              <h3 className="text-base font-extrabold text-slate-900 dark:text-white">Customer Logos & Announcement Banners</h3>

              <div className="space-y-4">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">Customer Logos</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {draftContent.customerLogos.map((logo, idx) => (
                    <div key={logo.id} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex items-center justify-between gap-2 text-xs">
                      <input
                        type="text"
                        value={logo.name}
                        onChange={e => {
                          const updated = [...draftContent.customerLogos];
                          updated[idx].name = e.target.value;
                          setDraftContent({ ...draftContent, customerLogos: updated });
                        }}
                        className="flex-1 px-3 py-1.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-semibold"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: FAQS */}
          {activeTab === 'faqs' && draftContent && (
            <div className="p-6 rounded-2xl glass-panel border border-slate-200/80 dark:border-slate-800 space-y-6 animate-in fade-in duration-150">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-extrabold text-slate-900 dark:text-white">Frequently Asked Questions (FAQs)</h3>
                <button
                  onClick={() => setDraftContent({
                    ...draftContent,
                    faqs: [
                      ...draftContent.faqs,
                      {
                        id: `faq-${Date.now()}`,
                        question: 'New Question?',
                        answer: 'Answer text goes here.',
                        category: 'General'
                      }
                    ]
                  })}
                  className="px-3 py-1.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-xs font-bold text-white flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" /> Add FAQ
                </button>
              </div>

              <div className="space-y-4">
                {draftContent.faqs.map((faq, idx) => (
                  <div key={faq.id} className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-brand-600 dark:text-brand-400">FAQ #{idx + 1}</span>
                      <button
                        onClick={() => setDraftContent({
                          ...draftContent,
                          faqs: draftContent.faqs.filter(f => f.id !== faq.id)
                        })}
                        className="text-slate-400 hover:text-rose-500"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <input
                      type="text"
                      value={faq.question}
                      onChange={e => {
                        const updated = [...draftContent.faqs];
                        updated[idx].question = e.target.value;
                        setDraftContent({ ...draftContent, faqs: updated });
                      }}
                      className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-semibold"
                    />

                    <textarea
                      rows={2}
                      value={faq.answer}
                      onChange={e => {
                        const updated = [...draftContent.faqs];
                        updated[idx].answer = e.target.value;
                        setDraftContent({ ...draftContent, faqs: updated });
                      }}
                      className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-semibold"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 6: SYSTEM & GATEWAY CONFIG */}
          {activeTab === 'system_gateway' && (
            <div className="p-6 rounded-2xl glass-panel border border-slate-200/80 dark:border-slate-800 space-y-6 animate-in fade-in duration-150">
              <h3 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                <Database className="w-5 h-5 text-accent-500" /> Vector Database & LLM Gateway Credentials
              </h3>

              {/* Vector Database Provider */}
              <div className="space-y-3 pt-2">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">Vector Database Provider</label>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                  {['Pinecone', 'Qdrant', 'Weaviate', 'ChromaDB', 'FAISS Local'].map(provider => (
                    <button
                      key={provider}
                      type="button"
                      onClick={() => setVectorProvider(provider as any)}
                      className={`p-3 rounded-2xl border text-center transition-all text-xs font-bold ${
                        vectorProvider === provider
                          ? 'border-brand-600 bg-brand-50 dark:bg-brand-950 text-brand-600 dark:text-brand-400 shadow-xs'
                          : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-600 dark:text-slate-400'
                      }`}
                    >
                      {provider}
                    </button>
                  ))}
                </div>
              </div>

              {/* Protected Gateway Credentials */}
              <div className="space-y-4 pt-4 border-t border-slate-200 dark:border-slate-800">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Lock className="w-4 h-4 text-violet-500" />
                    <span className="text-xs font-bold text-slate-900 dark:text-white">Protected LLM & SMTP Gateway Keys</span>
                  </div>
                  <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-1 rounded-lg border border-emerald-200 dark:border-emerald-800">
                    Admin Session Unlocked
                  </span>
                </div>

                <div className="space-y-3 text-xs">
                  <div>
                    <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">OpenAI API Key (GPT-4.1 / GPT-5)</label>
                    <div className="relative">
                      <input
                        type={showOpenaiKey ? 'text' : 'password'}
                        value={openaiKey}
                        onChange={e => setOpenaiKey(e.target.value)}
                        className="w-full pl-3.5 pr-10 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 font-mono text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-500 focus:outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => setShowOpenaiKey(!showOpenaiKey)}
                        className="absolute right-3 top-2.5 p-1 text-slate-400 hover:text-slate-600"
                      >
                        {showOpenaiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Anthropic API Key (Claude 3.5 Sonnet)</label>
                    <div className="relative">
                      <input
                        type={showAnthropicKey ? 'text' : 'password'}
                        value={anthropicKey}
                        onChange={e => setAnthropicKey(e.target.value)}
                        className="w-full pl-3.5 pr-10 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 font-mono text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-500 focus:outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => setShowAnthropicKey(!showAnthropicKey)}
                        className="absolute right-3 top-2.5 p-1 text-slate-400 hover:text-slate-600"
                      >
                        {showAnthropicKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Google Gemini API Key (Gemini 1.5 Pro)</label>
                    <div className="relative">
                      <input
                        type={showGeminiKey ? 'text' : 'password'}
                        value={geminiKey}
                        onChange={e => setGeminiKey(e.target.value)}
                        className="w-full pl-3.5 pr-10 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 font-mono text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-500 focus:outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => setShowGeminiKey(!showGeminiKey)}
                        className="absolute right-3 top-2.5 p-1 text-slate-400 hover:text-slate-600"
                      >
                        {showGeminiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs pt-3 border-t border-slate-200 dark:border-slate-800">
                  <div>
                    <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">SMTP Server Host</label>
                    <input
                      type="text"
                      value={smtpHost}
                      onChange={e => setSmtpHost(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 font-mono text-slate-900 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">SMTP App Password</label>
                    <div className="relative">
                      <input
                        type={showSmtpPass ? 'text' : 'password'}
                        value={smtpPass}
                        onChange={e => setSmtpPass(e.target.value)}
                        className="w-full pl-3.5 pr-10 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 font-mono text-slate-900 dark:text-white"
                      />
                      <button
                        type="button"
                        onClick={() => setShowSmtpPass(!showSmtpPass)}
                        className="absolute right-3 top-2.5 p-1 text-slate-400 hover:text-slate-600"
                      >
                        {showSmtpPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 7: MEDIA & GALLERY */}
          {activeTab === 'media' && (
            <div className="p-6 rounded-2xl glass-panel border border-slate-200/80 dark:border-slate-800 space-y-6 animate-in fade-in duration-150">
              <h3 className="text-base font-extrabold text-slate-900 dark:text-white">Media, Images & Document Upload Manager</h3>
              <p className="text-xs text-slate-500">Upload profile pictures, website images, banners, or PDFs directly from device file manager.</p>

              <div className="p-8 rounded-2xl border-2 border-dashed border-slate-300 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/50 text-center space-y-3">
                <UploadCloud className="w-10 h-10 text-brand-500 mx-auto" />
                <div className="text-xs font-bold text-slate-900 dark:text-white">Click or drag & drop images/PDFs from device file manager</div>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploadingMedia}
                  className="px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-xs font-bold text-white shadow-enterprise-sm transition-colors"
                >
                  {isUploadingMedia ? 'Uploading File...' : 'Choose File from Gallery/File Manager'}
                </button>
              </div>
            </div>
          )}

          {/* TAB 8: VERSION HISTORY & RESTORE */}
          {activeTab === 'versions' && (
            <div className="p-6 rounded-2xl glass-panel border border-slate-200/80 dark:border-slate-800 space-y-6 animate-in fade-in duration-150">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-extrabold text-slate-900 dark:text-white">Published Version History & 1-Click Restore</h3>
                <button onClick={fetchVersionHistory} className="text-xs text-brand-600 dark:text-brand-400 font-bold hover:underline flex items-center gap-1">
                  <RefreshCw className="w-3.5 h-3.5" /> Refresh List
                </button>
              </div>

              <div className="space-y-3">
                {versionHistory.map((ver, idx) => (
                  <div key={ver.id} className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex items-center justify-between text-xs">
                    <div>
                      <div className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                        <span>Snapshot #{versionHistory.length - idx}</span>
                        <span className="text-[10px] font-mono text-brand-600 dark:text-brand-400">({ver.id})</span>
                      </div>
                      <p className="text-[11px] text-slate-600 dark:text-slate-300 mt-0.5">{ver.description}</p>
                      <div className="text-[10px] text-slate-400 mt-1">
                        Published by {ver.author} on {new Date(ver.timestamp).toLocaleString()}
                      </div>
                    </div>

                    <button
                      onClick={() => handleRestoreVersion(ver.id)}
                      className="px-3.5 py-1.5 rounded-xl bg-white dark:bg-slate-800 hover:bg-brand-600 hover:text-white text-xs font-bold text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 transition-colors shrink-0"
                    >
                      1-Click Restore Live
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* LIVE PREVIEW MODAL */}
      {isPreviewOpen && draftContent && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-6">
          <div className="w-full max-w-4xl max-h-[85vh] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-enterprise-lg flex flex-col space-y-4 overflow-hidden">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <h3 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                <Eye className="w-5 h-5 text-brand-500" /> Live Content Preview
              </h3>
              <button onClick={() => setIsPreviewOpen(false)} className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-6 text-xs p-4 rounded-2xl bg-[#F8FAFC] text-slate-900 dark:bg-[#0B0F19] dark:text-slate-100">
              <div className="text-center space-y-3 p-6 border rounded-2xl border-slate-200 dark:border-slate-800">
                <div className="inline-block px-3 py-1 rounded-full bg-brand-100 dark:bg-brand-900/60 text-brand-700 dark:text-brand-300 font-bold text-[11px]">
                  {draftContent.hero.badgeText}
                </div>
                <h1 className="text-2xl font-extrabold">{draftContent.hero.headlineTitle} <span className="text-brand-600">{draftContent.hero.headlineGradient}</span></h1>
                <p className="text-slate-600 dark:text-slate-300 max-w-lg mx-auto">{draftContent.hero.subheadline}</p>
              </div>

              <div className="space-y-2">
                <div className="font-bold uppercase tracking-wider text-slate-400">Testimonials ({draftContent.testimonials.length})</div>
                <div className="grid grid-cols-2 gap-3">
                  {draftContent.testimonials.map(t => (
                    <div key={t.id} className="p-3 rounded-xl border border-slate-200 dark:border-slate-800">
                      <div className="font-bold">{t.name} ({t.role})</div>
                      <p className="text-[11px] text-slate-500 mt-1">"{t.text}"</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button onClick={() => setIsPreviewOpen(false)} className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300">Close Preview</button>
              <button
                onClick={() => {
                  setIsPreviewOpen(false);
                  handlePublishContent();
                }}
                className="px-4 py-2 rounded-xl bg-brand-600 text-xs font-bold text-white shadow-enterprise-md"
              >
                Looks Good — Publish Live On-the-Spot
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
