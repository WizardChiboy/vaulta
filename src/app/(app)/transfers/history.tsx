import { useMemo, useState } from 'react';
import { Pressable, ScrollView, TextInput, View } from 'react-native';
import { router } from 'expo-router';

import { useTheme } from '@/components/layout/ThemeProvider';
import { Screen } from '@/components/layout/Screen';
import { ScreenHeader } from '@/components/layout/ScreenHeader';
import { Avatar, Card, IconButton, Text } from '@/components/ui';
import { Chip } from '@/components/ui/Chip';
import { ICON_STROKE, ListFilter, Search } from '@/constants/icons';
import { fontFamily, typeScale } from '@/constants/theme';
import { cn } from '@/lib/cn';
import { transferHistory } from '@/mock/recipients';
import { useRecipients } from '@/store/recipients';
import type { TransferHistoryItem, TransferStatus } from '@/types/recipient';
import { formatDayMonth, formatRelativeTime, formatWholeCurrency } from '@/utils/format';

type StatusFilter = 'all' | TransferStatus;

const STATUS_CHIPS: { label: string; value: StatusFilter }[] = [
  { label: 'All', value: 'all' },
  { label: 'Successful', value: 'successful' },
  { label: 'Pending', value: 'pending' },
  { label: 'Failed', value: 'failed' },
];

const STATUS_LABEL: Record<TransferStatus, string> = {
  successful: 'Successful',
  pending: 'Pending',
  failed: 'Failed · refunded',
};

type StatusBadgeProps = { status: TransferStatus };

function StatusBadge({ status }: StatusBadgeProps) {
  const badgeClass = cn(
    'self-end rounded-full px-2 py-px',
    status === 'successful' && 'bg-success-soft',
    status === 'pending' && 'bg-warning-soft',
    status === 'failed' && 'bg-danger-soft'
  );
  const textTone =
    status === 'successful' ? 'success' : status === 'pending' ? 'warning' : 'danger';

  return (
    <View className={badgeClass}>
      <Text variant="xs" weight="semibold" tone={textTone}>
        {STATUS_LABEL[status]}
      </Text>
    </View>
  );
}

// Design 22 — Transfer history.
export default function TransferHistoryScreen() {
  const { colors } = useTheme();
  const { getRecipient } = useRecipients();
  const [query, setQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [focused, setFocused] = useState(false);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return transferHistory.filter((item) => {
      if (statusFilter !== 'all' && item.status !== statusFilter) return false;
      if (!q) return true;
      const recipient = getRecipient(item.recipientId);
      const nameMatch = recipient?.fullName.toLowerCase().includes(q) ?? false;
      return nameMatch || item.reference.toLowerCase().includes(q);
    });
  }, [query, statusFilter, getRecipient]);

  const totalSent = useMemo(
    () =>
      filtered
        .filter((item) => item.status !== 'failed')
        .reduce((sum, item) => sum + item.amount, 0),
    [filtered]
  );

  const monthLabel = useMemo(() => {
    const first = filtered[0];
    if (!first) return '';
    const month = new Date(first.sentAt).toLocaleString('en-NG', { month: 'long' });
    return month;
  }, [filtered]);

  return (
    <Screen scroll edges={['top', 'bottom']} contentClassName="pb-xl">
      <ScreenHeader largeTitle="Transfer history" />

      {/* Search + filter */}
      <View className="mt-[14px] flex-row items-center gap-[10px]">
        <View className="flex-1">
          <View
            className={cn(
              'h-11 flex-row items-center rounded-md bg-surface',
              focused ? 'border-2 border-primary px-3' : 'border border-border-strong px-[13px]'
            )}
          >
            <Search size={20} color={colors.muted} strokeWidth={ICON_STROKE} />
            <TextInput
              value={query}
              onChangeText={setQuery}
              placeholder="Search name or reference"
              placeholderTextColor={colors.subtle}
              autoCorrect={false}
              autoCapitalize="none"
              returnKeyType="search"
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
              cursorColor={colors.primary}
              selectionColor={colors.primary}
              accessibilityLabel="Search transfers"
              className="h-full flex-1 px-2.5 text-foreground"
              style={{ fontFamily: fontFamily.regular, fontSize: typeScale.body[0] }}
            />
          </View>
        </View>
        <IconButton
          icon={ListFilter}
          accessibilityLabel="Filter transfers"
          onPress={() => router.push('/transactions/filter')}
        />
      </View>

      {/* Status chips */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ gap: 8, paddingVertical: 2 }}
        className="-mx-gutter mt-md px-gutter"
      >
        {STATUS_CHIPS.map(({ label, value }) => (
          <Chip
            key={value}
            label={label}
            selected={statusFilter === value}
            onPress={() => setStatusFilter(value)}
          />
        ))}
      </ScrollView>

      {/* Summary */}
      {filtered.length > 0 && (
        <Text variant="caption" tone="muted" className="mb-sm mt-lg">
          {monthLabel} · {filtered.length} transfer{filtered.length !== 1 ? 's' : ''} ·{' '}
          <Text variant="caption" weight="semibold">
            {formatWholeCurrency(totalSent)} sent
          </Text>
        </Text>
      )}

      {/* Transfer list */}
      {filtered.length > 0 ? (
        <Card padded={false} className="overflow-hidden">
          {filtered.map((item, index) => (
            <TransferRow key={item.id} item={item} divider={index > 0} />
          ))}
        </Card>
      ) : (
        <Text variant="bodySm" tone="muted" className="mt-xl text-center">
          No transfers match your search.
        </Text>
      )}
    </Screen>
  );
}

type TransferRowProps = {
  item: TransferHistoryItem;
  divider: boolean;
};

function TransferRow({ item, divider }: TransferRowProps) {
  const { getRecipient } = useRecipients();
  const recipient = getRecipient(item.recipientId);
  const name = recipient?.fullName ?? '—';
  const bank = recipient?.bank ?? '—';
  const tone = recipient?.tone ?? 'neutral';
  const isFailed = item.status === 'failed';

  const timeLabel = formatRelativeTime(item.sentAt);
  const dateSubtitle = `${bank} · ${timeLabel === 'Today' || timeLabel === 'Yesterday' ? `${timeLabel}, ${new Date(item.sentAt).toLocaleTimeString('en-NG', { hour: '2-digit', minute: '2-digit' })}` : formatDayMonth(item.sentAt)}`;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${name}, ${bank}, ${formatWholeCurrency(item.amount)}, ${STATUS_LABEL[item.status]}`}
      onPress={() => router.push({ pathname: '/transactions/[id]', params: { id: item.id } })}
      className={cn(
        'flex-row items-center gap-md px-lg py-[11px] active:bg-surface-hover',
        divider && 'border-t border-surface-muted'
      )}
    >
      <Avatar name={name} tone={tone} size="sm" />
      <View className="flex-1">
        <Text variant="body" weight="medium" numberOfLines={1}>
          {name}
        </Text>
        <Text variant="caption" tone="muted" numberOfLines={1} className="mt-0.5">
          {dateSubtitle}
        </Text>
      </View>
      <View className="items-end">
        <Text
          variant="bodySm"
          weight="semibold"
          tone={isFailed ? 'muted' : 'default'}
          style={
            isFailed ? { textDecorationLine: 'line-through' } : { fontVariant: ['tabular-nums'] }
          }
        >
          {isFailed ? '' : '−'}
          {formatWholeCurrency(item.amount)}
        </Text>
        <StatusBadge status={item.status} />
      </View>
    </Pressable>
  );
}
