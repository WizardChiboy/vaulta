import { useState } from 'react';
import { Pressable, View } from 'react-native';
import { router } from 'expo-router';

import { DonutChart } from '@/components/charts/DonutChart';
import { useTheme } from '@/components/layout/ThemeProvider';
import { Screen } from '@/components/layout/Screen';
import { ScreenHeader } from '@/components/layout/ScreenHeader';
import { Card, Text } from '@/components/ui';
import { ChevronDown, ChevronUp, ICON_STROKE } from '@/constants/icons';
import { palette, type ThemeColors, type ThemeName } from '@/constants/theme';
import { cn } from '@/lib/cn';
import { insightsMonth, spendingCategories } from '@/mock/insights';
import type { CategoryPayment, SpendingCategory, SpendingCategoryId } from '@/types/insights';
import { formatDayMonth, formatWholeCurrency } from '@/utils/format';
import { formatMonthYear } from '@/utils/savings';

/** Segment colours from design 31; the navy and slate swap for lighter shades in dark mode. */
function categoryColors(
  colors: ThemeColors,
  themeName: ThemeName
): Record<SpendingCategoryId, string> {
  const dark = themeName === 'dark';
  return {
    groceries: colors.primary,
    shopping: colors.foreground,
    food: palette.green[300],
    bills: dark ? palette.gray[500] : palette.gray[600],
    transport: palette.gray[400],
    entertainment: palette.warning[500],
  };
}

function joinNames(names: readonly string[]) {
  if (names.length <= 1) return names.join('');
  return `${names.slice(0, -1).join(', ')} and ${names.at(-1) ?? ''}`;
}

// Design 31 — Category breakdown.
export default function CategoriesScreen() {
  const { colors, name: themeName } = useTheme();
  const swatches = categoryColors(colors, themeName);
  const total = spendingCategories.reduce((sum, category) => sum + category.amount, 0);
  const share = (amount: number) => (total > 0 ? Math.round((amount / total) * 100) : 0);
  const biggest = spendingCategories.reduce<SpendingCategory | undefined>(
    (best, category) => (!best || category.amount > best.amount ? category : best),
    undefined
  );
  // The biggest category starts open, as in the design.
  const [openId, setOpenId] = useState<SpendingCategoryId | null>(biggest?.id ?? null);

  const donutLabel = `Spending by category: ${spendingCategories
    .map((category) => `${category.name} ${share(category.amount)}%`)
    .join(', ')}`;

  return (
    <Screen scroll contentClassName="pb-xl">
      <ScreenHeader
        right={
          <Text variant="bodySm" weight="medium" tone="muted">
            {formatMonthYear(insightsMonth)}
          </Text>
        }
        largeTitle="Categories"
      />

      <Card className="mt-[14px] flex-row items-center gap-[18px]">
        <DonutChart
          segments={spendingCategories.map((category) => ({
            key: category.id,
            value: category.amount,
            color: swatches[category.id],
          }))}
          accessibilityLabel={donutLabel}
        >
          <Text variant="xs" weight="regular" tone="muted">
            Total
          </Text>
          <Text variant="bodyLg" weight="bold" style={{ fontVariant: ['tabular-nums'] }}>
            {formatWholeCurrency(total)}
          </Text>
        </DonutChart>
        {biggest && (
          <View className="flex-1 gap-1">
            <Text variant="small" tone="muted">
              Biggest category
            </Text>
            <Text variant="h3" weight="bold" style={{ fontSize: 18, lineHeight: 24 }}>
              {biggest.name}
            </Text>
            <Text variant="caption" tone="label" className="mt-1" style={{ lineHeight: 19 }}>
              {share(biggest.amount)}% of spending
              {biggest.topMerchants.length > 0
                ? `, mostly at ${joinNames(biggest.topMerchants)}.`
                : '.'}
            </Text>
          </View>
        )}
      </Card>

      <Card padded={false} className="mt-[14px] overflow-hidden">
        {spendingCategories.map((category, index) => (
          <CategoryRow
            key={category.id}
            category={category}
            color={swatches[category.id]}
            percent={share(category.amount)}
            open={openId === category.id}
            onToggle={() => setOpenId((current) => (current === category.id ? null : category.id))}
            last={index === spendingCategories.length - 1}
          />
        ))}
      </Card>
    </Screen>
  );
}

function CategoryRow({
  category,
  color,
  percent,
  open,
  onToggle,
  last,
}: {
  category: SpendingCategory;
  color: string;
  percent: number;
  open: boolean;
  onToggle: () => void;
  last: boolean;
}) {
  const { colors } = useTheme();
  const Chevron = open ? ChevronUp : ChevronDown;
  const count = `${category.transactionCount} transaction${category.transactionCount === 1 ? '' : 's'}`;

  return (
    <View className={cn(!last && 'border-b border-surface-muted', open && 'bg-surface-hover')}>
      <Pressable
        accessibilityRole="button"
        accessibilityState={{ expanded: open }}
        accessibilityLabel={`${category.name}, ${formatWholeCurrency(category.amount)}, ${percent}%, ${count}`}
        accessibilityHint={open ? 'Hides the largest payments' : 'Shows the largest payments'}
        onPress={onToggle}
        className="flex-row items-center gap-md px-lg py-[11px] active:opacity-70"
      >
        <View className="h-2.5 w-2.5 rounded-[3px]" style={{ backgroundColor: color }} />
        <View className="flex-1">
          <Text variant="body" weight="medium">
            {category.name}
          </Text>
          <Text variant="small" tone="muted" className="mt-0.5">
            {count}
          </Text>
        </View>
        <View className="items-end">
          <Text variant="bodySm" weight="semibold" style={{ fontVariant: ['tabular-nums'] }}>
            {formatWholeCurrency(category.amount)}
          </Text>
          <Text variant="small" tone="muted" className="mt-0.5">
            {percent}%
          </Text>
        </View>
        <Chevron size={16} color={colors.muted} strokeWidth={ICON_STROKE} />
      </Pressable>

      {open && (
        <View className="pb-2.5 pl-[38px] pr-lg">
          {category.payments.map((payment) => (
            <PaymentRow key={payment.id} payment={payment} />
          ))}
        </View>
      )}
    </View>
  );
}

function PaymentRow({ payment }: { payment: CategoryPayment }) {
  const { transactionId } = payment;
  const label = `${payment.merchant} · ${formatDayMonth(payment.date)}`;
  const amount = formatWholeCurrency(payment.amount);
  const content = (
    <>
      <Text variant="caption" tone="label" numberOfLines={1} className="flex-1">
        {label}
      </Text>
      <Text variant="caption" weight="semibold" style={{ fontVariant: ['tabular-nums'] }}>
        {amount}
      </Text>
    </>
  );

  if (!transactionId) {
    return (
      <View
        accessible
        accessibilityLabel={`${label}, ${amount}`}
        className="flex-row gap-md py-1.5"
      >
        {content}
      </View>
    );
  }

  return (
    <Pressable
      accessibilityRole="link"
      accessibilityLabel={`${label}, ${amount}`}
      accessibilityHint="Opens the transaction"
      onPress={() => router.push({ pathname: '/transactions/[id]', params: { id: transactionId } })}
      className="flex-row gap-md py-1.5 active:opacity-60"
    >
      {content}
    </Pressable>
  );
}
