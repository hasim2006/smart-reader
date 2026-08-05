'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import {
  getIntelligentSummaries,
  getInsightsEngineData,
  getResearchAnalysis,
  getCompanyAnalysis,
  getFlashcardsAndMcqs
} from '@/lib/documentIntelligenceEngine';
import {
  Sparkles,
  FileText,
  GitCompare,
  HelpCircle,
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  Cpu,
  Layers,
  Copy,
  Check,
  TrendingUp,
  BookOpen,
  Building2,
  Calendar,
  UserCheck,
  Hash,
  Brain,
  ShieldCheck,
  ListOrdered,
  FileSpreadsheet,
  Download,
  RotateCw
} from 'lucide-react';
import { compareTwoDocuments } from '@/lib/ragEngine';

export default function AiToolsView() {
  const { documents } = useApp();

  // Primary Tool Category: 'summaries' | 'insights' | 'research_company' | 'learning_quiz' | 'compare'
  const [activeTab, setActiveTab] = useState<'summaries' | 'insights' | 'research_company' | 'learning_quiz' | 'compare'>('summaries');
  
  // Selected Document
  const [selectedDocId, setSelectedDocId] = useState<string>(documents[0]?.id || '');
  const [compareDocAId, setCompareDocAId] = useState<string>(documents[0]?.id || '');
  const [compareDocBId, setCompareDocBId] = useState<string>(documents[1]?.id || '');

  // Sub-tab for Multi-Level Summaries
  const [summaryLevel, setSummaryLevel] = useState<'executive' | 'one_line' | 'detailed' | 'section' | 'chapter' | 'action_items'>('executive');
  
  // Quiz State
  const [revealedFlashcardId, setRevealedFlashcardId] = useState<string | null>(null);
  const [userMcqAnswers, setUserMcqAnswers] = useState<Record<string, number>>({});
  const [copiedSection, setCopiedSection] = useState<string | null>(null);

  const doc = documents.find(d => d.id === selectedDocId) || documents[0];
  const docA = documents.find(d => d.id === compareDocAId) || documents[0];
  const docB = documents.find(d => d.id === compareDocBId) || documents[1] || documents[0];

  if (!doc) {
    return (
      <div className="p-8 text-center text-slate-500">
        No documents available. Please upload a document to use AI Document Intelligence.
      </div>
    );
  }

  // Compute structured intelligence datasets
  const summaries = getIntelligentSummaries(doc);
  const insights = getInsightsEngineData(doc);
  const research = getResearchAnalysis(doc);
  const company = getCompanyAnalysis(doc);
  const { flashcards, mcqs } = getFlashcardsAndMcqs(doc);
  const diffData = compareTwoDocuments(docA, docB);

  const handleCopyText = (label: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSection(label);
    setTimeout(() => setCopiedSection(null), 2000);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div>
        <h2 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">AI Document Intelligence Hub</h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
          Multi-level instant summarization, deep trend analytics, research & company report parsers, interactive quizzes, and matrix diff tools.
        </p>
      </div>

      {/* Category Tabs */}
      <div className="flex flex-wrap items-center gap-2 p-1.5 rounded-2xl glass-panel border border-slate-200/80 dark:border-slate-800">
        <button
          onClick={() => setActiveTab('summaries')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'summaries' ? 'bg-brand-600 text-white shadow-enterprise-sm' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Multi-Level Summarizer</span>
        </button>

        <button
          onClick={() => setActiveTab('insights')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'insights' ? 'bg-brand-600 text-white shadow-enterprise-sm' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <TrendingUp className="w-4 h-4" />
          <span>Deep Insights & Trends</span>
        </button>

        <button
          onClick={() => setActiveTab('research_company')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'research_company' ? 'bg-brand-600 text-white shadow-enterprise-sm' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>Research & Corporate Analyzer</span>
        </button>

        <button
          onClick={() => setActiveTab('learning_quiz')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'learning_quiz' ? 'bg-brand-600 text-white shadow-enterprise-sm' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Brain className="w-4 h-4" />
          <span>Learning & Quiz Generator</span>
        </button>

        <button
          onClick={() => setActiveTab('compare')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'compare' ? 'bg-brand-600 text-white shadow-enterprise-sm' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <GitCompare className="w-4 h-4" />
          <span>Compare & Diff Matrix</span>
        </button>
      </div>

      {/* Target Document Selector */}
      {activeTab !== 'compare' && (
        <div className="flex items-center gap-3 p-4 rounded-2xl glass-panel border border-slate-200 dark:border-slate-800">
          <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Active Document Context:</span>
          <select
            value={selectedDocId}
            onChange={e => setSelectedDocId(e.target.value)}
            className="px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white focus:outline-none"
          >
            {documents.map(d => (
              <option key={d.id} value={d.id}>{d.name} ({d.department})</option>
            ))}
          </select>

          <span className="text-xs text-slate-400 font-medium ml-auto hidden sm:inline">
            {doc.pagesCount} Pages • {doc.tokensCount} Tokens • {doc.chunksCount} Vector Chunks
          </span>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* CATEGORY 1: MULTI-LEVEL INSTANT SUMMARIZER */}
      {/* ------------------------------------------------------------- */}
      {activeTab === 'summaries' && (
        <div className="space-y-6">
          {/* Sub-level Navigation */}
          <div className="flex flex-wrap gap-2 border-b border-slate-200 dark:border-slate-800 pb-3 text-xs font-bold">
            <button
              onClick={() => setSummaryLevel('executive')}
              className={`px-3 py-1.5 rounded-xl transition-colors ${summaryLevel === 'executive' ? 'bg-brand-100 dark:bg-brand-950 text-brand-700 dark:text-brand-300 border border-brand-300' : 'text-slate-500 hover:text-slate-900'}`}
            >
              Executive Summary
            </button>
            <button
              onClick={() => setSummaryLevel('one_line')}
              className={`px-3 py-1.5 rounded-xl transition-colors ${summaryLevel === 'one_line' ? 'bg-brand-100 dark:bg-brand-950 text-brand-700 dark:text-brand-300 border border-brand-300' : 'text-slate-500 hover:text-slate-900'}`}
            >
              One-Line Summary
            </button>
            <button
              onClick={() => setSummaryLevel('detailed')}
              className={`px-3 py-1.5 rounded-xl transition-colors ${summaryLevel === 'detailed' ? 'bg-brand-100 dark:bg-brand-950 text-brand-700 dark:text-brand-300 border border-brand-300' : 'text-slate-500 hover:text-slate-900'}`}
            >
              Detailed Breakdown
            </button>
            <button
              onClick={() => setSummaryLevel('section')}
              className={`px-3 py-1.5 rounded-xl transition-colors ${summaryLevel === 'section' ? 'bg-brand-100 dark:bg-brand-950 text-brand-700 dark:text-brand-300 border border-brand-300' : 'text-slate-500 hover:text-slate-900'}`}
            >
              Section-Wise Summary
            </button>
            <button
              onClick={() => setSummaryLevel('chapter')}
              className={`px-3 py-1.5 rounded-xl transition-colors ${summaryLevel === 'chapter' ? 'bg-brand-100 dark:bg-brand-950 text-brand-700 dark:text-brand-300 border border-brand-300' : 'text-slate-500 hover:text-slate-900'}`}
            >
              Chapter-Wise Summary
            </button>
            <button
              onClick={() => setSummaryLevel('action_items')}
              className={`px-3 py-1.5 rounded-xl transition-colors ${summaryLevel === 'action_items' ? 'bg-brand-100 dark:bg-brand-950 text-brand-700 dark:text-brand-300 border border-brand-300' : 'text-slate-500 hover:text-slate-900'}`}
            >
              Action Items & Dates
            </button>
          </div>

          {/* Display active summary view */}
          {summaryLevel === 'executive' && (
            <div className="p-6 rounded-3xl glass-panel border border-slate-200 dark:border-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-brand-500" /> Executive Overview & Key Findings
                </h3>
                <button
                  onClick={() => handleCopyText('exec', summaries.executiveSummary)}
                  className="text-xs text-slate-400 hover:text-slate-600 flex items-center gap-1"
                >
                  {copiedSection === 'exec' ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedSection === 'exec' ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
              <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                {summaries.executiveSummary}
              </p>

              <div className="pt-4 border-t border-slate-200 dark:border-slate-800">
                <h4 className="text-xs font-bold text-slate-900 dark:text-white mb-2">Key Takeaways:</h4>
                <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-400">
                  {summaries.keyTakeaways.map((point, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {summaryLevel === 'one_line' && (
            <div className="p-6 rounded-3xl glass-panel border border-slate-200 dark:border-slate-800 space-y-3">
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-brand-600 dark:text-brand-400">One-Sentence Essence</h3>
              <p className="text-base font-bold text-slate-900 dark:text-white leading-relaxed">
                "{summaries.oneLineSummary}"
              </p>
            </div>
          )}

          {summaryLevel === 'detailed' && (
            <div className="p-6 rounded-3xl glass-panel border border-slate-200 dark:border-slate-800 space-y-4">
              <h3 className="text-sm font-extrabold text-slate-900 dark:text-white">Comprehensive Detailed Analysis</h3>
              <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                {summaries.detailedSummary}
              </p>
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 text-xs space-y-2">
                <div className="font-bold text-slate-900 dark:text-white">Conclusion:</div>
                <p className="text-slate-600 dark:text-slate-400">{summaries.conclusion}</p>
              </div>
            </div>
          )}

          {summaryLevel === 'section' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {summaries.sectionWiseSummary.map((sec, idx) => (
                <div key={idx} className="p-5 rounded-2xl glass-panel border border-slate-200 dark:border-slate-800 space-y-2">
                  <div className="text-xs font-bold text-brand-600 dark:text-brand-400">{sec.section}</div>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">{sec.summary}</p>
                </div>
              ))}
            </div>
          )}

          {summaryLevel === 'chapter' && (
            <div className="space-y-4">
              {summaries.chapterWiseSummary.map((ch, idx) => (
                <div key={idx} className="p-5 rounded-2xl glass-panel border border-slate-200 dark:border-slate-800 flex items-start gap-4">
                  <div className="w-8 h-8 rounded-xl bg-brand-50 dark:bg-brand-950 text-brand-600 font-bold flex items-center justify-center text-xs shrink-0">
                    Ch. {idx + 1}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white">{ch.chapter}</h4>
                    <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">{ch.summary}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {summaryLevel === 'action_items' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-6 rounded-3xl glass-panel border border-slate-200 dark:border-slate-800 space-y-3">
                <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-2">
                  <ListOrdered className="w-4 h-4 text-brand-500" /> Action Items & Tasks
                </h3>
                <ul className="space-y-2 text-xs">
                  {summaries.actionItems.map((act, i) => (
                    <li key={i} className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 text-slate-700 dark:text-slate-300 font-medium">
                      • {act}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-6 rounded-3xl glass-panel border border-slate-200 dark:border-slate-800 space-y-3">
                <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-accent-500" /> Important Dates & Milestones
                </h3>
                <div className="space-y-2 text-xs">
                  {summaries.importantDates.map((dt, i) => (
                    <div key={i} className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 flex justify-between items-center">
                      <span className="font-semibold text-slate-800 dark:text-slate-200">{dt.event}</span>
                      <span className="font-mono text-brand-600 dark:text-brand-400 font-bold text-[11px]">{dt.date}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* CATEGORY 2: DEEP INSIGHTS & TRENDS */}
      {/* ------------------------------------------------------------- */}
      {activeTab === 'insights' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 rounded-3xl glass-panel border border-slate-200 dark:border-slate-800 space-y-4">
            <h3 className="text-sm font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-emerald-500" /> Key Insights & Hidden Trends
            </h3>
            <div className="space-y-2 text-xs">
              {insights.keyInsights.map((ins, idx) => (
                <div key={idx} className="p-3 rounded-xl bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 text-slate-800 dark:text-slate-200 font-medium">
                  💡 {ins}
                </div>
              ))}
            </div>
          </div>

          <div className="p-6 rounded-3xl glass-panel border border-slate-200 dark:border-slate-800 space-y-4">
            <h3 className="text-sm font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-500" /> Identified Risks & Bottlenecks
            </h3>
            <div className="space-y-2 text-xs">
              {insights.risks.map((r, idx) => (
                <div key={idx} className="p-3 rounded-xl bg-rose-50/60 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-800 text-rose-900 dark:text-rose-200 font-medium">
                  ⚠️ {r}
                </div>
              ))}
            </div>
          </div>

          <div className="p-6 rounded-3xl glass-panel border border-slate-200 dark:border-slate-800 space-y-4 md:col-span-2">
            <h3 className="text-sm font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
              <Hash className="w-4 h-4 text-violet-500" /> Frequently Discussed Topics
            </h3>
            <div className="flex flex-wrap gap-3">
              {insights.frequentlyDiscussedTopics.map((top, idx) => (
                <div key={idx} className="px-4 py-2 rounded-2xl bg-slate-100 dark:bg-slate-800 text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                  <span>{top.topic}</span>
                  <span className="px-2 py-0.5 rounded-full bg-brand-600 text-white text-[10px]">{top.mentionCount} mentions</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* CATEGORY 3: RESEARCH & CORPORATE ANALYZER */}
      {/* ------------------------------------------------------------- */}
      {activeTab === 'research_company' && (
        <div className="space-y-6">
          <div className="p-6 rounded-3xl glass-panel border border-slate-200 dark:border-slate-800 space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-brand-500" /> Research Paper & Scientific Analysis
              </h3>
              <span className="text-xs font-semibold text-slate-400">Authors: {research.authors.join(', ')}</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 space-y-1">
                <div className="font-bold text-brand-600 dark:text-brand-400">Problem Statement:</div>
                <p className="text-slate-700 dark:text-slate-300">{research.problemStatement}</p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 space-y-1">
                <div className="font-bold text-brand-600 dark:text-brand-400">Methodology & Dataset:</div>
                <p className="text-slate-700 dark:text-slate-300">{research.methodology}</p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 space-y-1">
                <div className="font-bold text-brand-600 dark:text-brand-400">Experimental Results:</div>
                <p className="text-slate-700 dark:text-slate-300">{research.results}</p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 space-y-1">
                <div className="font-bold text-brand-600 dark:text-brand-400">Novel Contributions:</div>
                <p className="text-slate-700 dark:text-slate-300">{research.novelContributions.join(' • ')}</p>
              </div>
            </div>
          </div>

          <div className="p-6 rounded-3xl glass-panel border border-slate-200 dark:border-slate-800 space-y-6">
            <h3 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
              <Building2 className="w-5 h-5 text-emerald-500" /> Corporate & Financial Report Insights
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
              {company.kpis.map((kpi, idx) => (
                <div key={idx} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                  <div className="text-[11px] font-bold text-slate-500">{kpi.name}</div>
                  <div className="text-lg font-extrabold text-brand-600 dark:text-brand-400 mt-1">{kpi.value}</div>
                </div>
              ))}
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 text-xs space-y-2">
              <div className="font-bold text-slate-900 dark:text-white">Revenue Highlights:</div>
              <p className="text-slate-700 dark:text-slate-300">{company.revenueHighlights}</p>
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* CATEGORY 4: LEARNING & QUIZ GENERATOR */}
      {/* ------------------------------------------------------------- */}
      {activeTab === 'learning_quiz' && (
        <div className="space-y-8">
          {/* Flashcards Section */}
          <div className="space-y-4">
            <h3 className="text-sm font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
              <Brain className="w-4 h-4 text-brand-500" /> Auto-Generated Study Flashcards ({flashcards.length})
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {flashcards.map(fc => (
                <div key={fc.id} className="p-5 rounded-2xl glass-panel border border-slate-200 dark:border-slate-800 space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-brand-600 dark:text-brand-400">{fc.category}</span>
                    <button
                      onClick={() => setRevealedFlashcardId(revealedFlashcardId === fc.id ? null : fc.id)}
                      className="text-xs font-bold text-brand-600 hover:underline"
                    >
                      {revealedFlashcardId === fc.id ? 'Hide Answer' : 'Flip Answer'}
                    </button>
                  </div>
                  <div className="text-xs font-bold text-slate-900 dark:text-white">Q: {fc.question}</div>
                  {revealedFlashcardId === fc.id && (
                    <div className="p-3 rounded-xl bg-brand-50 dark:bg-brand-950/60 text-xs font-medium text-slate-800 dark:text-slate-200 border border-brand-200 dark:border-brand-800 animate-in fade-in duration-150">
                      A: {fc.answer}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Multiple Choice Questions (MCQs) */}
          <div className="space-y-4 pt-4 border-t border-slate-200 dark:border-slate-800">
            <h3 className="text-sm font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Interactive Knowledge MCQs ({mcqs.length})
            </h3>

            <div className="space-y-4">
              {mcqs.map((mcq, mIdx) => {
                const selectedOpt = userMcqAnswers[mcq.id];
                const isSelected = selectedOpt !== undefined;
                const isCorrect = selectedOpt === mcq.correctOptionIndex;

                return (
                  <div key={mcq.id} className="p-5 rounded-2xl glass-panel border border-slate-200 dark:border-slate-800 space-y-3">
                    <div className="text-xs font-bold text-slate-900 dark:text-white">
                      {mIdx + 1}. {mcq.question}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {mcq.options.map((opt, oIdx) => (
                        <button
                          key={oIdx}
                          onClick={() => setUserMcqAnswers(prev => ({ ...prev, [mcq.id]: oIdx }))}
                          className={`p-3 rounded-xl text-xs text-left font-medium transition-all ${
                            selectedOpt === oIdx
                              ? oIdx === mcq.correctOptionIndex
                                ? 'bg-emerald-600 text-white font-bold'
                                : 'bg-rose-600 text-white font-bold'
                              : 'bg-slate-50 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
                          }`}
                        >
                          {String.fromCharCode(65 + oIdx)}. {opt}
                        </button>
                      ))}
                    </div>

                    {isSelected && (
                      <div className={`p-3 rounded-xl text-xs font-medium ${
                        isCorrect ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300' : 'bg-rose-50 dark:bg-rose-950/40 text-rose-800 dark:text-rose-300'
                      }`}>
                        {isCorrect ? '✓ Correct Answer! ' : '✗ Incorrect. '} {mcq.explanation}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* CATEGORY 5: COMPARE & DIFF MATRIX */}
      {/* ------------------------------------------------------------- */}
      {activeTab === 'compare' && (
        <div className="space-y-6">
          <div className="p-6 rounded-3xl glass-panel border border-slate-200 dark:border-slate-800 space-y-4">
            <h3 className="text-sm font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
              <GitCompare className="w-4 h-4 text-brand-500" /> Document Version & Side-by-Side Diff Matrix
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Document A (Baseline):</label>
                <select
                  value={compareDocAId}
                  onChange={e => setCompareDocAId(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white"
                >
                  {documents.map(d => (
                    <option key={d.id} value={d.id}>{d.name} ({d.version})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Document B (Comparison Target):</label>
                <select
                  value={compareDocBId}
                  onChange={e => setCompareDocBId(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white"
                >
                  {documents.map(d => (
                    <option key={d.id} value={d.id}>{d.name} ({d.version})</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="p-6 rounded-3xl glass-panel border border-slate-200 dark:border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-900 dark:text-white">Comparative Matrix Findings</h4>
              <span className="text-xs font-extrabold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-200">
                {(diffData.similarityScore * 100).toFixed(0)}% Vector Similarity
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 space-y-2">
                <div className="font-bold text-slate-900 dark:text-white">{docA.name} Summary:</div>
                <p className="text-slate-600 dark:text-slate-400">{docA.summary}</p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 space-y-2">
                <div className="font-bold text-slate-900 dark:text-white">{docB.name} Summary:</div>
                <p className="text-slate-600 dark:text-slate-400">{docB.summary}</p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-brand-50 dark:bg-brand-950/40 border border-brand-200 dark:border-brand-800 text-xs space-y-2">
              <div className="font-bold text-brand-700 dark:text-brand-300">Key Differences & Divergences:</div>
              <ul className="space-y-1 text-slate-700 dark:text-slate-300">
                {diffData.keyDifferences.map((diff, i) => (
                  <li key={i}>• {diff}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
