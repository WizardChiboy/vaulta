import { View } from 'react-native';

import { useTheme } from '@/components/layout/ThemeProvider';
import { Screen } from '@/components/layout/Screen';
import { ScreenHeader } from '@/components/layout/ScreenHeader';
import { Button, Card, ProgressBar, Text, type ProgressTone } from '@/components/ui';
import { CircleAlert, Pencil } from '@/constants/icons';
import { palette } from '@/constants/theme';
import { cn } from '@/lib/cn';
import { showMessage } from '@/lib/notify';
import { categoryBudgets, insightsLinks, insightsMonth, spendingCategories } from '@/mock/insights';
import { formatWholeCurrency } from '@/utils/format';
import { formatMonthYear } from '@/utils/savings';

/** From this share of a budget used, the bar turns amber. */
const WARNING_SHARE = 0.85;

function budgetTone(used: number): ProgressTone {
  if (used > 1) return 'danger';
  if (used >= WARNING_SHARE) return 'warning';
  return 'primary';
}

// Design 32 — Monthly budget. Spending per category against this month's budgets.
export default function MonthlyBudgetScreen() {
  const { spent, budget, daysLeft } = insightsLinks.budget;
  const left = budget - spent;
  const over = left < 0;
  // "about ₦8,750 a day", rounded to ₦50.
  const perDay = daysLeft > 0 ? Math.round(left / daysLeft / 50) * 50 : 0;

  const rows = categoryBudgets.flatMap((item) => {
    const category = spendingCategories.find((c) => c.id === item.categoryId);
    return category ? [{ ...item, name: category.name, spent: category.amount }] : [];
  });

  return (
    <Screen scroll contentClassName="pb-3xl">
      <ScreenHeader
        right={
          <Text variant="bodySm" weight="medium" tone="muted">
            {formatMonthYear(insightsMonth)}
          </Text>
        }
        largeTitle="Monthly budget"
      />

      {/* Fixed navy colours, as on the balance card, in both themes. */}
      <View
        accessible
        accessibilityLabel={`Spent so far ${formatWholeCurrency(spent)} of ${formatWholeCurrency(budget)}. ${
          over
            ? `${formatWholeCurrency(-left)} over budget`
            : `${formatWholeCurrency(left)} left, about ${formatWholeCurrency(perDay)} a day`
        }. ${daysLeft} days left.`}
        className="mt-[14px] rounded-xl bg-brand p-[18px]"
      >
        <View className="flex-row items-baseline justify-between">
          <Text variant="caption" style={{ color: palette.gray[400] }}>
            Spent so far
          </Text>
          <Text variant="caption" style={{ color: palette.gray[300] }}>
            {daysLeft} days left
          </Text>
        </View>
        <Text
          tone="inverse"
          weight="bold"
          className="mt-1"
          style={{
            fontSize: 26,
            lineHeight: 32,
            letterSpacing: -0.5,
            fontVariant: ['tabular-nums'],
          }}
        >
          {formatWholeCurrency(spent)}{' '}
          <Text variant="bodySm" weight="medium" style={{ color: palette.gray[400] }}>
            of {formatWholeCurrency(budget)}
          </Text>
        </Text>
        <View
          className="mt-md h-2 overflow-hidden rounded-full"
          style={{ backgroundColor: palette.gray[700] }}
        >
          <View
            className={cn('h-2 rounded-full', over ? 'bg-danger' : 'bg-primary')}
            style={{ width: `${Math.round(Math.min(spent / budget, 1) * 100)}%` }}
          />
        </View>
        <Text variant="caption" className="mt-2.5" style={{ color: palette.gray[300] }}>
          {over ? (
            <Text variant="caption" weight="semibold" style={{ color: palette.danger[200] }}>
              {formatWholeCurrency(-left)} over budget
            </Text>
          ) : (
            <>
              <Text variant="caption" weight="semibold" style={{ color: palette.green[400] }}>
                {formatWholeCurrency(left)} left
              </Text>
              {daysLeft > 0 && ` · about ${formatWholeCurrency(perDay)} a day`}
            </>
          )}
        </Text>
      </View>

      <Card padded={false} className="mt-[14px]">
        {rows.map((row, index) => (
          <BudgetRow
            key={row.categoryId}
            name={row.name}
            spent={row.spent}
            limit={row.limit}
            divider={index > 0}
          />
        ))}
      </Card>

      <View className="mt-auto pt-xl">
        <Button
          label="Edit budgets"
          variant="secondary"
          leadingIcon={Pencil}
          onPress={() =>
            showMessage('Edit budgets', 'This is a demo — editing budgets isn’t available yet.')
          }
        />
      </View>
    </Screen>
  );
}

function BudgetRow({
  name,
  spent,
  limit,
  divider,
}: {
  name: string;
  spent: number;
  limit: number;
  divider: boolean;
}) {
  const { colors } = useTheme();
  const used = limit > 0 ? spent / limit : 1;
  const tone = budgetTone(used);
  const left = limit - spent;
  const remark =
    tone === 'danger'
      ? `${formatWholeCurrency(-left)} over budget`
      : tone === 'warning'
        ? `${formatWholeCurrency(left)} left · ${Math.round(used * 100)}% used`
        : `${formatWholeCurrency(left)} left`;

  return (
    <View
      accessible
      accessibilityLabel={`${name}: ${formatWholeCurrency(spent)} of ${formatWholeCurrency(limit)}. ${remark}`}
      className={cn('px-lg py-[11px]', divider && 'border-t border-surface-muted')}
    >
      <View className="flex-row items-baseline justify-between gap-md">
        <Text variant="body" weight="medium" className="flex-shrink" numberOfLines={1}>
          {name}
        </Text>
        <Text variant="caption" tone="muted" style={{ fontVariant: ['tabular-nums'] }}>
          {formatWholeCurrency(spent)} / {formatWholeCurrency(limit)}
        </Text>
      </View>
      <ProgressBar value={used} size="medium" track="muted" tone={tone} className="mt-sm" />
      <View className="mt-1.5 flex-row items-center gap-1">
        {tone === 'danger' && (
          <CircleAlert size={13} color={colors['danger-text']} strokeWidth={2.2} />
        )}
        <Text
          variant="small"
          weight="medium"
          tone={tone === 'danger' ? 'danger' : tone === 'warning' ? 'warning' : 'muted'}
        >
          {remark}
        </Text>
      </View>
    </View>
  );
}
