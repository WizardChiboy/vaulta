import type { ReactNode } from 'react';
import { Pressable, View } from 'react-native';
import { router } from 'expo-router';

import { useTheme } from '@/components/layout/ThemeProvider';
import { Screen } from '@/components/layout/Screen';
import { ScreenHeader } from '@/components/layout/ScreenHeader';
import { Avatar, Card, IconButton, Text, TextLink } from '@/components/ui';
import { ICON_STROKE, Landmark, Plus, RotateCcwClock } from '@/constants/icons';
import { cn } from '@/lib/cn';
import { currentAccount } from '@/mock/accounts';
import { recentTransfers } from '@/mock/recipients';
import { useRecipients } from '@/store/recipients';
import type { Recipient } from '@/types/recipient';
import { formatCurrency, formatDayMonth, formatWholeCurrency } from '@/utils/format';

/** Saved recipients that fit beside "Add new" in one row. */
const SHORTCUT_COUNT = 4;

// Design 16 — Transfer.
export default function TransferScreen() {
  const { colors } = useTheme();
  const { recipients, getRecipient } = useRecipients();

  return (
    <Screen scroll edges={['top']} contentClassName="pb-xl">
      <ScreenHeader
        largeTitle="Transfer"
        back={false}
        right={
          <IconButton
            icon={RotateCcwClock}
            accessibilityLabel="Transfer history"
            onPress={() => router.push('/transfers/history')}
          />
        }
      />

      <Text variant="bodySm" tone="muted" className="mt-1">
        Available:{' '}
        <Text variant="bodySm" weight="semibold">
          {formatCurrency(currentAccount.balance)}
        </Text>
      </Text>

      <View className="mt-[18px] flex-row gap-md">
        <TransferOption
          title="Bank transfer"
          description="To any Nigerian bank account"
          tile={
            <View className="h-11 w-11 items-center justify-center rounded-md bg-brand">
              <Landmark size={22} color={colors['brand-foreground']} strokeWidth={ICON_STROKE} />
            </View>
          }
          onPress={() => router.push('/transfers/recipient')}
        />
        <TransferOption
          title="Vaulta to Vaulta"
          description="Instant and free, by @tag or phone"
          tile={
            <View className="h-11 w-11 items-center justify-center rounded-md bg-primary">
              <Text
                variant="body"
                weight="bold"
                tone="primary"
                style={{ letterSpacing: -0.6 }}
                accessible={false}
              >
                v.
              </Text>
            </View>
          }
          onPress={() => router.push('/transfers/recipient')}
        />
      </View>

      <View className="mt-[22px] flex-row items-center justify-between">
        <Text variant="h3" accessibilityRole="header">
          Saved recipients
        </Text>
        <TextLink onPress={() => router.push('/transfers/recipient')}>See all</TextLink>
      </View>

      <View className="mt-md flex-row justify-between">
        <RecipientShortcut
          label="Add new"
          accessibilityLabel="Add new recipient"
          avatar={<Avatar name="Add new recipient" size="lg" tone="add" icon={Plus} />}
          onPress={() => router.push('/transfers/add-recipient')}
        />
        {recipients.slice(0, SHORTCUT_COUNT).map((recipient) => (
          <RecipientShortcut
            key={recipient.id}
            label={recipient.shortName}
            accessibilityLabel={`Send to ${recipient.fullName}`}
            avatar={<Avatar name={recipient.fullName} size="lg" tone={recipient.tone} />}
            onPress={() =>
              router.push({ pathname: '/transfers/amount', params: { recipientId: recipient.id } })
            }
          />
        ))}
      </View>

      <Text variant="h3" accessibilityRole="header" className="mb-2.5 mt-xl">
        Recent
      </Text>

      <Card padded={false} className="overflow-hidden">
        {recentTransfers.map((transfer, index) => {
          const recipient = getRecipient(transfer.recipientId);
          if (!recipient) return null;
          return (
            <RecentRow
              key={transfer.id}
              recipient={recipient}
              amount={formatWholeCurrency(transfer.amount)}
              date={formatDayMonth(transfer.sentAt)}
              divider={index > 0}
              onPress={() =>
                router.push({
                  pathname: '/transfers/amount',
                  params: { recipientId: transfer.recipientId },
                })
              }
            />
          );
        })}
      </Card>
    </Screen>
  );
}

type TransferOptionProps = {
  title: string;
  description: string;
  tile: ReactNode;
  onPress: () => void;
};

function TransferOption({ title, description, tile, onPress }: TransferOptionProps) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${title}. ${description}`}
      onPress={onPress}
      className="flex-1 gap-md rounded-lg border border-border bg-surface p-lg active:border-primary active:bg-surface-hover"
    >
      {tile}
      <View>
        <Text variant="body" weight="semibold">
          {title}
        </Text>
        <Text variant="caption" tone="muted" className="mt-1" style={{ lineHeight: 18 }}>
          {description}
        </Text>
      </View>
    </Pressable>
  );
}

type RecipientShortcutProps = {
  label: string;
  accessibilityLabel: string;
  avatar: ReactNode;
  onPress: () => void;
};

function RecipientShortcut({ label, accessibilityLabel, avatar, onPress }: RecipientShortcutProps) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      onPress={onPress}
      className="w-[60px] items-center gap-1.5 active:opacity-70"
    >
      {avatar}
      <Text variant="small" weight="medium" tone="label" numberOfLines={1} className="text-center">
        {label}
      </Text>
    </Pressable>
  );
}

type RecentRowProps = {
  recipient: Recipient;
  amount: string;
  date: string;
  divider: boolean;
  onPress: () => void;
};

function RecentRow({ recipient, amount, date, divider, onPress }: RecentRowProps) {
  const subtitle = `${recipient.bank} · ${recipient.maskedAccount}`;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${recipient.fullName}, ${subtitle}, ${amount} on ${date}`}
      onPress={onPress}
      className={cn(
        'flex-row items-center gap-md px-lg py-2.5 active:bg-surface-hover',
        divider && 'border-t border-surface-muted'
      )}
    >
      <Avatar name={recipient.fullName} size="sm" tone={recipient.tone} />
      <View className="flex-1">
        <Text variant="body" weight="medium" numberOfLines={1}>
          {recipient.fullName}
        </Text>
        <Text variant="caption" tone="muted" numberOfLines={1} className="mt-0.5">
          {subtitle}
        </Text>
      </View>
      <View className="items-end">
        <Text variant="bodySm" weight="semibold" style={{ fontVariant: ['tabular-nums'] }}>
          {amount}
        </Text>
        <Text variant="small" tone="muted" className="mt-0.5">
          {date}
        </Text>
      </View>
    </Pressable>
  );
}
