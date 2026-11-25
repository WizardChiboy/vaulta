import type { AutoSave, AutoSaveFrequency, SavingsGoal } from '@/types/savings';
import { formatThousands } from './format';

const DAY_MS = 86_400_000;
/** Average days per period, for spreading the remaining amount evenly. */
const PERIOD_DAYS: Record<Exclude<AutoSaveFrequency, 'manual'>, number> = {
  weekly: 7,
  monthly: 30.44,
};

const LONG_MONTHS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

/** Share of the target saved, 0–1. */
export function goalShare(goal: Pick<SavingsGoal, 'saved' | 'target'>) {
  return goal.target > 0 ? Math.min(goal.saved / goal.target, 1) : 0;
}

/** Whole percent saved, e.g. 65. */
export function goalPercent(goal: Pick<SavingsGoal, 'saved' | 'target'>) {
  return Math.round(goalShare(goal) * 100);
}

/** "31 January 2027" */
export function formatLongDate(iso: string) {
  const date = new Date(iso);
  return `${date.getDate()} ${LONG_MONTHS[date.getMonth()] ?? ''} ${date.getFullYear()}`;
}

/** "October 2026" */
export function formatMonthYear(iso: string) {
  const date = new Date(iso);
  return `${LONG_MONTHS[date.getMonth()] ?? ''} ${date.getFullYear()}`;
}

/**
 * Last day of each month from `monthsAhead` months after `from`, as ISO dates at noon
 * (noon keeps the calendar day stable across time zones). Goal target dates (27).
 */
export function monthEnds(count: number, from = new Date(), monthsAhead = 1) {
  return Array.from({ length: count }, (_, index) => {
    // Day 0 of the following month is the last day of this one.
    const date = new Date(from.getFullYear(), from.getMonth() + monthsAhead + index + 1, 0, 12);
    return date.toISOString();
  });
}

/**
 * Amount to save each period to reach `remaining` by `targetDate`, rounded up to ₦100
 * (design 27: "Save about ₦514,300 a month"). 0 for manual saving.
 */
export function autoSaveAmount(
  remaining: number,
  targetDate: string,
  frequency: AutoSaveFrequency,
  now = new Date()
) {
  if (frequency === 'manual' || remaining <= 0) return 0;
  const days = Math.max((new Date(targetDate).getTime() - now.getTime()) / DAY_MS, 1);
  const periods = Math.max(days / PERIOD_DAYS[frequency], 1);
  return Math.ceil(remaining / periods / 100) * 100;
}

/** "₦70k / month" · "₦15k / week" · "Manual" (design 28). */
export function formatAutoSave(autoSave: AutoSave) {
  if (autoSave.frequency === 'manual' || autoSave.amount <= 0) return 'Manual';
  const unit = autoSave.frequency === 'weekly' ? 'week' : 'month';
  return `${formatThousands(autoSave.amount)} / ${unit}`;
}
