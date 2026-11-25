import { Platform, View } from 'react-native';

import { Switch } from '@/components/forms/Switch';
import { useTheme } from '@/components/layout/ThemeProvider';
import { Screen } from '@/components/layout/Screen';
import { ScreenHeader } from '@/components/layout/ScreenHeader';
import { Card, ListRow, SectionLabel, Text } from '@/components/ui';
import { Bell, ICON_STROKE } from '@/constants/icons';
import { usePreferences, type NotificationPreference } from '@/store/preferences';
import { formatWholeCurrency } from '@/utils/format';

/** Alerts for anything above this amount. */
const LARGE_TRANSACTION = 100_000;

const DEVICE_NAME = Platform.select({ ios: 'iPhone', android: 'phone', default: 'browser' });

type Row = { key: NotificationPreference; title: string; subtitle: string };

const TRANSACTION_ROWS: readonly Row[] = [
  { key: 'moneyIn', title: 'Money in', subtitle: 'Transfers, salary and refunds' },
  { key: 'moneyOut', title: 'Money out', subtitle: 'Card payments and transfers' },
  {
    key: 'largeTransactions',
    title: 'Large transactions',
    subtitle: `Anything above ${formatWholeCurrency(LARGE_TRANSACTION)}`,
  },
];

const PROMOTION_ROWS: readonly Row[] = [
  { key: 'offers', title: 'Offers and product news', subtitle: 'At most twice a month' },
  { key: 'savingsTips', title: 'Savings tips', subtitle: 'Weekly nudges for your goals' },
];

/** Security alerts can't be turned off. */
const SECURITY_ROWS = [
  { title: 'New sign-ins', subtitle: 'Always on to keep you safe' },
  { title: 'Password and PIN changes', subtitle: 'Always on' },
] as const;

// Design 38 — Notification preferences.
export default function NotificationPreferencesScreen() {
  const { colors } = useTheme();
  const { preferences, setNotification } = usePreferences();
  const { push } = preferences.notifications;

  const renderRows = (rows: readonly Row[]) =>
    rows.map((row, index) => (
      <ListRow
        key={row.key}
        title={row.title}
        subtitle={row.subtitle}
        divider={index > 0}
        // With push off nothing is sent, so the categories are greyed out.
        className={push ? undefined : 'opacity-50'}
        toggle={{
          value: preferences.notifications[row.key],
          onValueChange: (value) => setNotification(row.key, value),
          disabled: !push,
        }}
      />
    ));

  return (
    <Screen scroll contentClassName="pb-3xl">
      <ScreenHeader largeTitle="Notifications" />

      <Card padded={false} className="mt-[14px] flex-row items-center gap-md px-lg py-[14px]">
        <View className="h-10 w-10 items-center justify-center rounded-md bg-accent-soft">
          <Bell size={20} color={colors.accent} strokeWidth={ICON_STROKE} />
        </View>
        <View className="flex-1">
          <Text variant="body" weight="semibold">
            Push notifications
          </Text>
          <Text variant="small" tone="muted" className="mt-0.5">
            {push ? `Allowed on this ${DEVICE_NAME}` : 'Off — only security alerts are sent'}
          </Text>
        </View>
        <Switch
          value={push}
          onValueChange={(value) => setNotification('push', value)}
          accessibilityLabel="Push notifications"
        />
      </Card>

      <SectionLabel>Transaction alerts</SectionLabel>
      <Card padded={false} className="overflow-hidden">
        {renderRows(TRANSACTION_ROWS)}
      </Card>

      <SectionLabel>Security alerts</SectionLabel>
      <Card padded={false} className="overflow-hidden">
        {SECURITY_ROWS.map((row, index) => (
          <ListRow
            key={row.title}
            title={row.title}
            subtitle={row.subtitle}
            divider={index > 0}
            toggle={{ value: true, onValueChange: () => undefined, disabled: true }}
          />
        ))}
      </Card>

      <SectionLabel>Promotions</SectionLabel>
      <Card padded={false} className="overflow-hidden">
        {renderRows(PROMOTION_ROWS)}
      </Card>
    </Screen>
  );
}
