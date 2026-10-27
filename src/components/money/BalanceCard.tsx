import { useEffect, useRef, useState } from 'react';
import { Pressable, View } from 'react-native';

import { useTheme } from '@/components/layout/ThemeProvider';
import { Text } from '@/components/ui/Text';
import { ArrowDownLeft, Check, Copy, Eye, EyeOff, ICON_STROKE } from '@/constants/icons';
import { palette } from '@/constants/theme';
import { cn } from '@/lib/cn';
import { formatCurrencyParts, formatWholeCurrency } from '@/utils/format';

const HIDDEN = '₦••••••';

export type BalanceCardProps = {
  balance: number;
  /** e.g. "Vaulta Current · 0123 •• 4821" */
  accountLabel: string;
  /** Money in this month. */
  monthlyInflow: number;
  onAllAccounts: () => void;
  className?: string | undefined;
};

/**
 * Navy balance card from Home (08): hide/show balance, copy account number,
 * this month's money in and a link to all accounts. Decorative ring top right.
 * Colours are fixed on the brand surface in both themes, as in the designs.
 */
export function BalanceCard({
  balance,
  accountLabel,
  monthlyInflow,
  onAllAccounts,
  className,
}: BalanceCardProps) {
  const { colors } = useTheme();
  const [hidden, setHidden] = useState(false);
  const [copied, setCopied] = useState(false);
  const copiedTimer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const amount = formatCurrencyParts(balance);

  useEffect(() => () => clearTimeout(copiedTimer.current), []);

  // Simulated: the demo account number is fictional, so nothing is put on the clipboard.
  const copyAccountNumber = () => {
    setCopied(true);
    clearTimeout(copiedTimer.current);
    copiedTimer.current = setTimeout(() => setCopied(false), 2000);
  };

  const EyeIcon = hidden ? EyeOff : Eye;
  const CopyIcon = copied ? Check : Copy;

  return (
    <View
      accessibilityLabel="Balance"
      className={cn('overflow-hidden rounded-xl bg-brand p-gutter', className)}
    >
      <View
        accessible={false}
        importantForAccessibility="no-hide-descendants"
        className="absolute -right-[60px] -top-[70px] h-[200px] w-[200px] rounded-full border-[28px] border-brand-raised"
      />

      <View className="flex-row items-center justify-between">
        <Text variant="caption" tone="inverseMuted">
          Total balance
        </Text>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={hidden ? 'Show balance' : 'Hide balance'}
          onPress={() => setHidden((value) => !value)}
          hitSlop={6}
          className="-mr-2.5 h-8 w-11 items-center justify-center active:opacity-70"
        >
          <EyeIcon size={20} color={palette.gray[300]} strokeWidth={ICON_STROKE} />
        </Pressable>
      </View>

      <Text
        variant="display"
        tone="inverse"
        className="mt-1.5"
        style={{ fontVariant: ['tabular-nums'] }}
      >
        {hidden ? (
          HIDDEN
        ) : (
          <>
            {amount.whole}
            <Text variant="display" tone="inverseMuted">
              {amount.fraction}
            </Text>
          </>
        )}
      </Text>

      <View className="mt-1.5 flex-row items-center gap-sm">
        <Text variant="caption" className="text-gray-300">
          {accountLabel}
        </Text>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={copied ? 'Account number copied' : 'Copy account number'}
          onPress={copyAccountNumber}
          hitSlop={8}
          className="h-7 w-7 items-center justify-center active:opacity-70"
        >
          <CopyIcon
            size={15}
            color={copied ? palette.green[400] : colors['brand-muted']}
            strokeWidth={ICON_STROKE}
          />
        </Pressable>
      </View>

      <View className="mt-lg flex-row items-center justify-between border-t border-gray-700 pt-3.5">
        <View className="flex-row items-center gap-1.5">
          <View className="h-[22px] w-[22px] items-center justify-center rounded-full bg-primary">
            <ArrowDownLeft size={13} color={colors['primary-foreground']} strokeWidth={2.6} />
          </View>
          <Text variant="caption" className="text-gray-300">
            {hidden ? '₦••••' : formatWholeCurrency(monthlyInflow)} in this month
          </Text>
        </View>
        <Pressable
          accessibilityRole="link"
          onPress={onAllAccounts}
          hitSlop={8}
          className="py-1.5 active:opacity-70"
        >
          <Text variant="caption" weight="semibold" className="text-green-400">
            All accounts
          </Text>
        </Pressable>
      </View>
    </View>
  );
}
