export type QAChoiceType = 'Algebra' | 'Geometry';
export type MockType = 'Missed' | '1 Full Mock' | '2 Sectionals';
export type ThemeMode = 'dark' | 'light';

export interface DailyEntry {
  date: string; // YYYY-MM-DD
  rc: number; // Reading Comprehension passages (Target 6)
  cr: number; // Critical Reasoning questions (Target 10)
  va: number; // Verbal Ability questions (Target 10)
  lrdi: number; // LRDI sets (Target 10/day, cumulative to 250)
  arith: number; // Mandatory Arithmetic questions (Target 30)
  qaChoiceType: QAChoiceType;
  qaChoice: number; // Choice questions (Target 30)
  mock: MockType;
  notes?: string;
  updatedAt?: string;
}

export type TrackerStore = Record<string, DailyEntry>;

export interface SyncPayload {
  syncId: string;
  data: TrackerStore;
  timestamp: number;
}

