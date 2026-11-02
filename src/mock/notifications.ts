import type { AppNotification } from '@/types/notification';
import { transactions } from './transactions';

// Fictional notifications from the Notifications design (15), newest first.
// Times are relative to now so the "Today" group always has entries.
function minutesAgo(minutes: number) {
  return new Date(Date.now() - minutes * 60_000).toISOString();
}

function daysAgo(days: number, time: string) {
  const [hours = 0, minutes = 0] = time.split(':').map(Number);
  const date = new Date();
  date.setDate(date.getDate() - days);
  date.setHours(hours, minutes, 0, 0);
  return date.toISOString();
}

// The Ikeja Electric payment is notified when it happened.
const electricity = transactions.find((transaction) => transaction.id === 'txn_demo_007');

export const notifications: AppNotification[] = [
  {
    id: 'ntf_demo_001',
    category: 'transactions',
    message: 'You received ₦45,000.00 from Tunde Bakare',
    createdAt: minutesAgo(2),
    read: false,
    transactionId: 'txn_demo_002',
  },
  {
    id: 'ntf_demo_002',
    category: 'security',
    message: 'New sign-in on MacBook Air · Chrome, Lagos. Wasn’t you? Review now.',
    createdAt: minutesAgo(60),
    read: false,
  },
  {
    id: 'ntf_demo_003',
    category: 'savings',
    message: 'Your Emergency fund is now 65% funded. Nice momentum.',
    createdAt: minutesAgo(5 * 60),
    read: false,
  },
  {
    id: 'ntf_demo_004',
    category: 'transactions',
    message: 'Ikeja Electric token purchased: ₦15,000.00',
    createdAt: electricity?.occurredAt ?? daysAgo(4, '18:30'),
    read: true,
    transactionId: 'txn_demo_007',
  },
  {
    id: 'ntf_demo_005',
    category: 'insights',
    message: 'Your September activity report is ready',
    createdAt: daysAgo(6, '09:00'),
    read: true,
  },
];
