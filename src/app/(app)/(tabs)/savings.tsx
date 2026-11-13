import { Pressable, View } from 'react-native';

import { useTheme } from '@/components/layout/ThemeProvider';
import { Screen } from '@/components/layout/Screen';
import { Button, ProgressBar, Text } from '@/components/ui';
import {
  Gift,
  GraduationCap,
  House,
  ICON_STROKE,
  Laptop,
  Plane,
  Plus,
  Shield,
  type LucideIcon,
} from '@/constants/icons';
import { palette } from '@/constants/theme';
import { showMessage } from '@/lib/notify';
import { savingsGoals, savingsSuggestions, savingsSummary } from '@/mock/savings';
import type { SavingsGoal, SavingsGoalIcon, SavingsSuggestion } from '@/types/savings';
import { formatCurrencyParts, formatWholeCurrency } from '@/utils/format';

const goalIcons: Record<SavingsGoalIcon, LucideIcon> = {
  shield: Shield,
  laptop: Laptop,
  plane: Plane,
  house: House,
  'graduation-cap': GraduationCap,
  gift: Gift,
};

function comingSoon(title: string) {
  showMessage(title, 'This is a demo — this screen is coming in a later module.');
}

// Design 26 — Savings.
export default function SavingsScreen() {
  const { name: themeName } = useTheme();
  const totalSaved = savingsGoals.reduce((sum, goal) => sum + goal.saved, 0);
  const total = formatCurrencyParts(totalSaved);

  return (
    <Screen scroll edges={['top']} contentClassName="pb-xl">
      {/* Title and action share one row here, unlike ScreenHeader's layout. */}
      <View className="flex-row items-center justify-between pt-2.5">
        <Text variant="h1" accessibilityRole="header">
          Savings
        </Text>
        <Button
          label="New goal"
          size="sm"
          leadingIcon={Plus}
          onPress={() => comingSoon('New savings goal')}
        />
      </View>

      {/* Total saved */}
      <View
        accessible
        accessibilityLabel={`Total saved ${formatWholeCurrency(totalSaved)}. Plus ${formatWholeCurrency(savingsSummary.addedThisMonth)} this month. ${formatWholeCurrency(savingsSummary.interestEarned)} interest earned.`}
        className="mt-lg rounded-xl border bg-accent-soft p-[18px]"
        // The design's mint border; in dark mode the tint needs no outline.
        style={{ borderColor: themeName === 'light' ? palette.green[200] : 'transparent' }}
      >
        <Text variant="caption" weight="semibold" tone="accent">
          Total saved
        </Text>
        <Text
          variant="display"
          weight="bold"
          className="mt-1"
          style={{
            fontSize: 30,
            lineHeight: 38,
            letterSpacing: -0.75,
            fontVariant: ['tabular-nums'],
          }}
        >
          {total.whole}
          <Text variant="display" weight="bold" tone="muted" style={{ fontSize: 30 }}>
            {total.fraction}
          </Text>
        </Text>
        <View className="mt-2.5 flex-row flex-wrap gap-x-lg gap-y-1">
          <Text variant="caption" tone="label">
            <Text variant="caption" weight="bold" tone="accent">
              +{formatWholeCurrency(savingsSummary.addedThisMonth)}
            </Text>{' '}
            this month
          </Text>
          <Text variant="caption" tone="label">
            {formatWholeCurrency(savingsSummary.interestEarned)} interest earned
          </Text>
        </View>
      </View>

      <Text variant="h3" accessibilityRole="header" className="mb-2.5 mt-[20px]">
        Your goals
      </Text>
      <View className="gap-2.5">
        {savingsGoals.map((goal) => (
          <GoalCard key={goal.id} goal={goal} />
        ))}
      </View>

      <Text variant="h3" accessibilityRole="header" className="mb-2.5 mt-[20px]">
        Suggested for you
      </Text>
      <View className="flex-row gap-2.5">
        {savingsSuggestions.map((suggestion) => (
          <SuggestionTile key={suggestion.id} suggestion={suggestion} />
        ))}
      </View>
    </Screen>
  );
}

function GoalCard({ goal }: { goal: SavingsGoal }) {
  const { colors } = useTheme();
  const Icon = goalIcons[goal.icon];
  const share = goal.target > 0 ? goal.saved / goal.target : 0;
  const percent = Math.round(Math.min(share, 1) * 100);
  const progress = `${formatWholeCurrency(goal.saved)} of ${formatWholeCurrency(goal.target)}`;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${goal.name}, ${progress}, ${percent}%`}
      onPress={() => comingSoon(goal.name)}
      className="rounded-lg border border-border bg-surface px-lg py-[14px] active:border-primary active:bg-surface-hover"
    >
      <View className="flex-row items-center gap-md">
        <View className="h-10 w-10 items-center justify-center rounded-md bg-accent-soft">
          <Icon size={20} color={colors.accent} strokeWidth={ICON_STROKE} />
        </View>
        <View className="flex-1">
          <Text variant="body" weight="semibold" numberOfLines={1}>
            {goal.name}
          </Text>
          <Text
            variant="caption"
            tone="muted"
            numberOfLines={1}
            className="mt-0.5"
            style={{ fontVariant: ['tabular-nums'] }}
          >
            {progress}
          </Text>
        </View>
        <Text variant="bodySm" weight="bold" tone="accent">
          {percent}%
        </Text>
      </View>
      <ProgressBar value={share} track="muted" className="mt-md" />
    </Pressable>
  );
}

function SuggestionTile({ suggestion }: { suggestion: SavingsSuggestion }) {
  const { colors } = useTheme();
  const Icon = goalIcons[suggestion.icon];

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`Start a ${suggestion.name} goal`}
      onPress={() => comingSoon('New savings goal')}
      className="flex-1 items-start gap-sm rounded-[14px] border-[1.5px] border-dashed border-border-strong p-md active:bg-surface-hover"
    >
      <View className="h-8 w-8 items-center justify-center rounded-[10px] border border-border bg-surface">
        <Icon size={16} color={colors.label} strokeWidth={ICON_STROKE} />
      </View>
      <Text variant="caption" weight="semibold" tone="label">
        {suggestion.name}
      </Text>
    </Pressable>
  );
}
