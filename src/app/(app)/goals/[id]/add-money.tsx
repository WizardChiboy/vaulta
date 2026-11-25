import { useState } from 'react';
import { Pressable, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';

import {
  applyAmountKey,
  formatAmountInput,
  NumberPad,
  type NumberPadKey,
} from '@/components/forms/NumberPad';
import { useTheme } from '@/components/layout/ThemeProvider';
import { Screen } from '@/components/layout/Screen';
import { ScreenHeader } from '@/components/layout/ScreenHeader';
import { goalIcons } from '@/components/money/goalIcons';
import { Button, Card, Text } from '@/components/ui';
import { ICON_STROKE } from '@/constants/icons';
import { cn } from '@/lib/cn';
import { fundingSources, type FundingSource } from '@/mock/funding';
import { useSavings } from '@/store/savings';
import type { FundingSourceId } from '@/types/savings';
import { goalPercent } from '@/utils/savings';

// Design 29 — Add money to savings. Continue opens the Confirm deposit sheet.
export default function AddMoneyScreen() {
  const { colors } = useTheme();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { getGoal } = useSavings();
  const goal = getGoal(id);
  const [rawAmount, setRawAmount] = useState('');
  const [sourceId, setSourceId] = useState<FundingSourceId>('acc_demo_001');

  if (!goal) {
    return (
      <Screen>
        <ScreenHeader title="Add money" />
        <Text variant="body" tone="muted" className="mt-xl text-center">
          Goal not found.
        </Text>
      </Screen>
    );
  }

  const Icon = goalIcons[goal.icon];
  const source = fundingSources.find((item) => item.id === sourceId);
  const amount = parseFloat(rawAmount) || 0;
  const insufficient = source !== undefined && amount > source.availableNaira;
  const valid = amount > 0 && !insufficient;
  const display = formatAmountInput(rawAmount) || '0';

  const handleKey = (key: NumberPadKey) =>
    setRawAmount((previous) => applyAmountKey(previous, key));

  const review = () => {
    if (!valid) return;
    router.push({
      pathname: '/goals/[id]/confirm-deposit',
      params: { id: goal.id, amount: String(amount), source: sourceId },
    });
  };

  return (
    <Screen scroll contentClassName="pb-lg">
      <ScreenHeader largeTitle="Add money" />

      <Card padded={false} className="mt-lg flex-row items-center gap-md px-[14px] py-md">
        <View className="h-10 w-10 items-center justify-center rounded-md bg-accent-soft">
          <Icon size={20} color={colors.accent} strokeWidth={ICON_STROKE} />
        </View>
        <View className="flex-1">
          <Text variant="small" tone="muted">
            To
          </Text>
          <Text variant="body" weight="semibold" numberOfLines={1}>
            {goal.name} · {goalPercent(goal)}%
          </Text>
        </View>
      </Card>

      <View className="items-center pb-sm pt-xl">
        <Text variant="caption" tone="muted">
          Amount
        </Text>
        <Text
          accessibilityLabel={`Amount: ${display} naira`}
          accessibilityLiveRegion="polite"
          className="mt-1 font-sans-bold text-foreground"
          style={{ fontSize: 40, lineHeight: 50, letterSpacing: -1.2 }}
          numberOfLines={1}
          adjustsFontSizeToFit
        >
          ₦{display}
        </Text>
        {insufficient ? (
          <Text variant="caption" tone="danger" accessibilityRole="alert" className="mt-1">
            That’s more than {source.name} can cover.
          </Text>
        ) : (
          source?.convert &&
          amount > 0 && (
            <Text variant="caption" tone="muted" className="mt-1">
              About {source.convert(amount)} from your {source.name}
            </Text>
          )
        )}
      </View>

      <Text variant="caption" weight="semibold" tone="muted" className="mb-sm mt-sm">
        From
      </Text>
      <View accessibilityRole="radiogroup" accessibilityLabel="From" className="gap-sm">
        {fundingSources.map((item) => (
          <SourceRow
            key={item.id}
            source={item}
            selected={item.id === sourceId}
            onPress={() => setSourceId(item.id)}
          />
        ))}
      </View>

      <View className="mt-auto pt-lg">
        <NumberPad onKey={handleKey} />
        <Button label="Continue" fullWidth disabled={!valid} onPress={review} className="mt-md" />
      </View>
    </Screen>
  );
}

function SourceRow({
  source,
  selected,
  onPress,
}: {
  source: FundingSource;
  selected: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      accessibilityRole="radio"
      accessibilityState={{ checked: selected }}
      accessibilityLabel={`${source.name}, balance ${source.balanceLabel}`}
      onPress={onPress}
      className={cn(
        'flex-row items-center gap-md rounded-button bg-surface px-lg active:bg-surface-hover',
        selected ? 'border-2 border-primary py-[13px]' : 'border border-border py-[14px]'
      )}
    >
      <View
        className={cn(
          'h-[22px] w-[22px] rounded-full',
          selected ? 'border-[6px] border-primary' : 'border-[1.5px] border-border-strong'
        )}
      />
      <Text variant="body" weight="medium" className="flex-1">
        {source.name}
      </Text>
      <Text variant="bodySm" tone="muted" style={{ fontVariant: ['tabular-nums'] }}>
        {source.balanceLabel}
      </Text>
    </Pressable>
  );
}
