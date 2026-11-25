import { Pressable, View } from 'react-native';
import { router } from 'expo-router';

import { useTheme } from '@/components/layout/ThemeProvider';
import { Screen } from '@/components/layout/Screen';
import { ScreenHeader } from '@/components/layout/ScreenHeader';
import { Card, getInitials, ListRow, Text } from '@/components/ui';
import {
  Bell,
  CircleQuestionMark,
  Contrast,
  ICON_STROKE,
  Lock,
  LogOut,
  Pencil,
  ShieldCheck,
  User,
} from '@/constants/icons';
import { cn } from '@/lib/cn';
import { confirmAction, showMessage } from '@/lib/notify';
import { accounts } from '@/mock/accounts';
import { profileDetails } from '@/mock/profile';
import { usePreferences, type ThemePreference } from '@/store/preferences';
import { useSavings } from '@/store/savings';
import { useSecurity } from '@/store/security';
import { useSession } from '@/store/session';

const THEME_LABELS: Record<ThemePreference, string> = {
  light: 'Light',
  dark: 'Dark',
  system: 'System',
};

// Design 34 — Profile tab.
export default function ProfileScreen() {
  const { colors } = useTheme();
  const { user, signOut } = useSession();
  const { goals } = useSavings();
  const { alertDevice } = useSecurity();
  const { preferences } = usePreferences();

  if (!user) return null;

  const onSignOut = async () => {
    const confirmed = await confirmAction({
      title: 'Sign out?',
      message: 'You’ll need your password or Face ID to sign back in.',
      confirmLabel: 'Sign out',
      destructive: true,
    });
    // The (app) guard sends you to Welcome once the session is gone.
    if (confirmed) signOut();
  };

  return (
    <Screen scroll edges={['top']} contentClassName="pb-xl">
      <ScreenHeader back={false} largeTitle="Profile" />

      <View className="mt-[14px] items-center">
        <View
          className="h-20 w-20 items-center justify-center rounded-full border-[3px] border-surface bg-accent-soft"
          style={{ boxShadow: `0px 0px 0px 1px ${colors.border}` }}
        >
          <Text tone="accent" weight="bold" style={{ fontSize: 26, lineHeight: 32 }}>
            {getInitials(user.fullName)}
          </Text>
        </View>
        <Text variant="h2" weight="bold" className="mt-md text-center">
          {user.fullName}
        </Text>
        <View className="mt-0.5 flex-row items-center gap-1.5">
          <Text variant="bodySm" tone="muted">
            @{profileDetails.handle} ·
          </Text>
          <ShieldCheck size={14} color={colors.accent} strokeWidth={2.2} />
          <Text variant="bodySm" weight="semibold" tone="accent">
            {profileDetails.tier} verified
          </Text>
        </View>
        <Pressable
          accessibilityRole="button"
          onPress={() => router.push('/settings/edit-profile')}
          className="mt-md h-9 flex-row items-center gap-1.5 rounded-full border border-border-strong bg-surface px-lg active:bg-surface-hover"
        >
          <Pencil size={15} color={colors.foreground} strokeWidth={ICON_STROKE} />
          <Text variant="bodySm" weight="semibold">
            Edit profile
          </Text>
        </Pressable>
      </View>

      <Card padded={false} className="mt-[18px] flex-row">
        <Stat
          value={String(accounts.length)}
          label="Accounts"
          onPress={() => router.push('/accounts')}
        />
        <Stat
          value={String(goals.length)}
          label="Savings goals"
          onPress={() => router.push('/savings')}
          divider
        />
        <Stat value={String(profileDetails.memberSince)} label="Member since" divider />
      </Card>

      <Card padded={false} className="mt-[14px] overflow-hidden">
        <ListRow
          icon={User}
          title="Personal information"
          onPress={() => router.push('/settings/personal')}
        />
        <ListRow
          icon={Lock}
          title="Security"
          trailing={alertDevice ? <AlertBadge /> : undefined}
          onPress={() => router.push('/settings/security')}
          divider
        />
        <ListRow
          icon={Bell}
          title="Notifications"
          onPress={() => router.push('/settings/notifications')}
          divider
        />
        <ListRow
          icon={Contrast}
          title="Appearance"
          value={THEME_LABELS[preferences.theme]}
          onPress={() => router.push('/settings/appearance')}
          divider
        />
        <ListRow
          icon={CircleQuestionMark}
          title="Help & support"
          onPress={() =>
            showMessage('Help & support', 'This is a demo — support chat isn’t available yet.')
          }
          divider
        />
      </Card>

      <Pressable
        accessibilityRole="button"
        onPress={() => void onSignOut()}
        className="mt-[14px] h-12 flex-row items-center justify-center gap-sm rounded-button active:bg-danger-soft"
      >
        <LogOut size={18} color={colors['danger-text']} strokeWidth={ICON_STROKE} />
        <Text variant="body" weight="semibold" tone="danger">
          Sign out
        </Text>
      </Pressable>
    </Screen>
  );
}

function Stat({
  value,
  label,
  onPress,
  divider = false,
}: {
  value: string;
  label: string;
  onPress?: (() => void) | undefined;
  divider?: boolean | undefined;
}) {
  const className = cn(
    'flex-1 items-center px-sm py-md',
    divider && 'border-l border-surface-muted'
  );
  const content = (
    <>
      <Text variant="h3" weight="bold" style={{ fontVariant: ['tabular-nums'] }}>
        {value}
      </Text>
      <Text variant="small" tone="muted" className="mt-0.5">
        {label}
      </Text>
    </>
  );

  if (!onPress) {
    return (
      <View accessible accessibilityLabel={`${label}: ${value}`} className={className}>
        {content}
      </View>
    );
  }
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${value} ${label}`}
      onPress={onPress}
      className={cn(className, 'active:bg-surface-hover')}
    >
      {content}
    </Pressable>
  );
}

function AlertBadge() {
  return (
    <View className="rounded-full bg-warning-soft px-sm py-[3px]">
      <Text variant="small" weight="semibold" tone="warning">
        1 alert
      </Text>
    </View>
  );
}
