import { View } from 'react-native';
import { useLocalSearchParams } from 'expo-router';

import { Screen } from '@/components/layout/Screen';
import { ScreenHeader } from '@/components/layout/ScreenHeader';
import { QuickAction } from '@/components/money/QuickAction';
import { TransactionRow } from '@/components/money/TransactionRow';
import {
  Card,
  CopyButton,
  IconButton,
  KeyValueList,
  Text,
  TextLink,
  type KeyValueItem,
} from '@/components/ui';
import { ArrowUpRight, EllipsisVertical, FileText, Plus } from '@/constants/icons';
import { showMessage } from '@/lib/notify';
import { accounts } from '@/mock/accounts';
import { transactions } from '@/mock/transactions';
import { demoUser } from '@/mock/user';
import { useSession } from '@/store/session';
import type { Account } from '@/types/account';
import {
  formatCurrency,
  formatCurrencyParts,
  formatDate,
  formatDayLabel,
  formatTime,
  formatUsd,
} from '@/utils/format';

// 34px/700 hero balance sits between type-scale steps.
const balanceStyle = {
  fontSize: 34,
  lineHeight: 42,
  letterSpacing: -1.02,
  fontVariant: ['tabular-nums' as const],
};

const RECENT_COUNT = 2;

/** For destinations whose screens aren't built yet. */
function comingSoon(title: string) {
  showMessage(title, 'This is a demo — this screen is coming in a later module.');
}

function formatMoney(amount: number, currency: Account['currency']) {
  return currency === 'USD' ? formatUsd(amount) : formatCurrency(amount);
}

// Design 10 — Account details.
export default function AccountDetailsScreen() {
  const { id } = useLocalSearchParams<'/accounts/[id]'>();
  const { user } = useSession();
  const account = accounts.find((item) => item.id === id);

  if (!account) {
    return (
      <Screen>
        <ScreenHeader title="Account" />
        <Text variant="body" tone="muted" className="mt-xl text-center">
          This account couldn’t be found.
        </Text>
      </Screen>
    );
  }

  const activity = transactions.filter((transaction) => transaction.accountId === account.id);
  const pending = activity.filter((transaction) => transaction.status === 'pending');
  // Pending debits are held off the available balance but not yet off the ledger.
  const ledgerBalance =
    account.balance - pending.reduce((sum, transaction) => sum + transaction.amount, 0);
  const balance = formatCurrencyParts(
    account.balance,
    account.currency,
    account.currency === 'USD' ? 'en-US' : 'en-NG'
  );

  const info: KeyValueItem[] = [
    { label: 'Account name', value: user?.fullName ?? demoUser.fullName },
    ...(account.kind === 'current'
      ? [
          {
            label: 'Account number',
            value: (
              <>
                <Text variant="bodySm" weight="medium">
                  {account.maskedNumber}
                </Text>
                <CopyButton subject="account number" />
              </>
            ),
          },
        ]
      : []),
    { label: 'Bank', value: account.bank },
    { label: 'Account type', value: account.typeLabel },
    { label: 'Opened', value: formatDate(account.openedOn) },
  ];

  return (
    <Screen scroll contentClassName="pb-xl">
      <ScreenHeader
        title={account.name}
        right={
          <IconButton
            icon={EllipsisVertical}
            accessibilityLabel="More options"
            onPress={() =>
              showMessage('More options', 'This is a demo — account options aren’t available yet.')
            }
          />
        }
      />

      <View className="items-center pt-lg">
        <Text variant="caption" tone="muted">
          Available balance
        </Text>
        <Text variant="display" weight="bold" className="mt-1.5" style={balanceStyle}>
          {balance.whole}
          <Text variant="display" weight="bold" tone="subtle" style={balanceStyle}>
            {balance.fraction}
          </Text>
        </Text>
        <Text variant="caption" tone="muted" className="mt-1.5">
          Ledger balance {formatMoney(ledgerBalance, account.currency)}
          {pending.length > 0 && ` · ${pending.length} pending`}
        </Text>
      </View>

      <View accessibilityLabel="Account actions" className="mt-5 flex-row px-4">
        <QuickAction
          icon={ArrowUpRight}
          label="Transfer"
          onPress={() => comingSoon('Transfer')}
          className="flex-1"
        />
        <QuickAction
          icon={Plus}
          label="Add money"
          onPress={() => comingSoon('Add money')}
          className="flex-1"
        />
        <QuickAction
          icon={FileText}
          label="Statement"
          onPress={() => comingSoon('Statement')}
          className="flex-1"
        />
      </View>

      <Text variant="h3" accessibilityRole="header" className="mb-2.5 mt-6">
        Account information
      </Text>
      <KeyValueList items={info} />

      <View className="mb-2.5 mt-[22px] flex-row items-center justify-between">
        <Text variant="h3" accessibilityRole="header">
          Recent activity
        </Text>
        {activity.length > 0 && (
          <TextLink onPress={() => comingSoon('Transactions')}>See all</TextLink>
        )}
      </View>
      <Card padded={false} className="overflow-hidden py-1">
        {activity.length > 0 ? (
          activity
            .slice(0, RECENT_COUNT)
            .map((transaction) => (
              <TransactionRow
                key={transaction.id}
                transaction={transaction}
                meta={`${formatDayLabel(transaction.occurredAt)} · ${formatTime(transaction.occurredAt)}`}
                onPress={() => comingSoon('Transaction details')}
              />
            ))
        ) : (
          <Text variant="bodySm" tone="muted" className="px-lg py-md text-center">
            No activity on this account yet.
          </Text>
        )}
      </Card>
    </Screen>
  );
}
