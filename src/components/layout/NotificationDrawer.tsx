'use client';

import React from 'react';
import { useApp } from '@/context/AppContext';
import { Bell, CheckCircle2, Info, AlertTriangle, X } from 'lucide-react';

export default function NotificationDrawer({ onClose }: { onClose: () => void }) {
  const { notifications, dismissNotification } = useApp();

  return (
    <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-enterprise-lg p-4 z-50 animate-in fade-in zoom-in-95 duration-150">
      <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800 mb-3">
        <div className="flex items-center gap-2">
          <Bell className="w-4 h-4 text-brand-600 dark:text-brand-400" />
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
            System Notifications ({notifications.length})
          </h3>
        </div>
        <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800">
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="space-y-2.5 max-h-80 overflow-y-auto pr-1">
        {notifications.length === 0 ? (
          <div className="text-center py-6 text-xs text-slate-500">No new notifications</div>
        ) : (
          notifications.map(n => (
            <div
              key={n.id}
              className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 flex items-start gap-3 relative group"
            >
              {n.type === 'success' && <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />}
              {n.type === 'info' && <Info className="w-4 h-4 text-brand-500 shrink-0 mt-0.5" />}
              {n.type === 'warning' && <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />}

              <div className="flex-1 min-w-0 pr-4">
                <div className="text-xs font-bold text-slate-900 dark:text-white">{n.title}</div>
                <div className="text-xs text-slate-600 dark:text-slate-300 mt-0.5 leading-tight">{n.message}</div>
                <div className="text-[10px] text-slate-400 mt-1 font-medium">{n.timestamp}</div>
              </div>

              <button
                onClick={() => dismissNotification(n.id)}
                className="absolute top-2.5 right-2.5 opacity-0 group-hover:opacity-100 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-opacity"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
