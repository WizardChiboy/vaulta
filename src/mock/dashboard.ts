import type { Transaction } from '@/types/transaction';

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

export const recentTransactions: Transaction[] = [
  {
    id: 'txn_demo_001',
    title: 'Shoprite Lekki',
    category: 'groceries',
    categoryLabel: 'Groceries',
    when: '10:24',
    amount: -18450,
  },
  {
    id: 'txn_demo_002',
    title: 'Tunde Bakare',
    category: 'transfer',
    categoryLabel: 'Transfer in',
    when: '08:02',
    amount: 45000,
  },
  {
    id: 'txn_demo_003',
    title: 'Bolt Ride',
    category: 'transport',
    categoryLabel: 'Transport',
    when: 'Yesterday',
    amount: -3200,
  },
];
