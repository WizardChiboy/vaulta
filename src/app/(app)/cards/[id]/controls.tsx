import { useState } from 'react';
import { Pressable, View } from 'react-native';
import { useLocalSearchParams } from 'expo-router';

import { useTheme } from '@/components/layout/ThemeProvider';
import { Screen } from '@/components/layout/Screen';
import { ScreenHeader } from '@/components/layout/ScreenHeader';
import { Slider } from '@/components/forms/Slider';
import { Switch } from '@/components/forms/Switch';
import { Card, Text, TextLink } from '@/components/ui';
import {
  ArrowUpRight,
  Bell,
  ChevronRight,
  Globe,
  ICON_STROKE,
  RefreshCw,
  Snowflake,
  type LucideIcon,
} from '@/constants/icons';
import { cn } from '@/lib/cn';
import { showMessage } from '@/lib/notify';
import { getCard } from '@/mock/cards';
import type { CardControls } from '@/types/card';
import { formatDayMonth, formatWholeCurrency } from '@/utils/format';

const LIMIT_MAX = 500_000;
const LIMIT_STEP = 10_000;

function comingSoon(title: string) {
  showMessage(title, 'This is a demo — this is coming in a later module.');
}

/** "1 Dec" — monthly limits reset on the first of next month. */
function nextResetDate(now = new Date()) {
  return formatDayMonth(new Date(now.getFullYear(), now.getMonth() + 1, 1).toISOString());
}

// Design 25 — Card controls.
export default function CardControlsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const card = getCard(id);

  // Mock only: changes live on this screen until a card store/API exists.
  const [frozen, setFrozen] = useState(card?.status === 'frozen');
  const [controls, setControls] = useState<CardControls>(
    card?.controls ?? { onlinePayments: false, internationalPayments: false, notifications: false }
  );
  const [monthlyLimit, setMonthlyLimit] = useState(card?.monthlyLimit ?? 0);

  if (!card) {
    return (
      <Screen>
        <ScreenHeader largeTitle="Card controls" />
        <Text variant="body" tone="muted" className="mt-xl text-center">
          Card not found.
        </Text>
      </Screen>
    );
  }

  const setControl = (key: keyof CardControls) => (value: boolean) =>
    setControls((current) => ({ ...current, [key]: value }));

  const cardName = `${card.kind === 'virtual' ? 'Virtual' : 'Physical'} debit •••• ${card.last4}`;
  const overLimit = card.monthlySpend >= monthlyLimit;

  return (
    <Screen scroll contentClassName="pb-xl">
      <ScreenHeader largeTitle="Card controls" />

      {/* Card summary */}
      <Card padded={false} className="mt-[14px] flex-row items-center gap-md px-[14px] py-3">
        <View
          accessible={false}
          className="h-[38px] w-14 items-end justify-end rounded-[7px] bg-brand px-1.5 py-1"
        >
          <Text weight="bold" tone="accent" style={{ fontSize: 9, lineHeight: 11 }}>
            v.
          </Text>
        </View>
        <View className="flex-1">
          <Text variant="body" weight="semibold" numberOfLines={1}>
            {cardName}
          </Text>
          <Text
            variant="caption"
            weight="medium"
            tone={frozen ? 'warning' : 'success'}
            className="mt-0.5"
          >
            {frozen ? 'Frozen · payments blocked' : 'Active · all good'}
          </Text>
        </View>
      </Card>

      <SectionLabel>Security</SectionLabel>
      <Card padded={false} className="overflow-hidden">
        <ToggleRow
          icon={Snowflake}
          title="Freeze card"
          subtitle="Temporarily block all payments"
          value={frozen}
          onValueChange={setFrozen}
        />
        <ToggleRow
          icon={Globe}
          title="Online payments"
          subtitle="Web and in-app purchases"
          value={controls.onlinePayments}
          onValueChange={setControl('onlinePayments')}
          divider
        />
        <ToggleRow
          icon={ArrowUpRight}
          title="International payments"
          subtitle="Merchants outside Nigeria"
          value={controls.internationalPayments}
          onValueChange={setControl('internationalPayments')}
          divider
        />
        <ToggleRow
          icon={Bell}
          title="Card notifications"
          subtitle="Alert me for every payment"
          value={controls.notifications}
          onValueChange={setControl('notifications')}
          divider
        />
      </Card>

      <SectionLabel>Spending limits</SectionLabel>
      <Card padded={false} className="px-lg py-[14px]">
        <View className="flex-row items-baseline justify-between">
          <Text variant="body" weight="medium">
            Monthly limit
          </Text>
          <Text variant="body" weight="bold" style={{ fontVariant: ['tabular-nums'] }}>
            {formatWholeCurrency(monthlyLimit)}
          </Text>
        </View>
        <Slider
          min={0}
          max={LIMIT_MAX}
          step={LIMIT_STEP}
          value={monthlyLimit}
          // A ₦0 limit would block the card; freezing is the control for that.
          onChange={(value) => setMonthlyLimit(Math.max(value, LIMIT_STEP))}
          accessibilityLabel="Monthly limit"
          formatValue={formatWholeCurrency}
          className="mt-2.5"
        />
        <Text
          variant="small"
          tone={overLimit ? 'warning' : 'muted'}
          className="mt-1.5"
          style={{ fontVariant: ['tabular-nums'] }}
        >
          {formatWholeCurrency(card.monthlySpend)} used · {overLimit ? 'limit reached · ' : ''}
          resets {nextResetDate()}
        </Text>

        <View className="my-md h-px bg-surface-muted" />

        <View className="flex-row items-center justify-between">
          <Text variant="body" weight="medium">
            Per transaction
          </Text>
          <View className="flex-row items-center gap-sm">
            <Text variant="body" weight="semibold" style={{ fontVariant: ['tabular-nums'] }}>
              {formatWholeCurrency(card.transactionLimit)}
            </Text>
            <TextLink
              variant="body"
              accessibilityRole="button"
              accessibilityLabel="Edit per-transaction limit"
              onPress={() => comingSoon('Per-transaction limit')}
            >
              Edit
            </TextLink>
          </View>
        </View>
      </Card>

      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Replace card. Lost, stolen or damaged"
        onPress={() => comingSoon('Replace card')}
        className="mt-[14px] flex-row items-center gap-md rounded-lg border border-border bg-surface px-lg py-3 active:bg-surface-hover"
      >
        <RowIcon icon={RefreshCw} tone="danger" />
        <View className="flex-1">
          <Text variant="body" weight="medium">
            Replace card
          </Text>
          <Text variant="small" tone="muted" className="mt-0.5">
            Lost, stolen or damaged
          </Text>
        </View>
        <ChevronIcon />
      </Pressable>
    </Screen>
  );
}

