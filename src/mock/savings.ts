// Fictional figures from the Savings design (26). Goal balances add up to the
// Savings Vault balance in mock/accounts.ts (₦1,832,000).
import type { SavingsGoal, SavingsSuggestion } from '@/types/savings';

export const savingsGoals: SavingsGoal[] = [
  { id: 'goal_001', name: 'Emergency fund', icon: 'shield', saved: 780000, target: 1200000 },
  { id: 'goal_002', name: 'New laptop', icon: 'laptop', saved: 412000, target: 950000 },
  { id: 'goal_003', name: 'Lisbon trip', icon: 'plane', saved: 640000, target: 2500000 },
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
