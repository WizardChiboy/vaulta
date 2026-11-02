import { useState } from 'react';
import { Pressable, View } from 'react-native';
import { router } from 'expo-router';

import { RangeSlider } from '@/components/forms/RangeSlider';
import { useTheme } from '@/components/layout/ThemeProvider';
import { Screen } from '@/components/layout/Screen';
import { Button, Chip, IconButton, SegmentedControl, Text } from '@/components/ui';
import { Calendar, Check, ICON_STROKE, X } from '@/constants/icons';
import { showMessage } from '@/lib/notify';
import { countTransactions } from '@/services/transactions';
import { useTransactionsStore } from '@/store/transactions';
import type {
  DateRangePreset,
  TransactionCategory,
  TransactionDirection,
  TransactionFilters,
} from '@/types/transaction';
import { formatDate, formatWholeCurrency } from '@/utils/format';
import {
  AMOUNT_RANGE_MAX,
  AMOUNT_RANGE_STEP,
  CATEGORY_OPTIONS,
  DEFAULT_FILTERS,
  presetRange,
} from '@/utils/transactionFilters';

const DATE_OPTIONS: readonly { value: DateRangePreset; label: string }[] = [
  { value: 'this-month', label: 'This month' },
  { value: 'last-30-days', label: 'Last 30 days' },
  { value: 'three-months', label: '3 months' },
  { value: 'custom', label: 'Custom' },
];

const DIRECTION_OPTIONS: readonly { value: TransactionDirection; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'in', label: 'Money in' },
  { value: 'out', label: 'Money out' },
];

function amountLabel(min: number, max: number | null) {
  if (max === null) return min === 0 ? 'Any amount' : `${formatWholeCurrency(min)}+`;
  return `${formatWholeCurrency(min)} – ${formatWholeCurrency(max)}`;
}

function SectionTitle({ children }: { children: string }) {
  return (
    <Text variant="body" weight="semibold" accessibilityRole="header" className="mb-2.5">
      {children}
    </Text>
  );
}

// Design 14 — Filter transactions (form sheet).
export default function FilterTransactionsScreen() {
  const { colors } = useTheme();
  const { filters, setFilters } = useTransactionsStore();
  // Edits stay local until "Show results"; closing the sheet discards them.
  const [draft, setDraft] = useState<TransactionFilters>(filters);
  const update = (changes: Partial<TransactionFilters>) =>
    setDraft((current) => ({ ...current, ...changes }));

  const selectDateRange = (preset: DateRangePreset) => {
    if (draft.dateRange === preset) {
      // Tapping the selected chip again clears the date filter.
      update({ dateRange: null, from: '', to: '' });
    } else if (preset === 'custom') {
      // Custom starts from the dates on screen (or the last 30 days).
      const range = draft.from ? { from: draft.from, to: draft.to } : presetRange('last-30-days');
      update({ dateRange: 'custom', ...range });
    } else {
      update({ dateRange: preset, ...presetRange(preset) });
    }
  };

  const toggleCategory = (category: TransactionCategory) =>
    update({
      categories: draft.categories.includes(category)
        ? draft.categories.filter((item) => item !== category)
        : [...draft.categories, category],
    });

  const pickDate = () =>
    showMessage('Choose a date', 'This is a demo — the date picker is coming in a later module.');

  const resultCount = countTransactions(draft);

  return (
    <Screen scroll background="surface" edges={['bottom']} contentClassName="pb-lg">
      <View className="mt-2.5 h-[5px] w-10 self-center rounded-full bg-border-strong" />

      <View className="mt-md flex-row items-center justify-between">
        <Text variant="h1" accessibilityRole="header" style={{ fontSize: 24, lineHeight: 32 }}>
          Filter
        </Text>
        <IconButton
          icon={X}
          variant="ghost"
          iconSize={22}
          accessibilityLabel="Close"
          onPress={() => router.back()}
          className="-mr-2.5"
        />
      </View>

      <View className="mt-3.5">
        <SectionTitle>Date range</SectionTitle>
        <View className="flex-row flex-wrap gap-sm">
          {DATE_OPTIONS.map((option) => (
            <Chip
              key={option.value}
              label={option.label}
              selected={draft.dateRange === option.value}
              onPress={() => selectDateRange(option.value)}
            />
          ))}
        </View>
        <View className="mt-md flex-row gap-2.5">
          {(['From', 'To'] as const).map((label) => {
            const iso = label === 'From' ? draft.from : draft.to;
            const value = draft.dateRange ? formatDate(iso) : 'Any date';
            return (
              <Pressable
                key={label}
                accessibilityRole="button"
                accessibilityLabel={`${label}, ${value}`}
                onPress={pickDate}
                className="h-12 flex-1 flex-row items-center gap-sm rounded-md border border-border-strong bg-surface px-md active:bg-surface-hover"
              >
                <Calendar size={18} color={colors.muted} strokeWidth={ICON_STROKE} />
                <View>
                  <Text variant="xs" weight="regular" tone="muted">
                    {label}
                  </Text>
                  <Text variant="bodySm" tone={draft.dateRange ? 'default' : 'muted'}>
                    {value}
                  </Text>
                </View>
              </Pressable>
            );
          })}
        </View>
      </View>

      <View className="mt-[22px]">
        <SectionTitle>Transaction type</SectionTitle>
        <SegmentedControl
          options={DIRECTION_OPTIONS}
          value={draft.direction}
          onChange={(direction) => update({ direction })}
          accessibilityLabel="Transaction type"
        />
      </View>

      <View className="mt-[22px]">
        <SectionTitle>Category</SectionTitle>
        <View className="flex-row flex-wrap gap-sm">
          {CATEGORY_OPTIONS.map((option) => {
            const selected = draft.categories.includes(option.value);
            return (
              <Chip
                key={option.value}
                label={option.label}
                selected={selected}
                leadingIcon={selected ? Check : undefined}
                onPress={() => toggleCategory(option.value)}
              />
            );
          })}
        </View>
      </View>

      <View className="mt-[22px]">
        <View className="flex-row items-baseline justify-between">
          <SectionTitle>Amount</SectionTitle>
          <Text variant="bodySm" weight="semibold">
            {amountLabel(draft.minAmount, draft.maxAmount)}
          </Text>
        </View>
        <RangeSlider
          min={0}
          max={AMOUNT_RANGE_MAX}
          step={AMOUNT_RANGE_STEP}
          low={draft.minAmount}
          high={draft.maxAmount ?? AMOUNT_RANGE_MAX}
          onChange={(low, high) =>
            update({ minAmount: low, maxAmount: high >= AMOUNT_RANGE_MAX ? null : high })
          }
          formatValue={formatWholeCurrency}
          accessibilityLabel="Amount range"
          className="mt-1"
        />
        <View className="mt-1.5 flex-row justify-between">
          <Text variant="small" tone="muted">
            {formatWholeCurrency(0)}
          </Text>
          <Text variant="small" tone="muted">
            {formatWholeCurrency(AMOUNT_RANGE_MAX)}+
          </Text>
        </View>
      </View>

      <View className="mt-auto flex-row gap-md pt-8">
        <Button
          label="Reset"
          variant="secondary"
          onPress={() => setDraft(DEFAULT_FILTERS)}
          className="flex-1"
        />
        <Button
          label={
            resultCount === 0
              ? 'No results'
              : `Show ${resultCount} ${resultCount === 1 ? 'result' : 'results'}`
          }
          disabled={resultCount === 0}
          onPress={() => {
            setFilters(draft);
            router.back();
          }}
          className="flex-[2]"
        />
      </View>
    </Screen>
  );
}
