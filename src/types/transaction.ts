export type TransactionCategory =
  'groceries' | 'transport' | 'food' | 'bills' | 'salary' | 'transfer';

export type TransactionStatus = 'successful' | 'pending';

export type Transaction = {
  id: string;
  accountId: string;
  /** Merchant or person. */
  title: string;
  category: TransactionCategory;
  /** Shown before the time, e.g. "Groceries" or "Transfer in". */
  categoryLabel: string;
  /** ISO 8601 date-time. */
  occurredAt: string;
  /** Naira; negative for money out. */
  amount: number;
  status: TransactionStatus;
  /** e.g. "VLT-2610-1842-6630" */
  reference: string;
  /** Card or account the money moved through, e.g. "Virtual card •••• 7302". */
  channel: string;
  /** Naira. */
  fee: number;
  /** Balance after a settled transaction; absent while pending. */
  balanceAfter?: number | undefined;
};

/** Preset periods on Filter transactions (14). */
export type DateRangePreset = 'this-month' | 'last-30-days' | 'three-months' | 'custom';

export type TransactionDirection = 'all' | 'in' | 'out';

export type TransactionFilters = {
  /** null = any date. */
  dateRange: DateRangePreset | null;
  /** ISO dates (start of day) bounding a custom range. */
  from: string;
  to: string;
  direction: TransactionDirection;
  /** Empty = every category. */
  categories: TransactionCategory[];
  /** Naira, compared with the absolute amount. `max` null = no upper limit. */
  minAmount: number;
  maxAmount: number | null;
};
