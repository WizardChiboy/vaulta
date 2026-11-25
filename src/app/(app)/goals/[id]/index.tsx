import { View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';

import { useTheme } from '@/components/layout/ThemeProvider';
import { Screen } from '@/components/layout/Screen';
import { ScreenHeader } from '@/components/layout/ScreenHeader';
import { ProgressRing } from '@/components/money/ProgressRing';
import { Button, Card, IconButton, Text } from '@/components/ui';
import {
  CircleCheck,
  ICON_STROKE,
  Pencil,
  Plus,
  RotateCw,
  type LucideIcon,
} from '@/constants/icons';
import { cn } from '@/lib/cn';
import { showMessage } from '@/lib/notify';
import { useSavings } from '@/store/savings';
import type { SavingsContribution, SavingsContributionKind } from '@/types/savings';
import { formatDate, formatWholeCurrency } from '@/utils/format';
import { formatAutoSave, goalPercent, goalShare } from '@/utils/savings';

const contributionDisplay: Record<SavingsContributionKind, { label: string; icon: LucideIcon }> = {
  'auto-save': { label: 'Auto-save', icon: RotateCw },
  'top-up': { label: 'Manual top-up', icon: Plus },
  interest: { label: 'Interest paid', icon: CircleCheck },
};

// Design 28 — Savings goal details.
export default function GoalDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { getGoal } = useSavings();
  const goal = getGoal(id);

  if (!goal) {
    return (
      <Screen>
        <ScreenHeader title="Savings goal" />
        <Text variant="body" tone="muted" className="mt-xl text-center">
          Goal not found.
        </Text>
      </Screen>
    );
  }

  const percent = goalPercent(goal);
  const remaining = Math.max(goal.target - goal.saved, 0);
  const stats = [
    { label: 'Remaining', value: formatWholeCurrency(remaining) },
    { label: 'Target date', value: formatDate(goal.targetDate) },
    { label: 'Auto-save', value: formatAutoSave(goal.autoSave) },
  ];

  return (
    <Screen scroll contentClassName="pb-xl">
      <ScreenHeader
        title={goal.name}
        right={
          <IconButton
            icon={Pencil}
            accessibilityLabel="Edit goal"
            onPress={() =>
              showMessage('Edit goal', 'This is a demo — editing goals isn’t available yet.')
            }
          />
        }
      />

      <View className="mt-md items-center">
        <ProgressRing value={goalShare(goal)} accessibilityLabel={`${percent}% of goal saved`}>
          <Text
            variant="display"
            weight="bold"
            style={{ letterSpacing: -0.96, fontVariant: ['tabular-nums'] }}
          >
            {percent}%
          </Text>
          <Text variant="small" tone="muted">
            saved
          </Text>
        </ProgressRing>
      </View>

      <View className="mt-2.5 items-center">
        <Text
          variant="h1"
          weight="bold"
          style={{ fontSize: 24, lineHeight: 32, letterSpacing: -0.48 }}
        >
          {formatWholeCurrency(goal.saved)}
        </Text>
        <Text variant="bodySm" tone="muted" className="mt-0.5">
          of {formatWholeCurrency(goal.target)} target
        </Text>
      </View>

      <Card padded={false} className="mt-lg flex-row">
        {stats.map((stat, index) => (
          <View
            key={stat.label}
            accessible
            accessibilityLabel={`${stat.label}: ${stat.value}`}
            className={cn(
              'flex-1 items-center px-sm py-md',
              index > 0 && 'border-l border-surface-muted'
            )}
          >
            <Text variant="small" tone="muted">
              {stat.label}
            </Text>
            <Text
              variant="bodySm"
              weight="semibold"
              numberOfLines={1}
              adjustsFontSizeToFit
              className="mt-1"
            >
              {stat.value}
            </Text>
          </View>
        ))}
      </Card>

      <View className="mt-[14px] flex-row gap-md">
        <Button
          label="Withdraw"
          variant="secondary"
          className="flex-1"
          onPress={() =>
            showMessage('Withdraw', 'This is a demo — withdrawals from goals aren’t available yet.')
          }
        />
        <Button
          label="Add money"
          leadingIcon={Plus}
          className="flex-1"
          onPress={() =>
            router.push({ pathname: '/goals/[id]/add-money', params: { id: goal.id } })
          }
        />
      </View>

      <Text variant="h3" accessibilityRole="header" className="mb-2.5 mt-[20px]">
        Contributions
      </Text>
      {goal.contributions.length > 0 ? (
        <Card padded={false}>
          {goal.contributions.map((contribution, index) => (
            <ContributionRow
              key={contribution.id}
              contribution={contribution}
              divider={index < goal.contributions.length - 1}
            />
          ))}
        </Card>
      ) : (
        <Card className="items-center py-xl">
          <Text variant="bodySm" tone="muted" className="text-center">
            No contributions yet. Add money to get this goal started.
          </Text>
        </Card>
      )}
    </Screen>
  );
}

function ContributionRow({
  contribution,
  divider,
}: {
  contribution: SavingsContribution;
  divider: boolean;
}) {
  const { colors } = useTheme();
  const { label, icon: Icon } = contributionDisplay[contribution.kind];
  const interest = contribution.kind === 'interest';
  const amount = `+${formatWholeCurrency(contribution.amount)}`;
  const date = formatDate(contribution.date);

  return (
    <View
      accessible
      accessibilityLabel={`${label}, ${date}, ${amount}`}
      className={cn(
        'flex-row items-center gap-md px-lg py-[11px]',
        divider && 'border-b border-surface-muted'
      )}
    >
      <View
        className={cn(
          'h-9 w-9 items-center justify-center rounded-[10px]',
          interest ? 'bg-surface-muted' : 'bg-accent-soft'
        )}
      >
        <Icon size={16} color={interest ? colors.label : colors.accent} strokeWidth={ICON_STROKE} />
      </View>
      <View className="flex-1">
        <Text variant="bodySm" weight="medium">
          {label}
        </Text>
        <Text variant="small" tone="muted" className="mt-0.5">
          {date}
        </Text>
      </View>
      <Text
        variant="bodySm"
        weight="semibold"
        tone="accent"
        style={{ fontVariant: ['tabular-nums'] }}
      >
        {amount}
      </Text>
    </View>
  );
}
