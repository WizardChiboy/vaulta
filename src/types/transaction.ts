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
};
