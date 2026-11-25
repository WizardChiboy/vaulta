import { useState } from 'react';
import { Pressable, View } from 'react-native';
import { router } from 'expo-router';

import { GroupedBarChart, formatCompact } from '@/components/charts/GroupedBarChart';
import { useTheme } from '@/components/layout/ThemeProvider';
import { Screen } from '@/components/layout/Screen';
import { ScreenHeader } from '@/components/layout/ScreenHeader';
import { Card, SegmentedControl, Text } from '@/components/ui';
import {
  Archive,
  ArrowDown,
  ArrowUp,
  ChartPie,
  ChevronDown,
  ChevronRight,
  FileText,
  ICON_STROKE,
  type LucideIcon,
} from '@/constants/icons';
import { cn } from '@/lib/cn';
import { showMessage } from '@/lib/notify';
import { cashflow, insightsLinks, insightsMonth, spendingCategories } from '@/mock/insights';
import type { InsightsPeriod } from '@/types/insights';
import { formatWholeCurrency } from '@/utils/format';
import { formatMonthYear } from '@/utils/savings';

const PERIODS = [
  { value: 'week', label: 'Week' },
  { value: 'month', label: 'Month' },
  { value: 'year', label: 'Year' },
] as const satisfies readonly { value: InsightsPeriod; label: string }[];

/** Category with the largest rise on last month, for the breakdown link's subtitle. */
function biggestRise() {
  let best: { name: string; change: number } | null = null;
  for (const category of spendingCategories) {
    if (category.previousAmount <= 0) continue;
    const change = category.amount / category.previousAmount - 1;
    if (!best || change > best.change) best = { name: category.name, change };
  }
  return best && best.change > 0 ? best : null;
}

