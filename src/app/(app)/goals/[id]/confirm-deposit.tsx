import { useState, type ReactNode } from 'react';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';

import { useTheme } from '@/components/layout/ThemeProvider';
import { Button, Text } from '@/components/ui';
import { BriefcaseMedical, ICON_STROKE } from '@/constants/icons';
import { simulateRequest } from '@/lib/mock';
import { getFundingSource } from '@/mock/funding';
import { useSavings } from '@/store/savings';
import { formatCurrency, formatWholeCurrency } from '@/utils/format';
import { goalPercent, goalShare } from '@/utils/savings';

// Design 29 — Confirm deposit, a sheet sized to its content over Add money.
export default function ConfirmDepositScreen() {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<{ id: string; amount: string; source: string }>();
  const { getGoal, addMoney } = useSavings();
  const [submitting, setSubmitting] = useState(false);

  const goal = getGoal(params.id);
  const source = getFundingSource(params.source);
  const amount = Number(params.amount) || 0;

  // Nothing sensible to confirm (e.g. opened from a stale link): show a way out only.
  if (!goal || !source || amount <= 0) {
    return (
      <View className="bg-surface px-gutter pt-xl" style={{ paddingBottom: insets.bottom + 24 }}>
        <Text variant="body" tone="muted" className="text-center">
          This deposit can’t be confirmed.
        </Text>
        <Button label="Close" variant="secondary" className="mt-lg" onPress={() => router.back()} />
      </View>
    );
  }

  const after = { saved: goal.saved + amount, target: goal.target };
  const newPercent = goalPercent(after);

  const confirm = async () => {
    setSubmitting(true);
    await simulateRequest(null);
    addMoney(goal.id, amount);
    // Close the sheet and Add money together, back to the goal.
    router.dismissTo({ pathname: '/goals/[id]', params: { id: goal.id } });
  };

  return (
    <View className="bg-surface px-gutter" style={{ paddingBottom: insets.bottom + 24 }}>
      <View className="mt-2.5 h-[5px] w-10 self-center rounded-full bg-border-strong" />

      <View className="mt-[18px] h-12 w-12 items-center justify-center rounded-button bg-accent-soft">
        <BriefcaseMedical size={24} color={colors.accent} strokeWidth={ICON_STROKE} />
      </View>
      <Text
        variant="h2"
        weight="bold"
        accessibilityRole="header"
        className="mt-[14px]"
        style={{ fontSize: 22, lineHeight: 28, letterSpacing: -0.44 }}
      >
        Confirm deposit
      </Text>
      <Text variant="bodySm" tone="muted" className="mt-1">
        Money moves instantly and starts earning today.
      </Text>

      <View className="mt-[14px] border-y border-surface-muted py-1">
        <Row label="From" value={source.detail} />
        <Row label="To" value={goal.name} />
        <Row
          label="Amount"
          value={
            source.convert
              ? `${formatCurrency(amount)} (${source.convert(amount)})`
              : formatCurrency(amount)
          }
          strong
        />
        <Row
          label="New progress"
          accessibilityValue={`${newPercent}%`}
          value={
            <View className="flex-row items-center gap-sm">
              <View className="h-1.5 w-16 overflow-hidden rounded-full bg-accent-soft">
                <View
                  className="h-1.5 rounded-full bg-primary"
                  style={{ width: `${Math.round(goalShare(after) * 100)}%` }}
                />
              </View>
              <Text variant="bodySm" weight="medium">
                {newPercent}%
              </Text>
            </View>
          }
        />
      </View>

      <View className="mt-[20px] flex-row gap-md">
        <Button
          label="Cancel"
          variant="secondary"
          className="flex-1"
          disabled={submitting}
          onPress={() => router.back()}
        />
        <Button
          label={`Confirm ${formatWholeCurrency(amount)}`}
          className="flex-[2]"
          loading={submitting}
          onPress={() => void confirm()}
        />
      </View>
    </View>
  );
}

function Row({
  label,
  value,
  strong = false,
  accessibilityValue,
}: {
  label: string;
  value: ReactNode;
  strong?: boolean | undefined;
  /** Spoken value when `value` is a visual (e.g. a progress bar). */
  accessibilityValue?: string | undefined;
}) {
  const spoken = accessibilityValue ?? (typeof value === 'string' ? value : '');
  return (
    <View
      accessible
      accessibilityLabel={`${label}: ${spoken}`}
      className="flex-row items-center justify-between gap-md py-2.5"
    >
      <Text variant="bodySm" tone="muted">
        {label}
      </Text>
      {typeof value === 'string' ? (
        <Text
          variant="bodySm"
          weight={strong ? 'bold' : 'medium'}
          className="flex-shrink text-right"
          style={{ fontVariant: ['tabular-nums'] }}
        >
          {value}
        </Text>
      ) : (
        value
      )}
    </View>
  );
}
