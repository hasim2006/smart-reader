'use client';

import React from 'react';
import { useApp } from '@/context/AppContext';
import { FileSearch, ShieldCheck, Github, Twitter, Linkedin, Mail } from 'lucide-react';

export default function Footer() {
  const { setCurrentView } = useApp();

  return (
    <footer className="bg-slate-900 text-slate-400 py-16 px-6 border-t border-slate-800">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-5 gap-10">
        {/* Col 1: Brand Info */}
        <div className="md:col-span-2 space-y-4">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-brand-600 to-accent-500 flex items-center justify-center text-white font-bold">
              <FileSearch className="w-5 h-5" />
            </div>
            <span className="font-extrabold text-xl text-white tracking-tight">Track Report Enterprise</span>
          </div>
          <p className="text-sm text-slate-400 max-w-sm leading-relaxed">
            The modern AI-powered RAG knowledge management application for enterprise document search, citation verification, and decision intelligence.
          </p>
          <div className="flex items-center gap-3 pt-2 text-slate-400">
            <a href="#" className="p-2 rounded-lg bg-slate-800 hover:text-white transition-colors"><Github className="w-4 h-4" /></a>
            <a href="#" className="p-2 rounded-lg bg-slate-800 hover:text-white transition-colors"><Twitter className="w-4 h-4" /></a>
            <a href="#" className="p-2 rounded-lg bg-slate-800 hover:text-white transition-colors"><Linkedin className="w-4 h-4" /></a>
            <a href="#" className="p-2 rounded-lg bg-slate-800 hover:text-white transition-colors"><Mail className="w-4 h-4" /></a>
          </div>
        </div>

        {/* Col 2: Product Links */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 mb-4">Platform</h4>
          <ul className="space-y-2.5 text-sm">
            <li><button onClick={() => setCurrentView('dashboard')} className="hover:text-white transition-colors">Dashboard</button></li>
            <li><button onClick={() => setCurrentView('documents')} className="hover:text-white transition-colors">Document Ingestion</button></li>
            <li><button onClick={() => setCurrentView('search')} className="hover:text-white transition-colors">Hybrid Vector Search</button></li>
            <li><button onClick={() => setCurrentView('chat')} className="hover:text-white transition-colors">AI RAG Chat</button></li>
            <li><button onClick={() => setCurrentView('ai-tools')} className="hover:text-white transition-colors">Document AI Suite</button></li>
          </ul>
        </div>

        {/* Col 3: Architecture & Vector DBs */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 mb-4">Integrations</h4>
          <ul className="space-y-2.5 text-sm">
            <li><span className="hover:text-white transition-colors">Pinecone Vector Index</span></li>
            <li><span className="hover:text-white transition-colors">Qdrant HNSW Graph</span></li>
            <li><span className="hover:text-white transition-colors">Weaviate Hybrid</span></li>
            <li><span className="hover:text-white transition-colors">ChromaDB Local</span></li>
            <li><span className="hover:text-white transition-colors">FAISS GPU Engine</span></li>
          </ul>
        </div>

        {/* Col 4: Governance & Security */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 mb-4">Compliance</h4>
          <ul className="space-y-2.5 text-sm">
            <li><button onClick={() => setCurrentView('settings')} className="hover:text-white transition-colors">SOC 2 Type II</button></li>
            <li><button onClick={() => setCurrentView('settings')} className="hover:text-white transition-colors">ISO 27001 Certified</button></li>
            <li><button onClick={() => setCurrentView('settings')} className="hover:text-white transition-colors">GDPR & HIPAA Ready</button></li>
            <li><button onClick={() => setCurrentView('settings')} className="hover:text-white transition-colors">Zero-Retention API Policy</button></li>
            <li><button onClick={() => setCurrentView('settings')} className="hover:text-white transition-colors">Audit Log System</button></li>
          </ul>
        </div>
      </div>

      <div className="max-w-6xl mx-auto mt-12 pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500">
        <p>© 2026 Track Report Enterprise Technologies Inc. All rights reserved.</p>
        <div className="flex items-center gap-6 mt-4 sm:mt-0">
          <a href="#" className="hover:text-slate-300 transition-colors">Privacy Policy</a>
          <a href="#" className="hover:text-slate-300 transition-colors">Terms of Service</a>
          <a href="#" className="hover:text-slate-300 transition-colors">Security Architecture</a>
        </div>
      </div>
    </footer>
  );
}
