import { Stack } from 'expo-router';

import { useTheme } from '@/components/layout/ThemeProvider';
import { TransactionsProvider } from '@/store/transactions';

/** Signed-in area (designs 08+): the tabs plus screens pushed over them. */
export default function AppLayout() {
  const { colors } = useTheme();

  return (
    <TransactionsProvider>
      <Stack
        screenOptions={{ headerShown: false, contentStyle: { backgroundColor: colors.background } }}
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
      </Stack>
    </TransactionsProvider>
  );
}
