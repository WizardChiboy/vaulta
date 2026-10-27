import type {
  Account,
  AccountSummary,
  CurrentAccount,
  SavingsAccount,
  WalletAccount,
} from '@/types/account';

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

export const currentAccount: CurrentAccount = {
  id: 'acc_demo_001',
  kind: 'current',
  name: 'Vaulta Current',
  maskedNumber: '0123 •• 4821',
  currency: 'NGN',
  balance: 2450800,
  primary: true,
};

export const savingsAccount: SavingsAccount = {
  id: 'acc_demo_002',
  kind: 'savings',
  name: 'Savings Vault',
  currency: 'NGN',
  balance: 1832000,
  activeGoals: 3,
  interestRatePercent: 10,
};

export const dollarWallet: WalletAccount = {
  id: 'acc_demo_003',
  kind: 'wallet',
  name: 'Dollar Wallet',
  currency: 'USD',
  balance: 1240.5,
  purpose: 'for online payments',
  nairaRate: 1539.2,
};

export const accounts: Account[] = [currentAccount, savingsAccount, dollarWallet];
