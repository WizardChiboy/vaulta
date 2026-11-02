import type {
  DateRangePreset,
  Transaction,
  TransactionCategory,
  TransactionFilters,
} from '@/types/transaction';

/** Top of the amount slider (14); the top step means "and above". */
export const AMOUNT_RANGE_MAX = 150_000;
export const AMOUNT_RANGE_STEP = 5_000;

export const DEFAULT_FILTERS: TransactionFilters = {
  dateRange: null,
  from: '',
  to: '',
  direction: 'all',
  categories: [],
  minAmount: 0,
  maxAmount: null,
};

export const CATEGORY_OPTIONS: readonly { value: TransactionCategory; label: string }[] = [
  { value: 'groceries', label: 'Groceries' },
  { value: 'food', label: 'Food & dining' },
  { value: 'transport', label: 'Transport' },
  { value: 'bills', label: 'Bills' },
  { value: 'transfer', label: 'Transfers' },
  { value: 'salary', label: 'Salary' },
];

function startOfDay(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function endOfDay(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate(), 23, 59, 59, 999);
}

/** From/To dates (ISO, start of day) a preset covers, ending today. */
export function presetRange(
  preset: Exclude<DateRangePreset, 'custom'>,
  now = new Date()
): { from: string; to: string } {
  const today = startOfDay(now);
  const from =
    preset === 'this-month'
      ? new Date(today.getFullYear(), today.getMonth(), 1)
      : preset === 'last-30-days'
        ? new Date(today.getFullYear(), today.getMonth(), today.getDate() - 29)
        : new Date(today.getFullYear(), today.getMonth() - 3, today.getDate());
  return { from: from.toISOString(), to: today.toISOString() };
}

export function matchesFilters(transaction: Transaction, filters: TransactionFilters) {
  if (filters.direction === 'in' && transaction.amount <= 0) return false;
  if (filters.direction === 'out' && transaction.amount >= 0) return false;
  if (filters.categories.length > 0 && !filters.categories.includes(transaction.category)) {
    return false;
  }
  const size = Math.abs(transaction.amount);
  if (size < filters.minAmount) return false;
  if (filters.maxAmount !== null && size > filters.maxAmount) return false;
  if (filters.dateRange !== null) {
    const occurred = new Date(transaction.occurredAt).getTime();
    if (occurred < startOfDay(new Date(filters.from)).getTime()) return false;
    if (occurred > endOfDay(new Date(filters.to)).getTime()) return false;
  }
  return true;
}

/** How many filter groups differ from the defaults (badge on the filter button). */
export function activeFilterCount(filters: TransactionFilters) {
  return [
    filters.dateRange !== null,
    filters.direction !== 'all',
    filters.categories.length > 0,
    filters.minAmount > 0 || filters.maxAmount !== null,
  ].filter(Boolean).length;
}
