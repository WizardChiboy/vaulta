import type { FundingSourceId } from '@/types/savings';
import { formatCurrency, formatUsd } from '@/utils/format';
import { currentAccount, dollarWallet } from './accounts';

// Mock: the accounts in mock/accounts.ts that can move money into a goal.

/** An account that can fund a savings deposit (design 29). Amounts are entered in naira. */
export type FundingSource = {
  id: FundingSourceId;
  name: string;
  /** Shown on the confirm sheet, e.g. "Vaulta Current · •• 4821". */
  detail: string;
  /** Balance in the account's own currency, formatted. */
  balanceLabel: string;
  /** What the account can cover, in naira. */
  availableNaira: number;
  /** Converts a naira amount to the account's currency for display, if it isn't naira. */
  convert?: ((naira: number) => string) | undefined;
};

export const fundingSources: readonly FundingSource[] = [
  {
    id: 'acc_demo_001',
    name: currentAccount.name,
    detail: `${currentAccount.name} · •• ${currentAccount.maskedNumber.slice(-4)}`,
    balanceLabel: formatCurrency(currentAccount.balance),
    availableNaira: currentAccount.balance,
  },
  {
    id: 'acc_demo_003',
    name: dollarWallet.name,
    detail: dollarWallet.name,
    balanceLabel: formatUsd(dollarWallet.balance),
    availableNaira: Math.floor(dollarWallet.balance * dollarWallet.nairaRate),
    convert: (naira) => formatUsd(naira / dollarWallet.nairaRate),
  },
];

export function getFundingSource(id: string | undefined): FundingSource | undefined {
  return fundingSources.find((source) => source.id === id);
}
