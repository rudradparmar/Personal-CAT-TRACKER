'use client';

import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { ThemeMode } from '@/types/tracker';

interface ThemeToggleProps {
  theme: ThemeMode;
  onToggle: () => void;
}

export default function ThemeToggle({ theme, onToggle }: ThemeToggleProps) {
  return (
    <button
      onClick={onToggle}
      className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition-colors border border-slate-200 dark:border-slate-700 focus:outline-none"
      title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
      aria-label="Toggle theme"
    >
      {theme === 'dark' ? (
        <Sun className="w-5 h-5 text-amber-400 animate-in spin-in-180 duration-300" />
      ) : (
        <Moon className="w-5 h-5 text-indigo-600 animate-in spin-in-180 duration-300" />
      )}
    </button>
  );
}

