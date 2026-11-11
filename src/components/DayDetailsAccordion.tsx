'use client';

import React from 'react';
import { DailyEntry, MockType, QAChoiceType } from '@/types/tracker';
import { DAILY_TARGETS } from '@/utils/constants';
import { getDailyScore } from '@/utils/calculations';
import {
  BookOpen,
  Brain,
  Calculator,
  Trophy,
  Check,
  Plus,
  Minus,
  Sparkles,
  FileText,
  Clock,
  ArrowRight
} from 'lucide-react';

interface DayDetailsAccordionProps {
  entry: DailyEntry;
  onUpdate: (updated: DailyEntry) => void;
  onNextDay?: () => void;
  onPrevDay?: () => void;
}

export default function DayDetailsAccordion({
  entry,
  onUpdate,
  onNextDay,
  onPrevDay
}: DayDetailsAccordionProps) {
  const score = getDailyScore(entry);
  const dateObj = new Date(entry.date);
  const formattedDate = dateObj.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });

  const updateField = (field: keyof DailyEntry, value: unknown) => {
    onUpdate({
      ...entry,
      [field]: value,
      updatedAt: new Date().toISOString()
    });
  };

  const adjustNumber = (field: 'rc' | 'cr' | 'va' | 'lrdi' | 'arith' | 'qaChoice', delta: number) => {
    const current = Number(entry[field]) || 0;
    const newVal = Math.max(0, current + delta);
    updateField(field, newVal);
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 md:p-7 shadow-sm transition-all">
      {/* Date Header & Score Overview */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-100 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-brand-600 dark:text-brand-400 uppercase tracking-wider mb-1">
            <span>Daily Execution Workspace</span>
          </div>
          <h2 className="text-xl md:text-2xl font-black text-slate-900 dark:text-white">
            {formattedDate}
          </h2>
        </div>

        {/* Score & Next/Prev Controls */}
        <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
          {/* Quick Date Switchers */}
          <div className="flex items-center gap-1.5">
            {onPrevDay && (
              <button
                onClick={onPrevDay}
                className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-200 active:scale-95 transition-all"
              >
                ◀ Prev
              </button>
            )}
            {onNextDay && (
              <button
                onClick={onNextDay}
                className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-200 active:scale-95 transition-all"
              >
                Next ▶
              </button>
            )}
          </div>

          {/* Completion Badge */}
          <div className="flex items-center gap-3 bg-slate-50 dark:bg-slate-800/80 px-4 py-2 rounded-2xl border border-slate-200 dark:border-slate-700">
            <div className="text-right">
              <div className="text-xs font-semibold text-slate-500 dark:text-slate-400">Score</div>
              <div className="text-lg font-black text-slate-900 dark:text-white">{score}%</div>
            </div>
            <div className="w-10 h-10 relative flex items-center justify-center">
              <svg className="w-10 h-10 transform -rotate-90">
                <circle
                  cx="20"
                  cy="20"
                  r="16"
                  className="stroke-slate-200 dark:stroke-slate-700 fill-none"
                  strokeWidth="3.5"
                />
                <circle
                  cx="20"
                  cy="20"
                  r="16"
                  className="stroke-brand-500 fill-none transition-all duration-300"
                  strokeWidth="3.5"
                  strokeDasharray="100.5"
                  strokeDashoffset={100.5 - (100.5 * Math.min(100, score)) / 100}
                  strokeLinecap="round"
                />
              </svg>
              {score >= 100 ? (
                <Sparkles className="w-4 h-4 text-emerald-500 absolute" />
              ) : (
                <span className="text-[10px] font-bold absolute text-slate-700 dark:text-slate-300">
                  {score}%
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Target Blocks Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-6">
        
        {/* ==================== 1. VARC ==================== */}
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 p-4 bg-slate-50/50 dark:bg-slate-850">
          <div className="flex items-center gap-2 mb-4 text-slate-900 dark:text-white font-bold text-sm">
            <BookOpen className="w-4 h-4 text-sky-500" />
            <span>VARC (Verbal Ability & Reading Comp)</span>
          </div>

          <div className="space-y-3.5">
            {/* RC Passages */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-3 flex items-center justify-between">
              <div>
                <div className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                  RC Passages
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-400">
                  Target: {DAILY_TARGETS.rc} passages
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-slate-900 dark:text-white px-2">
                  {entry.rc} / {DAILY_TARGETS.rc}
                </span>
                <button
                  onClick={() => adjustNumber('rc', -1)}
                  className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 active:scale-90"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => adjustNumber('rc', 1)}
                  className="p-1.5 rounded-lg bg-brand-50 dark:bg-brand-950 text-brand-600 dark:text-brand-400 hover:bg-brand-100 dark:hover:bg-brand-900 active:scale-90"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => updateField('rc', DAILY_TARGETS.rc)}
                  className="px-2 py-1 rounded-lg text-xs font-bold bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/50 active:scale-95"
                >
                  Done (6)
                </button>
              </div>
            </div>

            {/* Critical Reasoning */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-3 flex items-center justify-between">
              <div>
                <div className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                  Critical Reasoning
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-400">
                  Target: {DAILY_TARGETS.cr} questions
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-slate-900 dark:text-white px-2">
                  {entry.cr} / {DAILY_TARGETS.cr}
                </span>
                <button
                  onClick={() => adjustNumber('cr', -1)}
                  className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 active:scale-90"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => adjustNumber('cr', 1)}
                  className="p-1.5 rounded-lg bg-brand-50 dark:bg-brand-950 text-brand-600 dark:text-brand-400 hover:bg-brand-100 dark:hover:bg-brand-900 active:scale-90"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => adjustNumber('cr', 5)}
                  className="px-2 py-1 rounded-lg text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 active:scale-90"
                >
                  +5
                </button>
                <button
                  onClick={() => updateField('cr', DAILY_TARGETS.cr)}
                  className="px-2 py-1 rounded-lg text-xs font-bold bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/50 active:scale-95"
                >
                  Done
                </button>
              </div>
            </div>

            {/* Verbal Ability */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-3 flex items-center justify-between">
              <div>
                <div className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                  Verbal Ability (VA)
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-400">
                  Target: {DAILY_TARGETS.va} questions
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-slate-900 dark:text-white px-2">
                  {entry.va} / {DAILY_TARGETS.va}
                </span>
                <button
                  onClick={() => adjustNumber('va', -1)}
                  className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 active:scale-90"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => adjustNumber('va', 1)}
                  className="p-1.5 rounded-lg bg-brand-50 dark:bg-brand-950 text-brand-600 dark:text-brand-400 hover:bg-brand-100 dark:hover:bg-brand-900 active:scale-90"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => adjustNumber('va', 5)}
                  className="px-2 py-1 rounded-lg text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 active:scale-90"
                >
                  +5
                </button>
                <button
                  onClick={() => updateField('va', DAILY_TARGETS.va)}
                  className="px-2 py-1 rounded-lg text-xs font-bold bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/50 active:scale-95"
                >
                  Done
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* ==================== 2. LRDI ==================== */}
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 p-4 bg-slate-50/50 dark:bg-slate-850 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-4 text-slate-900 dark:text-white font-bold text-sm">
              <Brain className="w-4 h-4 text-amber-500" />
              <span>LRDI (Logical Reasoning & Data Interp)</span>
            </div>

            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <div className="text-base font-bold text-slate-900 dark:text-white">
                    Daily Sets Solved
                  </div>
                  <div className="text-xs text-slate-500 dark:text-slate-400">
                    Daily target: 10 sets | Cumulative goal: <strong>250 sets</strong>
                  </div>
                </div>
                <span className="text-xl font-black text-amber-600 dark:text-amber-400">
                  {entry.lrdi} <span className="text-xs font-semibold text-slate-400">/ 10</span>
                </span>
              </div>

              {/* Steppers */}
              <div className="flex items-center gap-2 mt-2">
                <button
                  onClick={() => adjustNumber('lrdi', -1)}
                  className="flex-1 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold hover:bg-slate-200 dark:hover:bg-slate-700 active:scale-95 transition-all text-sm"
                >
                  -1 Set
                </button>
                <button
                  onClick={() => adjustNumber('lrdi', 1)}
                  className="flex-1 py-2 rounded-xl bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300 font-bold hover:bg-amber-100 dark:hover:bg-amber-900/60 active:scale-95 transition-all text-sm border border-amber-200 dark:border-amber-800/50"
                >
                  +1 Set
                </button>
                <button
                  onClick={() => adjustNumber('lrdi', 2)}
                  className="flex-1 py-2 rounded-xl bg-amber-100 dark:bg-amber-900/50 text-amber-800 dark:text-amber-200 font-bold hover:bg-amber-200 dark:hover:bg-amber-800 active:scale-95 transition-all text-sm"
                >
                  +2 Sets
                </button>
                <button
                  onClick={() => updateField('lrdi', DAILY_TARGETS.lrdi)}
                  className="flex-1 py-2 rounded-xl bg-emerald-500 text-white font-bold hover:bg-emerald-600 active:scale-95 transition-all text-sm"
                >
                  Done (10)
                </button>
              </div>
            </div>
          </div>

          <div className="mt-3 text-xs text-slate-500 dark:text-slate-400 bg-amber-50/50 dark:bg-amber-950/20 p-2.5 rounded-xl border border-amber-100 dark:border-amber-900/30">
            💡 Pro Tip: To achieve 250 sets before Nov 27, review past solution paths immediately after each attempt.
          </div>
        </div>

        {/* ==================== 3. QA ==================== */}
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 p-4 bg-slate-50/50 dark:bg-slate-850">
          <div className="flex items-center gap-2 mb-4 text-slate-900 dark:text-white font-bold text-sm">
            <Calculator className="w-4 h-4 text-emerald-500" />
            <span>QA (Quantitative Aptitude — 60 Qs Daily)</span>
          </div>

          <div className="space-y-3.5">
            {/* Mandatory Arithmetic */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <div className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                  Mandatory: Arithmetic
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-400">
                  TSD, Time & Work, Percentages, P&L (Target: 30)
                </div>
              </div>

              <div className="flex items-center gap-2 self-end sm:self-auto">
                <span className="text-sm font-bold text-slate-900 dark:text-white px-2">
                  {entry.arith} / 30
                </span>
                <button
                  onClick={() => adjustNumber('arith', -5)}
                  className="px-2 py-1 rounded-lg text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300"
                >
                  -5
                </button>
                <button
                  onClick={() => adjustNumber('arith', 5)}
                  className="px-2 py-1 rounded-lg text-xs font-bold bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400"
                >
                  +5
                </button>
                <button
                  onClick={() => adjustNumber('arith', 10)}
                  className="px-2 py-1 rounded-lg text-xs font-bold bg-emerald-100 dark:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300"
                >
                  +10
                </button>
                <button
                  onClick={() => updateField('arith', DAILY_TARGETS.qaArith)}
                  className="px-2.5 py-1 rounded-lg text-xs font-bold bg-emerald-500 text-white active:scale-95"
                >
                  Done (30)
                </button>
              </div>
            </div>

            {/* Optional Choice: Algebra or Geometry */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-3">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <div className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                    Choice Focus: {entry.qaChoiceType}
                  </div>
                  <div className="text-xs text-slate-500 dark:text-slate-400">
                    Pick 30 Algebra OR 30 Geometry daily
                  </div>
                </div>
                <span className="text-sm font-bold text-slate-900 dark:text-white">
                  {entry.qaChoice} / 30
                </span>
              </div>

              {/* Segmented Switcher */}
              <div className="grid grid-cols-2 gap-2 mb-3">
                <button
                  onClick={() => updateField('qaChoiceType', 'Algebra' as QAChoiceType)}
                  className={`py-1.5 rounded-xl text-xs font-bold transition-all ${
                    entry.qaChoiceType === 'Algebra'
                      ? 'bg-brand-500 text-white shadow-sm'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  Algebra Module (30)
                </button>
                <button
                  onClick={() => updateField('qaChoiceType', 'Geometry' as QAChoiceType)}
                  className={`py-1.5 rounded-xl text-xs font-bold transition-all ${
                    entry.qaChoiceType === 'Geometry'
                      ? 'bg-brand-500 text-white shadow-sm'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  Geometry Module (30)
                </button>
              </div>

              {/* Steppers */}
              <div className="flex items-center justify-end gap-2">
                <button
                  onClick={() => adjustNumber('qaChoice', -5)}
                  className="px-2 py-1 rounded-lg text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300"
                >
                  -5
                </button>
                <button
                  onClick={() => adjustNumber('qaChoice', 5)}
                  className="px-2 py-1 rounded-lg text-xs font-bold bg-brand-50 dark:bg-brand-950 text-brand-600 dark:text-brand-400"
                >
                  +5
                </button>
                <button
                  onClick={() => adjustNumber('qaChoice', 10)}
                  className="px-2 py-1 rounded-lg text-xs font-bold bg-brand-100 dark:bg-brand-900/60 text-brand-700 dark:text-brand-300"
                >
                  +10
                </button>
                <button
                  onClick={() => updateField('qaChoice', DAILY_TARGETS.qaChoice)}
                  className="px-2.5 py-1 rounded-lg text-xs font-bold bg-emerald-500 text-white active:scale-95"
                >
                  Done (30)
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* ==================== 4. MOCKS ==================== */}
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 p-4 bg-slate-50/50 dark:bg-slate-850 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-4 text-slate-900 dark:text-white font-bold text-sm">
              <Trophy className="w-4 h-4 text-purple-500" />
              <span>Mock Testing (Choose One Daily)</span>
            </div>

            <div className="grid grid-cols-3 gap-2.5">
              <button
                onClick={() => updateField('mock', '2 Sectionals' as MockType)}
                className={`p-3 rounded-2xl border text-center transition-all flex flex-col items-center gap-1 active:scale-95 ${
                  entry.mock === '2 Sectionals'
                    ? 'border-purple-500 bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 shadow-sm'
                    : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400'
                }`}
              >
                <span className="text-xl">📝</span>
                <span className="text-xs font-bold leading-tight">2 Sectionals</span>
                <span className="text-[10px] text-slate-400">80 mins</span>
              </button>

              <button
                onClick={() => updateField('mock', '1 Full Mock' as MockType)}
                className={`p-3 rounded-2xl border text-center transition-all flex flex-col items-center gap-1 active:scale-95 ${
                  entry.mock === '1 Full Mock'
                    ? 'border-purple-500 bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 shadow-sm'
                    : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400'
                }`}
              >
                <span className="text-xl">🏆</span>
                <span className="text-xs font-bold leading-tight">1 Full Mock</span>
                <span className="text-[10px] text-slate-400">120 mins</span>
              </button>

              <button
                onClick={() => updateField('mock', 'Missed' as MockType)}
                className={`p-3 rounded-2xl border text-center transition-all flex flex-col items-center gap-1 active:scale-95 ${
                  entry.mock === 'Missed'
                    ? 'border-slate-400 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                    : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-400'
                }`}
              >
                <span className="text-xl">💤</span>
                <span className="text-xs font-bold leading-tight">Rest / None</span>
                <span className="text-[10px] text-slate-400">0 pts</span>
              </button>
            </div>
          </div>

          {/* Daily Notes / Reflection */}
          <div className="mt-4 pt-3 border-t border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              <FileText className="w-3.5 h-3.5 text-slate-400" />
              <span>Day Analysis & Mock Score Log:</span>
            </div>
            <textarea
              value={entry.notes || ''}
              onChange={e => updateField('notes', e.target.value)}
              placeholder="e.g. Mock #14 Score: 88 (VARC 36, DILR 24, QA 28). RC tone questions need revision."
              rows={2}
              className="w-full text-xs p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-brand-500 resize-none"
            />
          </div>
        </div>

      </div>
    </div>
  );
}

