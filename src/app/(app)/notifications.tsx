import { useState } from 'react';
import { Pressable, ScrollView, View } from 'react-native';
import { router } from 'expo-router';

import { useTheme } from '@/components/layout/ThemeProvider';
import { Screen } from '@/components/layout/Screen';
import { ScreenHeader } from '@/components/layout/ScreenHeader';
import { transactionIconKey, transactionIcons } from '@/components/money/TransactionRow';
import { Card, Chip, Text, TextLink } from '@/components/ui';
import {
  Bell,
  BriefcaseMedical,
  Check,
  FileText,
  ICON_STROKE,
  ShieldAlert,
  type LucideIcon,
} from '@/constants/icons';
import type { ThemeColors } from '@/constants/theme';
import { cn } from '@/lib/cn';
import { showMessage } from '@/lib/notify';
import { transactions } from '@/mock/transactions';
import { useNotifications } from '@/store/notifications';
import type { AppNotification, NotificationCategory } from '@/types/notification';
import { formatTimeAgo } from '@/utils/format';

type Filter = 'all' | 'transactions' | 'security' | 'offers';

const FILTERS: readonly { value: Filter; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'transactions', label: 'Transactions' },
  { value: 'security', label: 'Security' },
  { value: 'offers', label: 'Offers' },
];

const CATEGORY_LABELS: Record<NotificationCategory, string> = {
  transactions: 'Transactions',
  security: 'Security',
  savings: 'Savings',
  insights: 'Insights',
  offers: 'Offers',
};

const CATEGORY_ICONS: Record<NotificationCategory, LucideIcon> = {
  transactions: Bell,
  security: ShieldAlert,
  savings: BriefcaseMedical,
  insights: FileText,
  offers: Bell,
};

// Icon tile colours: green for money in, amber for security, grey otherwise.
const TILE_TONES = {
  accent: { tile: 'bg-accent-soft', icon: 'accent' },
  warning: { tile: 'bg-warning-soft', icon: 'warning-text' },
  neutral: { tile: 'bg-surface-muted', icon: 'label' },
} as const satisfies Record<string, { tile: string; icon: keyof ThemeColors }>;

/** "Today" · "Earlier this week" · "Older" */
function groupTitle(iso: string, now = new Date()) {
  const date = new Date(iso);
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  if (date.getTime() >= startOfToday) return 'Today';
  return startOfToday - date.getTime() < 6 * 86_400_000 ? 'Earlier this week' : 'Older';
}

function groupNotifications(items: readonly AppNotification[]) {
  const groups: { title: string; items: AppNotification[] }[] = [];
  for (const item of items) {
    const title = groupTitle(item.createdAt);
    const last = groups[groups.length - 1];
    if (last?.title === title) last.items.push(item);
    else groups.push({ title, items: [item] });
  }
  return groups;
}

/** Destinations whose screens aren't built yet. */
function comingSoon(title: string) {
  showMessage(title, 'This is a demo — this screen is coming in a later module.');
}

function open(notification: AppNotification) {
  const { transactionId } = notification;
  if (transactionId) {
    router.push({ pathname: '/transactions/[id]', params: { id: transactionId } });
    return;
  }
  const destinations: Record<NotificationCategory, string> = {
    transactions: 'Transactions',
    security: 'Security settings',
    savings: 'Savings goal',
    insights: 'Monthly report',
    offers: 'Offers',
  };
  comingSoon(destinations[notification.category]);
}

