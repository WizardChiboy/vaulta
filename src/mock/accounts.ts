import type {
  Account,
  AccountSummary,
  CurrentAccount,
  SavingsAccount,
  WalletAccount,
} from '@/types/account';

// Mock data only — VAULTA is a frontend UI project with no real banking connection.
// Figures match the screen designs (Naira).
const DEMO_BANK = 'Vaulta MFB (demo)';

export const primaryAccount: AccountSummary = {
  id: 'acc_demo_001',
  name: 'Vaulta Current',
  maskedNumber: '4821',
  currency: 'NGN',
  balance: 2450800,
  monthlyChangePercent: 2.4,
};

export const currentAccount: CurrentAccount = {
  id: 'acc_demo_001',
  kind: 'current',
  name: 'Vaulta Current',
  maskedNumber: '0123 •• 4821',
  currency: 'NGN',
  balance: 2450800,
  bank: DEMO_BANK,
  typeLabel: 'Current · Tier 3',
  openedOn: '2024-03-12T09:00:00',
  primary: true,
};

export const savingsAccount: SavingsAccount = {
  id: 'acc_demo_002',
  kind: 'savings',
  name: 'Savings Vault',
  currency: 'NGN',
  balance: 1832000,
  bank: DEMO_BANK,
  typeLabel: 'Savings · 10% p.a.',
  openedOn: '2024-06-02T09:00:00',
  activeGoals: 3,
  interestRatePercent: 10,
};

export const dollarWallet: WalletAccount = {
  id: 'acc_demo_003',
  kind: 'wallet',
  name: 'Dollar Wallet',
  currency: 'USD',
  balance: 1240.5,
  bank: DEMO_BANK,
  typeLabel: 'Domiciliary · USD',
  openedOn: '2025-01-20T09:00:00',
  purpose: 'for online payments',
  nairaRate: 1539.2,
};

export const accounts: Account[] = [currentAccount, savingsAccount, dollarWallet];
