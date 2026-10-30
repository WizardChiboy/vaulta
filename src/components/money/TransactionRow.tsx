import { Pressable, View } from 'react-native';

import { useTheme } from '@/components/layout/ThemeProvider';
import { Text } from '@/components/ui/Text';
import {
  ArrowDownLeft,
  ArrowUpRight,
  Car,
  ICON_STROKE,
  ShoppingCart,
  Utensils,
  Zap,
  type LucideIcon,
} from '@/constants/icons';
import { cn } from '@/lib/cn';
import type { Transaction, TransactionCategory } from '@/types/transaction';
import { formatRelativeTime, formatSignedCurrency } from '@/utils/format';

// Transfers point in or out depending on the direction of the money.
type TransactionIconKey = Exclude<TransactionCategory, 'transfer'> | 'transfer-in' | 'transfer-out';

/** Category tile icons, shared with the larger tile on Transaction details (12). */
export const transactionIcons: Record<TransactionIconKey, LucideIcon> = {
  groceries: ShoppingCart,
  transport: Car,
  food: Utensils,
  bills: Zap,
  salary: ArrowDownLeft,
  'transfer-in': ArrowDownLeft,
  'transfer-out': ArrowUpRight,
};

export function transactionIconKey(transaction: Transaction): TransactionIconKey {
  if (transaction.category !== 'transfer') return transaction.category;
  return transaction.amount > 0 ? 'transfer-in' : 'transfer-out';
}

export type TransactionRowProps = {
  transaction: Transaction;
  /** Replaces the default "Category · time" line, e.g. "Today · 10:24" (10). */
  meta?: string | undefined;
  onPress: () => void;
  className?: string | undefined;
};

/** Design .tx: 40px category tile, name + meta, amount on the right. Money in is green. */
export function TransactionRow({ transaction, meta, onPress, className }: TransactionRowProps) {
  const { colors } = useTheme();
  const incoming = transaction.amount > 0;
  const Icon = transactionIcons[transactionIconKey(transaction)];
  const amount = formatSignedCurrency(transaction.amount);
  const subtitle =
    meta ?? `${transaction.categoryLabel} · ${formatRelativeTime(transaction.occurredAt)}`;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${transaction.title}, ${subtitle}, ${amount}`}
      onPress={onPress}
      className={cn('flex-row items-center gap-md px-lg py-2.5 active:bg-surface-hover', className)}
    >
      <View
        className={cn(
          'h-10 w-10 items-center justify-center rounded-md',
          incoming ? 'bg-accent-soft' : 'bg-surface-muted'
        )}
      >
        <Icon size={20} color={incoming ? colors.accent : colors.label} strokeWidth={ICON_STROKE} />
      </View>
      <View className="flex-1">
        <Text variant="body" weight="medium" numberOfLines={1}>
          {transaction.title}
        </Text>
        <Text variant="caption" tone="muted" numberOfLines={1} className="mt-0.5">
          {subtitle}
        </Text>
      </View>
      <Text
        variant="body"
        weight="semibold"
        tone={incoming ? 'accent' : 'default'}
        className="text-right"
        style={{ fontVariant: ['tabular-nums'] }}
      >
        {amount}
      </Text>
    </Pressable>
  );
}
