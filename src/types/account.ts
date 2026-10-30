export type AccountSummary = {
  id: string;
  name: string;
  /** Last four digits only — never store full account or card numbers. */
  maskedNumber: string;
  currency: string;
  balance: number;
  monthlyChangePercent: number;
};

type AccountBase = {
  id: string;
  name: string;
  currency: 'NGN' | 'USD';
  /** Available balance; pending holds are already taken off. */
  balance: number;
  /** e.g. "Vaulta MFB (demo)" */
  bank: string;
  /** e.g. "Current · Tier 3" */
  typeLabel: string;
  /** ISO 8601 date the account was opened. */
  openedOn: string;
};

export type CurrentAccount = AccountBase & {
  kind: 'current';
  /** Display form only, e.g. "0123 •• 4821" — never the full number. */
  maskedNumber: string;
  primary: boolean;
};

export type SavingsAccount = AccountBase & {
  kind: 'savings';
  activeGoals: number;
  interestRatePercent: number;
};

export type WalletAccount = AccountBase & {
  kind: 'wallet';
  /** e.g. "for online payments" */
  purpose: string;
  /** Naira per unit of the wallet currency. */
  nairaRate: number;
};

/** An account on the Accounts screen (design 09). */
export type Account = CurrentAccount | SavingsAccount | WalletAccount;
