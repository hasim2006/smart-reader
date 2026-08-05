'use client';

import React from 'react';
import { useApp } from '@/context/AppContext';
import { Star, Quote } from 'lucide-react';

export default function TestimonialsSection() {
  const { siteContent } = useApp();

  const dynamicTestimonials = siteContent?.testimonials || [
    {
      quote: "Track Report replaced three separate knowledge tools for our research division. Being able to search 50,000 PDF pages with sub-second vector response and exact citations is game changing.",
      name: "Dr. Rachel Sterling",
      role: "VP of Engineering & AI",
      company: "BioTech Global",
      avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=120&auto=format&fit=crop&q=80",
      rating: 5
    },
    {
      quote: "Compliance auditing used to take weeks of manual document searching. With Track Report's Document Intelligence and strict RBAC controls, our legal counsel resolves queries in minutes.",
      name: "Jonathan Hayes",
      role: "Chief Information Security Officer",
      company: "FinCore Capital",
      avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=120&auto=format&fit=crop&q=80",
      rating: 5
    },
    {
      quote: "The multi-model flexibility (switching between Claude 3.5 Sonnet and GPT-4.1) combined with verifiable page citations makes this the single most trusted tool in our enterprise tech stack.",
      name: "Elena Rostova",
      role: "Head of Operations & Knowledge",
      company: "Vertex Dynamics",
      avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=120&auto=format&fit=crop&q=80",
      rating: 5
    }
  ];

  return (
    <section id="testimonials" className="py-24 px-6 relative bg-slate-50 dark:bg-slate-900/60 border-t border-slate-200/80 dark:border-slate-800/80 animate-in fade-in duration-200">
      <div className="max-w-6xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Loved by <span className="text-gradient-primary">Enterprise Leaders</span>
          </h2>
          <p className="mt-3 text-slate-600 dark:text-slate-400 text-base">
            See how Fortune 500 decision makers streamline knowledge retrieval and safeguard institutional data.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {dynamicTestimonials.map((t: any, idx: number) => (
            <div
              key={t.id || idx}
              className="p-6 rounded-2xl glass-panel shadow-enterprise-md flex flex-col justify-between border border-slate-200/80 dark:border-slate-800 relative"
            >
              <div>
                <div className="flex items-center gap-1 text-amber-500 mb-4">
                  {[...Array(t.rating || 5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <Quote className="w-8 h-8 text-brand-500/20 mb-2" />
                <p className="text-sm text-slate-700 dark:text-slate-300 italic leading-relaxed mb-6">
                  "{t.text || t.quote}"
                </p>
              </div>

              <div className="flex items-center gap-3 pt-4 border-t border-slate-200/60 dark:border-slate-800/60">
                <img src={t.avatar} alt={t.name || t.author} className="w-10 h-10 rounded-full object-cover border border-brand-500" />
                <div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">{t.name || t.author}</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{t.role || t.title} • <span className="font-semibold">{t.company}</span></p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
