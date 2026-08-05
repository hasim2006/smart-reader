'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { Search, Filter, FileText, ArrowRight, ShieldCheck, Cpu, Sliders, CheckCircle2, MessageSquare } from 'lucide-react';
import { searchVectorDatabase } from '@/lib/ragEngine';

export default function SearchView() {
  const { documents, setCurrentView, setActivePreviewDoc, sendMessageInThread } = useApp();

  const [query, setQuery] = useState<string>('quarterly revenue margin expansion');
  const [deptFilter, setDeptFilter] = useState<string>('All');
  const [fileTypeFilter, setFileTypeFilter] = useState<string>('All');
  const [minScore, setMinScore] = useState<number>(0.60);
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [results, setResults] = useState<any[]>(() => searchVectorDatabase('quarterly revenue margin expansion', documents));

  const handleSearch = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsSearching(true);

    setTimeout(() => {
      const res = searchVectorDatabase(query, documents, {
        department: deptFilter,
        fileType: fileTypeFilter,
        minScore
      });
      setResults(res);
      setIsSearching(false);
    }, 250);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div>
        <h2 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">Hybrid Vector & Semantic Search</h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
          Execute dense 1536-dimensional embedding similarity searches paired with BM25 sparse keyword ranking.
        </p>
      </div>

      {/* Main Search Input Form */}
      <form onSubmit={handleSearch} className="p-4 rounded-2xl glass-panel shadow-enterprise-md border border-slate-200/80 dark:border-slate-800 space-y-4">
        <div className="relative">
          <Search className="w-5 h-5 text-brand-600 dark:text-brand-400 absolute left-4 top-3.5" />
          <input
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Type any question, keyword, or sentence (e.g. 'What encryption is mandated for vector databases?')..."
            className="w-full pl-12 pr-32 py-3.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-sm font-semibold text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-500 focus:outline-none"
          />
          <button
            type="submit"
            disabled={isSearching}
            className="absolute right-2 top-2 px-5 py-2 rounded-lg bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold shadow-enterprise-sm transition-all flex items-center gap-1.5"
          >
            {isSearching ? <span>Searching...</span> : <span>Run Vector Search</span>}
          </button>
        </div>

        {/* Filter Controls Row */}
        <div className="pt-3 border-t border-slate-200/60 dark:border-slate-800/60 flex flex-wrap items-center justify-between gap-4 text-xs">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2">
              <Filter className="w-3.5 h-3.5 text-slate-400" />
              <span className="font-bold text-slate-700 dark:text-slate-300">Department:</span>
              <select
                value={deptFilter}
                onChange={e => setDeptFilter(e.target.value)}
                className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-800 dark:text-slate-200 focus:outline-none"
              >
                <option value="All">All Departments</option>
                <option value="Executive">Executive</option>
                <option value="Finance">Finance</option>
                <option value="Legal">Legal</option>
                <option value="Engineering">Engineering</option>
                <option value="HR">HR</option>
                <option value="R&D">R&D</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-700 dark:text-slate-300">File Type:</span>
              <select
                value={fileTypeFilter}
                onChange={e => setFileTypeFilter(e.target.value)}
                className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-800 dark:text-slate-200 focus:outline-none"
              >
                <option value="All">All Types</option>
                <option value="pdf">PDF</option>
                <option value="docx">DOCX</option>
                <option value="pptx">PPTX</option>
                <option value="csv">CSV</option>
                <option value="md">Markdown</option>
              </select>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Sliders className="w-3.5 h-3.5 text-slate-400" />
            <span className="font-bold text-slate-700 dark:text-slate-300">Similarity Threshold:</span>
            <input
              type="range"
              min="0.50"
              max="0.95"
              step="0.05"
              value={minScore}
              onChange={e => setMinScore(parseFloat(e.target.value))}
              className="w-24 accent-brand-600"
            />
            <span className="font-mono text-[11px] font-bold text-brand-600 dark:text-brand-400">
              {(minScore * 100).toFixed(0)}%
            </span>
          </div>
        </div>
      </form>

      {/* Results Header */}
      <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-500">
        <span>Found {results.length} Matching Context Chunks</span>
        <span>Reciprocal Rank Fusion (RRF) Active</span>
      </div>

      {/* Search Results List */}
      <div className="space-y-4">
        {results.length === 0 ? (
          <div className="p-12 text-center rounded-2xl glass-panel border border-slate-200 dark:border-slate-800">
            <Cpu className="w-10 h-10 text-slate-400 mx-auto mb-3" />
            <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">No Vector Matches Above Threshold</h3>
            <p className="text-xs text-slate-500 mt-1">Try lowering the similarity threshold or removing department filters.</p>
          </div>
        ) : (
          results.map(res => (
            <div
              key={res.id}
              className="p-5 rounded-2xl glass-panel border border-slate-200/80 dark:border-slate-800 hover:border-brand-500/50 shadow-enterprise-sm transition-all space-y-3"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="px-2.5 py-1 rounded-lg bg-brand-50 dark:bg-brand-950/60 text-brand-600 dark:text-brand-400 text-xs font-bold uppercase">
                    {res.fileType}
                  </span>
                  <div>
                    <h3 className="text-sm font-extrabold text-slate-900 dark:text-white">{res.documentName}</h3>
                    <div className="text-[11px] text-slate-500 font-medium">
                      {res.department} • Section: {res.sectionHeader} • Page {res.pageNumber}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 text-xs font-extrabold border border-emerald-200 dark:border-emerald-800">
                    {(res.score * 100).toFixed(1)}% Match
                  </span>
                </div>
              </div>

              {/* Matched Snippet */}
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 text-xs sm:text-sm text-slate-800 dark:text-slate-200 leading-relaxed">
                "{res.snippet}"
              </div>

              {/* Card Footer Actions */}
              <div className="pt-2 flex items-center justify-between text-xs">
                <span className="text-[10px] font-mono text-slate-400">Chunk Vector ID: {res.chunkId}</span>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => {
                      const doc = documents.find(d => d.id === res.documentId);
                      if (doc) setActivePreviewDoc(doc);
                      setCurrentView('documents');
                    }}
                    className="text-slate-600 dark:text-slate-300 font-semibold hover:text-brand-600 transition-colors flex items-center gap-1"
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span>Inspect Document</span>
                  </button>

                  <button
                    onClick={() => {
                      sendMessageInThread(`Explain this excerpt from ${res.documentName}: "${res.snippet.slice(0, 100)}..."`);
                      setCurrentView('chat');
                    }}
                    className="px-3 py-1.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs flex items-center gap-1.5 transition-all shadow-xs"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>Ask AI in Chat</span>
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
