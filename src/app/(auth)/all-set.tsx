import { useEffect, useRef, useState } from 'react';
import { Pressable, View } from 'react-native';
import { router } from 'expo-router';

import { Screen } from '@/components/layout/Screen';
import { useTheme } from '@/components/layout/ThemeProvider';
import { Button, Card, Text, TextLink } from '@/components/ui';
import { Check, Copy, ICON_STROKE } from '@/constants/icons';
import { showMessage } from '@/lib/notify';
import { useSession } from '@/store/session';
import { firstName } from '@/utils/format';

const SETUP_ITEMS = ['Account created', 'Phone number verified'];
const ACCOUNT_NUMBER = '0123 •• 4821';

// Design 07 — You're all set (end of sign-up).
export default function AllSetScreen() {
  const { colors } = useTheme();
  const { user } = useSession();
  const [copied, setCopied] = useState(false);
  const copiedTimer = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => () => clearTimeout(copiedTimer.current), []);

  // Simulated: the demo account number is fictional, so nothing is put on the clipboard.
  const copyAccountNumber = () => {
    setCopied(true);
    clearTimeout(copiedTimer.current);
    copiedTimer.current = setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Screen scroll padded={false} contentClassName="px-gutter-lg pb-lg">
      <SuccessIllustration />

      <View className="gap-2.5 pt-7">
        <Text variant="h1" accessibilityRole="header" className="text-center">
          You’re all set, {firstName(user?.fullName ?? 'Adaeze')}
        </Text>
        <Text variant="body" tone="muted" className="text-center">
          Your Vaulta account is open and ready. Here’s what we set up for you.
        </Text>
      </View>

      <Card padded={false} className="mt-xl">
        {SETUP_ITEMS.map((item) => (
          <View
            key={item}
            className="flex-row items-center gap-md border-b border-surface-muted px-lg py-3.5"
          >
            <View className="h-6 w-6 items-center justify-center rounded-full bg-primary">
              <Check size={14} color={colors['primary-foreground']} strokeWidth={2.6} />
            </View>
            <Text variant="body" className="flex-1">
              {item}
            </Text>
          </View>
        ))}
        <View className="flex-row items-center gap-md px-lg py-3.5">
          <View className="h-6 w-6 rounded-full border-[1.5px] border-dashed border-subtle" />
          <Text variant="body" className="flex-1">
            Virtual card{' '}
            <Text variant="caption" tone="muted">
              · optional
            </Text>
          </Text>
          <TextLink
            onPress={() => showMessage('Virtual cards', 'Cards are coming in a later module.')}
            className="py-sm"
          >
            Set up
          </TextLink>
        </View>
      </Card>

      <Card className="mt-md flex-row items-center justify-between">
        <View className="gap-xs">
          <Text variant="small" tone="muted">
            Your account number
          </Text>
          <Text variant="h3" weight="semibold" style={{ letterSpacing: 0.7 }}>
            {ACCOUNT_NUMBER}
          </Text>
        </View>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={copied ? 'Account number copied' : 'Copy account number'}
          onPress={copyAccountNumber}
          className="h-10 flex-row items-center gap-1.5 rounded-[10px] border border-border bg-surface-hover px-3.5 active:opacity-70"
        >
          {copied ? (
            <Check size={16} color={colors.accent} strokeWidth={ICON_STROKE} />
          ) : (
            <Copy size={16} color={colors.foreground} strokeWidth={ICON_STROKE} />
          )}
          <Text variant="bodySm" weight="semibold" tone={copied ? 'accent' : 'default'}>
            {copied ? 'Copied' : 'Copy'}
          </Text>
        </Pressable>
      </Card>

      <View className="flex-1" />

      <View className="gap-md pt-2xl">
        <Button label="Go to dashboard" fullWidth onPress={() => router.replace('/')} />
        <Button
          label="Turn on Face ID"
          variant="secondary"
          fullWidth
          onPress={() => showMessage('Face ID turned on', 'Simulated — no biometrics are used.')}
        />
      </View>
    </Screen>
  );
}

/** Concentric success badge with confetti dots (decorative). */
function SuccessIllustration() {
  const { colors } = useTheme();

  return (
    <View
      accessible={false}
      importantForAccessibility="no-hide-descendants"
      className="items-center pt-11"
    >
      <View className="h-[168px] w-[168px] items-center justify-center rounded-full bg-accent-soft">
        <View className="h-[124px] w-[124px] items-center justify-center rounded-full bg-green-100">
          <View className="h-20 w-20 items-center justify-center rounded-full bg-primary">
            <Check size={36} color={colors['primary-foreground']} strokeWidth={2.4} />
          </View>
        </View>
        <View className="absolute left-1.5 top-[26px] h-2.5 w-2.5 rounded-full bg-primary" />
        <View className="absolute right-0.5 top-[52px] h-1.5 w-1.5 rounded-full bg-brand" />
        <View
          className="absolute bottom-2.5 right-[18px] h-2 w-2 rounded-sm bg-warning"
          style={{ transform: [{ rotate: '20deg' }] }}
        />
      </View>
    </View>
  );
}
