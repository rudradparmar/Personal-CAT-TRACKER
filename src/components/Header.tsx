'use client';

import React from 'react';
import { ThemeMode } from '@/types/tracker';
import ThemeToggle from './ThemeToggle';
import { Smartphone, RefreshCw, Flame, Check } from 'lucide-react';

interface HeaderProps {
  theme: ThemeMode;
  onToggleTheme: () => void;
  onOpenSync: () => void;
  syncRoom: string;
  isSyncing: boolean;
  daysRemaining: number;
}

export default function Header({
  theme,
  onToggleTheme,
  onOpenSync,
  syncRoom,
  isSyncing,
  daysRemaining
}: HeaderProps) {
  return (
    <header className="sticky top-0 z-40 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-brand-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-brand-500/20">
            <span className="text-xl">🎯</span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-black text-slate-900 dark:text-white text-base tracking-tight">
                CAT 2026 Sprint
              </span>
              <span className="hidden sm:inline-block text-[10px] font-black uppercase tracking-wider bg-brand-50 dark:bg-brand-950 text-brand-600 dark:text-brand-400 px-2 py-0.5 rounded-full border border-brand-200 dark:border-brand-800">
                Nov 11 - Nov 27
              </span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 hidden xs:block">
              Daily & Cumulative Prep Command Center
            </p>
          </div>
        </div>

        {/* Right Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          
          {/* Countdown Pill */}
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold border border-slate-200 dark:border-slate-700">
            <Flame className="w-3.5 h-3.5 text-amber-500" />
            <span>{daysRemaining} Days Left</span>
          </div>

          {/* Sync Button */}
          <button
            onClick={onOpenSync}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold border transition-all active:scale-95 ${
              syncRoom
                ? 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-200 dark:border-emerald-800/60 text-emerald-700 dark:text-emerald-300'
                : 'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
            }`}
            title="Configure Cloud Sync & Phone Access"
          >
            {isSyncing ? (
              <RefreshCw className="w-3.5 h-3.5 animate-spin text-brand-500" />
            ) : (
              <Smartphone className="w-3.5 h-3.5" />
            )}
            <span className="hidden sm:inline">
              {syncRoom ? `Sync: ${syncRoom}` : 'Connect Phone'}
            </span>
          </button>

          {/* Theme Switcher */}
          <ThemeToggle theme={theme} onToggle={onToggleTheme} />

        </div>

      </div>
    </header>
  );
}

