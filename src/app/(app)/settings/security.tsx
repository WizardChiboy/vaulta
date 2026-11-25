import { Pressable, View } from 'react-native';
import { router } from 'expo-router';

import { useTheme } from '@/components/layout/ThemeProvider';
import { Screen } from '@/components/layout/Screen';
import { ScreenHeader } from '@/components/layout/ScreenHeader';
import { Card, ListRow, SectionLabel, Text } from '@/components/ui';
import {
  EyeOff,
  ICON_STROKE,
  Laptop,
  Lock,
  LogOut,
  RectangleEllipsis,
  ScanFace,
  ShieldAlert,
  Smartphone,
} from '@/constants/icons';
import { confirmAction } from '@/lib/notify';
import { passwordChangedAt } from '@/mock/profile';
import { usePreferences } from '@/store/preferences';
import { useSecurity } from '@/store/security';
import type { TrustedDevice } from '@/types/profile';
import { formatTime, formatTimeAgo, formatWholeCurrency } from '@/utils/format';

/** Transfers above this amount ask for the PIN. */
const PIN_THRESHOLD = 50_000;

/** "Last changed 3 months ago" */
function passwordAge(iso: string, now = new Date()) {
  const date = new Date(iso);
  const months = (now.getFullYear() - date.getFullYear()) * 12 + now.getMonth() - date.getMonth();
  if (months <= 0) return 'Changed this month';
  return `Last changed ${months} ${months === 1 ? 'month' : 'months'} ago`;
}

function deviceMeta(device: TrustedDevice) {
  const seen = device.current ? 'now' : formatTimeAgo(device.lastActiveAt);
  return `${device.client} · ${device.location} · ${seen}`;
}

// Design 37 — Security.
export default function SecurityScreen() {
  const { colors } = useTheme();
  const { preferences, setPreference } = usePreferences();
  const { devices, alertDevice, dismissAlert, removeDevice, removeOtherDevices } = useSecurity();
  const otherDevices = devices.filter((device) => !device.current);

  const confirmRemove = async (device: TrustedDevice) => {
    const confirmed = await confirmAction({
      title: `Remove ${device.name}?`,
      message: 'It will be signed out of Vaulta straight away.',
      confirmLabel: 'Remove',
      destructive: true,
    });
    if (confirmed) removeDevice(device.id);
  };

  const reviewAlert = async (device: TrustedDevice) => {
    const remove = await confirmAction({
      title: `Was this you?`,
      message: `${device.name} signed in today at ${formatTime(device.lastActiveAt)} using ${device.client} in ${device.location}. If it wasn’t you, remove it and change your password.`,
      confirmLabel: 'Remove device',
      cancelLabel: 'It was me',
      destructive: true,
    });
    if (remove) removeDevice(device.id);
    else dismissAlert();
  };

  const confirmSignOutOthers = async () => {
    const confirmed = await confirmAction({
      title: 'Sign out of all other sessions?',
      message: 'Every device except this one will be signed out.',
      confirmLabel: 'Sign out',
      destructive: true,
    });
    if (confirmed) removeOtherDevices();
  };

  return (
    <Screen scroll contentClassName="pb-3xl">
      <ScreenHeader largeTitle="Security" />

      {alertDevice && (
        <View className="mt-[14px] flex-row items-center gap-md rounded-lg border border-warning/40 bg-warning-soft p-[14px]">
          <View className="h-10 w-10 items-center justify-center rounded-md bg-surface">
            <ShieldAlert size={20} color={colors['warning-text']} strokeWidth={ICON_STROKE} />
          </View>
          <View className="flex-1">
            <Text variant="bodySm" weight="semibold">
              New sign-in from {alertDevice.name}
            </Text>
            <Text variant="small" tone="warning" className="mt-0.5">
              Today, {formatTime(alertDevice.lastActiveAt)} · {alertDevice.client} ·{' '}
              {alertDevice.location}
            </Text>
          </View>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={`Review sign-in from ${alertDevice.name}`}
            onPress={() => void reviewAlert(alertDevice)}
            hitSlop={8}
            className="py-sm active:opacity-60"
          >
            <Text variant="caption" weight="semibold" tone="warning">
              Review
            </Text>
          </Pressable>
        </View>
      )}

      <SectionLabel>Sign-in & payments</SectionLabel>
      <Card padded={false} className="overflow-hidden">
        <ListRow
          icon={ScanFace}
          title="Face ID sign-in"
          subtitle="Unlock Vaulta with your face"
          toggle={{
            value: preferences.faceIdSignIn,
            onValueChange: (value) => setPreference('faceIdSignIn', value),
          }}
        />
        <ListRow
          icon={RectangleEllipsis}
          title="PIN for transfers"
          subtitle={`Ask for PIN above ${formatWholeCurrency(PIN_THRESHOLD)}`}
          toggle={{
            value: preferences.transferPin,
            onValueChange: (value) => setPreference('transferPin', value),
          }}
          divider
        />
        <ListRow
          icon={EyeOff}
          title="Hide balance on open"
          subtitle="Tap to reveal on Home"
          toggle={{
            value: !preferences.showBalance,
            onValueChange: (value) => setPreference('showBalance', !value),
          }}
          divider
        />
        <ListRow
          icon={Lock}
          title="Change password"
          subtitle={passwordAge(passwordChangedAt)}
          onPress={() => router.push('/reset-password')}
          divider
        />
      </Card>

      <SectionLabel>Trusted devices</SectionLabel>
      <Card padded={false} className="overflow-hidden">
        {devices.map((device, index) => (
          <ListRow
            key={device.id}
            icon={device.kind === 'phone' ? Smartphone : Laptop}
            title={device.name}
            subtitle={deviceMeta(device)}
            divider={index > 0}
            trailing={
              device.current ? (
                <View className="rounded-full bg-success-soft px-sm py-[3px]">
                  <Text variant="xs" weight="semibold" tone="success">
                    This device
                  </Text>
                </View>
              ) : (
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel={`Remove ${device.name}`}
                  onPress={() => void confirmRemove(device)}
                  hitSlop={8}
                  className="py-sm active:opacity-60"
                >
                  <Text variant="bodySm" weight="semibold" tone="danger">
                    Remove
                  </Text>
                </Pressable>
              )
            }
          />
        ))}
      </Card>

      {otherDevices.length > 0 && (
        <Pressable
          accessibilityRole="button"
          onPress={() => void confirmSignOutOthers()}
          className="mt-[14px] h-12 flex-row items-center justify-center gap-sm rounded-button border border-danger/30 bg-danger-soft active:opacity-80"
        >
          <LogOut size={18} color={colors['danger-text']} strokeWidth={ICON_STROKE} />
          <Text variant="body" weight="semibold" tone="danger">
            Sign out of all other sessions
          </Text>
        </Pressable>
      )}
    </Screen>
  );
}
