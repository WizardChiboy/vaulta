import { Pressable, View } from 'react-native';
import { router } from 'expo-router';

import { Screen } from '@/components/layout/Screen';
import { BalanceCard } from '@/components/money/BalanceCard';
import { QuickAction } from '@/components/money/QuickAction';
import { TransactionRow } from '@/components/money/TransactionRow';
import { Avatar, Card, IconButton, ProgressBar, Text, TextLink } from '@/components/ui';
import { ArrowUpRight, Bell, BriefcaseMedical, CreditCard, Plus } from '@/constants/icons';
import { cn } from '@/lib/cn';
import { showMessage } from '@/lib/notify';
import { currentAccount } from '@/mock/accounts';
import { dashboard, recentTransactions } from '@/mock/dashboard';
import { demoUser } from '@/mock/user';
import { useSession } from '@/store/session';
import { firstName, formatThousands, formatWholeCurrency } from '@/utils/format';

const UNREAD_NOTIFICATIONS = 3;

// 18px/700 summary figures sit between type-scale steps.
const statAmountStyle = { fontSize: 18, lineHeight: 24, letterSpacing: -0.18 };

function greeting(date = new Date()) {
  const hour = date.getHours();
  if (hour < 12) return 'Good morning,';
  if (hour < 17) return 'Good afternoon,';
  return 'Good evening,';
}

/** For destinations whose screens aren't built yet. */
function comingSoon(title: string) {
  showMessage(title, 'This is a demo — this screen is coming in a later module.');
}

// Design 08 — Home.
export default function HomeScreen() {
  const { user } = useSession();
  const fullName = user?.fullName ?? demoUser.fullName;
  const { spending, featuredGoal } = dashboard;
  const spentShare = spending.spent / spending.budget;
  const goalShare = featuredGoal.saved / featuredGoal.target;

  return (
    <Screen scroll edges={['top']} contentClassName="pb-xl">
      <View className="h-[60px] flex-row items-center gap-md">
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Profile"
          onPress={() => comingSoon('Profile')}
          className="active:opacity-70"
        >
          <Avatar name={fullName} />
        </Pressable>
        <View className="flex-1">
          <Text variant="caption" tone="muted">
            {greeting()}
          </Text>
          <Text
            variant="h3"
            weight="semibold"
            accessibilityRole="header"
            numberOfLines={1}
            style={{ fontSize: 18, letterSpacing: -0.18 }}
          >
            {firstName(fullName)}
          </Text>
        </View>
        <View>
          <IconButton
            icon={Bell}
            iconSize={22}
            accessibilityLabel={`Notifications, ${UNREAD_NOTIFICATIONS} unread`}
            onPress={() => comingSoon('Notifications')}
          />
          <View
            pointerEvents="none"
            className="absolute right-2.5 top-[9px] h-[9px] w-[9px] rounded-full border-2 border-surface bg-danger"
          />
        </View>
      </View>

      <BalanceCard
        balance={currentAccount.balance}
        accountLabel={`${currentAccount.name} · ${currentAccount.maskedNumber}`}
        monthlyInflow={dashboard.monthlyInflow}
        onAllAccounts={() => router.push('/accounts')}
        className="mt-sm"
      />

      <View accessibilityLabel="Quick actions" className="mt-[18px] flex-row">
        <QuickAction
          icon={ArrowUpRight}
          label="Transfer"
          onPress={() => comingSoon('Transfer')}
          className="flex-1"
        />
        <QuickAction
          icon={Plus}
          label="Add Money"
          onPress={() => comingSoon('Add money')}
          className="flex-1"
        />
        <QuickAction
          icon={CreditCard}
          label="Cards"
          onPress={() => comingSoon('Cards')}
          className="flex-1"
        />
        <QuickAction
          icon={BriefcaseMedical}
          label="Savings"
          onPress={() => comingSoon('Savings')}
          className="flex-1"
        />
      </View>

      <View className="mt-[18px] flex-row gap-md">
        <Pressable
          accessibilityRole="button"
          onPress={() => comingSoon('Spending analytics')}
          className="flex-1 rounded-lg border border-border bg-surface p-[14px] active:bg-surface-hover"
        >
          <Text variant="small" weight="medium" tone="muted">
            Spent in {spending.month}
          </Text>
          <Text variant="h3" weight="bold" className="mt-1" style={statAmountStyle}>
            {formatWholeCurrency(spending.spent)}
          </Text>
          <View
            accessible={false}
            importantForAccessibility="no-hide-descendants"
            className="mt-2.5 h-[30px] flex-row items-end gap-[5px]"
          >
            {spending.bars.map((height, index) => (
              <View
                key={index}
                className={cn(
                  'flex-1 rounded-[3px]',
                  index === spending.bars.length - 1 ? 'bg-primary' : 'bg-border'
                )}
                style={{ height: `${height * 100}%` }}
              />
            ))}
          </View>
          <Text variant="small" tone="muted" className="mt-sm">
            {Math.round(spentShare * 100)}% of {formatThousands(spending.budget)} budget
          </Text>
        </Pressable>

        <Pressable
          accessibilityRole="button"
          onPress={() => comingSoon(featuredGoal.name)}
          className="flex-1 rounded-lg border border-border bg-surface p-[14px] active:bg-surface-hover"
        >
          <Text variant="small" weight="medium" tone="muted">
            {featuredGoal.name}
          </Text>
          <Text variant="h3" weight="bold" className="mt-1" style={statAmountStyle}>
            {formatWholeCurrency(featuredGoal.saved)}
          </Text>
          <Text variant="small" tone="muted" className="mt-0.5">
            of {formatWholeCurrency(featuredGoal.target)}
          </Text>
          <ProgressBar value={goalShare} className="mt-3.5" />
          <Text variant="small" weight="semibold" tone="accent" className="mt-sm">
            {Math.round(goalShare * 100)}% saved
          </Text>
        </Pressable>
      </View>

      <View className="mt-[18px] flex-row items-center justify-between">
        <Text variant="h3" accessibilityRole="header">
          Recent transactions
        </Text>
        <TextLink onPress={() => router.push('/transactions')}>See all</TextLink>
      </View>

      <Card padded={false} className="mt-2.5 overflow-hidden py-1">
        {recentTransactions.map((transaction) => (
          <TransactionRow
            key={transaction.id}
            transaction={transaction}
            onPress={() =>
              router.push({ pathname: '/transactions/[id]', params: { id: transaction.id } })
            }
          />
        ))}
      </Card>
    </Screen>
  );
}
