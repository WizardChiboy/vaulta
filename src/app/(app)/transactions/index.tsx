import { useEffect, useRef, useState } from 'react';
import { FlatList, ScrollView, View } from 'react-native';
import { router } from 'expo-router';

import { Screen } from '@/components/layout/Screen';
import { ScreenHeader } from '@/components/layout/ScreenHeader';
import { TransactionRow } from '@/components/money/TransactionRow';
import { Card, Chip, IconButton, Text, TextLink } from '@/components/ui';
import { ListFilter, Search } from '@/constants/icons';
import { dashboard } from '@/mock/dashboard';
import { fetchTransactions } from '@/services/transactions';
import { useTransactionsStore } from '@/store/transactions';
import type { Transaction } from '@/types/transaction';
import {
  formatDayLabel,
  formatDayMonth,
  formatShortDate,
  formatTime,
  formatWholeCurrency,
} from '@/utils/format';
import { activeFilterCount, DEFAULT_FILTERS } from '@/utils/transactionFilters';

type Filter = 'all' | 'in' | 'out' | 'pending';

const FILTERS: readonly { value: Filter; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'in', label: 'Money in' },
  { value: 'out', label: 'Money out' },
  { value: 'pending', label: 'Pending' },
];

const matchesFilter: Record<Filter, (transaction: Transaction) => boolean> = {
  all: () => true,
  in: (transaction) => transaction.amount > 0,
  out: (transaction) => transaction.amount < 0,
  pending: (transaction) => transaction.status === 'pending',
};

type DayGroup = {
  key: string;
  /** "Today" · "Yesterday" · "Thursday" · "Sun, 4 Oct" */
  title: string;
  /** Date shown on the right, when the title doesn't already include it. */
  date: string;
  transactions: Transaction[];
};

// 16px/700 summary figures sit between type-scale steps.
const summaryAmountStyle = { fontSize: 16, lineHeight: 22 };

/** Groups newest-first transactions by calendar day. */
function groupByDay(items: readonly Transaction[]): DayGroup[] {
  const groups: DayGroup[] = [];
  for (const transaction of items) {
    const key = new Date(transaction.occurredAt).toDateString();
    const last = groups[groups.length - 1];
    if (last?.key === key) {
      last.transactions.push(transaction);
      continue;
    }
    const title = formatDayLabel(transaction.occurredAt);
    const shortDate = formatShortDate(transaction.occurredAt);
    const date =
      title === shortDate
        ? ''
        : title === 'Today' || title === 'Yesterday'
          ? shortDate
          : formatDayMonth(transaction.occurredAt);
    groups.push({ key, title, date, transactions: [transaction] });
  }
  return groups;
}

