'use client';

import React from 'react';
import { useApp } from '@/context/AppContext';
import { Sparkles, Moon, Sun, ArrowRight, ShieldCheck, FileSearch } from 'lucide-react';

export default function LandingNavbar() {
  const { setCurrentView, isDarkMode, toggleDarkMode, setIsAuthModalOpen } = useApp();

  return (
    <nav className="glass-header border-b border-slate-200/80 dark:border-slate-800/80 px-6 py-4 transition-colors">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Brand Logo */}
        <div 
          onClick={() => setCurrentView('home')}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-enterprise bg-gradient-to-tr from-brand-600 to-accent-500 flex items-center justify-center text-white shadow-glow-primary group-hover:scale-105 transition-transform">
            <FileSearch className="w-5.5 h-5.5" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-xl tracking-tight text-slate-900 dark:text-white">Track Report</span>
              <span className="bg-brand-100 dark:bg-brand-900/60 text-brand-700 dark:text-brand-300 text-xs font-semibold px-2 py-0.5 rounded-full border border-brand-200 dark:border-brand-800">
                Enterprise
              </span>
            </div>
            <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium uppercase tracking-wider">Knowledge Platform</p>
          </div>
        </div>

        {/* Center Nav Links */}
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600 dark:text-slate-300">
          <a href="#features" className="hover:text-brand-600 dark:hover:text-brand-400 transition-colors">Features</a>
          <a href="#demo" className="hover:text-brand-600 dark:hover:text-brand-400 transition-colors">Live RAG Sandbox</a>
          <a href="#testimonials" className="hover:text-brand-600 dark:hover:text-brand-400 transition-colors">Enterprise Security</a>
          <button 
            onClick={() => setCurrentView('dashboard')}
            className="hover:text-brand-600 dark:hover:text-brand-400 transition-colors"
          >
            Product Dashboard
          </button>
        </div>

        {/* Right CTA Actions */}
        <div className="flex items-center gap-3">
          <button
            onClick={toggleDarkMode}
            className="p-2.5 rounded-enterprise text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title="Toggle theme"
          >
            {isDarkMode ? <Sun className="w-4.5 h-4.5" /> : <Moon className="w-4.5 h-4.5" />}
          </button>

          <button
            onClick={() => setIsAuthModalOpen(true)}
            className="px-4 py-2 text-sm font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-enterprise transition-colors hidden sm:block"
          >
            Sign In
          </button>

          <button
            onClick={() => setCurrentView('dashboard')}
            className="flex items-center gap-2 px-4.5 py-2.5 rounded-enterprise bg-brand-600 hover:bg-brand-700 text-white text-sm font-semibold shadow-enterprise-md hover:shadow-glow-primary transition-all active:scale-[0.98]"
          >
            <span>Launch Platform</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </nav>
  );
}
