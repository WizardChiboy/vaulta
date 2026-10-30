import type { Transaction } from '@/types/transaction';
import { currentAccount } from './accounts';

// Fictional activity on the current account, newest first. The first six match the
// Transactions design (11). Dates are relative to now so "Today" always has entries.
function daysAgo(days: number, time: string) {
  const [hours = 0, minutes = 0] = time.split(':').map(Number);
  const date = new Date();
  date.setDate(date.getDate() - days);
  date.setHours(hours, minutes, 0, 0);
  return date.toISOString();
}

const ACCOUNT_ID = 'acc_demo_001';

const entries: Omit<Transaction, 'balanceAfter'>[] = [
  {
    id: 'txn_demo_001',
    accountId: ACCOUNT_ID,
    title: 'Shoprite Lekki',
    category: 'groceries',
    categoryLabel: 'Groceries',
    occurredAt: daysAgo(0, '10:24'),
    amount: -18450,
    status: 'successful',
    reference: 'VLT-2610-1842-6630',
    channel: 'Virtual card •••• 7302',
    fee: 0,
  },
  {
    id: 'txn_demo_002',
    accountId: ACCOUNT_ID,
    title: 'Tunde Bakare',
    category: 'transfer',
    categoryLabel: 'Transfer in',
    occurredAt: daysAgo(0, '08:02'),
    amount: 45000,
    status: 'successful',
    reference: 'VLT-2610-1842-5517',
    channel: 'GTBank •••• 3318',
    fee: 0,
  },
  {
    // The pending card hold behind the ledger balance on Account details (10).
    id: 'txn_demo_003',
    accountId: ACCOUNT_ID,
    title: 'Ebeano Supermarket',
    category: 'groceries',
    categoryLabel: 'Groceries',
    occurredAt: daysAgo(0, '07:15'),
    amount: -17450,
    status: 'pending',
    reference: 'VLT-2610-1842-4409',
    channel: 'Virtual card •••• 7302',
    fee: 0,
  },
  {
    id: 'txn_demo_004',
    accountId: ACCOUNT_ID,
    title: 'Bolt Ride',
    category: 'transport',
    categoryLabel: 'Transport',
    occurredAt: daysAgo(1, '21:40'),
    amount: -3200,
    status: 'successful',
    reference: 'VLT-2610-1741-9023',
    channel: 'Virtual card •••• 7302',
    fee: 0,
  },
  {
    id: 'txn_demo_005',
    accountId: ACCOUNT_ID,
    title: 'Chicken Republic',
    category: 'food',
    categoryLabel: 'Food & dining',
    occurredAt: daysAgo(1, '13:15'),
    amount: -6750,
    status: 'successful',
    reference: 'VLT-2610-1741-7316',
    channel: 'Virtual card •••• 7302',
    fee: 0,
  },
  {
    id: 'txn_demo_006',
    accountId: ACCOUNT_ID,
    title: 'Brightline Studios',
    category: 'salary',
    categoryLabel: 'Salary',
    occurredAt: daysAgo(3, '09:00'),
    amount: 850000,
    status: 'successful',
    reference: 'VLT-2610-1539-2048',
    channel: 'Zenith Bank •••• 0915',
    fee: 0,
  },
  {
    id: 'txn_demo_007',
    accountId: ACCOUNT_ID,
    title: 'Ikeja Electric',
    category: 'bills',
    categoryLabel: 'Bills & utilities',
    occurredAt: daysAgo(4, '18:30'),
    amount: -15000,
    status: 'successful',
    reference: 'VLT-2610-1438-6671',
    channel: 'Vaulta Current •• 4821',
    fee: 100,
  },
  {
    id: 'txn_demo_008',
    accountId: ACCOUNT_ID,
    title: 'Chioma Eze',
    category: 'transfer',
    categoryLabel: 'Transfer out',
    occurredAt: daysAgo(5, '12:05'),
    amount: -25000,
    status: 'successful',
    reference: 'VLT-2610-1337-1194',
    channel: 'Vaulta Current •• 4821',
    fee: 10.75,
  },
  {
    id: 'txn_demo_009',
    accountId: ACCOUNT_ID,
    title: 'Bolt Ride',
    category: 'transport',
    categoryLabel: 'Transport',
    occurredAt: daysAgo(5, '08:40'),
    amount: -2800,
    status: 'successful',
    reference: 'VLT-2610-1337-0582',
    channel: 'Virtual card •••• 7302',
    fee: 0,
  },
  {
    id: 'txn_demo_010',
    accountId: ACCOUNT_ID,
    title: 'Chinedu Okeke',
    category: 'transfer',
    categoryLabel: 'Transfer in',
    occurredAt: daysAgo(7, '16:20'),
    amount: 40000,
    status: 'successful',
    reference: 'VLT-2610-1136-8840',
    channel: 'Access Bank •••• 2290',
    fee: 0,
  },
  {
    id: 'txn_demo_011',
    accountId: ACCOUNT_ID,
    title: 'Shoprite Lekki',
    category: 'groceries',
    categoryLabel: 'Groceries',
    occurredAt: daysAgo(8, '11:10'),
    amount: -22300,
    status: 'successful',
    reference: 'VLT-2610-1035-4127',
    channel: 'Virtual card •••• 7302',
    fee: 0,
  },
  {
    id: 'txn_demo_012',
    accountId: ACCOUNT_ID,
    title: 'Chicken Republic',
    category: 'food',
    categoryLabel: 'Food & dining',
    occurredAt: daysAgo(10, '19:45'),
    amount: -5400,
    status: 'successful',
    reference: 'VLT-2610-0833-9365',
    channel: 'Virtual card •••• 7302',
    fee: 0,
  },
];

// Walk back from today's balance so each settled entry shows the balance it left behind
// (Shoprite → ₦2,450,800.00, as in design 12). Pending holds haven't moved the balance yet.
let running = currentAccount.balance;

export const transactions: Transaction[] = entries.map((entry) => {
  if (entry.status !== 'successful') return entry;
  const balanceAfter = running;
  // Fees are charged on top of the amount, so add them back when stepping into the past.
  running += entry.fee - entry.amount;
  return { ...entry, balanceAfter };
});
