import { DailyEntry, TrackerStore } from '@/types/tracker';
import { CUMULATIVE_TARGETS, DAILY_TARGETS, DEADLINE_TIMESTAMP, SPRINT_DATES } from './constants';

export function getDailyScore(entry?: DailyEntry): number {
  if (!entry) return 0;
  const rcScore = (Math.min(entry.rc, DAILY_TARGETS.rc) / DAILY_TARGETS.rc) * 0.10;
  const crScore = (Math.min(entry.cr, DAILY_TARGETS.cr) / DAILY_TARGETS.cr) * 0.075;
  const vaScore = (Math.min(entry.va, DAILY_TARGETS.va) / DAILY_TARGETS.va) * 0.075;
  const lrdiScore = (Math.min(entry.lrdi, DAILY_TARGETS.lrdi) / DAILY_TARGETS.lrdi) * 0.25;
  const arithScore = (Math.min(entry.arith, DAILY_TARGETS.qaArith) / DAILY_TARGETS.qaArith) * 0.125;
  const choiceScore = (Math.min(entry.qaChoice, DAILY_TARGETS.qaChoice) / DAILY_TARGETS.qaChoice) * 0.125;
  const mockScore = (entry.mock === '1 Full Mock' || entry.mock === '2 Sectionals') ? 0.25 : 0;

  return Math.round((rcScore + crScore + vaScore + lrdiScore + arithScore + choiceScore + mockScore) * 100);
}

export function getDaysRemaining(): number {
  const target = new Date(DEADLINE_TIMESTAMP);
  const now = new Date();
  const diff = target.getTime() - now.getTime();
  const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
  return Math.max(1, days);
}

export function getTodaySprintDate(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const todayStr = `${year}-${month}-${day}`;
  
  if (SPRINT_DATES.includes(todayStr)) {
    return todayStr;
  }
  return SPRINT_DATES[0]; // fallback to Nov 11
}

export function calculateSummaryMetrics(store: TrackerStore) {
  let totalLrdi = 0;
  let totalArith = 0;
  let totalChoice = 0;
  let totalVarc = 0;
  let totalMocks = 0;

  SPRINT_DATES.forEach(d => {
    const item = store[d];
    if (item) {
      totalLrdi += (item.lrdi || 0);
      totalArith += (item.arith || 0);
      totalChoice += (item.qaChoice || 0);
      totalVarc += ((item.rc || 0) + (item.cr || 0) + (item.va || 0));
      if (item.mock === '1 Full Mock' || item.mock === '2 Sectionals') {
        totalMocks += 1;
      }
    }
  });

  const totalQa = totalArith + totalChoice;
  const daysLeft = getDaysRemaining();

  const lrdiPace = Math.max(0, (CUMULATIVE_TARGETS.lrdi - totalLrdi) / daysLeft).toFixed(1);
  const qaPace = Math.ceil(Math.max(0, CUMULATIVE_TARGETS.qaTotal - totalQa) / daysLeft);
  const varcPace = Math.max(0, (CUMULATIVE_TARGETS.varcTotal - totalVarc) / daysLeft).toFixed(1);
  const mockPace = Math.max(0, (CUMULATIVE_TARGETS.mocks - totalMocks) / daysLeft).toFixed(1);

  return {
    daysLeft,
    totalLrdi,
    lrdiPace: Number(lrdiPace),
    lrdiPct: Math.min(100, Math.round((totalLrdi / CUMULATIVE_TARGETS.lrdi) * 100)),
    totalQa,
    totalArith,
    totalChoice,
    qaPace,
    qaPct: Math.min(100, Math.round((totalQa / CUMULATIVE_TARGETS.qaTotal) * 100)),
    totalVarc,
    varcPace: Number(varcPace),
    varcPct: Math.min(100, Math.round((totalVarc / CUMULATIVE_TARGETS.varcTotal) * 100)),
    totalMocks,
    mockPace: Number(mockPace),
    mockPct: Math.min(100, Math.round((totalMocks / CUMULATIVE_TARGETS.mocks) * 100)),
  };
}

