import type { Bank } from '@/types/recipient';

/** Banks offered on Add recipient (18), alphabetical. Names only — no real account data. */
export const banks: Bank[] = [
  { id: 'access', name: 'Access Bank', shortName: 'Access Bank' },
  { id: 'ecobank', name: 'Ecobank Nigeria', shortName: 'Ecobank' },
  { id: 'fidelity', name: 'Fidelity Bank', shortName: 'Fidelity' },
  { id: 'firstbank', name: 'First Bank of Nigeria', shortName: 'First Bank' },
  { id: 'fcmb', name: 'First City Monument Bank', shortName: 'FCMB' },
  { id: 'gtbank', name: 'Guaranty Trust Bank', shortName: 'GTBank' },
  { id: 'kuda', name: 'Kuda Microfinance Bank', shortName: 'Kuda' },
  { id: 'moniepoint', name: 'Moniepoint Microfinance Bank', shortName: 'Moniepoint' },
  { id: 'opay', name: 'OPay', shortName: 'OPay' },
  { id: 'polaris', name: 'Polaris Bank', shortName: 'Polaris' },
  { id: 'stanbic', name: 'Stanbic IBTC Bank', shortName: 'Stanbic IBTC' },
  { id: 'sterling', name: 'Sterling Bank', shortName: 'Sterling' },
  { id: 'uba', name: 'United Bank for Africa', shortName: 'UBA' },
  { id: 'union', name: 'Union Bank of Nigeria', shortName: 'Union Bank' },
  { id: 'wema', name: 'Wema Bank', shortName: 'Wema' },
  { id: 'zenith', name: 'Zenith Bank', shortName: 'Zenith Bank' },
];

export function getBank(id: string | null) {
  return id === null ? undefined : banks.find((bank) => bank.id === id);
}
