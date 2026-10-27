import '../../global.css';

import { useEffect } from 'react';
import { SplashScreen, Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useFonts } from 'expo-font';
import { KeyboardProvider } from 'react-native-keyboard-controller';
// Per-weight imports: the package index would bundle all 7 Manrope weights.
import { Manrope_400Regular } from '@expo-google-fonts/manrope/400Regular';
import { Manrope_500Medium } from '@expo-google-fonts/manrope/500Medium';
import { Manrope_600SemiBold } from '@expo-google-fonts/manrope/600SemiBold';
import { Manrope_700Bold } from '@expo-google-fonts/manrope/700Bold';

import { ThemeProvider, useTheme } from '@/components/layout/ThemeProvider';
import { SessionProvider, useSession } from '@/store/session';

// Fire-and-forget: rejects harmlessly if the splash is already hidden (e.g. after fast refresh).
void SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    Manrope_400Regular,
    Manrope_500Medium,
    Manrope_600SemiBold,
    Manrope_700Bold,
  });
  const ready = fontsLoaded || !!fontError;

  useEffect(() => {
    if (ready) void SplashScreen.hideAsync();
  }, [ready]);

  if (!ready) return null;

  return (
    // KeyboardProvider powers <Screen>'s keyboard handling (react-native-keyboard-controller).
    <KeyboardProvider>
      <ThemeProvider theme="light">
        <SessionProvider>
          <RootNavigator />
        </SessionProvider>
      </ThemeProvider>
    </KeyboardProvider>
  );
}

/**
 * (app) is the signed-in area (designs 08+), only reachable with a session; signed out,
 * its routes (including `/`) redirect to Welcome. (auth) isn't guarded the other way because "You're all set"
 * (07) is shown after the account is created.
 */
function RootNavigator() {
  const { name, colors } = useTheme();
  const { user } = useSession();

  return (
    <>
      <StatusBar style={name === 'dark' ? 'light' : 'dark'} />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: colors.background },
        }}
      >
        <Stack.Protected guard={!!user} redirectTo="/welcome">
          <Stack.Screen name="(app)" />
        </Stack.Protected>
        <Stack.Screen name="(auth)" />
      </Stack>
    </>
  );
}
