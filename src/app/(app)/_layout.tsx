import { Stack } from 'expo-router';

import { useTheme } from '@/components/layout/ThemeProvider';

/** Signed-in area (designs 08+): the tabs plus screens pushed over them. */
export default function AppLayout() {
  const { colors } = useTheme();

  return (
    <Stack
      screenOptions={{ headerShown: false, contentStyle: { backgroundColor: colors.background } }}
    >
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="accounts/index" />
      <Stack.Screen name="accounts/[id]" />
    </Stack>
  );
}
