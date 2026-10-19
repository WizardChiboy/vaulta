import { View } from 'react-native';
import { router, useIsFocused } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

import { Screen } from '@/components/layout/Screen';
import { useTheme } from '@/components/layout/ThemeProvider';
import { Button, Logo, Text } from '@/components/ui';
import { ArrowDownLeft, ICON_STROKE } from '@/constants/icons';
import { palette } from '@/constants/theme';
import { primaryAccount } from '@/mock/accounts';
import { formatCurrencyParts } from '@/utils/format';

// Design 01 — Welcome.
export default function WelcomeScreen() {
  // This screen stays mounted under sign-in, so only claim the light status bar while focused.
  const focused = useIsFocused();

  return (
    <Screen background="brand" padded={false} contentClassName="pb-lg">
      <StatusBar style={focused ? 'light' : 'dark'} />

      <View className="flex-row items-center justify-between px-gutter-lg pt-2.5">
        {/* "vaulta." at 26px type; the artwork is cropped to the letters (~0.77em). */}
        <Logo variant="reversed" height={20} />
        {/* Language picker — English only in this demo. */}
        <View className="rounded-full border border-gray-700 px-2.5 py-1.5">
          <Text variant="small" weight="medium" tone="inverseMuted">
            EN
          </Text>
        </View>
      </View>

      <HeroIllustration />

      <View className="gap-md px-gutter-lg pt-[26px]">
        <Text
          variant="h1"
          tone="inverse"
          accessibilityRole="header"
          style={{ fontSize: 30, lineHeight: 35 }}
        >
          Your money, secured and always in sight.
        </Text>
        <Text variant="body" tone="inverseMuted">
          Send, save and track every naira from one calm, secure app.
        </Text>
      </View>

      <View className="flex-1" />

      <View className="gap-md px-gutter-lg pt-xl">
        <Button label="Create account" fullWidth onPress={() => router.push('/sign-up')} />
        <Button
          label="Sign in"
          variant="outlineInverse"
          fullWidth
          onPress={() => router.push('/sign-in')}
        />
        <Text variant="small" tone="inverseMuted" className="pt-0.5 text-center">
          Demo app · all names and figures are fictional
        </Text>
      </View>
    </Screen>
  );
}

/** Stacked cards + balance card from the design, built with views (decorative). */
function HeroIllustration() {
  const { colors } = useTheme();
  const balance = formatCurrencyParts(primaryAccount.balance);

  return (
    <View
      accessible={false}
      importantForAccessibility="no-hide-descendants"
      className="mt-3.5 h-[340px]"
    >
      {/* Back card */}
      <View
        className="absolute left-[62px] top-[22px] h-[168px] w-[278px] rounded-xl border border-gray-700 bg-brand-raised"
        style={{ transform: [{ rotate: '-7deg' }] }}
      />
      {/* Green virtual card */}
      <View
        className="absolute left-[46px] top-[46px] h-[176px] w-[300px] justify-between rounded-xl bg-primary p-gutter"
        style={{ transform: [{ rotate: '3deg' }] }}
      >
        <View className="flex-row items-center justify-between">
          <Logo variant="mono" height={12} color={palette.gray[900]} />
          <Text variant="xs" weight="semibold" tone="primary" style={{ letterSpacing: 0.9 }}>
            VIRTUAL
          </Text>
        </View>
        <View
          className="h-[26px] w-9 rounded-md"
          style={{ backgroundColor: 'rgba(16,24,40,0.18)' }}
        />
        <View className="flex-row items-end justify-between">
          <Text variant="body" weight="semibold" tone="primary" style={{ letterSpacing: 2.2 }}>
            •••• 7302
          </Text>
          <Text variant="small" weight="semibold" tone="primary">
            09/29
          </Text>
        </View>
      </View>
      {/* Balance card */}
      <View
        className="absolute left-gutter-lg right-gutter-lg top-[190px] rounded-xl bg-surface px-gutter py-[18px]"
        style={{ boxShadow: '0px 16px 40px rgba(0, 0, 0, 0.35)' }}
      >
        <View className="flex-row items-center justify-between">
          <Text variant="caption" tone="muted">
            Total balance
          </Text>
          <View className="rounded-full bg-accent-soft px-sm py-xs">
            <Text variant="small" weight="semibold" tone="accent">
              Protected
            </Text>
          </View>
        </View>
        <Text variant="h1" className="mt-xs">
          {balance.whole}
          <Text variant="h1" tone="subtle">
            {balance.fraction}
          </Text>
        </Text>
        <View className="mt-3.5 flex-row gap-sm">
          <View className="flex-row items-center gap-1.5 rounded-full bg-accent-soft px-2.5 py-1.5">
            <ArrowDownLeft size={14} color={colors.accent} strokeWidth={ICON_STROKE} />
            <Text variant="small" weight="semibold" tone="accent">
              ₦850,000 salary
            </Text>
          </View>
          <View className="rounded-full bg-surface-muted px-2.5 py-1.5">
            <Text variant="small" weight="semibold" tone="label">
              Goal 65% funded
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
}
