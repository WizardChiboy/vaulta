import { Stack } from 'expo-router';

import { useTheme } from '@/components/layout/ThemeProvider';

// Keeps Welcome underneath when deep-linking straight to another auth screen, so Back works.
export const unstable_settings = { anchor: 'welcome' };

/**
 * Authentication & onboarding (designs 01–07). Screens draw their own <ScreenHeader />.
 * Flows: 01 → 03 → 04 → 07 (sign up) · 01 → 02 (sign in) · 02 → 05 → 06 → 02 (reset)
 */
export default function AuthLayout() {
  const { colors } = useTheme();

  return (
    <Stack
      screenOptions={{ headerShown: false, contentStyle: { backgroundColor: colors.background } }}
    >
      <Stack.Screen name="welcome" />
      <Stack.Screen name="sign-in" />
      <Stack.Screen name="sign-up" />
      <Stack.Screen name="verify-phone" />
      <Stack.Screen name="forgot-password" />
      <Stack.Screen name="reset-password" />
      {/* End of sign-up: no way back into the finished form. */}
      <Stack.Screen name="all-set" options={{ gestureEnabled: false }} />
    </Stack>
  );
}
