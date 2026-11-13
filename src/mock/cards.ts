// Mock data only — VAULTA is a frontend UI project with no real card connection.
// Numbers are fictional and must never be treated as real payment credentials.
import type { Card } from '@/types/card';

export const virtualCard: Card = {
  id: 'card_virtual_001',
  kind: 'virtual',
  last4: '7302',
  fullNumber: '5399 8812 4720 7302',
  expiry: '09/29',
  cvv: '472',
  status: 'active',
  holderName: 'ADAEZE OKAFOR',
  billingAddress: 'Admiralty Way, Lekki, Lagos',
  monthlySpend: 212840,
  monthlyLimit: 300000,
  transactionLimit: 100000,
  controls: { onlinePayments: true, internationalPayments: false, notifications: true },
  weeklyBars: [0.6, 0.85, 0.45, 1],
  purpose: 'Online payments',
};

export const physicalCard: Card = {
  id: 'card_physical_001',
  kind: 'physical',
  last4: '1159',
  fullNumber: '5399 8812 4721 1159',
  expiry: '11/27',
  cvv: '389',
  status: 'frozen',
  holderName: 'ADAEZE OKAFOR',
  billingAddress: 'Admiralty Way, Lekki, Lagos',
  monthlySpend: 0,
  monthlyLimit: 300000,
  transactionLimit: 50000,
  controls: { onlinePayments: false, internationalPayments: false, notifications: true },
  weeklyBars: [0.3, 0.4, 0.2, 0],
  purpose: 'Frozen by you',
};

export const cards: Card[] = [virtualCard, physicalCard];

export function getCard(id: string): Card | undefined {
  return cards.find((c) => c.id === id);
}
