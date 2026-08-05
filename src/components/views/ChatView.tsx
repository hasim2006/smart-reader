'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '@/context/AppContext';
import { ChatThread, ChatMessage, Citation } from '@/types';
import {
  MessageSquare,
  Plus,
  Trash2,
  Send,
  Sparkles,
  Bot,
  User,
  Copy,
  Check,
  Share2,
  Download,
  RotateCw,
  FileText,
  ShieldCheck,
  ChevronDown,
  Cpu,
  Paperclip,
  UploadCloud,
  X,
  FileUp,
  Loader2
} from 'lucide-react';
import CitationDrawer from './CitationDrawer';

export default function ChatView() {
  const {
    chatThreads,
    activeThreadId,
    setActiveThreadId,
    activeThread,
    createNewThread,
    sendMessageInThread,
    deleteThread,
    setActiveCitation,
    modelConfig,
    updateModelConfig,
    addDocument
  } = useApp();

  const [inputPrompt, setInputPrompt] = useState<string>('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isModelDropdownOpen, setIsModelDropdownOpen] = useState<boolean>(false);
  const [attachedFile, setAttachedFile] = useState<{ name: string; size: number; content?: string } | null>(null);
  const [isIngesting, setIsIngesting] = useState<boolean>(false);
  const [isDragging, setIsDragging] = useState<boolean>(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const availableModels = [
    'OpenAI GPT-4.1 Enterprise',
    'Anthropic Claude 3.5 Sonnet',
    'Google Gemini 1.5 Pro',
    'Llama 3.3 70B Enterprise'
  ];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeThread?.messages]);

  const processSelectedFile = (file: File) => {
    setIsIngesting(true);
    const reader = new FileReader();

    const isTextFile = file.name.endsWith('.txt') ||
                       file.name.endsWith('.md') ||
                       file.name.endsWith('.csv') ||
                       file.name.endsWith('.json') ||
                       file.type.startsWith('text/');

    if (isTextFile) {
      reader.onload = (event) => {
        const content = event.target?.result as string;
        setAttachedFile({ name: file.name, size: file.size, content });
        addDocument(file.name, file.size, content);
        setIsIngesting(false);
      };
      reader.readAsText(file);
    } else {
      // For binary files (PDF, DOCX, etc.), ingest with standard parser
      setTimeout(() => {
        setAttachedFile({ name: file.name, size: file.size });
        addDocument(file.name, file.size);
        setIsIngesting(false);
      }, 500);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processSelectedFile(e.target.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processSelectedFile(e.dataTransfer.files[0]);
    }
  };

  const handleSend = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    
    let text = inputPrompt.trim();

    if (attachedFile) {
      const filePrompt = `[Uploaded File: ${attachedFile.name}]\n${text || 'What is this document about? Give an executive summary and key findings.'}`;
      text = filePrompt;
      setAttachedFile(null);
    }

    if (!text) return;

    setInputPrompt('');
    sendMessageInThread(text);
  };

  const handleCopyMessage = (msgId: string, content: string) => {
    navigator.clipboard.writeText(content);
    setCopiedId(msgId);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleExportThread = () => {
    if (!activeThread) return;
    const textData = activeThread.messages
      .map(m => `[${m.role.toUpperCase()} - ${m.timestamp}]\n${m.content}\n`)
      .join('\n----------------------------------------\n\n');
    const blob = new Blob([textData], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${activeThread.title.replace(/[^a-zA-Z0-9]/g, '_')}_Transcript.txt`;
    a.click();
  };

  return (
    <div 
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className="h-[calc(100vh-6rem)] flex gap-6 relative animate-in fade-in duration-200"
    >
      {/* Hidden File Input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileSelect}
        accept=".pdf,.docx,.txt,.csv,.json,.md,.xlsx,.pptx"
        className="hidden"
      />

      {/* Drag & Drop Visual Overlay */}
      {isDragging && (
        <div className="absolute inset-0 bg-brand-600/90 backdrop-blur-md z-50 rounded-3xl flex flex-col items-center justify-center text-white p-8 border-4 border-dashed border-white/60 animate-in fade-in duration-150">
          <UploadCloud className="w-16 h-16 mb-3 animate-bounce" />
          <h3 className="text-xl font-extrabold">Drop File Here to Chat & Ingest</h3>
          <p className="text-sm opacity-90 mt-1">Supports PDF, DOCX, CSV, TXT, JSON, & Markdown files</p>
        </div>
      )}

      {/* Left Panel: Conversation Thread List */}
      <div className="w-72 hidden md:flex flex-col justify-between rounded-3xl glass-panel border border-slate-200/80 dark:border-slate-800 p-4 shadow-enterprise-sm shrink-0">
        <div>
          <button
            onClick={() => createNewThread()}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs shadow-enterprise-sm transition-all mb-4"
          >
            <Plus className="w-4 h-4" />
            <span>New Chat Thread</span>
          </button>

          <div className="space-y-1">
            <p className="px-2 text-[10px] font-extrabold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2">
              Saved Conversations ({chatThreads.length})
            </p>

            <div className="space-y-1.5 max-h-[calc(100vh-16rem)] overflow-y-auto pr-1">
              {chatThreads.map(thread => {
                const isActive = thread.id === activeThreadId;
                return (
                  <div
                    key={thread.id}
                    onClick={() => setActiveThreadId(thread.id)}
                    className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-center justify-between group ${
                      isActive
                        ? 'border-brand-600 bg-brand-50/70 dark:bg-brand-950/40 text-slate-900 dark:text-white shadow-xs'
                        : 'border-transparent hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <MessageSquare className={`w-4 h-4 shrink-0 ${isActive ? 'text-brand-600 dark:text-brand-400' : 'text-slate-400'}`} />
                      <span className="text-xs font-bold truncate">{thread.title}</span>
                    </div>

                    {chatThreads.length > 1 && (
                      <button
                        onClick={e => {
                          e.stopPropagation();
                          deleteThread(thread.id);
                        }}
                        className="opacity-0 group-hover:opacity-100 p-1 text-slate-400 hover:text-rose-500 transition-opacity"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Export Button */}
        <button
          onClick={handleExportThread}
          className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Export Conversation</span>
        </button>
      </div>

      {/* Main Chat Interface */}
      <div className="flex-1 flex flex-col justify-between rounded-3xl glass-panel border border-slate-200/80 dark:border-slate-800 shadow-enterprise-md overflow-hidden relative">
        {/* Top Header: Active Thread & Model Selector */}
        <div className="p-4 border-b border-slate-200/80 dark:border-slate-800/80 flex items-center justify-between bg-white/50 dark:bg-slate-900/50">
          <div className="flex items-center gap-3">
            <Bot className="w-5 h-5 text-brand-600 dark:text-brand-400" />
            <div>
              <h3 className="text-sm font-extrabold text-slate-900 dark:text-white line-clamp-1">
                {activeThread?.title || 'AI RAG Chat'}
              </h3>
              <p className="text-[10px] text-slate-500 font-medium flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                Active Scope: All Enterprise Documents & Direct Uploads
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Quick Upload Button in Chat Header */}
            <button
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-brand-50 dark:bg-brand-950/60 text-brand-700 dark:text-brand-300 border border-brand-200 dark:border-brand-800 text-xs font-bold hover:bg-brand-100 dark:hover:bg-brand-900/80 transition-colors"
            >
              <UploadCloud className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Upload File</span>
            </button>

            {/* LLM Model Switcher Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsModelDropdownOpen(!isModelDropdownOpen)}
                className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-800 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
              >
                <Cpu className="w-3.5 h-3.5 text-brand-600 dark:text-brand-400" />
                <span>{modelConfig.defaultModel}</span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {isModelDropdownOpen && (
                <div className="absolute right-0 mt-2 w-64 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-enterprise-lg p-2 z-40 space-y-1">
                  <div className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Select Enterprise LLM
                  </div>
                  {availableModels.map(m => (
                    <button
                      key={m}
                      onClick={() => {
                        updateModelConfig({ defaultModel: m });
                        setIsModelDropdownOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold flex items-center justify-between ${
                        modelConfig.defaultModel === m
                          ? 'bg-brand-50 dark:bg-brand-950/60 text-brand-600 dark:text-brand-400'
                          : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                      }`}
                    >
                      <span>{m}</span>
                      {modelConfig.defaultModel === m && <Check className="w-3.5 h-3.5" />}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Chat Messages Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {activeThread?.messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-8">
              <div className="w-14 h-14 rounded-2xl bg-brand-50 dark:bg-brand-950/60 text-brand-600 dark:text-brand-400 flex items-center justify-center mb-4 shadow-glow-primary">
                <Sparkles className="w-7 h-7" />
              </div>
              <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">Enterprise Retrieval-Augmented Generation</h3>
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-[11px] font-bold text-emerald-600 dark:text-emerald-400 mt-2">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Zero-Hallucination Grounded AI Search</span>
              </div>
              <p className="text-xs text-slate-500 max-w-md mt-1 leading-relaxed">
                Directly upload your PDF reports, DOCX files, or spreadsheets to ask questions. Answers are synthesized with exact page citations.
              </p>

              {/* Direct File Upload Dropzone in Welcome State */}
              <div 
                onClick={() => fileInputRef.current?.click()}
                className="mt-6 p-6 rounded-2xl border-2 border-dashed border-brand-300 dark:border-brand-800 hover:border-brand-500 bg-brand-50/40 dark:bg-brand-950/20 max-w-md w-full cursor-pointer transition-all hover:scale-[1.01] group"
              >
                <div className="flex flex-col items-center gap-2">
                  <div className="p-3 rounded-xl bg-white dark:bg-slate-800 text-brand-600 dark:text-brand-400 shadow-enterprise-xs group-hover:scale-110 transition-transform">
                    <FileUp className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-xs font-extrabold text-slate-900 dark:text-white group-hover:text-brand-600 transition-colors">
                      Click or Drag & Drop File to Upload & Ask AI
                    </span>
                    <p className="text-[10px] text-slate-500 mt-0.5">Supports PDF, DOCX, CSV, TXT, JSON, MD</p>
                  </div>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5 max-w-2xl w-full text-left">
                <button
                  onClick={() => sendMessageInThread('What is this document about? Give an executive overview.')}
                  className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-brand-500 bg-slate-50/50 dark:bg-slate-900/50 text-xs font-semibold text-slate-700 dark:text-slate-300 transition-colors"
                >
                  📄 "What is this document about?"
                </button>
                <button
                  onClick={() => sendMessageInThread('Explain this document in simple language with examples.')}
                  className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-brand-500 bg-slate-50/50 dark:bg-slate-900/50 text-xs font-semibold text-slate-700 dark:text-slate-300 transition-colors"
                >
                  💡 "Explain in simple language"
                </button>
                <button
                  onClick={() => sendMessageInThread('What are the key risks, opportunities, and recommendations?')}
                  className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-brand-500 bg-slate-50/50 dark:bg-slate-900/50 text-xs font-semibold text-slate-700 dark:text-slate-300 transition-colors"
                >
                  ⚠️ "Risks & Recommendations"
                </button>
                <button
                  onClick={() => sendMessageInThread('Compare Chapter 2 and Chapter 5 findings.')}
                  className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-brand-500 bg-slate-50/50 dark:bg-slate-900/50 text-xs font-semibold text-slate-700 dark:text-slate-300 transition-colors"
                >
                  ⚖️ "Compare Chapter 2 vs 5"
                </button>
                <button
                  onClick={() => sendMessageInThread('Summarize page 12 and explain the financial table data.')}
                  className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-brand-500 bg-slate-50/50 dark:bg-slate-900/50 text-xs font-semibold text-slate-700 dark:text-slate-300 transition-colors"
                >
                  📊 "Summarize Page 12 & Table"
                </button>
                <button
                  onClick={() => sendMessageInThread('Generate 3 interview questions and flashcards.')}
                  className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-brand-500 bg-slate-50/50 dark:bg-slate-900/50 text-xs font-semibold text-slate-700 dark:text-slate-300 transition-colors"
                >
                  🎓 "Generate MCQs & Quiz"
                </button>
              </div>
            </div>
          ) : (
            activeThread?.messages.map(msg => (
              <div key={msg.id} className={`flex gap-4 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                {msg.role === 'assistant' && (
                  <div className="w-9 h-9 rounded-xl bg-brand-600 text-white flex items-center justify-center shrink-0 shadow-enterprise-sm">
                    <Bot className="w-5 h-5" />
                  </div>
                )}

                <div className={`max-w-2xl space-y-3 ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                  {/* Message Bubble */}
                  <div className={`p-4 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                    msg.role === 'user'
                      ? 'bg-brand-600 text-white font-medium shadow-enterprise-sm rounded-tr-xs'
                      : 'bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-800 shadow-enterprise-sm rounded-tl-xs whitespace-pre-line'
                  }`}>
                    {msg.content}
                  </div>

                  {/* Inline Document Citations Box */}
                  {msg.citations && msg.citations.length > 0 && (
                    <div className="p-3 rounded-xl bg-brand-50/70 dark:bg-brand-950/40 border border-brand-200 dark:border-brand-800/80 space-y-2">
                      <div className="text-[11px] font-bold text-brand-700 dark:text-brand-300 flex items-center gap-1.5">
                        <ShieldCheck className="w-3.5 h-3.5" />
                        <span>Verifiable Document Citations ({msg.citations.length})</span>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        {msg.citations.map((cit, idx) => (
                          <button
                            key={cit.id}
                            onClick={() => setActiveCitation(cit)}
                            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold border border-slate-200 dark:border-slate-700 hover:border-brand-500 transition-colors shadow-xs"
                          >
                            <FileText className="w-3.5 h-3.5 text-brand-500" />
                            <span>{cit.documentName} (p. {cit.pageNumber})</span>
                            <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-extrabold ml-1">
                              {(cit.similarityScore * 100).toFixed(0)}%
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Suggested Follow-up Questions */}
                  {msg.suggestedFollowUps && msg.suggestedFollowUps.length > 0 && (
                    <div className="space-y-1.5 pt-1">
                      <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Suggested Follow-ups</div>
                      <div className="flex flex-wrap gap-2">
                        {msg.suggestedFollowUps.map((q, idx) => (
                          <button
                            key={idx}
                            onClick={() => sendMessageInThread(q)}
                            className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800/80 hover:bg-brand-50 dark:hover:bg-brand-950/40 text-xs font-semibold text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 transition-colors"
                          >
                            + {q}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Message Footer Info & Actions */}
                  <div className="flex items-center gap-3 text-[10px] text-slate-400 font-medium px-1">
                    <span>{msg.timestamp}</span>
                    {msg.modelUsed && <span>• {msg.modelUsed}</span>}
                    {msg.retrievalLatencyMs && <span>• Latency: {msg.retrievalLatencyMs}ms</span>}

                    <button
                      onClick={() => handleCopyMessage(msg.id, msg.content)}
                      className="ml-auto hover:text-slate-600 dark:hover:text-slate-200 flex items-center gap-1"
                    >
                      {copiedId === msg.id ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                      <span>{copiedId === msg.id ? 'Copied' : 'Copy'}</span>
                    </button>
                  </div>
                </div>

                {msg.role === 'user' && (
                  <div className="w-9 h-9 rounded-xl bg-slate-900 text-white flex items-center justify-center shrink-0">
                    <User className="w-5 h-5" />
                  </div>
                )}
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Chat Input Bar with Direct File Attachment Chip */}
        <div className="p-4 border-t border-slate-200/80 dark:border-slate-800/80 bg-white/70 dark:bg-slate-900/70 space-y-2">
          {/* Attached File Chip Preview */}
          {attachedFile && (
            <div className="flex items-center justify-between px-3 py-1.5 rounded-xl bg-brand-50 dark:bg-brand-950/60 border border-brand-200 dark:border-brand-800 text-xs font-semibold text-brand-800 dark:text-brand-200 animate-in fade-in duration-100">
              <div className="flex items-center gap-2 min-w-0">
                <FileText className="w-4 h-4 text-brand-600 dark:text-brand-400 shrink-0" />
                <span className="truncate">{attachedFile.name}</span>
                <span className="text-[10px] text-slate-400 font-normal">({(attachedFile.size / 1024).toFixed(0)} KB)</span>
                <span className="text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 px-1.5 py-0.2 rounded border border-emerald-200 dark:border-emerald-800 ml-1">
                  Indexed in Vector Store
                </span>
              </div>
              <button
                onClick={() => setAttachedFile(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          <form onSubmit={handleSend} className="relative flex items-center gap-2">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={isIngesting}
              className="p-3 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors shrink-0"
              title="Attach File to Chat"
            >
              {isIngesting ? (
                <Loader2 className="w-4 h-4 animate-spin text-brand-600" />
              ) : (
                <Paperclip className="w-4 h-4" />
              )}
            </button>

            <input
              type="text"
              value={inputPrompt}
              onChange={e => setInputPrompt(e.target.value)}
              placeholder={attachedFile ? `Ask questions about ${attachedFile.name}...` : "Ask natural language questions or upload files directly..."}
              className="w-full pl-4 pr-24 py-3.5 rounded-2xl bg-slate-100/80 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm font-semibold text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-500 focus:outline-none"
            />
            
            <button
              type="submit"
              disabled={!inputPrompt.trim() && !attachedFile}
              className="absolute right-2 px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 disabled:opacity-50 text-white font-bold text-xs flex items-center gap-1.5 shadow-enterprise-sm transition-all"
            >
              <span>Send</span>
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      </div>

      {/* Right Source Inspector Drawer */}
      <CitationDrawer />
    </div>
  );
}
