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
import { SessionProvider } from '@/store/session';

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
 * Only the authentication & onboarding screens (designs 01–07) exist so far.
 * When the signed-in area is added, gate it here with <Stack.Protected guard={!!user}>.
 */
function RootNavigator() {
  const { name, colors } = useTheme();

  return (
    <>
      <StatusBar style={name === 'dark' ? 'light' : 'dark'} />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: colors.background },
        }}
      >
        <Stack.Screen name="index" />
        <Stack.Screen name="(auth)" />
      </Stack>
    </>
  );
}