function SectionLabel({ children }: { children: string }) {
  return (
    <Text
      variant="caption"
      weight="semibold"
      tone="muted"
      accessibilityRole="header"
      className="mb-sm mt-[18px]"
    >
      {children}
    </Text>
  );
}

type RowIconProps = { icon: LucideIcon; tone?: 'neutral' | 'danger' | undefined };

/** 36px rounded tile (.ic): grey for settings, soft red for destructive actions. */
function RowIcon({ icon: Icon, tone = 'neutral' }: RowIconProps) {
  const { colors } = useTheme();

  return (
    <View
      className={cn(
        'h-9 w-9 items-center justify-center rounded-[10px]',
        tone === 'danger' ? 'bg-danger-soft' : 'bg-surface-muted'
      )}
    >
      <Icon
        size={18}
        color={tone === 'danger' ? colors['danger-text'] : colors.label}
        strokeWidth={ICON_STROKE}
      />
    </View>
  );
}

function ChevronIcon() {
  const { colors } = useTheme();
  return <ChevronRight size={18} color={colors.subtle} strokeWidth={ICON_STROKE} />;
}

type ToggleRowProps = {
  icon: LucideIcon;
  title: string;
  subtitle: string;
  value: boolean;
  onValueChange: (value: boolean) => void;
  divider?: boolean | undefined;
};

function ToggleRow({ icon, title, subtitle, value, onValueChange, divider }: ToggleRowProps) {
  return (
    <View
      className={cn(
        'flex-row items-center gap-md px-lg py-3',
        divider && 'border-t border-surface-muted'
      )}
    >
      <RowIcon icon={icon} />
      <View className="flex-1">
        <Text variant="body" weight="medium">
          {title}
        </Text>
        <Text variant="small" tone="muted" className="mt-0.5">
          {subtitle}
        </Text>
      </View>
      <Switch value={value} onValueChange={onValueChange} accessibilityLabel={title} />
    </View>
  );
}
