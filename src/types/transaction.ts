export type TransactionCategory = 'groceries' | 'transport' | 'transfer';

export type Transaction = {
  id: string;
  /** Merchant or person. */
  title: string;
  category: TransactionCategory;
  /** Shown before the time, e.g. "Groceries" or "Transfer in". */
  categoryLabel: string;
  /** Display time, e.g. "10:24" or "Yesterday". */
  when: string;
  /** Naira; negative for money out. */
  amount: number;
};
