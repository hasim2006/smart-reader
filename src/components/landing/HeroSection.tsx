'use client';

import React from 'react';
import { useApp } from '@/context/AppContext';
import { Sparkles, UploadCloud, MessageSquare, ShieldCheck, Cpu, Search, CheckCircle2, ArrowRight } from 'lucide-react';

export default function HeroSection() {
  const { setCurrentView, addDocument, siteContent } = useApp();

  const heroData = siteContent?.hero || {
    badgeText: 'Next-Generation Vector Indexing & Hybrid RAG Platform',
    headlineTitle: 'Enterprise AI',
    headlineGradient: 'Knowledge Platform',
    subheadline: 'Upload company documents and ask intelligent questions powered by Retrieval-Augmented Generation. Every answer is grounded with verifiable document citations.',
    uploadButtonText: 'Upload Documents',
    chatButtonText: 'Start Chatting',
    dropzoneTitle: 'Click to upload or drag enterprise files here',
    dropzoneSubtitle: 'PDF, DOCX, PPTX, CSV, Markdown up to 100MB',
    stat1Value: '99.4%',
    stat1Label: 'MRR@10 Recall Accuracy',
    stat2Value: '< 1.2s',
    stat2Label: 'Avg Hybrid Retrieval Latency',
    stat3Value: '100%',
    stat3Label: 'Verifiable Grounded Citations',
    stat4Value: 'SOC 2',
    stat4Label: 'Type II Security Certified'
  };

  const handleHeroFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      addDocument(file.name, file.size);
      setCurrentView('documents');
    }
  };

  return (
    <section className="relative pt-12 pb-20 px-6 overflow-hidden animate-in fade-in duration-200">
      {/* Background Subtle Gradient Blobs */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-brand-600/15 via-accent-500/15 to-transparent blur-[120px] pointer-events-none rounded-full" />

      <div className="max-w-6xl mx-auto text-center relative z-10 space-y-12">
        <div>
          {/* Top Gradient Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-50 dark:bg-brand-900/40 border border-brand-200 dark:border-brand-800 text-brand-700 dark:text-brand-300 text-xs font-semibold mb-8 shadow-sm animate-pulse-glow">
            <Sparkles className="w-3.5 h-3.5 text-brand-500" />
            <span>{heroData.badgeText}</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white max-w-4xl mx-auto leading-[1.15]">
            {heroData.headlineTitle} <span className="text-gradient-primary">{heroData.headlineGradient}</span>
          </h1>

          {/* Subheadline */}
          <p className="mt-6 text-lg sm:text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto font-normal leading-relaxed">
            {heroData.subheadline}
          </p>

          {/* Primary Action Buttons */}
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => setCurrentView('documents')}
              className="w-full sm:w-auto flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-enterprise bg-brand-600 hover:bg-brand-700 text-white font-semibold text-base shadow-enterprise-lg hover:shadow-glow-primary transition-all active:scale-[0.98]"
            >
              <UploadCloud className="w-5 h-5" />
              <span>{heroData.uploadButtonText || 'Upload Documents'}</span>
            </button>

            <button
              onClick={() => setCurrentView('chat')}
              className="w-full sm:w-auto flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-enterprise bg-slate-900 hover:bg-slate-800 dark:bg-slate-800 dark:hover:bg-slate-700 text-white font-semibold text-base shadow-enterprise-md transition-all active:scale-[0.98]"
            >
              <MessageSquare className="w-5 h-5 text-accent-400" />
              <span>{heroData.chatButtonText || 'Start Chatting'}</span>
            </button>
          </div>
        </div>

        {/* Quick Drop Zone Widget Preview */}
        <div className="max-w-2xl mx-auto p-4 rounded-2xl glass-panel shadow-enterprise-lg border border-slate-200/80 dark:border-slate-800 text-left">
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-200/60 dark:border-slate-800/60">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-600 dark:text-slate-300">
              <Cpu className="w-4 h-4 text-brand-500" />
              <span>Instant Ingestion & Parsing Engine</span>
            </div>
            <span className="text-[11px] font-medium text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> Ready for PDF, DOCX, CSV, PPTX
            </span>
          </div>

          <label className="group flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-xl hover:border-brand-500 dark:hover:border-brand-500 bg-slate-50/50 dark:bg-slate-900/50 hover:bg-brand-50/30 dark:hover:bg-brand-950/20 cursor-pointer transition-all">
            <div className="flex flex-col items-center justify-center pt-5 pb-6 text-center">
              <UploadCloud className="w-8 h-8 text-brand-500 group-hover:scale-110 transition-transform mb-2" />
              <p className="text-sm font-medium text-slate-700 dark:text-slate-200 px-2">
                <span className="font-semibold text-brand-600 dark:text-brand-400">{heroData.dropzoneTitle}</span>
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{heroData.dropzoneSubtitle}</p>
            </div>
            <input type="file" className="hidden" onChange={handleHeroFileUpload} />
          </label>
        </div>

        {/* Live Platform Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-10 border-t border-slate-200/80 dark:border-slate-800/80">
          <div>
            <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">{heroData.stat1Value}</div>
            <div className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-1">{heroData.stat1Label}</div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-extrabold text-brand-600 dark:text-brand-400">{heroData.stat2Value}</div>
            <div className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-1">{heroData.stat2Label}</div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-extrabold text-accent-500">{heroData.stat3Value}</div>
            <div className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-1">{heroData.stat3Label}</div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">{heroData.stat4Value}</div>
            <div className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-1">{heroData.stat4Label}</div>
          </div>
        </div>
      </div>
    </section>
  );
}
