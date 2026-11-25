// Fictional figures from the Savings designs (26, 28). Goal balances add up to the
// Savings Vault balance in mock/accounts.ts (₦1,832,000).
import type { SavingsGoal, SavingsSuggestion } from '@/types/savings';

export const savingsGoals: SavingsGoal[] = [
  {
    id: 'goal_001',
    name: 'Emergency fund',
    icon: 'shield',
    saved: 780000,
    target: 1200000,
    targetDate: '2027-03-31T12:00:00',
    autoSave: { frequency: 'monthly', amount: 70000 },
    contributions: [
      { id: 'ctb_001_4', kind: 'auto-save', amount: 70000, date: '2026-10-15T09:00:00' },
      { id: 'ctb_001_3', kind: 'top-up', amount: 25000, date: '2026-10-02T18:40:00' },
      { id: 'ctb_001_2', kind: 'auto-save', amount: 70000, date: '2026-09-15T09:00:00' },
      { id: 'ctb_001_1', kind: 'interest', amount: 6250, date: '2026-09-01T00:05:00' },
    ],
  },
  {
    id: 'goal_002',
    name: 'New laptop',
    icon: 'laptop',
    saved: 412000,
    target: 950000,
    targetDate: '2027-02-28T12:00:00',
    autoSave: { frequency: 'weekly', amount: 15000 },
    contributions: [
      { id: 'ctb_002_3', kind: 'auto-save', amount: 15000, date: '2026-10-16T09:00:00' },
      { id: 'ctb_002_2', kind: 'auto-save', amount: 15000, date: '2026-10-09T09:00:00' },
      { id: 'ctb_002_1', kind: 'top-up', amount: 40000, date: '2026-10-03T13:12:00' },
    ],
  },
  {
    id: 'goal_003',
    name: 'Lisbon trip',
    icon: 'plane',
    saved: 640000,
    target: 2500000,
    targetDate: '2027-07-31T12:00:00',
    autoSave: { frequency: 'manual', amount: 0 },
    contributions: [
      { id: 'ctb_003_2', kind: 'top-up', amount: 120000, date: '2026-09-28T20:05:00' },
      { id: 'ctb_003_1', kind: 'interest', amount: 4180, date: '2026-09-01T00:05:00' },
    ],
  },
];

export const savingsSummary = {
  /** Deposits into goals this month. */
  addedThisMonth: 145000,
  interestEarned: 38420,
};

export const savingsSuggestions: SavingsSuggestion[] = [
  { id: 'suggest_rent', name: 'Rent 2027', icon: 'house' },
  { id: 'suggest_school', name: 'School fees', icon: 'graduation-cap' },
  { id: 'suggest_gifts', name: 'December gifts', icon: 'gift' },
];
