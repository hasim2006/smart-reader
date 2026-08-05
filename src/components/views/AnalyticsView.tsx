'use client';

import React from 'react';
import { useApp } from '@/context/AppContext';
import { BarChart3, TrendingUp, Cpu, Database, Clock, ShieldCheck, Zap } from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar
} from 'recharts';

export default function AnalyticsView() {
  const { documents } = useApp();

  const queryTrendData = [
    { time: '08:00', queries: 240, latencyMs: 120 },
    { time: '10:00', queries: 890, latencyMs: 145 },
    { time: '12:00', queries: 1420, latencyMs: 190 },
    { time: '14:00', queries: 1850, latencyMs: 160 },
    { time: '16:00', queries: 1210, latencyMs: 135 },
    { time: '18:00', queries: 640, latencyMs: 110 }
  ];

  const storageDistribution = [
    { name: 'Finance', value: 34.5, color: '#2563EB' },
    { name: 'Legal', value: 51.2, color: '#14B8A6' },
    { name: 'R&D', value: 89.0, color: '#8B5CF6' },
    { name: 'HR', value: 24.1, color: '#F59E0B' }
  ];

  const popularTopics = [
    { topic: 'Q3 Financial Growth', count: 480 },
    { topic: 'Vector Encryption Policy', count: 390 },
    { topic: 'Hybrid RRF Benchmarks', count: 320 },
    { topic: 'PTO & Benefits Guide', count: 210 },
    { topic: 'CSAT Support Tickets', count: 180 }
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Header */}
      <div>
        <h2 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">Performance & Knowledge Analytics</h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
          Real-time metrics tracking vector index retrieval latency, storage allocation, query volume, and search trends.
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="p-5 rounded-2xl glass-panel border border-slate-200/80 dark:border-slate-800">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-500">Queries Executed Today</div>
          <div className="text-2xl font-extrabold text-slate-900 dark:text-white mt-2">18,490</div>
          <div className="text-xs text-emerald-600 font-semibold mt-1">+14.2% from yesterday</div>
        </div>

        <div className="p-5 rounded-2xl glass-panel border border-slate-200/80 dark:border-slate-800">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-500">Average RAG Latency</div>
          <div className="text-2xl font-extrabold text-brand-600 dark:text-brand-400 mt-2">1.12s</div>
          <div className="text-xs text-emerald-600 font-semibold mt-1">185ms Vector Retrieval</div>
        </div>

        <div className="p-5 rounded-2xl glass-panel border border-slate-200/80 dark:border-slate-800">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-500">Vector Storage Used</div>
          <div className="text-2xl font-extrabold text-slate-900 dark:text-white mt-2">42.8 GB</div>
          <div className="text-xs text-slate-500 mt-1">198.8 MB Raw Knowledge</div>
        </div>

        <div className="p-5 rounded-2xl glass-panel border border-slate-200/80 dark:border-slate-800">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-500">Retrieval Precision</div>
          <div className="text-2xl font-extrabold text-accent-500 mt-2">98.4%</div>
          <div className="text-xs text-emerald-600 font-semibold mt-1">Zero Hallucination Score</div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Query Volume & Latency Trend (Area Chart) */}
        <div className="lg:col-span-8 p-6 rounded-3xl glass-panel border border-slate-200/80 dark:border-slate-800 shadow-enterprise-md space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-brand-500" />
              <span>Query Volume & Latency (Today)</span>
            </h3>
            <span className="text-[10px] font-bold bg-brand-50 dark:bg-brand-950 text-brand-600 px-2 py-0.5 rounded">
              Real-time Stream
            </span>
          </div>

          <div className="h-64 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={queryTrendData}>
                <defs>
                  <linearGradient id="colorQueries" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563EB" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#2563EB" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="time" stroke="#94a3b8" fontSize={11} />
                <YAxis stroke="#94a3b8" fontSize={11} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0F172A', borderColor: '#1E293B', borderRadius: '12px', color: '#fff', fontSize: '12px' }}
                />
                <Area type="monotone" dataKey="queries" stroke="#2563EB" strokeWidth={3} fillOpacity={1} fill="url(#colorQueries)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Right: Storage Breakdown (Pie Chart) */}
        <div className="lg:col-span-4 p-6 rounded-3xl glass-panel border border-slate-200/80 dark:border-slate-800 shadow-enterprise-md space-y-4">
          <h3 className="text-sm font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <Database className="w-4 h-4 text-accent-500" />
            <span>Storage by Department (MB)</span>
          </h3>

          <div className="h-48 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={storageDistribution} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={45} outerRadius={70} paddingAngle={4}>
                  {storageDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: '#0F172A', borderColor: '#1E293B', borderRadius: '12px', color: '#fff', fontSize: '12px' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs pt-2">
            {storageDistribution.map(item => (
              <div key={item.name} className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                <span className="font-medium text-slate-600 dark:text-slate-400">{item.name}: {item.value} MB</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Bar Chart: Popular Searched Topics */}
      <div className="p-6 rounded-3xl glass-panel border border-slate-200/80 dark:border-slate-800 shadow-enterprise-md space-y-4">
        <h3 className="text-sm font-extrabold text-slate-900 dark:text-white">Top Searched Knowledge Topics</h3>
        <div className="h-56 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={popularTopics}>
              <XAxis dataKey="topic" stroke="#94a3b8" fontSize={11} />
              <YAxis stroke="#94a3b8" fontSize={11} />
              <Tooltip
                contentStyle={{ backgroundColor: '#0F172A', borderColor: '#1E293B', borderRadius: '12px', color: '#fff', fontSize: '12px' }}
              />
              <Bar dataKey="count" fill="#14B8A6" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
