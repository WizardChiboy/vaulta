/** Range shown on Spending analytics (design 30). */
export type InsightsPeriod = 'week' | 'month' | 'year';

/** One group of bars on the income vs expenses chart. */
export type CashflowBucket = {
  /** Axis label, e.g. "Oct". */
  label: string;
  /** Naira. */
  income: number;
  /** Naira. */
  expenses: number;
};

export type CashflowSeries = {
  /** Oldest first; the last bucket is the current period. */
  buckets: CashflowBucket[];
  /** "Spent this month" */
  spentLabel: string;
  /** Short name of the previous period for the change badge, e.g. "Sept". */
  previousLabel: string;
};

/** Spending categories on Category breakdown (design 31). */
export type SpendingCategoryId =
  'groceries' | 'shopping' | 'food' | 'bills' | 'transport' | 'entertainment';

export type CategoryPayment = {
  id: string;
  /** "Shoprite Lekki" */
  merchant: string;
  /** ISO 8601 date-time. */
  date: string;
  /** Naira, positive. */
  amount: number;
  /** Opens Transaction details (12) when the payment is in the mock history. */
  transactionId?: string | undefined;
};

export type SpendingCategory = {
  id: SpendingCategoryId;
  name: string;
  /** Naira spent this month. */
  amount: number;
  /** Naira spent last month, for the change shown on Insights (30). */
  previousAmount: number;
  transactionCount: number;
  /** Where most of the money went, e.g. ["Shoprite", "Spar"]. */
  topMerchants: string[];
  /** Largest payments this month. */
  payments: CategoryPayment[];
};

/** A category's monthly budget on Monthly budget (design 32). */
export type CategoryBudget = {
  categoryId: SpendingCategoryId;
  /** Naira. */
  limit: number;
};

/** Last month's summary on Monthly report (design 33). */
export type MonthlyReport = {
  /** "September" */
  month: string;
  /** Short name of the month before, for the change lines, e.g. "Aug". */
  previousMonth: string;
  /** "1 – 30 Sep 2026" */
  rangeLabel: string;
  /** Naira. */
  income: number;
  previousIncome: number;
  expenses: number;
  previousExpenses: number;
  /** Naira moved into savings goals. */
  saved: number;
  goalCount: number;
  /** Savings rate target, 0–1. */
  savingsTarget: number;
  biggestPayment: { label: string; amount: number };
  topCategory: { name: string; amount: number };
  underBudget: { count: number; of: number };
};
