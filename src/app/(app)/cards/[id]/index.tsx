import { useEffect, useRef, useState } from 'react';
import { View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';

import { useTheme } from '@/components/layout/ThemeProvider';
import { Screen } from '@/components/layout/Screen';
import { ScreenHeader } from '@/components/layout/ScreenHeader';
import { CardArtwork } from '@/components/money/CardArtwork';
import { Button, IconButton, KeyValueList, Text } from '@/components/ui';
import { CopyButton } from '@/components/ui/CopyButton';
import { Eye, EyeOff, SlidersVertical } from '@/constants/icons';
import { cn } from '@/lib/cn';
import { getCard } from '@/mock/cards';
import { formatWholeCurrency } from '@/utils/format';

const WEEK_LABELS = ['Wk 1', 'Wk 2', 'Wk 3', 'Wk 4'] as const;

// Design 24 — Card details.
export default function CardDetailsScreen() {
  const { colors } = useTheme();
  const { id } = useLocalSearchParams<{ id: string }>();
  const card = getCard(id);

  const [revealed, setRevealed] = useState(false);
  const revealTimer = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => () => clearTimeout(revealTimer.current), []);

  const toggleReveal = () => {
    if (revealed) {
      setRevealed(false);
      clearTimeout(revealTimer.current);
    } else {
      setRevealed(true);
      clearTimeout(revealTimer.current);
      // Auto-hide after 10 s for security.
      revealTimer.current = setTimeout(() => setRevealed(false), 10_000);
    }
  };

  if (!card) {
    return (
      <Screen>
        <ScreenHeader title="Card details" />
        <Text variant="body" tone="muted" className="mt-xl text-center">
          Card not found.
        </Text>
      </Screen>
    );
  }

  const cardTitle = card.kind === 'virtual' ? 'Virtual debit card' : 'Physical debit card';
  const maskedNumber = `•••• •••• •••• ${card.last4}`;

  const kvItems = [
    {
      label: 'Card number',
      value: (
        <View className="flex-row items-center gap-1.5">
          <Text
            variant="bodySm"
            weight="medium"
            numberOfLines={1}
            className="shrink"
            style={{ fontVariant: ['tabular-nums'] }}
          >
            {revealed ? card.fullNumber : maskedNumber}
          </Text>
          <CopyButton subject="card number" />
        </View>
      ),
    },
    {
      label: 'Expiry · CVV',
      value: `${card.expiry} · ${revealed ? card.cvv : '•••'}`,
    },
    {
      label: 'Status',
      value: (
        <View className="flex-row items-center gap-1.5">
          <View
            className={cn(
              'h-1.5 w-1.5 rounded-full',
              card.status === 'active' ? 'bg-success' : 'bg-warning'
            )}
          />
          <Text
            variant="bodySm"
            weight="medium"
            tone={card.status === 'active' ? 'success' : 'warning'}
          >
            {card.status === 'active' ? 'Active' : 'Frozen'}
          </Text>
        </View>
      ),
    },
    {
      label: 'Billing address',
      value: card.billingAddress,
    },
  ];

  return (
    <Screen edges={['top', 'bottom']} contentClassName="pb-10">
      <ScreenHeader
        title={cardTitle}
        right={
          <IconButton
            icon={revealed ? EyeOff : Eye}
            accessibilityLabel={revealed ? 'Hide card details' : 'Show card details'}
            onPress={toggleReveal}
          />
        }
      />

      {/* Card artwork */}
      <View className="mt-3" style={{ height: 210 }}>
        <CardArtwork card={card} variant="detail" revealed={revealed} />
      </View>

      {/* Key-value details */}
      <KeyValueList items={kvItems} className="mt-[16px]" />

      {/* Spent this month */}
      <View className="rounded-card mt-[14px] border border-border bg-surface p-[14px]">
        <View className="flex-row items-baseline justify-between">
          <Text variant="body" weight="semibold">
            Spent this month
          </Text>
          <Text variant="body" weight="bold" style={{ fontVariant: ['tabular-nums'] }}>
            {formatWholeCurrency(card.monthlySpend)}
          </Text>
        </View>

        {/* Weekly bars */}
        <View
          accessible={false}
          importantForAccessibility="no-hide-descendants"
          style={{
            height: 56,
            flexDirection: 'row',
            gap: 10,
            alignItems: 'flex-end',
            marginTop: 12,
          }}
        >
          {card.weeklyBars.map((h, i) => (
            <View
              key={i}
              style={{
                flex: 1,
                height: h * 56,
                borderRadius: 4,
                backgroundColor: i === card.weeklyBars.length - 1 ? colors.primary : colors.border,
              }}
            />
          ))}
        </View>

        {/* Week labels */}
        <View style={{ flexDirection: 'row', marginTop: 6 }}>
          {WEEK_LABELS.map((label, i) => (
            <Text
              key={label}
              variant="xs"
              tone={i === WEEK_LABELS.length - 1 ? 'accent' : 'muted'}
              weight={i === WEEK_LABELS.length - 1 ? 'semibold' : 'regular'}
              style={{ flex: 1, textAlign: 'center' }}
            >
              {label}
            </Text>
          ))}
        </View>
      </View>

      {/* Card controls button */}
      <View className="mt-auto pt-sm">
        <Button
          label="Card controls"
          variant="secondary"
          leadingIcon={SlidersVertical}
          fullWidth
          onPress={() => router.push({ pathname: '/cards/[id]/controls', params: { id: card.id } })}
        />
      </View>
    </Screen>
  );
}
