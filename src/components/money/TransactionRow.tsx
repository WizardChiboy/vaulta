import { Pressable, View } from 'react-native';

import { useTheme } from '@/components/layout/ThemeProvider';
import { Text } from '@/components/ui/Text';
import {
  ArrowDownLeft,
  ArrowUpRight,
  Car,
  ICON_STROKE,
  ShoppingCart,
  type LucideIcon,
} from '@/constants/icons';
import { cn } from '@/lib/cn';
import type { Transaction, TransactionCategory } from '@/types/transaction';
import { formatSignedCurrency } from '@/utils/format';

// Transfers point in or out depending on the direction of the money.
const icons: Record<
  Exclude<TransactionCategory, 'transfer'> | 'transfer-in' | 'transfer-out',
  LucideIcon
> = {
  groceries: ShoppingCart,
  transport: Car,
  'transfer-in': ArrowDownLeft,
  'transfer-out': ArrowUpRight,
};

export type TransactionRowProps = {
  transaction: Transaction;
  onPress: () => void;
  className?: string | undefined;
};

/** Design .tx: 40px category tile, name + meta, amount on the right. Money in is green. */
export function TransactionRow({ transaction, onPress, className }: TransactionRowProps) {
  const { colors } = useTheme();
  const incoming = transaction.amount > 0;
  const Icon =
    icons[
      transaction.category === 'transfer'
        ? incoming
          ? 'transfer-in'
          : 'transfer-out'
        : transaction.category
    ];
  const amount = formatSignedCurrency(transaction.amount);
  const meta = `${transaction.categoryLabel} · ${transaction.when}`;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${transaction.title}, ${meta}, ${amount}`}
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
          {meta}
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
