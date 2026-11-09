import { View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';

import { useTheme } from '@/components/layout/ThemeProvider';
import { Screen } from '@/components/layout/Screen';
import { Button, Text } from '@/components/ui';
import { CopyButton } from '@/components/ui/CopyButton';
import { KeyValueList } from '@/components/ui/KeyValueList';
import { Check, Share } from '@/constants/icons';
import { showMessage } from '@/lib/notify';
import { useRecipients } from '@/store/recipients';
import { formatCurrency, formatDate, formatTime } from '@/utils/format';

// Design 21 — Transfer successful.
export default function TransferSuccessScreen() {
  const { colors } = useTheme();
  const {
    recipientId,
    amount: amountStr,
    fee: feeStr,
    reference,
    sentAt,
  } = useLocalSearchParams<{
    recipientId: string;
    amount: string;
    fee: string;
    reference: string;
    sentAt: string;
  }>();
  const { getRecipient } = useRecipients();

  const recipient = getRecipient(recipientId);
  const amount = parseFloat(amountStr) || 0;
  const fee = parseFloat(feeStr) || 0;
  const dateLabel = sentAt ? `${formatDate(sentAt)} · ${formatTime(sentAt)}` : '—';

  const kvItems = [
    {
      label: 'Reference',
      value: (
        <View className="flex-row items-center gap-1.5">
          <Text variant="bodySm" weight="medium" numberOfLines={1} className="shrink">
            {reference}
          </Text>
          <CopyButton subject="reference" />
        </View>
      ),
    },
    { label: 'Date', value: dateLabel },
    {
      label: 'To',
      value: recipient ? `${recipient.bank} · ${recipient.maskedAccount}` : '—',
    },
    { label: 'Fee', value: fee === 0 ? 'Free' : formatCurrency(fee) },
    {
      label: 'Status',
      value: (
        <View className="flex-row items-center gap-1.5">
          <View className="h-1.5 w-1.5 rounded-full bg-success" />
          <Text variant="bodySm" weight="medium" tone="success">
            Successful
          </Text>
        </View>
      ),
    },
  ] as const;

  return (
    <Screen edges={['top', 'bottom']} contentClassName="pb-10">
      {/* Success illustration */}
      <View className="mt-10 items-center" aria-hidden>
        <View style={{ width: 140, height: 140 }}>
          <View
            style={{
              position: 'absolute',
              inset: 0,
              borderRadius: 70,
              backgroundColor: colors['accent-soft'],
            }}
          />
          <View
            style={{
              position: 'absolute',
              inset: 18,
              borderRadius: 52,
              backgroundColor: '#CFF0E1',
            }}
          />
          <View
            style={{
              position: 'absolute',
              inset: 36,
              borderRadius: 34,
              backgroundColor: colors.primary,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Check size={34} color={colors['primary-foreground']} strokeWidth={2.6} />
          </View>
        </View>
      </View>

      {/* Status text */}
      <View role="status" className="items-center px-6 pt-[22px]">
        <Text
          style={{ fontSize: 26, letterSpacing: -0.5 }}
          className="text-center font-sans-bold text-foreground"
        >
          Transfer successful
        </Text>
        <Text
          style={{ fontSize: 32, letterSpacing: -1.5 }}
          className="mt-[14px] font-sans-bold text-foreground"
          accessibilityLabel={`${formatCurrency(amount)} transferred`}
        >
          {formatCurrency(amount)}
        </Text>
        <Text variant="body" tone="muted" className="mt-1.5">
          sent to{' '}
          <Text variant="body" weight="semibold">
            {recipient?.fullName ?? '—'}
          </Text>
        </Text>
      </View>

      {/* Receipt */}
      <View className="mt-[26px]">
        <KeyValueList items={kvItems} />
      </View>

      {/* Actions */}
      <View className="mt-auto flex-row gap-md pt-xl">
        <Button
          label="Share receipt"
          leadingIcon={Share}
          variant="secondary"
          className="flex-1"
          onPress={() => showMessage('Share receipt', 'Sharing is coming in a later module.')}
        />
        <Button label="Done" className="flex-1" onPress={() => router.replace('/')} />
      </View>
    </Screen>
  );
}
