import type { RecentTransfer, Recipient } from '@/types/recipient';

// Fictional saved recipients from the Transfer design (16). Never real account details.
export const savedRecipients: Recipient[] = [
  {
    id: 'rcp_demo_001',
    fullName: 'Tunde Bakare',
    shortName: 'Tunde',
    bank: 'GTBank',
    maskedAccount: '0123 •• 4489',
    tone: 'green',
  },
  {
    id: 'rcp_demo_002',
    fullName: 'Chiamaka Eze',
    shortName: 'Chiamaka',
    bank: 'Access Bank',
    maskedAccount: '0456 •• 2210',
    tone: 'neutral',
  },
  {
    id: 'rcp_demo_003',
    fullName: 'Ibrahim Musa',
    shortName: 'Ibrahim',
    bank: 'Zenith Bank',
    maskedAccount: '2087 •• 9037',
    tone: 'green',
  },
  {
    id: 'rcp_demo_004',
    fullName: 'Funmi Adeyemi',
    shortName: 'Funmi',
    bank: 'First Bank',
    maskedAccount: '3091 •• 5562',
    tone: 'neutral',
  },
];

function daysAgo(days: number) {
  const date = new Date();
  date.setDate(date.getDate() - days);
  date.setHours(12, 0, 0, 0);
  return date.toISOString();
}

/** Newest first. Dates are relative to now, like the transaction mocks. */
export const recentTransfers: RecentTransfer[] = [
  { id: 'trf_demo_001', recipientId: 'rcp_demo_001', amount: 75000, sentAt: daysAgo(2) },
  { id: 'trf_demo_002', recipientId: 'rcp_demo_002', amount: 20000, sentAt: daysAgo(4) },
  { id: 'trf_demo_003', recipientId: 'rcp_demo_003', amount: 150000, sentAt: daysAgo(6) },
];

export function getRecipient(id: string) {
  return savedRecipients.find((recipient) => recipient.id === id);
}
