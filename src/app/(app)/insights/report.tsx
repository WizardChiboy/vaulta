import type { ReactNode } from 'react';
import { Share as NativeShare, View } from 'react-native';

import { useTheme } from '@/components/layout/ThemeProvider';
import { Screen } from '@/components/layout/Screen';
import { ScreenHeader } from '@/components/layout/ScreenHeader';
import { Button, Card, IconButton, RowIcon, Text, type RowIconTone } from '@/components/ui';
import {
  ArrowDown,
  ArrowUp,
  Check,
  Download,
  House,
  Share,
  ShoppingCart,
  type LucideIcon,
} from '@/constants/icons';
import { cn } from '@/lib/cn';
import { showMessage } from '@/lib/notify';
import { septemberReport as report } from '@/mock/insights';
import { formatWholeCurrency } from '@/utils/format';

/** Rounded percentage change, e.g. 0.123 → 12. */
function percentChange(current: number, previous: number) {
  return previous > 0 ? Math.round((current / previous - 1) * 100) : 0;
}

/** Spent / saved / kept shares of income, rounded so they add up to 100. */
function incomeShares() {
  const spent = Math.round((report.expenses / report.income) * 100);
  const saved = Math.round((report.saved / report.income) * 100);
  return { spent, saved, kept: Math.max(100 - spent - saved, 0) };
}

async function shareReport() {
  const shares = incomeShares();
  const message = [
    `Vaulta — ${report.month} report (${report.rangeLabel})`,
    `Income: ${formatWholeCurrency(report.income)}`,
    `Expenses: ${formatWholeCurrency(report.expenses)}`,
    `Saved: ${formatWholeCurrency(report.saved)} (${shares.saved}% of income)`,
  ].join('\n');
  try {
    await NativeShare.share({ message });
  } catch {
    showMessage('Sharing isn’t available', 'Your device can’t open the share sheet here.');
  }
}

// Design 33 — Monthly report ("September report").
export default function MonthlyReportScreen() {
  const { colors } = useTheme();
  const shares = incomeShares();
  const savingsRate = report.saved / report.income;
  const incomeChange = percentChange(report.income, report.previousIncome);
  const expensesChange = percentChange(report.expenses, report.previousExpenses);
  const metTarget = savingsRate >= report.savingsTarget;

  return (
    <Screen scroll contentClassName="pb-3xl">
      <ScreenHeader
        right={
          <IconButton
            icon={Share}
            accessibilityLabel="Share report"
            onPress={() => void shareReport()}
          />
        }
        largeTitle={`${report.month} report`}
      />
      <Text variant="bodySm" tone="muted" className="mt-1">
        {report.rangeLabel} · all Vaulta accounts
      </Text>

      <View className="mt-lg flex-row gap-2.5">
        <Tile
          label="Income"
          swatch={colors.foreground}
          value={formatWholeCurrency(report.income)}
          footer={<Change percent={incomeChange} previous={report.previousMonth} goodWhenUp />}
        />
        <Tile
          label="Expenses"
          swatch={colors.primary}
          value={formatWholeCurrency(report.expenses)}
          footer={<Change percent={expensesChange} previous={report.previousMonth} />}
        />
      </View>
      <View className="mt-2.5 flex-row gap-2.5">
        <Tile
          label="Saved"
          value={formatWholeCurrency(report.saved)}
          footer={
            <Text variant="small" weight="medium" tone="muted" className="mt-1">
              across {report.goalCount} goals
            </Text>
          }
        />
        <Tile
          label="Savings rate"
          value={`${Math.round(savingsRate * 100)}%`}
          highlight
          footer={
            <Text variant="small" weight="medium" tone="label" className="mt-1">
              Target {Math.round(report.savingsTarget * 100)}%{metTarget ? ' ✓' : ''}
            </Text>
          }
        />
      </View>

      <Card padded={false} className="mt-md px-lg py-[14px]">
        <View className="flex-row items-baseline justify-between">
          <Text variant="body" weight="semibold" accessibilityRole="header">
            Where income went
          </Text>
          <Text variant="small" tone="muted" style={{ fontVariant: ['tabular-nums'] }}>
            {formatWholeCurrency(report.income)}
          </Text>
        </View>
        <View
          accessible
          accessibilityRole="image"
          accessibilityLabel={`Spent ${shares.spent}%, saved ${shares.saved}%, kept in account ${shares.kept}%`}
          className="mt-md h-3 flex-row gap-0.5 overflow-hidden rounded-full"
        >
          <View className="bg-foreground" style={{ flex: shares.spent }} />
          <View className="bg-primary" style={{ flex: shares.saved }} />
          <View className="bg-border-strong" style={{ flex: shares.kept }} />
        </View>
        <View className="mt-2.5 flex-row gap-[14px]" accessible={false}>
          <Text variant="small" tone="label">
            Spent {shares.spent}%
          </Text>
          <Text variant="small" tone="label">
            Saved {shares.saved}%
          </Text>
          <Text variant="small" tone="label">
            Kept {shares.kept}%
          </Text>
        </View>
      </Card>

      <Text variant="h3" weight="semibold" accessibilityRole="header" className="mb-sm mt-[18px]">
        Highlights
      </Text>
      <Card padded={false}>
        <Highlight
          icon={House}
          label="Biggest payment: "
          value={`${report.biggestPayment.label}, ${formatWholeCurrency(report.biggestPayment.amount)}`}
        />
        <Highlight
          icon={ShoppingCart}
          label="Top category: "
          value={`${report.topCategory.name}, ${formatWholeCurrency(report.topCategory.amount)}`}
          divider
        />
        <Highlight
          icon={Check}
          tone="accent"
          label="Under budget in "
          value={`${report.underBudget.count} of ${report.underBudget.of} categories`}
          divider
        />
      </Card>

      <View className="mt-auto flex-row gap-md pt-xl">
        <Button
          label="PDF"
          variant="secondary"
          leadingIcon={Download}
          className="flex-1"
          onPress={() =>
            showMessage(
              `${report.month} report`,
              'This is a demo — PDF downloads aren’t available yet.'
            )
          }
        />
        <Button
          label="Share report"
          leadingIcon={Share}
          className="flex-1"
          onPress={() => void shareReport()}
        />
      </View>
    </Screen>
  );
}

