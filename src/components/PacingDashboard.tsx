'use client';

import React from 'react';
import { calculateSummaryMetrics } from '@/utils/calculations';
import { TrackerStore } from '@/types/tracker';
import { CUMULATIVE_TARGETS } from '@/utils/constants';
import {
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  Brain,
  Calculator,
  BookOpen,
  Trophy,
  Hourglass
} from 'lucide-react';

interface PacingDashboardProps {
  store: TrackerStore;
}

export default function PacingDashboard({ store }: PacingDashboardProps) {
  const metrics = calculateSummaryMetrics(store);

  return (
    <div className="space-y-5">
      {/* Dynamic Pacing Hero Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-brand-600 via-brand-700 to-indigo-800 text-white p-6 md:p-8 shadow-lg">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="max-w-xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-bold uppercase tracking-wider mb-3">
              <Hourglass className="w-3.5 h-3.5" />
              <span>CAT Exam Countdown: Nov 27 Deadline</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-black tracking-tight">
              {metrics.daysLeft} Days Left in Your Final Sprint
            </h1>
            <p className="mt-2 text-sm text-brand-100 leading-relaxed">
              To hit your <strong>250 LRDI sets</strong> target, your required run rate from today onward is{' '}
              <strong className="text-white underline decoration-amber-400 decoration-2">
                {metrics.lrdiPace} sets/day
              </strong>
              . Complete your mandatory arithmetic and mock testing early each day.
            </p>
          </div>

          <div className="flex md:flex-col items-center justify-between md:items-end gap-2 bg-black/20 backdrop-blur-sm p-4 rounded-2xl border border-white/10">
            <span className="text-xs uppercase font-bold tracking-wider text-brand-200">
              LRDI Current Run Rate
            </span>
            <div className="text-3xl font-black text-amber-300">
              {metrics.lrdiPace}{' '}
              <span className="text-xs text-white font-medium">sets / day</span>
            </div>
            {metrics.lrdiPace > 12 ? (
              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-200 bg-amber-500/30 px-2 py-0.5 rounded-md">
                <AlertTriangle className="w-3 h-3" /> Pace Alert: Catch up
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-200 bg-emerald-500/30 px-2 py-0.5 rounded-md">
                <CheckCircle2 className="w-3 h-3" /> On Track Pace
              </span>
            )}
          </div>
        </div>

        {/* Subtle background glow */}
        <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-brand-400/20 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* Cumulative Subject Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* 1. LRDI Target */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400">
                <Brain className="w-4 h-4" />
              </div>
              <span className="text-xs font-bold uppercase text-slate-500 dark:text-slate-400">
                LRDI Goal
              </span>
            </div>
            <span className="text-xs font-bold text-amber-600 dark:text-amber-400">
              {metrics.lrdiPct}%
            </span>
          </div>

          <div className="text-2xl font-black text-slate-900 dark:text-white">
            {metrics.totalLrdi}{' '}
            <span className="text-sm font-semibold text-slate-400">
              / {CUMULATIVE_TARGETS.lrdi} Sets
            </span>
          </div>

          <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden my-3">
            <div
              className="h-full bg-amber-500 rounded-full transition-all duration-300"
              style={{ width: `${metrics.lrdiPct}%` }}
            />
          </div>

          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 pt-1">
            <span>Remaining: {Math.max(0, CUMULATIVE_TARGETS.lrdi - metrics.totalLrdi)}</span>
            <span className="font-bold text-slate-800 dark:text-slate-200">
              {metrics.lrdiPace} sets/day
            </span>
          </div>
        </div>

        {/* 2. QA Target */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400">
                <Calculator className="w-4 h-4" />
              </div>
              <span className="text-xs font-bold uppercase text-slate-500 dark:text-slate-400">
                QA Questions
              </span>
            </div>
            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
              {metrics.qaPct}%
            </span>
          </div>

          <div className="text-2xl font-black text-slate-900 dark:text-white">
            {metrics.totalQa}{' '}
            <span className="text-sm font-semibold text-slate-400">
              / {CUMULATIVE_TARGETS.qaTotal} Qs
            </span>
          </div>

          <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden my-3">
            <div
              className="h-full bg-emerald-500 rounded-full transition-all duration-300"
              style={{ width: `${metrics.qaPct}%` }}
            />
          </div>

          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 pt-1">
            <span>Arith: {metrics.totalArith} | Choice: {metrics.totalChoice}</span>
            <span className="font-bold text-slate-800 dark:text-slate-200">
              {metrics.qaPace} Qs/day
            </span>
          </div>
        </div>

        {/* 3. VARC Target */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-sky-50 dark:bg-sky-950/60 text-sky-600 dark:text-sky-400">
                <BookOpen className="w-4 h-4" />
              </div>
              <span className="text-xs font-bold uppercase text-slate-500 dark:text-slate-400">
                VARC Units
              </span>
            </div>
            <span className="text-xs font-bold text-sky-600 dark:text-sky-400">
              {metrics.varcPct}%
            </span>
          </div>

          <div className="text-2xl font-black text-slate-900 dark:text-white">
            {metrics.totalVarc}{' '}
            <span className="text-sm font-semibold text-slate-400">
              / {CUMULATIVE_TARGETS.varcTotal} Units
            </span>
          </div>

          <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden my-3">
            <div
              className="h-full bg-sky-500 rounded-full transition-all duration-300"
              style={{ width: `${metrics.varcPct}%` }}
            />
          </div>

          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 pt-1">
            <span>Remaining: {Math.max(0, CUMULATIVE_TARGETS.varcTotal - metrics.totalVarc)}</span>
            <span className="font-bold text-slate-800 dark:text-slate-200">
              {metrics.varcPace} units/day
            </span>
          </div>
        </div>

        {/* 4. Mocks Target */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400">
                <Trophy className="w-4 h-4" />
              </div>
              <span className="text-xs font-bold uppercase text-slate-500 dark:text-slate-400">
                Mocks Taken
              </span>
            </div>
            <span className="text-xs font-bold text-purple-600 dark:text-purple-400">
              {metrics.mockPct}%
            </span>
          </div>

          <div className="text-2xl font-black text-slate-900 dark:text-white">
            {metrics.totalMocks}{' '}
            <span className="text-sm font-semibold text-slate-400">
              / {CUMULATIVE_TARGETS.mocks} Mocks
            </span>
          </div>

          <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden my-3">
            <div
              className="h-full bg-purple-500 rounded-full transition-all duration-300"
              style={{ width: `${metrics.mockPct}%` }}
            />
          </div>

          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 pt-1">
            <span>Remaining: {Math.max(0, CUMULATIVE_TARGETS.mocks - metrics.totalMocks)}</span>
            <span className="font-bold text-slate-800 dark:text-slate-200">
              {metrics.mockPace} /day
            </span>
          </div>
        </div>

      </div>
    </div>
  );
}
