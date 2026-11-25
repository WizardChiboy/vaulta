import { useState } from 'react';
import { View } from 'react-native';

import { Switch } from '@/components/forms/Switch';
import { useTheme } from '@/components/layout/ThemeProvider';
import { Screen } from '@/components/layout/Screen';
import { ScreenHeader } from '@/components/layout/ScreenHeader';
import { Card, KeyValueList, SectionLabel, Text, TextLink } from '@/components/ui';
import { Eye, ICON_STROKE, Lock, ShieldCheck } from '@/constants/icons';
import { showMessage } from '@/lib/notify';
import { profileDetails as details } from '@/mock/profile';
import { formatDate } from '@/utils/format';

/** "22200000081" → "2220 0000 081", or "222• •••• •81" when hidden. */
function formatBvn(bvn: string, revealed: boolean) {
  const shown = revealed ? bvn : `${bvn.slice(0, 3)}${'•'.repeat(6)}${bvn.slice(-2)}`;
  return `${shown.slice(0, 4)} ${shown.slice(4, 8)} ${shown.slice(8)}`;
}

/** "14 Mar 1994", or "•• ••• 1994" when hidden. */
function formatBirthDate(iso: string, revealed: boolean) {
  return revealed ? formatDate(`${iso}T12:00:00`) : `•• ••• ${iso.slice(0, 4)}`;
}

/** "Mar 2024" */
function formatShortMonthYear(isoDate: string) {
  return formatDate(`${isoDate}T12:00:00`).replace(/^d+ /, '');
}

/** "₦5m" */
function formatMillions(amount: number) {
  return `₦${amount / 1_000_000}m`;
}

// Design 36 — Personal information. Sensitive values stay masked until revealed.
export default function PersonalInformationScreen() {
  const { colors } = useTheme();
  const [revealed, setRevealed] = useState(false);

  return (
    <Screen scroll contentClassName="pb-3xl">
      <ScreenHeader largeTitle="Personal information" />

      <View className="mt-[14px] flex-row items-start gap-md rounded-button bg-accent-soft px-[14px] py-md">
        <ShieldCheck size={20} color={colors.accent} strokeWidth={ICON_STROKE} />
        <Text variant="caption" tone="label" className="flex-1" style={{ lineHeight: 19 }}>
          Your details are encrypted and only used to verify your identity. We never share them
          without your consent.
        </Text>
      </View>

      <Card padded={false} className="mt-md flex-row items-center gap-md px-lg py-md">
        <Eye size={20} color={colors.label} strokeWidth={ICON_STROKE} />
        <Text variant="body" weight="medium" className="flex-1">
          Show sensitive details
        </Text>
        <Switch
          value={revealed}
          onValueChange={setRevealed}
          accessibilityLabel="Show sensitive details"
        />
      </Card>

      <SectionLabel>Personal details</SectionLabel>
      <KeyValueList
        items={[
          { label: 'Legal name', value: details.legalName },
          { label: 'Date of birth', value: formatBirthDate(details.dateOfBirth, revealed) },
          {
            label: 'BVN',
            value: (
              <>
                <Text
                  variant="bodySm"
                  weight="medium"
                  accessibilityLabel={revealed ? undefined : 'BVN hidden'}
                  style={{ fontVariant: ['tabular-nums'] }}
                >
                  {formatBvn(details.bvn, revealed)}
                </Text>
                {!revealed && <Lock size={14} color={colors.subtle} strokeWidth={ICON_STROKE} />}
              </>
            ),
          },
          { label: 'Address', value: details.address },
          { label: 'Nationality', value: details.nationality },
        ]}
      />

      <SectionLabel>Account</SectionLabel>
      <KeyValueList
        items={[
          {
            label: 'Account tier',
            value: `${details.tier} · ${formatMillions(details.dailyLimit)} daily limit`,
          },
          { label: 'Customer ID', value: details.customerId },
          {
            label: 'Identity check',
            value: (
              <>
                <View className="h-1.5 w-1.5 rounded-full bg-success" />
                <Text variant="bodySm" weight="medium" tone="success">
                  Verified · {formatShortMonthYear(details.verifiedAt)}
                </Text>
              </>
            ),
          },
        ]}
      />

      <View className="mt-lg flex-row flex-wrap items-center gap-1">
        <Text variant="caption" tone="muted">
          Something wrong?
        </Text>
        <TextLink
          variant="caption"
          accessibilityRole="button"
          onPress={() =>
            showMessage(
              'Request a correction',
              'This is a demo — correction requests aren’t available yet.'
            )
          }
        >
          Request a correction
        </TextLink>
      </View>
    </Screen>
  );
}
