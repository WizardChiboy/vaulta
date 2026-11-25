import { Stack } from 'expo-router';

import { useTheme } from '@/components/layout/ThemeProvider';
import { NotificationsProvider } from '@/store/notifications';
import { usePreferences } from '@/store/preferences';
import { RecipientsProvider } from '@/store/recipients';
import { SavingsProvider } from '@/store/savings';
import { SecurityProvider } from '@/store/security';
import { TransactionsProvider } from '@/store/transactions';

/** Sheets draw their own grabber so they look the same on every platform. */
const sheet = {
  presentation: 'formSheet',
  sheetCornerRadius: 24,
  sheetGrabberVisible: false,
} as const;

/** Signed-in area (designs 08+): the tabs plus screens pushed over them. */
export default function AppLayout() {
  const { colors } = useTheme();
  const { preferences } = usePreferences();

  return (
    <NotificationsProvider>
      <TransactionsProvider>
        <RecipientsProvider>
          <SavingsProvider>
            <SecurityProvider>
              <Stack
                screenOptions={{
                  headerShown: false,
                  contentStyle: { backgroundColor: colors.background },
                  animation: preferences.reduceMotion ? 'fade' : 'default',
                }}
              >
                <Stack.Screen name="(tabs)" />
                <Stack.Screen name="accounts/index" />
                <Stack.Screen name="accounts/[id]" />
                <Stack.Screen name="transactions/index" />
                <Stack.Screen name="transactions/search" options={{ presentation: 'modal' }} />
                <Stack.Screen
                  name="transactions/filter"
                  options={{
                    presentation: 'formSheet',
                    sheetAllowedDetents: [0.9],
                    sheetCornerRadius: 24,
                    // The sheet draws its own grabber so it looks the same on every platform.
                    sheetGrabberVisible: false,
                    contentStyle: { backgroundColor: colors.surface },
                  }}
                />
                <Stack.Screen name="transactions/[id]" />
                <Stack.Screen name="notifications" />
                <Stack.Screen name="transfers/recipient" />
                <Stack.Screen name="transfers/add-recipient" />
                <Stack.Screen
                  name="transfers/bank"
                  options={{
                    presentation: 'formSheet',
                    sheetAllowedDetents: [0.9],
                    sheetCornerRadius: 24,
                    sheetGrabberVisible: false,
                    contentStyle: { backgroundColor: colors.surface },
                  }}
                />
                <Stack.Screen name="transfers/amount" />
                <Stack.Screen name="transfers/review" />
                <Stack.Screen name="transfers/success" options={{ gestureEnabled: false }} />
                <Stack.Screen name="transfers/history" />
                <Stack.Screen name="cards/index" />
                <Stack.Screen name="cards/[id]/index" />
                <Stack.Screen name="cards/[id]/controls" />
                <Stack.Screen name="goals/new" />
                <Stack.Screen
                  name="goals/target-date"
                  options={{
                    ...sheet,
                    sheetAllowedDetents: [0.9],
                    contentStyle: { backgroundColor: colors.surface },
                  }}
                />
                <Stack.Screen name="goals/[id]/index" />
                <Stack.Screen name="goals/[id]/add-money" />
                <Stack.Screen
                  name="goals/[id]/confirm-deposit"
                  options={{
                    ...sheet,
                    sheetAllowedDetents: 'fitToContents',
                    contentStyle: { backgroundColor: colors.surface },
                  }}
                />
                <Stack.Screen name="insights/index" />
                <Stack.Screen name="insights/categories" />
                <Stack.Screen name="insights/budget" />
                <Stack.Screen name="insights/report" />
                <Stack.Screen name="settings/edit-profile" />
                <Stack.Screen name="settings/personal" />
                <Stack.Screen name="settings/security" />
                <Stack.Screen name="settings/notifications" />
                <Stack.Screen name="settings/appearance" />
              </Stack>
            </SecurityProvider>
          </SavingsProvider>
        </RecipientsProvider>
      </TransactionsProvider>
    </NotificationsProvider>
  );
}
