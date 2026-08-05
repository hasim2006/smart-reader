'use client';

import React from 'react';
import { useApp } from '@/context/AppContext';
import { Citation } from '@/types';
import { X, ShieldCheck, FileText, ExternalLink, Database, Copy, Check } from 'lucide-react';

export default function CitationDrawer() {
  const { activeCitation, setActiveCitation, documents, setActivePreviewDoc, setCurrentView } = useApp();
  const [copied, setCopied] = React.useState(false);

  if (!activeCitation) return null;

  const handleCopyChunk = () => {
    navigator.clipboard.writeText(activeCitation.chunkContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const parentDoc = documents.find(d => d.id === activeCitation.documentId);

  return (
    <div className="fixed inset-y-0 right-0 w-full sm:w-[450px] bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 shadow-enterprise-lg z-50 flex flex-col justify-between animate-in slide-in-from-right duration-200">
      {/* Header */}
      <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-brand-50 dark:bg-brand-950/60 text-brand-600 dark:text-brand-400">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-extrabold text-slate-900 dark:text-white">Citation Source Inspector</h3>
            <p className="text-[11px] text-slate-500 font-medium">Verifiable Vector Grounding Evidence</p>
          </div>
        </div>

        <button
          onClick={() => setActiveCitation(null)}
          className="p-1.5 rounded-xl text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Content */}
      <div className="p-6 overflow-y-auto space-y-5 flex-1">
        {/* Document Metadata Card */}
        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Source Document</span>
            <span className="px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold border border-emerald-200 dark:border-emerald-800">
              {(activeCitation.similarityScore * 100).toFixed(1)}% Match
            </span>
          </div>

          <h4 className="text-sm font-bold text-slate-900 dark:text-white">{activeCitation.documentName}</h4>

          <div className="text-xs text-slate-500 space-y-1 font-medium">
            <div>Page Number: <strong className="text-slate-800 dark:text-slate-200">{activeCitation.pageNumber || 1}</strong></div>
            <div>Section Header: <strong className="text-slate-800 dark:text-slate-200">{activeCitation.sectionHeader || 'General Section'}</strong></div>
            {parentDoc && (
              <div>Department Scope: <strong className="text-slate-800 dark:text-slate-200">{parentDoc.department}</strong></div>
            )}
          </div>
        </div>

        {/* Extracted Chunk Content */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Extracted Context Chunk
            </span>
            <button
              onClick={handleCopyChunk}
              className="text-xs font-semibold text-brand-600 dark:text-brand-400 hover:underline flex items-center gap-1"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy Text'}</span>
            </button>
          </div>

          <div className="p-4 rounded-2xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs sm:text-sm text-slate-800 dark:text-slate-200 font-sans leading-relaxed shadow-inner">
            "{activeCitation.chunkContent}"
          </div>
        </div>

        {/* Vector DB Metadata */}
        <div className="p-3.5 rounded-xl bg-brand-50/50 dark:bg-brand-950/30 border border-brand-200/60 dark:border-brand-800/60 text-xs text-slate-600 dark:text-slate-400 space-y-1 font-mono">
          <div className="flex items-center gap-1.5 font-bold text-brand-700 dark:text-brand-300">
            <Database className="w-3.5 h-3.5" /> Vector Hash Verification
          </div>
          <div>Vector ID: {activeCitation.vectorId}</div>
          <div>Embedding Model: text-embedding-3-large (1536d)</div>
        </div>
      </div>

      {/* Footer */}
      <div className="p-6 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/80 flex items-center justify-between">
        <button
          onClick={() => {
            if (parentDoc) setActivePreviewDoc(parentDoc);
            setActiveCitation(null);
            setCurrentView('documents');
          }}
          className="w-full py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-enterprise-md transition-colors"
        >
          <FileText className="w-4 h-4" />
          <span>Inspect Full Source Document</span>
        </button>
      </div>
    </div>
  );
}
