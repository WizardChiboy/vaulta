import { simulateRequest } from '@/lib/mock';
import { transactions } from '@/mock/transactions';
import type { Transaction } from '@/types/transaction';

const PAGE_SIZE = 6;

/** Search answers quickly, like a typeahead endpoint would. */
const SEARCH_LATENCY_MS = 250;

export type TransactionPage = {
  items: Transaction[];
  /** Pass to the next call; null when there are no older transactions. */
  nextCursor: number | null;
};

/** Newest-first transaction history, one page at a time (mock: served from memory). */
export function fetchTransactions(cursor = 0): Promise<TransactionPage> {
  const next = cursor + PAGE_SIZE;
  return simulateRequest({
    items: transactions.slice(cursor, next),
    nextCursor: next < transactions.length ? next : null,
  });
}

/** Transactions whose merchant/person or category contains `query` (case-insensitive). */
export function searchTransactions(query: string): Promise<Transaction[]> {
  const needle = query.trim().toLowerCase();
  const results = needle
    ? transactions.filter(
        (transaction) =>
          transaction.title.toLowerCase().includes(needle) ||
          transaction.categoryLabel.toLowerCase().includes(needle)
      )
    : [];
  return simulateRequest(results, SEARCH_LATENCY_MS);
}