function Tile({
  label,
  value,
  footer,
  swatch,
  highlight = false,
}: {
  label: string;
  value: string;
  footer: ReactNode;
  swatch?: string | undefined;
  highlight?: boolean | undefined;
}) {
  return (
    <View
      className={cn(
        'flex-1 rounded-lg border p-[14px]',
        highlight ? 'border-accent-soft bg-accent-soft' : 'border-border bg-surface'
      )}
    >
      <View className="flex-row items-center gap-1.5">
        {swatch && <View className="h-2 w-2 rounded-[2px]" style={{ backgroundColor: swatch }} />}
        <Text variant="small" tone={highlight ? 'accent' : 'muted'}>
          {label}
        </Text>
      </View>
      <Text
        variant="h2"
        weight="bold"
        tone={highlight ? 'accent' : 'default'}
        numberOfLines={1}
        adjustsFontSizeToFit
        className="mt-1.5"
        style={{ fontVariant: ['tabular-nums'] }}
      >
        {value}
      </Text>
      {footer}
    </View>
  );
}

/** "▲ 2% vs Aug": green when the change is good, amber when it isn't. */
function Change({
  percent,
  previous,
  goodWhenUp = false,
}: {
  percent: number;
  previous: string;
  goodWhenUp?: boolean | undefined;
}) {
  const { colors } = useTheme();
  const up = percent >= 0;
  const good = up === goodWhenUp;
  const color = good ? colors['success-text'] : colors['warning-text'];
  const Icon = up ? ArrowUp : ArrowDown;

  return (
    <View
      accessible
      accessibilityLabel={`${up ? 'Up' : 'Down'} ${Math.abs(percent)}% compared with ${previous}`}
      className="mt-1 flex-row items-center gap-0.5"
    >
      <Icon size={12} color={color} strokeWidth={2.6} />
      <Text variant="small" weight="semibold" tone={good ? 'success' : 'warning'}>
        {Math.abs(percent)}% vs {previous}
      </Text>
    </View>
  );
}

function Highlight({
  icon,
  tone,
  label,
  value,
  divider = false,
}: {
  icon: LucideIcon;
  tone?: RowIconTone | undefined;
  label: string;
  value: string;
  divider?: boolean | undefined;
}) {
  return (
    <View
      className={cn(
        'flex-row items-center gap-md px-lg py-md',
        divider && 'border-t border-surface-muted'
      )}
    >
      <RowIcon icon={icon} tone={tone} />
      <Text variant="bodySm" className="flex-1">
        {label}
        <Text variant="bodySm" weight="semibold">
          {value}
        </Text>
      </Text>
    </View>
  );
}
