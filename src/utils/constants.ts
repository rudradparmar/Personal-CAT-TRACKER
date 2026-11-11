import { DailyEntry, TrackerStore } from '@/types/tracker';

export const START_DATE = '2026-11-11';
export const DEADLINE_DATE = '2026-11-27';
export const DEADLINE_TIMESTAMP = '2026-11-27T23:59:59';

export const SPRINT_DATES: string[] = [
  '2026-11-11', '2026-11-12', '2026-11-13', '2026-11-14', '2026-11-15',
  '2026-11-16', '2026-11-17', '2026-11-18', '2026-11-19', '2026-11-20',
  '2026-11-21', '2026-11-22', '2026-11-23', '2026-11-24', '2026-11-25',
  '2026-11-26', '2026-11-27'
];

export const DAILY_TARGETS = {
  rc: 6,
  cr: 10,
  va: 10,
  lrdi: 10,
  qaArith: 30,
  qaChoice: 30,
  mockUnits: 1
};

export const CUMULATIVE_TARGETS = {
  lrdi: 250,
  qaTotal: 900, // 60 questions * 15 days
  varcTotal: 390, // 26 questions/passages * 15 days
  mocks: 15
};

export function createDefaultEntry(date: string): DailyEntry {
  return {
    date,
    rc: 0,
    cr: 0,
    va: 0,
    lrdi: 0,
    arith: 0,
    qaChoiceType: 'Algebra',
    qaChoice: 0,
    mock: 'Missed',
    notes: ''
  };
}

export function createInitialStore(): TrackerStore {
  const store: TrackerStore = {};
  SPRINT_DATES.forEach(d => {
    store[d] = createDefaultEntry(d);
  });
  return store;
}

