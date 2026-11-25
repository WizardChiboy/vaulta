import type {
  CashflowSeries,
  CategoryPayment,
  InsightsPeriod,
  SpendingCategory,
} from '@/types/insights';
import { dashboard } from './dashboard';
import { transactions } from './transactions';

// Fictional figures from the Insights designs (30, 31), for October 2026.
// This month's spending matches Home (08): ₦486,250 against a ₦600,000 budget.

export const insightsMonth = '2026-10-15T12:00:00';

export const cashflow: Record<InsightsPeriod, CashflowSeries> = {
  week: {
    spentLabel: 'Spent this week',
    previousLabel: 'last week',
    buckets: [
      { label: '7 Sep', income: 45000, expenses: 118400 },
      { label: '14 Sep', income: 60000, expenses: 132900 },
      { label: '21 Sep', income: 25000, expenses: 104300 },
      { label: '28 Sep', income: 850000, expenses: 151200 },
      { label: '5 Oct', income: 40000, expenses: 126750 },
      { label: '12 Oct', income: 45000, expenses: 112600 },
    ],
  },
  month: {
    spentLabel: 'Spent this month',
    previousLabel: 'Sept',
    buckets: [
      { label: 'May', income: 880000, expenses: 512000 },
      { label: 'Jun', income: 880000, expenses: 548000 },
      { label: 'Jul', income: 910000, expenses: 602000 },
      { label: 'Aug', income: 885000, expenses: 470000 },
      { label: 'Sep', income: 900000, expenses: 527900 },
      { label: 'Oct', income: dashboard.monthlyInflow, expenses: dashboard.spending.spent },
    ],
  },
  year: {
    spentLabel: 'Spent this year',
    previousLabel: '2025',
    buckets: [
      { label: '2021', income: 5400000, expenses: 3920000 },
      { label: '2022', income: 6900000, expenses: 4810000 },
      { label: '2023', income: 8100000, expenses: 5660000 },
      { label: '2024', income: 9600000, expenses: 6480000 },
      { label: '2025', income: 10450000, expenses: 6950000 },
      { label: '2026', income: 8910000, expenses: 5230000 },
    ],
  },
};

/**
 * A payment that is also in the mock transaction history: it takes the transaction's
 * date and opens Transaction details (12). Falls back to `date` if it isn't found.
 */
function linked(id: string, merchant: string, amount: number, date: string): CategoryPayment {
  const transaction = transactions.find(
    (item) => item.title === merchant && item.amount === -amount
  );
  return transaction
    ? { id, merchant, amount, date: transaction.occurredAt, transactionId: transaction.id }
    : { id, merchant, amount, date };
}

/** Biggest first. Amounts add up to this month's spending (₦486,250). */
export const spendingCategories: SpendingCategory[] = [
  {
    id: 'groceries',
    name: 'Groceries',
    amount: 128400,
    previousAmount: 121300,
    transactionCount: 14,
    topMerchants: ['Shoprite', 'Spar'],
    payments: [
      linked('pay_gro_1', 'Shoprite Lekki', 18450, '2026-10-18T10:24:00'),
      { id: 'pay_gro_2', merchant: 'Spar Ikeja', date: '2026-10-11T16:05:00', amount: 26900 },
      linked('pay_gro_3', 'Shoprite Lekki', 22300, '2026-10-04T12:40:00'),
    ],
  },
  {
    id: 'shopping',
    name: 'Shopping',
    amount: 96200,
    previousAmount: 118500,
    transactionCount: 6,
    topMerchants: ['Jumia', 'Zara Ikeja'],
    payments: [
      { id: 'pay_sho_1', merchant: 'Jumia', date: '2026-10-14T21:10:00', amount: 41500 },
      { id: 'pay_sho_2', merchant: 'Zara Ikeja', date: '2026-10-06T15:32:00', amount: 32800 },
    ],
  },
  {
    id: 'food',
    name: 'Food & dining',
    amount: 84600,
    previousAmount: 74200,
    transactionCount: 11,
    topMerchants: ['Chicken Republic', 'Cafe Neo'],
    payments: [
      linked('pay_foo_1', 'Chicken Republic', 6750, '2026-10-17T13:15:00'),
      { id: 'pay_foo_2', merchant: 'Cafe Neo', date: '2026-10-12T09:20:00', amount: 8400 },
    ],
  },
  {
    id: 'bills',
    name: 'Bills & utilities',
    amount: 71500,
    previousAmount: 69800,
    transactionCount: 4,
    topMerchants: ['Ikeja Electric', 'Spectranet'],
    payments: [
      { id: 'pay_bil_1', merchant: 'Spectranet', date: '2026-10-05T08:00:00', amount: 25000 },
      linked('pay_bil_2', 'Ikeja Electric', 15000, '2026-10-03T19:45:00'),
    ],
  },
  {
    id: 'transport',
    name: 'Transport',
    amount: 62300,
    previousAmount: 66900,
    transactionCount: 17,
    topMerchants: ['Bolt', 'Uber'],
    payments: [
      { id: 'pay_tra_1', merchant: 'Uber', date: '2026-10-16T22:40:00', amount: 7900 },
      linked('pay_tra_2', 'Bolt Ride', 3200, '2026-10-17T08:10:00'),
    ],
  },
  {
    id: 'entertainment',
    name: 'Entertainment',
    amount: 43250,
    previousAmount: 77200,
    transactionCount: 5,
    topMerchants: ['Filmhouse', 'Spotify'],
    payments: [
      { id: 'pay_ent_1', merchant: 'Filmhouse Lekki', date: '2026-10-10T19:30:00', amount: 14500 },
      { id: 'pay_ent_2', merchant: 'Spotify', date: '2026-10-02T06:00:00', amount: 1900 },
    ],
  },
];

/** Links under the chart on Insights (30). */
export const insightsLinks = {
  budget: {
    spent: dashboard.spending.spent,
    budget: dashboard.spending.budget,
    daysLeft: 13,
  },
  report: {
    month: 'September',
    savedShareOfIncome: 0.24,
  },
};
