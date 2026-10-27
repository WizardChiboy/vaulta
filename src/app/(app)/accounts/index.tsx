import type { ReactNode } from 'react';
import { Pressable, View } from 'react-native';

import { Screen } from '@/components/layout/Screen';
import { ScreenHeader } from '@/components/layout/ScreenHeader';
import { useTheme } from '@/components/layout/ThemeProvider';
import { Badge, Card, IconButton, Text } from '@/components/ui';
import {
  ArrowUpRight,
  BriefcaseMedical,
  ICON_STROKE,
  Plus,
  type LucideIcon,
} from '@/constants/icons';
import { showMessage } from '@/lib/notify';
import { accounts } from '@/mock/accounts';
import type { Account } from '@/types/account';
import { formatCurrency, formatUsd, formatWholeCurrency } from '@/utils/format';

// 22px/700 account balances sit between type-scale steps.
const balanceStyle = { fontSize: 22, lineHeight: 28, letterSpacing: -0.44 };

/** For destinations whose screens aren't built yet. */
function comingSoon(title: string) {
  showMessage(title, 'This is a demo — this screen is coming in a later module.');
}

function openNewAccount() {
  showMessage('Open a new account', 'This is a demo — new accounts aren’t available yet.');
}

// Design 09 — Accounts.
export default function AccountsScreen() {
  const { colors } = useTheme();
  const nairaTotal = accounts.reduce(
    (sum, account) => (account.currency === 'NGN' ? sum + account.balance : sum),
    0
  );
  const usdTotal = accounts.reduce(
    (sum, account) => (account.currency === 'USD' ? sum + account.balance : sum),
    0
  );

  return (
    <Screen scroll contentClassName="pb-xl">
      <ScreenHeader
        largeTitle="Accounts"
        right={
          <IconButton
            icon={Plus}
            accessibilityLabel="Open a new account"
            onPress={openNewAccount}
          />
        }
      />

      <View className="mt-lg flex-row items-end justify-between">
        <View>
          <Text variant="caption" tone="muted">
            Total in Naira
          </Text>
          <Text
            variant="h2"
            weight="bold"
            className="mt-xs"
            style={{ letterSpacing: -0.4, fontVariant: ['tabular-nums'] }}
          >
            {formatCurrency(nairaTotal)}
          </Text>
        </View>
        {usdTotal > 0 && (
          <Text variant="caption" tone="muted">
            + {formatUsd(usdTotal)} USD
          </Text>
        )}
      </View>

      <View className="mt-lg gap-md">
        {accounts.map((account) => (
          <AccountCard key={account.id} account={account} />
        ))}

        <Pressable
          accessibilityRole="button"
          onPress={openNewAccount}
          className="h-[60px] flex-row items-center justify-center gap-sm rounded-lg border-[1.5px] border-dashed border-border-strong active:bg-surface-hover"
        >
          <Plus size={20} color={colors.label} strokeWidth={ICON_STROKE} />
          <Text variant="body" weight="semibold" tone="label">
            Open a new account
          </Text>
        </Pressable>
      </View>
    </Screen>
  );
}

/** Design .ac: icon tile, name + meta, optional tag, balance, action buttons. */
function AccountCard({ account }: { account: Account }) {
  const { colors } = useTheme();

  switch (account.kind) {
    case 'current':
      return (
        <AccountCardFrame
          tile={
            <View className="h-10 w-10 items-center justify-center rounded-md bg-brand">
              <Text variant="caption" weight="bold" tone="inverse" style={{ letterSpacing: -0.52 }}>
                v.
              </Text>
            </View>
          }
          name={account.name}
          meta={`${account.maskedNumber} · ${account.currency}`}
          badge={account.primary ? <Badge label="Primary" tone="accent" /> : null}
          balance={formatCurrency(account.balance)}
        >
          <View className="mt-3.5 flex-row gap-sm">
            <AccountAction
              label="Transfer"
              icon={ArrowUpRight}
              onPress={() => comingSoon('Transfer')}
            />
            <AccountAction label="Add money" icon={Plus} onPress={() => comingSoon('Add money')} />
            <AccountAction label="Details" onPress={() => comingSoon('Account details')} />
          </View>
        </AccountCardFrame>
      );
    case 'savings':
      return (
        <AccountCardFrame
          tile={
            <View className="h-10 w-10 items-center justify-center rounded-md bg-accent-soft">
              <BriefcaseMedical size={20} color={colors.accent} strokeWidth={ICON_STROKE} />
            </View>
          }
          name={account.name}
          meta={`${account.activeGoals} active goals · ${account.currency}`}
          badge={<Badge label={`${account.interestRatePercent}% p.a.`} />}
          balance={formatCurrency(account.balance)}
        >
          <View className="mt-3.5 flex-row gap-sm">
            <AccountAction label="Add money" icon={Plus} onPress={() => comingSoon('Add money')} />
            <AccountAction label="View goals" onPress={() => comingSoon('Savings goals')} />
          </View>
        </AccountCardFrame>
      );
    case 'wallet':
      return (
        <AccountCardFrame
          tile={
            <View className="h-10 w-10 items-center justify-center rounded-md bg-surface-muted">
              <Text variant="bodyLg" weight="bold" tone="label">
                $
              </Text>
            </View>
          }
          name={account.name}
          meta={`${account.currency} · ${account.purpose}`}
          balance={formatUsd(account.balance)}
        >
          <Text variant="small" tone="muted" className="mt-0.5">
            ≈ {formatWholeCurrency(account.balance * account.nairaRate)} at{' '}
            {formatCurrency(account.nairaRate)} / $1
          </Text>
        </AccountCardFrame>
      );
  }
}

type AccountCardFrameProps = {
  tile: ReactNode;
  name: string;
  meta: string;
  badge?: ReactNode | undefined;
  balance: string;
  children?: ReactNode | undefined;
};

function AccountCardFrame({ tile, name, meta, badge, balance, children }: AccountCardFrameProps) {
  return (
    <Card>
      <View className="flex-row items-center gap-md">
        {tile}
        <View className="flex-1">
          <Text variant="body" weight="semibold" accessibilityRole="header">
            {name}
          </Text>
          <Text variant="caption" tone="muted" className="mt-0.5">
            {meta}
          </Text>
        </View>
        {badge}
      </View>
      <Text
        variant="h2"
        weight="bold"
        className="mt-3.5"
        style={[balanceStyle, { fontVariant: ['tabular-nums'] }]}
      >
        {balance}
      </Text>
      {children}
    </Card>
  );
}

type AccountActionProps = {
  label: string;
  icon?: LucideIcon | undefined;
  onPress: () => void;
};

/** Design .acts button: 40px, 10px radius, bordered, 13px/600 label. */
function AccountAction({ label, icon: Icon, onPress }: AccountActionProps) {
  const { colors } = useTheme();

  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      className="h-10 flex-1 flex-row items-center justify-center gap-1.5 rounded-[10px] border border-border bg-surface-hover active:opacity-70"
    >
      {Icon && <Icon size={16} color={colors.foreground} strokeWidth={ICON_STROKE} />}
      <Text variant="caption" weight="semibold">
        {label}
      </Text>
    </Pressable>
  );
}
