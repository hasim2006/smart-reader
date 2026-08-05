'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { DocumentItem, FileType, Department } from '@/types';
import {
  FileText,
  UploadCloud,
  Search,
  Filter,
  Trash2,
  Eye,
  Tag,
  CheckCircle2,
  AlertCircle,
  Cpu,
  Layers,
  Sparkles,
  Grid,
  List,
  X,
  Database,
  ArrowRight,
  Plus
} from 'lucide-react';

export default function DocumentsView() {
  const { documents, addDocument, deleteDocument, activePreviewDoc, setActivePreviewDoc } = useApp();

  const [searchFilter, setSearchFilter] = useState<string>('');
  const [selectedDept, setSelectedDept] = useState<string>('All');
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [uploadStage, setUploadStage] = useState<number>(0); // 0 to 4
  const [uploadFileName, setUploadFileName] = useState<string>('');

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setUploadFileName(file.name);
      setIsUploading(true);
      setUploadStage(1);

      // Simulate 4-Stage Ingestion Pipeline
      setTimeout(() => setUploadStage(2), 700);
      setTimeout(() => setUploadStage(3), 1400);
      setTimeout(() => setUploadStage(4), 2100);
      setTimeout(() => {
        setIsUploading(false);
        setUploadStage(0);
        addDocument(file.name, file.size);
      }, 2600);
    }
  };

  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.name.toLowerCase().includes(searchFilter.toLowerCase()) ||
                          doc.tags.some(t => t.toLowerCase().includes(searchFilter.toLowerCase()));
    const matchesDept = selectedDept === 'All' || doc.department === selectedDept;
    return matchesSearch && matchesDept;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Controls Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">Document Management</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Upload, chunk, inspect, and manage enterprise documents indexed in your vector database.
          </p>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <label className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold shadow-enterprise-md cursor-pointer transition-all active:scale-95">
            <UploadCloud className="w-4 h-4" />
            <span>Upload New Document</span>
            <input type="file" className="hidden" onChange={handleFileUpload} />
          </label>

          <div className="flex items-center p-1 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-lg transition-colors ${viewMode === 'table' ? 'bg-white dark:bg-slate-700 text-brand-600 dark:text-brand-400 shadow-xs' : 'text-slate-400'}`}
            >
              <List className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-lg transition-colors ${viewMode === 'grid' ? 'bg-white dark:bg-slate-700 text-brand-600 dark:text-brand-400 shadow-xs' : 'text-slate-400'}`}
            >
              <Grid className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Live Interactive Ingestion Pipeline Stage Visualizer */}
      {isUploading && (
        <div className="p-6 rounded-2xl glass-panel border border-brand-500/50 bg-brand-50/40 dark:bg-brand-950/30 shadow-enterprise-lg space-y-4 animate-in fade-in duration-150">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5 text-xs font-extrabold text-brand-700 dark:text-brand-300">
              <Cpu className="w-4 h-4 text-brand-500 animate-spin" />
              <span>Processing Enterprise File: {uploadFileName}</span>
            </div>
            <span className="text-xs font-bold text-brand-600 dark:text-brand-400">
              Stage {uploadStage} of 4 ({uploadStage * 25}%)
            </span>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-slate-200 dark:bg-slate-800 rounded-full h-2 overflow-hidden">
            <div
              className="bg-gradient-to-r from-brand-600 to-accent-500 h-full transition-all duration-500 ease-out"
              style={{ width: `${uploadStage * 25}%` }}
            />
          </div>

          {/* Stage Indicators */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-2 text-xs">
            <div className={`p-2.5 rounded-xl border flex items-center gap-2 ${uploadStage >= 1 ? 'border-brand-500 bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-bold' : 'border-slate-200 dark:border-slate-800 text-slate-400'}`}>
              <CheckCircle2 className={`w-3.5 h-3.5 ${uploadStage >= 1 ? 'text-brand-500' : 'text-slate-400'}`} />
              <span>1. Text & Layout OCR</span>
            </div>

            <div className={`p-2.5 rounded-xl border flex items-center gap-2 ${uploadStage >= 2 ? 'border-brand-500 bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-bold' : 'border-slate-200 dark:border-slate-800 text-slate-400'}`}>
              <CheckCircle2 className={`w-3.5 h-3.5 ${uploadStage >= 2 ? 'text-brand-500' : 'text-slate-400'}`} />
              <span>2. Sliding Window Chunking</span>
            </div>

            <div className={`p-2.5 rounded-xl border flex items-center gap-2 ${uploadStage >= 3 ? 'border-brand-500 bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-bold' : 'border-slate-200 dark:border-slate-800 text-slate-400'}`}>
              <CheckCircle2 className={`w-3.5 h-3.5 ${uploadStage >= 3 ? 'text-brand-500' : 'text-slate-400'}`} />
              <span>3. 1536d Embeddings</span>
            </div>

            <div className={`p-2.5 rounded-xl border flex items-center gap-2 ${uploadStage >= 4 ? 'border-brand-500 bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-bold' : 'border-slate-200 dark:border-slate-800 text-slate-400'}`}>
              <CheckCircle2 className={`w-3.5 h-3.5 ${uploadStage >= 4 ? 'text-brand-500' : 'text-slate-400'}`} />
              <span>4. HNSW Vector Indexing</span>
            </div>
          </div>
        </div>
      )}

      {/* Filter & Search Bar */}
      <div className="p-4 rounded-2xl glass-panel border border-slate-200/80 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchFilter}
            onChange={e => setSearchFilter(e.target.value)}
            placeholder="Search documents by title or tag..."
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
          />
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
            <Filter className="w-3.5 h-3.5" />
            <span>Department:</span>
          </div>
          <select
            value={selectedDept}
            onChange={e => setSelectedDept(e.target.value)}
            className="px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-800 dark:text-slate-200 focus:outline-none"
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
      </div>

      {/* Document List: Table vs Grid */}
      {viewMode === 'table' ? (
        <div className="rounded-2xl glass-panel border border-slate-200/80 dark:border-slate-800 overflow-hidden shadow-enterprise-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100/70 dark:bg-slate-900/70 border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider">
                <tr>
                  <th className="py-3.5 px-4">Document Name</th>
                  <th className="py-3.5 px-4">Department</th>
                  <th className="py-3.5 px-4">Chunks / Tokens</th>
                  <th className="py-3.5 px-4">Security Level</th>
                  <th className="py-3.5 px-4">Tags</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800 font-medium">
                {filteredDocuments.map(doc => (
                  <tr key={doc.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-brand-50 dark:bg-brand-950/60 text-brand-600 dark:text-brand-400 font-bold uppercase text-[10px]">
                          {doc.fileType}
                        </div>
                        <div>
                          <div className="font-bold text-slate-900 dark:text-white">{doc.name}</div>
                          <div className="text-[10px] text-slate-500 font-normal">
                            {(doc.sizeBytes / 1024).toFixed(0)} KB • Authored by {doc.author}
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 font-semibold text-slate-700 dark:text-slate-300">
                      {doc.department}
                    </td>

                    <td className="py-3.5 px-4 text-slate-600 dark:text-slate-400">
                      <span className="font-bold text-slate-900 dark:text-white">{doc.chunksCount}</span> chunks ({doc.tokensCount.toLocaleString()} t)
                    </td>

                    <td className="py-3.5 px-4">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        doc.securityLevel === 'Confidential' || doc.securityLevel === 'Restricted'
                          ? 'bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-800'
                          : 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800'
                      }`}>
                        {doc.securityLevel}
                      </span>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="flex flex-wrap gap-1">
                        {doc.tags.slice(0, 2).map((t, idx) => (
                          <span key={idx} className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-[10px] text-slate-600 dark:text-slate-400">
                            #{t}
                          </span>
                        ))}
                      </div>
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => setActivePreviewDoc(doc)}
                          className="p-1.5 rounded-lg text-brand-600 dark:text-brand-400 hover:bg-brand-50 dark:hover:bg-brand-950/40 transition-colors"
                          title="Inspect Chunks & Vector Data"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => deleteDocument(doc.id)}
                          className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                          title="Delete Document"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDocuments.map(doc => (
            <div
              key={doc.id}
              className="p-5 rounded-2xl glass-panel border border-slate-200/80 dark:border-slate-800 hover:border-brand-500/50 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="px-2.5 py-1 rounded-lg bg-brand-50 dark:bg-brand-950/60 text-brand-600 dark:text-brand-400 text-xs font-bold uppercase">
                    {doc.fileType}
                  </span>
                  <span className="text-[10px] font-bold text-slate-500">{doc.department}</span>
                </div>

                <h3 className="text-sm font-bold text-slate-900 dark:text-white line-clamp-1 mb-2">{doc.name}</h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-3 leading-relaxed mb-4">
                  {doc.summary || doc.rawText?.slice(0, 140)}
                </p>
              </div>

              <div className="pt-4 border-t border-slate-200/60 dark:border-slate-800/60 flex items-center justify-between text-xs">
                <span className="text-slate-500 font-medium">{doc.chunksCount} Chunks</span>
                <button
                  onClick={() => setActivePreviewDoc(doc)}
                  className="px-3 py-1.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs flex items-center gap-1 transition-colors"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Inspect</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Document Detail & Chunk Inspector Modal */}
      {activePreviewDoc && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-4xl max-h-[85vh] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-enterprise-lg flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-2xl bg-brand-50 dark:bg-brand-950/60 text-brand-600 dark:text-brand-400 font-bold uppercase text-xs">
                  {activePreviewDoc.fileType}
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-slate-900 dark:text-white">{activePreviewDoc.name}</h3>
                  <div className="text-xs text-slate-500 mt-0.5">
                    {activePreviewDoc.department} • Authored by {activePreviewDoc.author} • {activePreviewDoc.chunksCount} Chunks • {activePreviewDoc.tokensCount.toLocaleString()} Tokens
                  </div>
                </div>
              </div>
              <button onClick={() => setActivePreviewDoc(null)} className="p-2 rounded-xl text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body: Chunks & Vector Inspector */}
            <div className="p-6 overflow-y-auto space-y-6 flex-1">
              {/* Executive Summary Card */}
              <div className="p-4 rounded-2xl bg-brand-50/60 dark:bg-brand-950/40 border border-brand-200 dark:border-brand-800">
                <h4 className="text-xs font-bold uppercase tracking-wider text-brand-700 dark:text-brand-300 mb-1.5 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4" /> Auto-Generated Document Summary
                </h4>
                <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                  {activePreviewDoc.summary}
                </p>
              </div>

              {/* Chunks Inspector List */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Extracted Semantic Chunks & 1536d Vector Embeddings ({activePreviewDoc.chunks?.length || 0})
                </h4>

                {activePreviewDoc.chunks?.map((chunk, idx) => (
                  <div key={chunk.id} className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                        <Database className="w-3.5 h-3.5 text-brand-500" />
                        Chunk #{chunk.chunkIndex} (Page {chunk.pageNumber})
                      </span>
                      <span className="font-mono text-[10px] text-brand-600 dark:text-brand-400 bg-brand-50 dark:bg-brand-900/60 px-2 py-0.5 rounded border border-brand-200 dark:border-brand-800">
                        Vector ID: {chunk.vectorId}
                      </span>
                    </div>

                    <p className="text-xs text-slate-700 dark:text-slate-300 font-sans leading-relaxed">
                      "{chunk.content}"
                    </p>

                    <div className="flex items-center justify-between pt-2 border-t border-slate-200/60 dark:border-slate-700/60 text-[10px] text-slate-400">
                      <span>Token Length: {chunk.tokenCount} tokens</span>
                      <span>Section: {chunk.sectionHeader}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
