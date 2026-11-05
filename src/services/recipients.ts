import { simulateRequest } from '@/lib/mock';
import {
  accountDirectory,
  lookupFirstNames,
  lookupLastNames,
  lookupMiddleNames,
} from '@/mock/recipients';
import type { AccountLookup } from '@/types/recipient';

/** Nigerian (NUBAN) account numbers are 10 digits. */
export const ACCOUNT_NUMBER_LENGTH = 10;

function pick(list: readonly string[], seed: number) {
  return list[seed % list.length] ?? '';
}

/**
 * Resolves the account holder's name for a bank and account number, as a real
 * name-enquiry endpoint would (mock). Numbers made of one repeated digit
 * (e.g. 0000000000) are "not found", so the error state can be shown in the demo.
 */
export function lookupAccount(bankId: string, accountNumber: string): Promise<AccountLookup> {
  if (/^(\d)\1+$/.test(accountNumber)) return simulateRequest({ found: false });

  const known = accountDirectory[accountNumber];
  if (known) return simulateRequest({ found: true, accountName: known });

  // Deterministic, so the same bank and number always return the same name.
  const key = `${bankId}${accountNumber}`;
  let seed = 0;
  for (let index = 0; index < key.length; index += 1) {
    seed += key.charCodeAt(index) * (index + 1);
  }
  const accountName = [
    pick(lookupFirstNames, seed),
    pick(lookupMiddleNames, seed >> 2),
    pick(lookupLastNames, seed >> 4),
  ].join(' ');
  return simulateRequest({ found: true, accountName });
}

/** "0123456789" → "0123 •• 6789" */
export function maskAccountNumber(accountNumber: string) {
  return `${accountNumber.slice(0, 4)} •• ${accountNumber.slice(-4)}`;
}
