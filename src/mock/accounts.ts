import type { AccountSummary } from '@/types/account';

// Mock data only — VAULTA is a frontend UI project with no real banking connection.
// Figures match the screen designs (Naira).
export const primaryAccount: AccountSummary = {
  id: 'acc_demo_001',
  name: 'Vaulta Current',
  maskedNumber: '4821',
  currency: 'NGN',
  balance: 2450800,
  monthlyChangePercent: 2.4,
};
