'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import confetti from 'canvas-confetti';
import Header from '@/components/Header';
import CalendarView from '@/components/CalendarView';
import DayDetailsAccordion from '@/components/DayDetailsAccordion';
import PacingDashboard from '@/components/PacingDashboard';
import SyncModal from '@/components/SyncModal';
import { DailyEntry, ThemeMode, TrackerStore } from '@/types/tracker';
import { createDefaultEntry, createInitialStore, SPRINT_DATES } from '@/utils/constants';
import { getDailyScore, getDaysRemaining, getTodaySprintDate } from '@/utils/calculations';
import { Calendar, CheckCircle2, ChevronRight, Layers, Table as TableIcon } from 'lucide-react';

export default function HomePage() {
  const [store, setStore] = useState<TrackerStore>(createInitialStore);
  const [theme, setTheme] = useState<ThemeMode>('dark');
  const [selectedDate, setSelectedDate] = useState<string>(getTodaySprintDate);
  const [syncRoom, setSyncRoom] = useState<string>('');
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [lastSynced, setLastSynced] = useState<number | null>(null);
  const [isSyncModalOpen, setIsSyncModalOpen] = useState<boolean>(false);
  const [isMounted, setIsMounted] = useState<boolean>(false);

  const syncTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const detailsRef = useRef<HTMLDivElement | null>(null);

  // Sync to Cloud API
  const pushToCloud = useCallback(async (room: string, dataToPush: TrackerStore) => {
    if (!room) return;
    try {
      setIsSyncing(true);
      await fetch('/api/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ room, data: dataToPush })
      });
      setLastSynced(Date.now());
    } catch (e) {
      console.warn('Sync push skipped or offline:', e);
    } finally {
      setIsSyncing(false);
    }
  }, []);

  // Fetch from Cloud API
  const fetchFromCloud = useCallback(async (room: string) => {
    if (!room) return;
    try {
      setIsSyncing(true);
      const res = await fetch(`/api/sync?room=${encodeURIComponent(room)}`);
      const json = await res.json();
      if (json && json.data) {
        setStore(prev => {
          const merged = { ...prev, ...json.data };
          localStorage.setItem('cat_2026_sprint_data', JSON.stringify(merged));
          return merged;
        });
        setLastSynced(json.updatedAt || Date.now());
      }
    } catch (e) {
      console.warn('Sync fetch skipped:', e);
    } finally {
      setIsSyncing(false);
    }
  }, []);

  // Initialize and hydrate from localStorage + URL params
  useEffect(() => {
    setIsMounted(true);

    // 1. Theme hydration
    const savedTheme = (localStorage.getItem('cat_theme') as ThemeMode) || 'dark';
    setTheme(savedTheme);
    if (savedTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }

    // 2. Data hydration
    const savedData = localStorage.getItem('cat_2026_sprint_data');
    let loadedStore = createInitialStore();
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        loadedStore = { ...loadedStore, ...parsed };
      } catch (e) {
        console.error('Failed to parse local storage data', e);
      }
    }
    setStore(loadedStore);

    // 3. Room parameter hydration from URL or storage
    const urlParams = new URLSearchParams(window.location.search);
    const roomParam = urlParams.get('room');
    const storedRoom = localStorage.getItem('cat_sync_room') || '';
    const activeRoom = roomParam || storedRoom;

    if (activeRoom) {
      setSyncRoom(activeRoom);
      localStorage.setItem('cat_sync_room', activeRoom);
      fetchFromCloud(activeRoom);
    }

    // 4. Default date
    setSelectedDate(getTodaySprintDate());
  }, [fetchFromCloud]);

  // Theme toggle handler
  const handleToggleTheme = () => {
    const nextTheme: ThemeMode = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
    localStorage.setItem('cat_theme', nextTheme);
    if (nextTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  // Sync Room update handler
  const handleSetSyncRoom = (room: string) => {
    setSyncRoom(room);
    localStorage.setItem('cat_sync_room', room);
    if (room) {
      pushToCloud(room, store);
    }
  };

  // Update a single day's entry
  const handleUpdateEntry = (updatedEntry: DailyEntry) => {
    const oldScore = getDailyScore(store[updatedEntry.date]);
    const newScore = getDailyScore(updatedEntry);

    const updatedStore = {
      ...store,
      [updatedEntry.date]: updatedEntry
    };

    setStore(updatedStore);
    localStorage.setItem('cat_2026_sprint_data', JSON.stringify(updatedStore));

    // Confetti celebration on reaching 100%
    if (oldScore < 100 && newScore >= 100) {
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 }
      });
    }

    // Debounced sync to cloud
    if (syncRoom) {
      if (syncTimeoutRef.current) clearTimeout(syncTimeoutRef.current);
      syncTimeoutRef.current = setTimeout(() => {
        pushToCloud(syncRoom, updatedStore);
      }, 1000);
    }
  };

  // Date selection with smooth scroll into expanded details
  const handleSelectDate = (date: string) => {
    setSelectedDate(date);
    if (detailsRef.current) {
      detailsRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  };

  // Next & Prev Day navigators
  const currentIndex = SPRINT_DATES.indexOf(selectedDate);
  const handlePrevDay =
    currentIndex > 0
      ? () => handleSelectDate(SPRINT_DATES[currentIndex - 1])
      : undefined;
  const handleNextDay =
    currentIndex < SPRINT_DATES.length - 1
      ? () => handleSelectDate(SPRINT_DATES[currentIndex + 1])
      : undefined;

  const currentEntry = store[selectedDate] || createDefaultEntry(selectedDate);
  const daysRemaining = getDaysRemaining();
  const todayDate = getTodaySprintDate();

  if (!isMounted) return null;

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors">
      {/* Top Navigation */}
      <Header
        theme={theme}
        onToggleTheme={handleToggleTheme}
        onOpenSync={() => setIsSyncModalOpen(true)}
        syncRoom={syncRoom}
        isSyncing={isSyncing}
        daysRemaining={daysRemaining}
      />

      {/* Main Content */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-6 md:py-8 space-y-8">
        
        {/* Section 1: Dynamic Countdown & Pacing Dashboard */}
        <PacingDashboard store={store} />

        {/* Section 2: Interactive November Sprint Calendar */}
        <section>
          <CalendarView
            store={store}
            selectedDate={selectedDate}
            onSelectDate={handleSelectDate}
            todayDate={todayDate}
          />
        </section>

        {/* Section 3: Expandable Live-Editing Day Workspace */}
        <section ref={detailsRef}>
          <DayDetailsAccordion
            entry={currentEntry}
            onUpdate={handleUpdateEntry}
            onPrevDay={handlePrevDay}
            onNextDay={handleNextDay}
          />
        </section>

        {/* Section 4: Sprint Matrix Table */}
        <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 md:p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                <TableIcon className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  17-Day Sprint Log & Score Matrix
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Click any row to jump into that day&apos;s checklist
                </p>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-400 uppercase font-semibold">
                  <th className="py-2.5 px-3">Date</th>
                  <th className="py-2.5 px-3">RC (6)</th>
                  <th className="py-2.5 px-3">CR (10)</th>
                  <th className="py-2.5 px-3">VA (10)</th>
                  <th className="py-2.5 px-3 font-bold text-amber-500">LRDI (10)</th>
                  <th className="py-2.5 px-3">Arith (30)</th>
                  <th className="py-2.5 px-3">Choice (30)</th>
                  <th className="py-2.5 px-3">Mock</th>
                  <th className="py-2.5 px-3">Score</th>
                  <th className="py-2.5 px-3">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                {SPRINT_DATES.map(d => {
                  const item = store[d] || createDefaultEntry(d);
                  const score = getDailyScore(item);
                  const isSelected = d === selectedDate;
                  const dateLabel = new Date(d).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    weekday: 'short'
                  });

                  return (
                    <tr
                      key={d}
                      onClick={() => handleSelectDate(d)}
                      className={`cursor-pointer transition-colors hover:bg-slate-50 dark:hover:bg-slate-850 ${
                        isSelected
                          ? 'bg-brand-50/50 dark:bg-brand-950/30 font-medium'
                          : ''
                      }`}
                    >
                      <td className="py-3 px-3 font-bold text-slate-800 dark:text-slate-200">
                        {dateLabel}
                      </td>
                      <td className="py-3 px-3">{item.rc}/6</td>
                      <td className="py-3 px-3">{item.cr}/10</td>
                      <td className="py-3 px-3">{item.va}/10</td>
                      <td className="py-3 px-3 font-black text-amber-600 dark:text-amber-400">
                        {item.lrdi}/10
                      </td>
                      <td className="py-3 px-3">{item.arith}/30</td>
                      <td className="py-3 px-3">
                        {item.qaChoice}/30{' '}
                        <span className="text-[10px] text-slate-400">({item.qaChoiceType[0]})</span>
                      </td>
                      <td className="py-3 px-3">
                        {item.mock === '1 Full Mock' ? (
                          <span className="text-purple-600 dark:text-purple-400 font-bold">1 Full</span>
                        ) : item.mock === '2 Sectionals' ? (
                          <span className="text-purple-600 dark:text-purple-400 font-bold">2 Sec</span>
                        ) : (
                          <span className="text-slate-400">-</span>
                        )}
                      </td>
                      <td className="py-3 px-3">
                        <span
                          className={`inline-block px-2 py-0.5 rounded-full text-[11px] font-black ${
                            score >= 100
                              ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300'
                              : score > 0
                              ? 'bg-brand-100 dark:bg-brand-950 text-brand-700 dark:text-brand-300'
                              : 'bg-slate-100 dark:bg-slate-800 text-slate-400'
                          }`}
                        >
                          {score}%
                        </span>
                      </td>
                      <td className="py-3 px-3 text-brand-600 dark:text-brand-400">
                        <ChevronRight className="w-4 h-4" />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>

      </main>

      {/* Cloud Sync & Phone Pairing Modal */}
      <SyncModal
        isOpen={isSyncModalOpen}
        onClose={() => setIsSyncModalOpen(false)}
        syncRoom={syncRoom}
        onSetSyncRoom={handleSetSyncRoom}
        onManualSync={() => pushToCloud(syncRoom, store)}
        isSyncing={isSyncing}
        lastSynced={lastSynced}
        store={store}
        onImportStore={imported => {
          setStore(imported);
          localStorage.setItem('cat_2026_sprint_data', JSON.stringify(imported));
          if (syncRoom) pushToCloud(syncRoom, imported);
        }}
      />
    </div>
  );
}

