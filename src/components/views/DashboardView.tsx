'use client';

import React from 'react';
import { useApp } from '@/context/AppContext';
import {
  FileText,
  MessageSquare,
  Search,
  UploadCloud,
  TrendingUp,
  Cpu,
  ShieldCheck,
  Zap,
  Sparkles,
  ArrowRight,
  FolderKanban,
  CheckCircle2,
  Clock
} from 'lucide-react';

export default function DashboardView() {
  const { documents, collections, setCurrentView, setActivePreviewDoc, userProfile } = useApp();

  const totalSizeBytes = documents.reduce((acc, d) => acc + d.sizeBytes, 0);
  const totalTokens = documents.reduce((acc, d) => acc + d.tokensCount, 0);

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Welcome Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-brand-600 via-blue-600 to-indigo-700 text-white shadow-enterprise-lg relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-full bg-white/10 blur-3xl pointer-events-none rounded-full" />
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-white text-xs font-semibold mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Multi-LLM & Vector Engine Ready</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Welcome back, {userProfile.name}
          </h2>
          <p className="mt-2 text-white/90 text-sm sm:text-base leading-relaxed">
            Your enterprise knowledge base holds <span className="font-bold underline">{documents.length} indexed documents</span> containing over <span className="font-bold">{totalTokens.toLocaleString()} tokens</span> ready for RAG natural language querying.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <button
              onClick={() => setCurrentView('chat')}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white text-brand-700 hover:bg-slate-100 font-bold text-xs shadow-enterprise-md transition-all active:scale-95"
            >
              <MessageSquare className="w-4 h-4 text-brand-600" />
              <span>Ask AI Question</span>
            </button>

            <button
              onClick={() => setCurrentView('documents')}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/15 hover:bg-white/25 text-white font-bold text-xs border border-white/20 transition-all active:scale-95"
            >
              <UploadCloud className="w-4 h-4" />
              <span>Upload Document</span>
            </button>
          </div>
        </div>
      </div>

      {/* KPI Stats Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="p-5 rounded-2xl glass-panel shadow-enterprise-sm border border-slate-200/80 dark:border-slate-800">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Total Documents</span>
            <div className="p-2 rounded-xl bg-brand-50 dark:bg-brand-950/60 text-brand-600 dark:text-brand-400">
              <FileText className="w-4.5 h-4.5" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-slate-900 dark:text-white mt-3">{documents.length}</div>
          <div className="text-xs text-slate-500 mt-1 flex items-center gap-1">
            <span className="text-emerald-600 font-semibold">+3 this week</span> • {(totalSizeBytes / (1024 * 1024)).toFixed(1)} MB
          </div>
        </div>

        <div className="p-5 rounded-2xl glass-panel shadow-enterprise-sm border border-slate-200/80 dark:border-slate-800">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Indexed Chunks</span>
            <div className="p-2 rounded-xl bg-violet-50 dark:bg-violet-950/60 text-violet-600 dark:text-violet-400">
              <Cpu className="w-4.5 h-4.5" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-slate-900 dark:text-white mt-3">
            {documents.reduce((acc, d) => acc + d.chunksCount, 0)}
          </div>
          <div className="text-xs text-slate-500 mt-1 flex items-center gap-1">
            <span className="text-emerald-600 font-semibold">1536-dim Vectors</span> • 100% Synced
          </div>
        </div>

        <div className="p-5 rounded-2xl glass-panel shadow-enterprise-sm border border-slate-200/80 dark:border-slate-800">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Queries Executed</span>
            <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400">
              <TrendingUp className="w-4.5 h-4.5" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-slate-900 dark:text-white mt-3">1,482</div>
          <div className="text-xs text-slate-500 mt-1 flex items-center gap-1">
            <span className="text-emerald-600 font-semibold">Avg 1.1s</span> • 99.4% Recall
          </div>
        </div>

        <div className="p-5 rounded-2xl glass-panel shadow-enterprise-sm border border-slate-200/80 dark:border-slate-800">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Security Posture</span>
            <div className="p-2 rounded-xl bg-teal-50 dark:bg-teal-950/60 text-accent-500">
              <ShieldCheck className="w-4.5 h-4.5" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-slate-900 dark:text-white mt-3">SOC 2</div>
          <div className="text-xs text-slate-500 mt-1 flex items-center gap-1">
            <span className="text-emerald-600 font-semibold">KMS Encrypted</span> • AES-256
          </div>
        </div>
      </div>

      {/* Main Grid: Recent Documents & Active Workspaces */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Recent Documents Table */}
        <div className="lg:col-span-8 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-extrabold text-slate-900 dark:text-white">Recent Knowledge Uploads</h3>
            <button
              onClick={() => setCurrentView('documents')}
              className="text-xs font-semibold text-brand-600 dark:text-brand-400 hover:underline flex items-center gap-1"
            >
              <span>View All ({documents.length})</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="rounded-2xl glass-panel border border-slate-200/80 dark:border-slate-800 overflow-hidden shadow-enterprise-sm">
            <div className="divide-y divide-slate-200 dark:divide-slate-800">
              {documents.slice(0, 4).map(doc => (
                <div
                  key={doc.id}
                  onClick={() => {
                    setActivePreviewDoc(doc);
                    setCurrentView('documents');
                  }}
                  className="p-4 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors cursor-pointer group"
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div className="p-2.5 rounded-xl bg-brand-50 dark:bg-brand-950/60 text-brand-600 dark:text-brand-400 group-hover:scale-105 transition-transform">
                      <FileText className="w-5 h-5" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs font-bold text-slate-900 dark:text-white truncate">{doc.name}</div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 flex items-center gap-2">
                        <span>{doc.department}</span> • <span>{doc.chunksCount} Chunks</span> • <span>{doc.securityLevel}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <span className="text-[10px] font-bold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> Indexed
                    </span>
                    <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-brand-600 group-hover:translate-x-0.5 transition-all" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Workspaces & AI Tools Quick Launch */}
        <div className="lg:col-span-4 space-y-4">
          <h3 className="text-base font-extrabold text-slate-900 dark:text-white">Active Workspaces</h3>

          <div className="space-y-3">
            {collections.slice(0, 3).map(col => (
              <div
                key={col.id}
                onClick={() => setCurrentView('collections')}
                className="p-4 rounded-2xl glass-panel border border-slate-200/80 dark:border-slate-800 hover:border-brand-500/50 transition-all cursor-pointer group"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-slate-900 dark:text-white">{col.name}</span>
                  <span className="text-[10px] font-semibold text-slate-500">{col.documentCount} Docs</span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2">{col.description}</p>
              </div>
            ))}
          </div>

          <div className="p-4 rounded-2xl bg-slate-900 text-white shadow-enterprise-md relative overflow-hidden">
            <div className="flex items-center gap-2 text-xs font-bold text-accent-400 mb-2">
              <Sparkles className="w-4 h-4" />
              <span>Document Intelligence Suite</span>
            </div>
            <p className="text-xs text-slate-300 mb-4">
              Compare contract revisions, extract executive summaries, or find contradictions across policy documents.
            </p>
            <button
              onClick={() => setCurrentView('ai-tools')}
              className="w-full py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold transition-colors"
            >
              Open AI Tools
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