// Design 15 — Notifications.
export default function NotificationsScreen() {
  const { notifications, unreadCount, markRead, markAllRead } = useNotifications();
  const [filter, setFilter] = useState<Filter>('all');
  const visible =
    filter === 'all' ? notifications : notifications.filter((item) => item.category === filter);
  const groups = groupNotifications(visible);

  return (
    <Screen scroll contentClassName="pb-xl">
      <ScreenHeader
        largeTitle="Notifications"
        right={
          unreadCount > 0 ? (
            <TextLink accessibilityRole="button" onPress={markAllRead} className="py-md">
              Mark all as read
            </TextLink>
          ) : undefined
        }
      />

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        className="-mx-gutter mt-3.5 flex-grow-0"
        contentContainerClassName="gap-sm px-gutter"
      >
        {FILTERS.map((option) => (
          <Chip
            key={option.value}
            label={option.label}
            count={option.value === 'all' ? unreadCount : undefined}
            accessibilityLabel={
              option.value === 'all' && unreadCount > 0
                ? `All, ${unreadCount} unread`
                : option.label
            }
            selected={filter === option.value}
            onPress={() => setFilter(option.value)}
          />
        ))}
      </ScrollView>

      {groups.map((group) => (
        <View key={group.title}>
          <Text
            variant="caption"
            weight="semibold"
            tone="muted"
            accessibilityRole="header"
            className="mb-sm mt-lg"
          >
            {group.title}
          </Text>
          <Card padded={false} className="overflow-hidden">
            {group.items.map((item, index) => (
              <NotificationRow
                key={item.id}
                notification={item}
                divider={index > 0}
                onPress={() => {
                  markRead(item.id);
                  open(item);
                }}
              />
            ))}
          </Card>
        </View>
      ))}

      {groups.length === 0 ? (
        <Text variant="bodySm" tone="muted" className="mt-xl text-center">
          No notifications in {FILTERS.find((option) => option.value === filter)?.label} yet.
        </Text>
      ) : (
        <CaughtUp />
      )}
    </Screen>
  );
}

type NotificationRowProps = {
  notification: AppNotification;
  divider: boolean;
  onPress: () => void;
};

function NotificationRow({ notification, divider, onPress }: NotificationRowProps) {
  const { colors } = useTheme();
  const transaction = notification.transactionId
    ? transactions.find((item) => item.id === notification.transactionId)
    : undefined;
  const Icon = transaction
    ? transactionIcons[transactionIconKey(transaction)]
    : CATEGORY_ICONS[notification.category];
  const tone =
    transaction && transaction.amount > 0
      ? TILE_TONES.accent
      : notification.category === 'security'
        ? TILE_TONES.warning
        : TILE_TONES.neutral;
  const meta = `${CATEGORY_LABELS[notification.category]} · ${formatTimeAgo(notification.createdAt)}`;
  const unread = !notification.read;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${unread ? 'Unread. ' : ''}${notification.message}. ${meta}`}
      onPress={onPress}
      className={cn(
        'flex-row gap-md px-lg py-md active:bg-surface-hover',
        divider && 'border-t border-surface-muted'
      )}
    >
      <View className={cn('h-10 w-10 items-center justify-center rounded-md', tone.tile)}>
        <Icon size={20} color={colors[tone.icon]} strokeWidth={ICON_STROKE} />
      </View>
      <View className={cn('flex-1', unread && 'pr-lg')}>
        <Text
          variant="bodySm"
          weight={unread ? 'medium' : 'regular'}
          tone={unread ? 'default' : 'label'}
          style={{ lineHeight: 20 }}
        >
          {notification.message}
        </Text>
        <Text variant="small" tone="muted" className="mt-1">
          {meta}
        </Text>
      </View>
      {unread && <View className="absolute right-lg top-[18px] h-2 w-2 rounded-full bg-primary" />}
    </Pressable>
  );
}

function CaughtUp() {
  const { colors } = useTheme();

  return (
    <View className="mt-lg items-center gap-1.5 rounded-lg border-[1.5px] border-dashed border-border-strong p-5">
      <View className="h-11 w-11 items-center justify-center rounded-full bg-accent-soft">
        <Check size={22} color={colors.accent} strokeWidth={ICON_STROKE} />
      </View>
      <Text variant="body" weight="semibold" className="mt-1 text-center">
        You’re all caught up
      </Text>
      <Text variant="caption" tone="muted" className="text-center">
        Notifications older than 90 days are cleared.
      </Text>
    </View>
  );
}