// Design 11 — Transactions.
export default function TransactionsScreen() {
  const [items, setItems] = useState<Transaction[]>([]);
  const [cursor, setCursor] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<Filter>('all');
  // Filters applied from the filter sheet (14); the list reloads when they change.
  const { filters, setFilters } = useTransactionsStore();
  const [listFilters, setListFilters] = useState(filters);
  if (listFilters !== filters) {
    setListFilters(filters);
    setItems([]);
    setCursor(null);
    setLoading(true);
  }
  const activeFilters = activeFilterCount(filters);
  // Guards against onEndReached firing again before the loading state re-renders.
  const fetching = useRef(true);
  // Lets a page that arrives after the filters changed be dropped.
  const currentFilters = useRef(filters);

  useEffect(() => {
    let active = true;
    currentFilters.current = filters;
    fetching.current = true;
    void fetchTransactions(0, filters).then((page) => {
      if (!active) return;
      setItems(page.items);
      setCursor(page.nextCursor);
      setLoading(false);
      fetching.current = false;
    });
    return () => {
      active = false;
    };
  }, [filters]);

  const loadEarlier = async () => {
    if (cursor === null || fetching.current) return;
    fetching.current = true;
    setLoading(true);
    const requested = filters;
    try {
      const page = await fetchTransactions(cursor, requested);
      if (currentFilters.current !== requested) return;
      setItems((previous) => [...previous, ...page.items]);
      setCursor(page.nextCursor);
    } finally {
      if (currentFilters.current === requested) {
        fetching.current = false;
        setLoading(false);
      }
    }
  };

  const groups = groupByDay(items.filter(matchesFilter[filter]));
  const initialLoad = loading && items.length === 0;

  return (
    <Screen padded={false}>
      <FlatList
        data={groups}
        keyExtractor={(group) => group.key}
        showsVerticalScrollIndicator={false}
        contentContainerClassName="px-gutter pb-xl"
        onEndReached={() => void loadEarlier()}
        onEndReachedThreshold={0.5}
        ListHeaderComponent={
          <>
            <ScreenHeader
              largeTitle="Transactions"
              right={
                <View className="flex-row gap-sm">
                  <IconButton
                    icon={Search}
                    accessibilityLabel="Search transactions"
                    onPress={() => router.push('/transactions/search')}
                  />
                  <View>
                    <IconButton
                      icon={ListFilter}
                      accessibilityLabel={
                        activeFilters > 0
                          ? `Filter transactions, ${activeFilters} active`
                          : 'Filter transactions'
                      }
                      onPress={() => router.push('/transactions/filter')}
                    />
                    {activeFilters > 0 && (
                      <View
                        pointerEvents="none"
                        className="absolute right-2.5 top-[9px] h-[9px] w-[9px] rounded-full border-2 border-surface bg-primary"
                      />
                    )}
                  </View>
                </View>
              }
            />

            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              className="-mx-gutter mt-3.5"
              contentContainerClassName="gap-sm px-gutter"
            >
              {FILTERS.map((option) => (
                <Chip
                  key={option.value}
                  label={option.label}
                  selected={filter === option.value}
                  onPress={() => setFilter(option.value)}
                />
              ))}
            </ScrollView>

            <Card padded={false} className="mt-3.5 flex-row px-lg py-md">
              <View className="flex-1">
                <Text variant="small" tone="muted">
                  In · {dashboard.spending.month}
                </Text>
                <Text
                  variant="bodyLg"
                  weight="bold"
                  tone="accent"
                  className="mt-0.5"
                  style={summaryAmountStyle}
                >
                  +{formatWholeCurrency(dashboard.monthlyInflow)}
                </Text>
              </View>
              <View className="flex-1 border-l border-surface-muted pl-lg">
                <Text variant="small" tone="muted">
                  Out · {dashboard.spending.month}
                </Text>
                <Text variant="bodyLg" weight="bold" className="mt-0.5" style={summaryAmountStyle}>
                  −{formatWholeCurrency(dashboard.spending.spent)}
                </Text>
              </View>
            </Card>
          </>
        }
        renderItem={({ item: group }) => (
          <View>
            <View accessibilityRole="header" className="mb-sm mt-3.5 flex-row justify-between">
              <Text variant="caption" weight="semibold" tone="muted">
                {group.title}
              </Text>
              <Text variant="caption" weight="semibold" tone="muted">
                {group.date}
              </Text>
            </View>
            <Card padded={false} className="overflow-hidden py-[3px]">
              {group.transactions.map((transaction) => (
                <TransactionRow
                  key={transaction.id}
                  transaction={transaction}
                  meta={`${transaction.categoryLabel} · ${formatTime(transaction.occurredAt)}`}
                  onPress={() =>
                    router.push({ pathname: '/transactions/[id]', params: { id: transaction.id } })
                  }
                  className="py-[9px]"
                />
              ))}
            </Card>
          </View>
        )}
        ListFooterComponent={
          loading ? (
            <Card
              padded={false}
              accessibilityRole="progressbar"
              accessibilityLabel={
                initialLoad ? 'Loading transactions' : 'Loading earlier transactions'
              }
              className="mt-3.5 py-[3px]"
            >
              {Array.from({ length: initialLoad ? 3 : 1 }, (_, index) => (
                <SkeletonRow key={index} />
              ))}
            </Card>
          ) : groups.length === 0 ? (
            <View className="mt-xl items-center gap-sm">
              <Text variant="bodySm" tone="muted" className="text-center">
                {activeFilters > 0
                  ? 'No transactions match your filters.'
                  : 'No transactions to show.'}
              </Text>
              {activeFilters > 0 && (
                <TextLink
                  accessibilityRole="button"
                  onPress={() => setFilters(DEFAULT_FILTERS)}
                  className="py-1.5"
                >
                  Clear filters
                </TextLink>
              )}
            </View>
          ) : undefined
        }
      />
    </Screen>
  );
}

/** Design .sk placeholder in the shape of a transaction row. */
function SkeletonRow() {
  return (
    <View className="flex-row items-center gap-md px-lg py-[9px]">
      <View className="h-10 w-10 rounded-md bg-surface-sunken" />
      <View className="flex-1">
        <View className="h-3 w-3/5 rounded-[6px] bg-surface-sunken" />
        <View className="mt-sm h-2.5 w-[38%] rounded-[6px] bg-surface-sunken" />
      </View>
      <View className="h-3 w-16 rounded-[6px] bg-surface-sunken" />
    </View>
  );
}
