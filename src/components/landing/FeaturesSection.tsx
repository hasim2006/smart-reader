'use client';

import React from 'react';
import { Search, ShieldCheck, Database, FileText, Cpu, BarChart3, Layers, Lock, Zap } from 'lucide-react';

export default function FeaturesSection() {
  const features = [
    {
      icon: Search,
      title: 'Hybrid Vector & Keyword Search',
      description: 'Combines 1536-dimensional dense embedding similarity (OpenAI/BGE) with BM25 sparse lexical search using Reciprocal Rank Fusion.'
    },
    {
      icon: FileText,
      title: 'Intelligent Document Processing',
      description: 'Automatic text extraction, OCR for scanned PDFs, table structure preservation, and sliding-window semantic chunking.'
    },
    {
      icon: ShieldCheck,
      title: 'Verifiable Document Citations',
      description: 'Every LLM output is grounded with exact document title, section header, page number, and chunk similarity confidence scores.'
    },
    {
      icon: Cpu,
      title: 'Multi-LLM Orchestration',
      description: 'Switch seamlessly between OpenAI GPT-4.1/GPT-5, Anthropic Claude 3.5 Sonnet, Google Gemini 1.5 Pro, and Llama 3 70B.'
    },
    {
      icon: Database,
      title: 'Enterprise Vector DB Connectors',
      description: 'Connect to Pinecone, Qdrant, Weaviate, ChromaDB, or run high-performance local FAISS GPU vector indexes.'
    },
    {
      icon: Lock,
      title: 'Role-Based Access & Governance',
      description: 'Granular permissions (Admin, Editor, Analyst, Viewer), KMS encryption at rest, tenant isolation, and 365-day audit trail.'
    }
  ];

  return (
    <section id="features" className="py-24 px-6 relative">
      <div className="max-w-6xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-accent-50 dark:bg-accent-950/40 border border-accent-200 dark:border-accent-800 text-accent-600 dark:text-accent-300 text-xs font-semibold mb-4">
            <Zap className="w-3.5 h-3.5 text-accent-500" />
            <span>Built for High-Scale Enterprise Intelligence</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Engineered for <span className="text-gradient-primary">Zero Hallucinations</span>
          </h2>
          <p className="mt-4 text-slate-600 dark:text-slate-300 text-base sm:text-lg">
            Everything your organization needs to parse, index, search, and converse with institutional knowledge securely.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feat, idx) => {
            const IconComponent = feat.icon;
            return (
              <div
                key={idx}
                className="p-6 rounded-2xl glass-panel shadow-enterprise-md hover:shadow-enterprise-lg border border-slate-200/80 dark:border-slate-800 hover:border-brand-500/50 dark:hover:border-brand-500/50 transition-all group"
              >
                <div className="w-12 h-12 rounded-xl bg-brand-50 dark:bg-brand-950/60 border border-brand-200/60 dark:border-brand-800/60 text-brand-600 dark:text-brand-400 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                  <IconComponent className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">{feat.title}</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{feat.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
