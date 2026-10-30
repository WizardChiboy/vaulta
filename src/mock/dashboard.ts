import { transactions } from './transactions';

// Fictional figures from the Home design (08).
export const dashboard = {
  /** Money in this month. */
  monthlyInflow: 935000,
  spending: {
    month: 'October',
    spent: 486250,
    budget: 600000,
    /** Relative bar heights for the mini chart; the last bar is the current period. */
    bars: [0.4, 0.65, 0.5, 0.85, 0.6, 1],
  },
  featuredGoal: {
    name: 'Emergency fund',
    saved: 780000,
    target: 1200000,
  },
};

/** Latest settled activity for Home; pending holds are listed on Transactions (11). */
export const recentTransactions = transactions
  .filter((transaction) => transaction.status === 'successful')
  .slice(0, 3);
