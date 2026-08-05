'use client';

import React from 'react';
import { useApp } from '@/context/AppContext';
import { Shield, Activity, Cpu, Box, Globe2, Layers, Building2 } from 'lucide-react';

export default function CustomerLogos() {
  const { siteContent } = useApp();

  const dynamicLogos = siteContent?.customerLogos || [
    { id: 'l1', name: 'Vertex Dynamics', logoUrl: '⚡ Vertex' },
    { id: 'l2', name: 'CloudScale Inc', logoUrl: '☁️ CloudScale' },
    { id: 'l3', name: 'BioTech Global', logoUrl: '🧬 BioTech' },
    { id: 'l4', name: 'FinCore Capital', logoUrl: '🛡️ FinCore' },
    { id: 'l5', name: 'Acme Enterprise', logoUrl: '🏢 Acme Corp' },
    { id: 'l6', name: 'OmniData Labs', logoUrl: '📦 OmniData' }
  ];

  return (
    <div className="py-12 border-y border-slate-200/60 dark:border-slate-800/60 bg-white/40 dark:bg-slate-900/40">
      <div className="max-w-6xl mx-auto px-6 text-center">
        <p className="text-xs font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400 mb-8">
          Trusted by Knowledge & Engineering Teams at Leading Global Organizations
        </p>

        <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-12 opacity-80">
          {dynamicLogos.map((logo: any) => (
            <div key={logo.id || logo.name} className="flex items-center gap-2 text-slate-700 dark:text-slate-300 font-bold text-sm sm:text-base hover:opacity-100 transition-opacity">
              <Building2 className="w-4 h-4 text-brand-600 dark:text-brand-400" />
              <span>{logo.name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
