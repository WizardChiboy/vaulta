import { simulateRequest } from '@/lib/mock';
import { transactions } from '@/mock/transactions';
import type { Transaction } from '@/types/transaction';

const PAGE_SIZE = 6;

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
