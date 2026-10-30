import { Pressable, Share as NativeShare, View } from 'react-native';
import { useLocalSearchParams } from 'expo-router';

import { useTheme } from '@/components/layout/ThemeProvider';
import { Screen } from '@/components/layout/Screen';
import { ScreenHeader } from '@/components/layout/ScreenHeader';
import { transactionIconKey, transactionIcons } from '@/components/money/TransactionRow';
import {
  Button,
  CopyButton,
  IconButton,
  KeyValueList,
  Text,
  TextLink,
  type KeyValueItem,
} from '@/components/ui';
import { ChevronRight, CircleAlert, Download, ICON_STROKE, Share } from '@/constants/icons';
import { cn } from '@/lib/cn';
import { showMessage } from '@/lib/notify';
import { transactions } from '@/mock/transactions';
import type { Transaction, TransactionStatus } from '@/types/transaction';
import { formatCurrency, formatShortDate, formatSignedCurrency, formatTime } from '@/utils/format';

// 34px/700 hero amount sits between type-scale steps.
const amountStyle = {
  fontSize: 34,
  lineHeight: 42,
  letterSpacing: -1.02,
  fontVariant: ['tabular-nums' as const],
};

const statusStyles: Record<
  TransactionStatus,
  { label: string; container: string; dot: string; tone: 'success' | 'warning' }
> = {
  successful: {
    label: 'Successful',
    container: 'bg-success-soft',
    dot: 'bg-success',
    tone: 'success',
  },
  pending: { label: 'Pending', container: 'bg-warning-soft', dot: 'bg-warning', tone: 'warning' },
};

/** "Sun, 18 Oct 2026 · 10:24" */
function formatDateTime(iso: string) {
  return `${formatShortDate(iso)} ${new Date(iso).getFullYear()} · ${formatTime(iso)}`;
}

/** Opens the system share sheet with a plain-text summary of the transaction. */
async function shareTransaction(transaction: Transaction) {
  const message = [
    `${transaction.title}: ${formatSignedCurrency(transaction.amount)}`,
    `${statusStyles[transaction.status].label} · ${formatDateTime(transaction.occurredAt)}`,
    `Reference ${transaction.reference}`,
  ].join('\n');
  try {
    await NativeShare.share({ message });
  } catch {
    // Web browsers without the Web Share API reject; say so instead of failing silently.
    showMessage('Sharing isn’t available', 'Your device can’t open the share sheet here.');
  }
}

// Design 12 — Transaction details.
export default function TransactionDetailsScreen() {
  const { id } = useLocalSearchParams<'/transactions/[id]'>();
  const { colors } = useTheme();
  const transaction = transactions.find((item) => item.id === id);

  if (!transaction) {
    return (
      <Screen>
        <ScreenHeader title="Transaction details" />
        <Text variant="body" tone="muted" className="mt-xl text-center">
          This transaction couldn’t be found.
        </Text>
      </Screen>
    );
  }

  const incoming = transaction.amount > 0;
  const Icon = transactionIcons[transactionIconKey(transaction)];
  const status = statusStyles[transaction.status];

  const details: KeyValueItem[] = [
    { label: 'Date & time', value: formatDateTime(transaction.occurredAt) },
    {
      label: 'Category',
      value: (
        <>
          <View className="rounded-full bg-surface-muted px-2.5 py-1">
            <Text variant="caption">{transaction.categoryLabel}</Text>
          </View>
          <TextLink
            variant="caption"
            accessibilityLabel="Change category"
            onPress={() =>
              showMessage('Change category', 'This is a demo — categories can’t be changed yet.')
            }
            className="py-1.5 pl-1"
          >
            Change
          </TextLink>
        </>
      ),
    },
    { label: incoming ? 'Received via' : 'Paid with', value: transaction.channel },
    {
      label: 'Reference',
      value: (
        <>
          <Text variant="bodySm" weight="medium" style={{ fontVariant: ['tabular-nums'] }}>
            {transaction.reference}
          </Text>
          <CopyButton subject="reference" />
        </>
      ),
    },
    { label: 'Fee', value: formatCurrency(transaction.fee) },
    ...(transaction.balanceAfter === undefined
      ? []
      : [{ label: 'Balance after', value: formatCurrency(transaction.balanceAfter) }]),
  ];

  return (
    <Screen scroll contentClassName="pb-xl">
      <ScreenHeader
        title="Transaction details"
        right={
          <IconButton
            icon={Share}
            accessibilityLabel="Share"
            onPress={() => void shareTransaction(transaction)}
          />
        }
      />

      <View className="items-center pt-5">
        <View
          className={cn(
            'h-16 w-16 items-center justify-center rounded-[20px]',
            incoming ? 'bg-accent-soft' : 'bg-surface-muted'
          )}
        >
          <Icon
            size={30}
            color={incoming ? colors.accent : colors.label}
            strokeWidth={ICON_STROKE}
          />
        </View>
        <Text variant="body" weight="medium" className="mt-md">
          {transaction.title}
        </Text>
        <Text
          variant="display"
          weight="bold"
          tone={incoming ? 'accent' : 'default'}
          accessibilityRole="header"
          className="mt-1.5"
          style={amountStyle}
        >
          {formatSignedCurrency(transaction.amount)}
        </Text>
        <View
          className={cn(
            'mt-2.5 flex-row items-center gap-1.5 rounded-full px-md py-1.5',
            status.container
          )}
        >
          <View className={cn('h-1.5 w-1.5 rounded-full', status.dot)} />
          <Text variant="caption" weight="semibold" tone={status.tone}>
            {status.label}
          </Text>
        </View>
      </View>

      <KeyValueList items={details} className="mt-6" />

      <Pressable
        accessibilityRole="button"
        onPress={() =>
          showMessage('Report an issue', 'This is a demo — reporting isn’t available yet.')
        }
        className="mt-lg flex-row items-center gap-md rounded-lg border border-border bg-surface px-lg py-3.5 active:bg-surface-hover"
      >
        <View className="h-9 w-9 items-center justify-center rounded-[10px] bg-danger-soft">
          <CircleAlert size={18} color={colors['danger-text']} strokeWidth={ICON_STROKE} />
        </View>
        <View className="flex-1">
          <Text variant="bodySm" weight="semibold">
            Something wrong?
          </Text>
          <Text variant="caption" tone="muted" className="mt-0.5">
            Report an issue with this payment
          </Text>
        </View>
        <ChevronRight size={18} color={colors.subtle} strokeWidth={ICON_STROKE} />
      </Pressable>

      <View className="mt-auto flex-row gap-md pt-6">
        <Button
          label="Share"
          variant="secondary"
          leadingIcon={Share}
          onPress={() => void shareTransaction(transaction)}
          className="flex-1"
        />
        <Button
          label="Receipt"
          leadingIcon={Download}
          onPress={() => showMessage('Receipt', 'This is a demo — receipts aren’t generated yet.')}
          className="flex-1"
        />
      </View>
    </Screen>
  );
}
