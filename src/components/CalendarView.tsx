'use client';

import React from 'react';
import { DailyEntry, TrackerStore } from '@/types/tracker';
import { SPRINT_DATES } from '@/utils/constants';
import { getDailyScore } from '@/utils/calculations';
import { Calendar as CalendarIcon, CheckCircle2, Flame, Clock } from 'lucide-react';

interface CalendarViewProps {
  store: TrackerStore;
  selectedDate: string;
  onSelectDate: (date: string) => void;
  todayDate: string;
}

export default function CalendarView({
  store,
  selectedDate,
  onSelectDate,
  todayDate
}: CalendarViewProps) {
  // November 2026: 30 days
  // Nov 1, 2026 starts on Sunday (day 0)
  const totalDaysInNov = 30;
  const days = Array.from({ length: totalDaysInNov }, (_, i) => {
    const dayNum = i + 1;
    const dateStr = `2026-11-${String(dayNum).padStart(2, '0')}`;
    const isSprintDay = SPRINT_DATES.includes(dateStr);
    const isToday = dateStr === todayDate;
    const isSelected = dateStr === selectedDate;
    const entry = store[dateStr];
    const score = isSprintDay ? getDailyScore(entry) : 0;
    
    return {
      dayNum,
      dateStr,
      isSprintDay,
      isToday,
      isSelected,
      entry,
      score
    };
  });

  const weekHeaders = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 md:p-6 shadow-sm transition-all">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
        <div className="flex items-center gap-2.5">
          <div className="p-2.5 rounded-2xl bg-brand-50 dark:bg-brand-950/60 text-brand-600 dark:text-brand-400 border border-brand-100 dark:border-brand-800/50">
            <CalendarIcon className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              November 2026 Sprint Calendar
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Click any date to view and live-edit its targets & notes
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs font-semibold">
          <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 px-2.5 py-1 rounded-full border border-emerald-200 dark:border-emerald-800/50">
            <Flame className="w-3.5 h-3.5" /> 100% Smashed
          </span>
          <span className="flex items-center gap-1 text-brand-600 dark:text-brand-400 bg-brand-50 dark:bg-brand-950/50 px-2.5 py-1 rounded-full border border-brand-200 dark:border-brand-800/50">
            <Clock className="w-3.5 h-3.5" /> In Progress
          </span>
        </div>
      </div>

      {/* Weekday Labels */}
      <div className="grid grid-cols-7 gap-1.5 md:gap-2 text-center text-xs font-semibold text-slate-400 dark:text-slate-500 mb-2">
        {weekHeaders.map(day => (
          <div key={day} className="py-1">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-1.5 md:gap-2">
        {days.map(d => {
          if (!d.isSprintDay) {
            return (
              <div
                key={d.dateStr}
                className="min-h-[64px] md:min-h-[76px] rounded-2xl p-1.5 md:p-2 border border-slate-100 dark:border-slate-800/40 bg-slate-50/50 dark:bg-slate-900/40 text-slate-300 dark:text-slate-700 flex flex-col justify-between select-none opacity-60"
              >
                <span className="text-xs font-medium">{d.dayNum}</span>
                <span className="text-[10px] text-slate-400 dark:text-slate-600">Off</span>
              </div>
            );
          }

          const isCompleted = d.score >= 100;
          const isInProgress = d.score > 0 && d.score < 100;

          return (
            <button
              key={d.dateStr}
              onClick={() => onSelectDate(d.dateStr)}
              className={`min-h-[68px] md:min-h-[82px] rounded-2xl p-1.5 md:p-2 text-left transition-all duration-200 relative flex flex-col justify-between border cursor-pointer group active:scale-95 focus:outline-none ${
                d.isSelected
                  ? 'ring-2 ring-brand-500 border-brand-500 shadow-md bg-brand-50/60 dark:bg-brand-950/40'
                  : 'border-slate-200 dark:border-slate-800 hover:border-brand-300 dark:hover:border-slate-700 bg-white dark:bg-slate-850 hover:bg-slate-50/80 dark:hover:bg-slate-800'
              }`}
            >
              <div className="flex items-center justify-between w-full">
                <span
                  className={`text-xs md:text-sm font-bold ${
                    d.isSelected
                      ? 'text-brand-600 dark:text-brand-400'
                      : 'text-slate-800 dark:text-slate-200'
                  }`}
                >
                  {d.dayNum}
                </span>

                {d.isToday && (
                  <span className="text-[9px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded-md bg-brand-500 text-white leading-none">
                    Today
                  </span>
                )}
              </div>

              {/* Day Score & Visual Indicator */}
              <div className="mt-1">
                {isCompleted ? (
                  <div className="flex items-center gap-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
                    <Flame className="w-3.5 h-3.5 fill-current" />
                    <span>{d.score}%</span>
                  </div>
                ) : isInProgress ? (
                  <div className="flex flex-col gap-0.5">
                    <span className="text-[10px] font-bold text-brand-600 dark:text-brand-400">
                      {d.score}%
                    </span>
                    <div className="w-full h-1 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-brand-500 rounded-full"
                        style={{ width: `${Math.min(100, d.score)}%` }}
                      />
                    </div>
                  </div>
                ) : (
                  <span className="text-[10px] text-slate-400 dark:text-slate-500">
                    0%
                  </span>
                )}
              </div>

              {/* Bottom tag: LRDI sets or Mock indicator */}
              <div className="flex items-center justify-between text-[10px] text-slate-500 dark:text-slate-400">
                <span>{d.entry?.lrdi || 0} Sets</span>
                {d.entry?.mock && d.entry.mock !== 'Missed' && (
                  <span className="text-purple-600 dark:text-purple-400 font-bold">🎯</span>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
