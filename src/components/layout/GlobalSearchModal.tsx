'use client';

import React, { useState, useEffect } from 'react';
import { useApp } from '@/context/AppContext';
import { Search, FileText, X, ArrowRight, ShieldCheck, CornerDownLeft } from 'lucide-react';
import { searchVectorDatabase } from '@/lib/ragEngine';

export default function GlobalSearchModal() {
  const { isGlobalSearchOpen, setIsGlobalSearchOpen, documents, setCurrentView, setActivePreviewDoc, sendMessageInThread } = useApp();
  const [query, setQuery] = useState<string>('');
  const [results, setResults] = useState<any[]>([]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setIsGlobalSearchOpen(!isGlobalSearchOpen);
      }
      if (e.key === 'Escape' && isGlobalSearchOpen) {
        setIsGlobalSearchOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isGlobalSearchOpen, setIsGlobalSearchOpen]);

  const handleSearchChange = (val: string) => {
    setQuery(val);
    if (val.trim().length > 1) {
      const res = searchVectorDatabase(val, documents);
      setResults(res.slice(0, 5));
    } else {
      setResults([]);
    }
  };

  if (!isGlobalSearchOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-50 flex items-start justify-center pt-8 sm:pt-20 px-3 sm:px-4">
      <div className="w-full max-w-2xl max-h-[85vh] flex flex-col bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-enterprise-lg overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Search Bar Input */}
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center gap-3">
          <Search className="w-5 h-5 text-brand-600 dark:text-brand-400" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={e => handleSearchChange(e.target.value)}
            placeholder="Global Vector Search: Type questions, keywords, or topics..."
            className="flex-1 bg-transparent text-sm font-medium text-slate-900 dark:text-white focus:outline-none"
          />
          <button onClick={() => setIsGlobalSearchOpen(false)} className="p-1 rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Search Results List */}
        <div className="p-4 max-h-[380px] overflow-y-auto space-y-2.5">
          {query.trim().length > 0 && results.length === 0 && (
            <div className="text-center py-10 text-xs text-slate-500">
              No matching chunks found above vector threshold.
            </div>
          )}

          {query.trim().length === 0 && (
            <div className="py-6 px-4 text-xs text-slate-500 dark:text-slate-400">
              <span className="font-bold text-slate-700 dark:text-slate-300 block mb-2">QUICK SEARCH EXAMPLES:</span>
              <div className="flex flex-wrap gap-2">
                <button onClick={() => handleSearchChange('revenue growth')} className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:text-brand-600">Revenue Growth</button>
                <button onClick={() => handleSearchChange('encryption standards')} className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:text-brand-600">Encryption Standards</button>
                <button onClick={() => handleSearchChange('PTO policy')} className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:text-brand-600">PTO Policy</button>
                <button onClick={() => handleSearchChange('hybrid retrieval')} className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:text-brand-600">Hybrid Retrieval</button>
              </div>
            </div>
          )}

          {results.map(res => (
            <div
              key={res.id}
              onClick={() => {
                const targetDoc = documents.find(d => d.id === res.documentId);
                if (targetDoc) setActivePreviewDoc(targetDoc);
                setIsGlobalSearchOpen(false);
                setCurrentView('documents');
              }}
              className="p-3 rounded-xl border border-slate-200/80 dark:border-slate-800/80 hover:border-brand-500 bg-slate-50/50 dark:bg-slate-800/40 hover:bg-white dark:hover:bg-slate-800 transition-all cursor-pointer group flex items-start justify-between"
            >
              <div className="flex items-start gap-3 min-w-0">
                <div className="p-2 rounded-lg bg-brand-50 dark:bg-brand-950/60 text-brand-600 dark:text-brand-400 mt-0.5">
                  <FileText className="w-4 h-4" />
                </div>
                <div className="min-w-0 pr-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-900 dark:text-white truncate">{res.documentName}</span>
                    <span className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-1.5 py-0.2 rounded border border-emerald-200 dark:border-emerald-800">
                      {(res.score * 100).toFixed(0)}% Match
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 line-clamp-2">{res.snippet}</p>
                  <div className="text-[10px] text-slate-400 mt-1 font-medium">
                    {res.department} • Section: {res.sectionHeader} • Page {res.pageNumber}
                  </div>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-brand-600 group-hover:translate-x-1 transition-all shrink-0 mt-2" />
            </div>
          ))}
        </div>

        {/* Footer shortcuts */}
        <div className="px-4 py-2.5 bg-slate-50 dark:bg-slate-900/80 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
          <div className="flex items-center gap-3">
            <span><kbd className="font-mono bg-slate-200 dark:bg-slate-800 px-1 rounded">↑↓</kbd> Navigate</span>
            <span><kbd className="font-mono bg-slate-200 dark:bg-slate-800 px-1 rounded">↵</kbd> Inspect Chunk</span>
            <span><kbd className="font-mono bg-slate-200 dark:bg-slate-800 px-1 rounded">ESC</kbd> Close</span>
          </div>
          <span className="font-semibold text-brand-600 dark:text-brand-400">Track Report Vector Engine</span>
        </div>
      </div>
    </div>
  );
}
