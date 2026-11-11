import { Pressable, View } from 'react-native';
import { router } from 'expo-router';

import { useTheme } from '@/components/layout/ThemeProvider';
import { Screen } from '@/components/layout/Screen';
import { ScreenHeader } from '@/components/layout/ScreenHeader';
import { CardArtwork } from '@/components/money/CardArtwork';
import { QuickAction } from '@/components/money/QuickAction';
import { Card, IconButton, ProgressBar, Text } from '@/components/ui';
import { Eye, ICON_STROKE, Plus, Settings, SlidersVertical, Snowflake } from '@/constants/icons';
import { cn } from '@/lib/cn';
import { showMessage } from '@/lib/notify';
import { cards, virtualCard } from '@/mock/cards';
import type { Card as CardModel } from '@/types/card';
import { formatWholeCurrency } from '@/utils/format';

function comingSoon(title: string) {
  showMessage(title, 'This is a demo — this screen is coming in a later module.');
}

// Design 23 — Cards overview.
export default function CardsScreen() {
  const { colors } = useTheme();
  const featured = virtualCard;
  const spendPercent = Math.round((featured.monthlySpend / featured.monthlyLimit) * 100);

  return (
    <Screen scroll contentClassName="pb-xl">
      <ScreenHeader
        largeTitle="Cards"
        right={
          <IconButton
            icon={Plus}
            accessibilityLabel="New card"
            onPress={() => comingSoon('New card')}
          />
        }
      />

      {/* Featured card — tappable */}
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`Virtual debit card ending ${featured.last4}, open details`}
        onPress={() => router.push({ pathname: '/cards/[id]', params: { id: featured.id } })}
        className="mt-[16px] active:opacity-90"
        style={{ height: 208 }}
      >
        <CardArtwork card={featured} variant="overview" />
      </Pressable>

      {/* Pagination dots (2 cards) */}
      <View
        accessible={false}
        importantForAccessibility="no-hide-descendants"
        className="mt-[10px] flex-row justify-center gap-[6px]"
      >
        <View style={{ width: 18, height: 6, borderRadius: 3, backgroundColor: colors.primary }} />
        <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: colors.border }} />
      </View>

      {/* Quick actions */}
      <View accessibilityLabel="Card actions" className="mt-[14px] flex-row">
        <QuickAction
          icon={Snowflake}
          label="Freeze"
          onPress={() => comingSoon('Freeze card')}
          className="flex-1"
        />
        <QuickAction
          icon={Eye}
          label="Details"
          onPress={() => router.push({ pathname: '/cards/[id]', params: { id: featured.id } })}
          className="flex-1"
        />
        <QuickAction
          icon={SlidersVertical}
          label="Limits"
          onPress={() => comingSoon('Card limits')}
          className="flex-1"
        />
        <QuickAction
          icon={Settings}
          label="Settings"
          onPress={() => comingSoon('Card settings')}
          className="flex-1"
        />
      </View>

      {/* Card spend */}
      <Card className="mt-[18px] p-[14px]">
        <View className="flex-row items-baseline justify-between">
          <Text variant="caption" tone="muted">
            Card spend · October
          </Text>
          <Text variant="caption" weight="semibold">
            {spendPercent}%
          </Text>
        </View>
        <Text
          variant="h3"
          weight="bold"
          className="mt-1"
          style={{ letterSpacing: -0.34, fontVariant: ['tabular-nums'] }}
        >
          {formatWholeCurrency(featured.monthlySpend)}{' '}
          <Text variant="caption" tone="muted">
            of {formatWholeCurrency(featured.monthlyLimit)} limit
          </Text>
        </Text>
        <ProgressBar value={featured.monthlySpend / featured.monthlyLimit} className="mt-[10px]" />
      </Card>

      {/* Your cards list */}
      <Text variant="h3" weight="semibold" className="mb-sm mt-[18px]">
        Your cards
      </Text>
      <Card padded={false} className="overflow-hidden">
        {cards.map((card, index) => (
          <CardListRow key={card.id} card={card} divider={index > 0} />
        ))}
      </Card>
    </Screen>
  );
}

type CardListRowProps = { card: CardModel; divider: boolean };

function CardListRow({ card, divider }: CardListRowProps) {
  const { colors } = useTheme();
  const isVirtual = card.kind === 'virtual';

  const onPress = isVirtual
    ? () => router.push({ pathname: '/cards/[id]', params: { id: card.id } })
    : () => comingSoon('Card controls');

  const name = isVirtual ? 'Virtual debit' : 'Physical debit';
  const meta = `•••• ${card.last4} · ${card.purpose}`;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${name}, ${meta}`}
      onPress={onPress}
      className={cn(
        'flex-row items-center gap-md px-lg py-3 active:bg-surface-hover',
        divider && 'border-t border-surface-muted'
      )}
    >
      {/* Card thumbnail tile */}
      {isVirtual ? (
        <View
          className="items-end justify-end rounded-md bg-brand"
          style={{ width: 48, height: 32, padding: 4 }}
        >
          <Text weight="bold" style={{ fontSize: 8, color: '#16A875' }}>
            v.
          </Text>
        </View>
      ) : (
        <View
          className="items-center justify-center rounded-md"
          style={{ width: 48, height: 32, backgroundColor: colors.border }}
        >
          <Snowflake size={16} color={colors.label} strokeWidth={ICON_STROKE} />
        </View>
      )}

      <View className="flex-1">
        <Text variant="body" weight="medium" numberOfLines={1}>
          {name}
        </Text>
        <Text variant="caption" tone="muted" numberOfLines={1} className="mt-0.5">
          {meta}
        </Text>
      </View>

      <CardStatusBadge status={card.status} />
    </Pressable>
  );
}

type CardStatusBadgeProps = { status: CardModel['status'] };

function CardStatusBadge({ status }: CardStatusBadgeProps) {
  const badgeClass = cn(
    'rounded-full px-2 py-px',
    status === 'active' && 'bg-success-soft',
    status === 'frozen' && 'bg-warning-soft',
    status === 'blocked' && 'bg-danger-soft'
  );
  const tone = status === 'active' ? 'success' : status === 'frozen' ? 'warning' : 'danger';
  const label = status === 'active' ? 'Active' : status === 'frozen' ? 'Frozen' : 'Blocked';

  return (
    <View className={badgeClass}>
      <Text variant="xs" weight="semibold" tone={tone}>
        {label}
      </Text>
    </View>
  );
}
