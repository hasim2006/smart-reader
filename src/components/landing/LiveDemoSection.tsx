'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { Sparkles, FileText, Search, ArrowRight, ShieldCheck, Check, Layers, ExternalLink } from 'lucide-react';
import { searchVectorDatabase, generateRAGResponse } from '@/lib/ragEngine';

export default function LiveDemoSection() {
  const { documents, setCurrentView, setActiveCitation } = useApp();
  const [selectedDocId, setSelectedDocId] = useState<string>(documents[0]?.id || '');
  const [queryInput, setQueryInput] = useState<string>('What was our total revenue growth in Q3 2026?');
  const [demoOutput, setDemoOutput] = useState<{ content: string; citations: any[] } | null>(null);
  const [isSearching, setIsSearching] = useState<boolean>(false);

  const samplePrompts = [
    'What was our total revenue growth in Q3 2026?',
    'What encryption standards are mandated for stored document vectors?',
    'What are the key findings of the hybrid retrieval whitepaper?'
  ];

  const handleRunDemo = (promptText?: string) => {
    const q = promptText || queryInput;
    setQueryInput(q);
    setIsSearching(true);

    setTimeout(() => {
      const searchRes = searchVectorDatabase(q, documents);
      const rag = generateRAGResponse(q, searchRes, documents, 'OpenAI GPT-4.1 Enterprise');
      setDemoOutput({
        content: rag.content,
        citations: rag.citations
      });
      setIsSearching(false);
    }, 450);
  };

  return (
    <section id="demo" className="py-20 px-6 bg-slate-100/60 dark:bg-slate-900/40 border-y border-slate-200/80 dark:border-slate-800/80">
      <div className="max-w-6xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Try the <span className="text-gradient-primary">Live RAG Sandbox</span>
          </h2>
          <p className="mt-3 text-slate-600 dark:text-slate-400 text-base">
            Select an enterprise knowledge source below and execute natural language queries to see vector retrieval and citation grounding in action.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Controls & Sample Documents */}
          <div className="lg:col-span-5 space-y-5">
            <div className="p-5 rounded-2xl glass-panel shadow-enterprise-md">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block mb-3">
                1. Select Active Document Context
              </label>

              <div className="space-y-2.5">
                {documents.slice(0, 3).map(doc => (
                  <div
                    key={doc.id}
                    onClick={() => setSelectedDocId(doc.id)}
                    className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                      selectedDocId === doc.id
                        ? 'border-brand-600 bg-brand-50/70 dark:bg-brand-950/40 text-slate-900 dark:text-white shadow-sm'
                        : 'border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 hover:border-slate-300 dark:hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="p-2 rounded-lg bg-brand-100 dark:bg-brand-900/60 text-brand-600 dark:text-brand-300">
                        <FileText className="w-4.5 h-4.5" />
                      </div>
                      <div className="truncate">
                        <div className="text-xs font-semibold truncate">{doc.name}</div>
                        <div className="text-[11px] text-slate-500 dark:text-slate-400">
                          {doc.department} • {doc.chunksCount} Chunks
                        </div>
                      </div>
                    </div>
                    {selectedDocId === doc.id && (
                      <div className="w-5 h-5 rounded-full bg-brand-600 text-white flex items-center justify-center text-xs">
                        <Check className="w-3 h-3" />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Sample Prompts */}
            <div className="p-5 rounded-2xl glass-panel shadow-enterprise-md">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block mb-3">
                2. Test Enterprise Questions
              </label>

              <div className="space-y-2">
                {samplePrompts.map((prompt, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleRunDemo(prompt)}
                    className="w-full text-left p-2.5 rounded-xl text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-brand-50 dark:hover:bg-brand-950/40 border border-slate-200 dark:border-slate-800 transition-colors flex items-center justify-between group"
                  >
                    <span className="truncate">{prompt}</span>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-brand-600 group-hover:translate-x-0.5 transition-all shrink-0 ml-2" />
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right Live Answer Output */}
          <div className="lg:col-span-7">
            <div className="p-6 rounded-2xl glass-panel shadow-enterprise-lg border border-slate-200/80 dark:border-slate-800 flex flex-col h-full min-h-[420px]">
              {/* Input Form */}
              <div className="relative mb-6">
                <input
                  type="text"
                  value={queryInput}
                  onChange={e => setQueryInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleRunDemo()}
                  placeholder="Ask any question about selected enterprise documents..."
                  className="w-full pl-4 pr-28 py-3.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-sm font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
                <button
                  onClick={() => handleRunDemo()}
                  disabled={isSearching}
                  className="absolute right-2 top-2 px-4 py-1.5 rounded-lg bg-brand-600 hover:bg-brand-700 text-white text-xs font-semibold flex items-center gap-1.5 transition-all"
                >
                  {isSearching ? (
                    <span>Retrieving...</span>
                  ) : (
                    <>
                      <Search className="w-3.5 h-3.5" />
                      <span>Run RAG</span>
                    </>
                  )}
                </button>
              </div>

              {/* Output Content */}
              {demoOutput ? (
                <div className="space-y-4 flex-1">
                  <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs sm:text-sm text-slate-800 dark:text-slate-200 font-sans leading-relaxed whitespace-pre-line">
                    {demoOutput.content}
                  </div>

                  {/* Citations Box */}
                  {demoOutput.citations.length > 0 && (
                    <div className="p-3.5 rounded-xl bg-brand-50/60 dark:bg-brand-950/40 border border-brand-200 dark:border-brand-800/80">
                      <div className="text-xs font-bold text-brand-700 dark:text-brand-300 mb-2 flex items-center gap-1.5">
                        <ShieldCheck className="w-3.5 h-3.5" />
                        <span>Verifiable Document Citations ({demoOutput.citations.length})</span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {demoOutput.citations.map((cit, idx) => (
                          <button
                            key={cit.id}
                            onClick={() => {
                              setActiveCitation(cit);
                              setCurrentView('chat');
                            }}
                            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-medium border border-slate-200 dark:border-slate-700 hover:border-brand-500 shadow-xs transition-colors"
                          >
                            <FileText className="w-3 h-3 text-brand-500" />
                            <span>{cit.documentName} (p. {cit.pageNumber})</span>
                            <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold ml-1">
                              {(cit.similarityScore * 100).toFixed(0)}% Match
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="pt-3 flex items-center justify-between text-xs text-slate-500">
                    <span>Model: GPT-4.1 Enterprise • Vector Index: Qdrant HNSW</span>
                    <button
                      onClick={() => setCurrentView('chat')}
                      className="text-brand-600 dark:text-brand-400 font-semibold hover:underline flex items-center gap-1"
                    >
                      <span>Open in Full Chat Engine</span>
                      <ExternalLink className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center text-center p-8 border border-dashed border-slate-300 dark:border-slate-800 rounded-xl">
                  <Layers className="w-10 h-10 text-slate-400 mb-3" />
                  <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">Click "Run RAG" or select a sample question above</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Simulates real-time vector chunk retrieval and grounded LLM generation</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
