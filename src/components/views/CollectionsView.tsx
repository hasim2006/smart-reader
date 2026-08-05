'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { FolderKanban, Plus, FileText, ArrowRight, Shield, TrendingUp, Cpu, Users, X } from 'lucide-react';

export default function CollectionsView() {
  const { collections, documents, addCollection, setCurrentView } = useApp();
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [name, setName] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [department, setDepartment] = useState<any>('Engineering');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      addCollection(name, description, department);
      setName('');
      setDescription('');
      setIsModalOpen(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header Bar */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">Knowledge Collections</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Organize enterprise documents into department workspaces and scoped RAG retrieval domains.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold shadow-enterprise-md transition-all active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>New Collection Workspace</span>
        </button>
      </div>

      {/* Collections Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {collections.map(col => {
          const colDocs = documents.filter(d => d.collection === col.name);
          const totalSize = colDocs.reduce((acc, d) => acc + d.sizeBytes, 0);

          return (
            <div
              key={col.id}
              className="p-6 rounded-3xl glass-panel border border-slate-200/80 dark:border-slate-800 hover:border-brand-500/50 transition-all flex flex-col justify-between shadow-enterprise-sm relative overflow-hidden group"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-2xl bg-gradient-to-tr ${col.color} text-white shadow-enterprise-sm`}>
                    <FolderKanban className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-bold text-slate-500 bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-full">
                    {col.department} Scope
                  </span>
                </div>

                <h3 className="text-lg font-extrabold text-slate-900 dark:text-white group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
                  {col.name}
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-2 leading-relaxed">
                  {col.description}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-200/60 dark:border-slate-800/60 flex items-center justify-between text-xs">
                <div className="flex items-center gap-3 text-slate-500 font-medium">
                  <span><strong className="text-slate-900 dark:text-white">{colDocs.length}</strong> Docs</span>
                  <span>•</span>
                  <span>{(totalSize / (1024 * 1024)).toFixed(1)} MB</span>
                </div>

                <button
                  onClick={() => setCurrentView('documents')}
                  className="text-brand-600 dark:text-brand-400 font-bold hover:underline flex items-center gap-1"
                >
                  <span>Explore Scope</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* New Collection Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-enterprise-lg p-6 relative animate-in fade-in zoom-in-95 duration-150">
            <button onClick={() => setIsModalOpen(false)} className="absolute top-4 right-4 p-2 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full">
              <X className="w-4 h-4" />
            </button>

            <h3 className="text-lg font-extrabold text-slate-900 dark:text-white mb-1">Create Collection Workspace</h3>
            <p className="text-xs text-slate-500 mb-4">Define a new isolated knowledge domain for document ingestion and AI queries.</p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Workspace Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Patent Architecture & IP"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Department Scope</label>
                <select
                  value={department}
                  onChange={e => setDepartment(e.target.value as any)}
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-900 dark:text-white focus:outline-none"
                >
                  <option value="Executive">Executive</option>
                  <option value="Finance">Finance</option>
                  <option value="Legal">Legal</option>
                  <option value="Engineering">Engineering</option>
                  <option value="HR">HR</option>
                  <option value="R&D">R&D</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Description</label>
                <textarea
                  rows={3}
                  placeholder="Summary of documents stored in this collection..."
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-500 focus:outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold shadow-enterprise-md transition-colors"
              >
                Create Workspace
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