// Design 30 — Spending analytics ("Insights").
export default function InsightsScreen() {
  const { colors } = useTheme();
  const [period, setPeriod] = useState<InsightsPeriod>('month');
  const series = cashflow[period];
  const current = series.buckets.at(-1);
  const previous = series.buckets.at(-2);
  const spent = current?.expenses ?? 0;
  const change = previous && previous.expenses > 0 ? spent / previous.expenses - 1 : 0;
  const changePercent = Math.round(Math.abs(change) * 100);
  const spendingDown = change <= 0;

  const rise = biggestRise();
  const { budget, report } = insightsLinks;
  const monthLabel = formatMonthYear(insightsMonth);

  const chartLabel = `Income and expenses, ${series.buckets[0]?.label ?? ''} to ${current?.label ?? ''}. ${series.buckets
    .map(
      (bucket) =>
        `${bucket.label}: income ${formatWholeCurrency(bucket.income)}, expenses ${formatWholeCurrency(bucket.expenses)}`
    )
    .join('. ')}`;

  return (
    <Screen scroll contentClassName="pb-xl">
      <ScreenHeader
        right={
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={`Month, ${monthLabel}`}
            accessibilityHint="Choose another month"
            onPress={() =>
              showMessage(monthLabel, 'This is a demo — other months aren’t available yet.')
            }
            className="h-10 flex-row items-center gap-1.5 rounded-md border border-border bg-surface px-md active:bg-surface-hover"
          >
            <Text variant="bodySm" weight="semibold">
              {monthLabel}
            </Text>
            <ChevronDown size={16} color={colors.muted} strokeWidth={ICON_STROKE} />
          </Pressable>
        }
        largeTitle="Insights"
      />

      <SegmentedControl
        options={PERIODS}
        value={period}
        onChange={setPeriod}
        accessibilityLabel="Period"
        className="mt-[14px]"
      />

      <View className="mt-lg flex-row items-end justify-between gap-md">
        <View className="flex-shrink">
          <Text variant="caption" tone="muted">
            {series.spentLabel}
          </Text>
          <Text
            variant="h1"
            weight="bold"
            className="mt-0.5"
            style={{ letterSpacing: -0.7, fontVariant: ['tabular-nums'] }}
          >
            {formatWholeCurrency(spent)}
          </Text>
        </View>
        {previous && (
          <View
            accessible
            accessibilityLabel={`${changePercent}% ${spendingDown ? 'less' : 'more'} than ${series.previousLabel}`}
            className={cn(
              'flex-row items-center gap-1 rounded-full px-2.5 py-[5px]',
              spendingDown ? 'bg-success-soft' : 'bg-warning-soft'
            )}
          >
            {spendingDown ? (
              <ArrowDown size={14} color={colors['success-text']} strokeWidth={2.4} />
            ) : (
              <ArrowUp size={14} color={colors['warning-text']} strokeWidth={2.4} />
            )}
            <Text variant="caption" weight="semibold" tone={spendingDown ? 'success' : 'warning'}>
              {changePercent}% vs {series.previousLabel}
            </Text>
          </View>
        )}
      </View>

      <Card padded={false} className="mt-[14px] px-md pb-2.5 pt-[14px]">
        <View className="flex-row items-center justify-between px-1">
          <Text variant="body" weight="semibold" accessibilityRole="header">
            Income vs expenses
          </Text>
          <View className="flex-row gap-md" accessible={false}>
            <Legend color={colors.foreground} label="Income" />
            <Legend color={colors.primary} label="Expenses" />
          </View>
        </View>
        <View className="mt-2.5">
          <GroupedBarChart
            groups={series.buckets.map((bucket) => ({
              label: bucket.label,
              values: [bucket.income, bucket.expenses],
            }))}
            seriesColors={[colors.foreground, colors.primary]}
            formatTick={formatCompact}
            accessibilityLabel={chartLabel}
          />
        </View>
      </Card>

      <Card padded={false} className="mt-[14px]">
        <InsightLink
          icon={ChartPie}
          title="Category breakdown"
          subtitle={
            rise
              ? `${rise.name} up ${Math.round(rise.change * 100)}% this month`
              : 'Where your money went this month'
          }
          onPress={() => router.push('/insights/categories')}
        />
        <InsightLink
          icon={Archive}
          title="Monthly budget"
          subtitle={`${formatWholeCurrency(Math.max(budget.budget - budget.spent, 0))} left · ${budget.daysLeft} days to go`}
          onPress={() =>
            showMessage(
              'Monthly budget',
              'This is a demo — this screen is coming in a later module.'
            )
          }
        />
        <InsightLink
          icon={FileText}
          title={`${report.month} report`}
          subtitle={`You saved ${Math.round(report.savedShareOfIncome * 100)}% of income`}
          onPress={() =>
            showMessage(
              `${report.month} report`,
              'This is a demo — this screen is coming in a later module.'
            )
          }
          last
        />
      </Card>
    </Screen>
  );
}

function Legend({ color, label }: { color: string; label: string }) {
  return (
    <View className="flex-row items-center gap-[5px]">
      <View className="h-2.5 w-2.5 rounded-[3px]" style={{ backgroundColor: color }} />
      <Text variant="small" tone="label">
        {label}
      </Text>
    </View>
  );
}

function InsightLink({
  icon: Icon,
  title,
  subtitle,
  onPress,
  last = false,
}: {
  icon: LucideIcon;
  title: string;
  subtitle: string;
  onPress: () => void;
  last?: boolean | undefined;
}) {
  const { colors } = useTheme();
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${title}. ${subtitle}`}
      onPress={onPress}
      className={cn(
        'flex-row items-center gap-md px-lg py-md active:bg-surface-hover',
        !last && 'border-b border-surface-muted'
      )}
    >
      <View className="h-9 w-9 items-center justify-center rounded-[10px] bg-surface-muted">
        <Icon size={18} color={colors.label} strokeWidth={ICON_STROKE} />
      </View>
      <View className="flex-1">
        <Text variant="body" weight="medium">
          {title}
        </Text>
        <Text variant="small" tone="muted" className="mt-0.5">
          {subtitle}
        </Text>
      </View>
      <ChevronRight size={18} color={colors.subtle} strokeWidth={ICON_STROKE} />
    </Pressable>
  );
}
