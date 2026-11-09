import { View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';

import { useTheme } from '@/components/layout/ThemeProvider';
import { Screen } from '@/components/layout/Screen';
import { ScreenHeader } from '@/components/layout/ScreenHeader';
import { Avatar, Button, Card, Text } from '@/components/ui';
import { ArrowRight, ICON_STROKE, Lock, ShieldCheck } from '@/constants/icons';
import { currentAccount } from '@/mock/accounts';
import { useRecipients } from '@/store/recipients';
import { formatCurrency } from '@/utils/format';
import { calcTransferFee } from './amount';

function generateReference(): string {
  const now = new Date();
  const yy = now.getFullYear().toString().slice(-2);
  const mm = String(now.getMonth() + 1).padStart(2, '0');
  const rand = Math.floor(Math.random() * 9000 + 1000);
  const rand2 = Math.floor(Math.random() * 9000 + 1000);
  return `VLT-${yy}${mm}-${rand}-${rand2}`;
}

// Design 20 — Review transfer.
export default function ReviewTransferScreen() {
  const { colors } = useTheme();
  const {
    recipientId,
    amount: amountStr,
    note,
  } = useLocalSearchParams<{
    recipientId: string;
    amount: string;
    note: string;
  }>();
  const { getRecipient } = useRecipients();

  const recipient = getRecipient(recipientId);
  const amount = parseFloat(amountStr) || 0;
  const isVaulta = recipient?.vaulta === true;
  const fee = calcTransferFee(amount, isVaulta);
  const total = amount + fee;

  function confirmAndSend(): void {
    router.replace({
      pathname: '/transfers/success',
      params: {
        recipientId,
        amount: amountStr,
        fee: fee.toFixed(2),
        note,
        reference: generateReference(),
        sentAt: new Date().toISOString(),
      },
    });
  }

  return (
    <Screen scroll edges={['top', 'bottom']} contentClassName="pb-xl">
      <ScreenHeader title="Review transfer" />

      {/* Sender → Recipient avatars */}
      <View className="mt-[18px] items-center">
        <View className="flex-row items-center" aria-hidden>
          <View className="h-[52px] w-[52px] items-center justify-center rounded-full border-[3px] border-background bg-brand">
            <Text style={{ fontSize: 15 }} className="font-sans-bold text-brand-foreground">
              AO
            </Text>
          </View>
          <View className="z-10 -mx-1.5 h-8 w-8 items-center justify-center rounded-full border border-border bg-surface">
            <ArrowRight size={16} color={colors.accent} strokeWidth={2.2} />
          </View>
          <View className="h-[52px] w-[52px] items-center justify-center rounded-full border-[3px] border-background bg-accent-soft">
            <Avatar name={recipient?.fullName ?? ''} tone={recipient?.tone ?? 'green'} size="sm" />
          </View>
        </View>

        <Text variant="bodySm" tone="muted" className="mt-[14px]">
          You&apos;re sending
        </Text>
        <Text
          style={{ fontSize: 36, letterSpacing: -1.5 }}
          className="mt-1 font-sans-bold text-foreground"
          accessibilityRole="header"
        >
          {formatCurrency(amount)}
        </Text>
        <Text variant="bodySm" className="mt-1">
          to{' '}
          <Text variant="bodySm" weight="semibold">
            {recipient?.fullName ?? '—'}
          </Text>
        </Text>
      </View>

      {/* Transfer details — all rows in one card */}
      <Card padded={false} className="mt-[22px]">
        <KvRow label="From" value={`${currentAccount.name} · •• ${currentAccount.maskedNumber}`} />
        <KvRow label="Bank" value={recipient?.bank ?? '—'} />
        <KvRow label="Account number" value={recipient?.maskedAccount ?? '—'} />
        {!!note && <KvRow label="Note" value={note} />}
        <View className="mx-lg my-1 h-px bg-surface-muted" />
        <KvRow label="Amount" value={formatCurrency(amount)} />
        <KvRow label="Transfer fee" value={fee === 0 ? 'Free' : formatCurrency(fee)} />
        <View className="mx-lg my-1 h-px bg-surface-muted" />
        <View className="flex-row items-center justify-between gap-md px-lg py-[13px]">
          <Text variant="body" weight="semibold">
            Total
          </Text>
          <Text style={{ fontSize: 16 }} className="font-sans-bold text-foreground">
            {formatCurrency(total)}
          </Text>
        </View>
      </Card>

      {/* Security note */}
      <View className="mt-[14px] flex-row gap-[10px] rounded-xl bg-surface-muted px-[14px] py-md">
        <ShieldCheck size={18} color={colors.accent} strokeWidth={ICON_STROKE} />
        <Text variant="caption" tone="label" style={{ flex: 1, lineHeight: 20 }}>
          You&apos;ll confirm with Face ID. Transfers to other banks usually arrive within minutes.
        </Text>
      </View>

      {/* Actions */}
      <View className="mt-auto gap-sm pt-lg">
        <Button label="Confirm and send" leadingIcon={Lock} fullWidth onPress={confirmAndSend} />
        <Button label="Edit details" variant="outline" fullWidth onPress={() => router.back()} />
      </View>
    </Screen>
  );
}

function KvRow({ label, value }: { label: string; value: string }) {
  return (
    <View className="flex-row items-center justify-between gap-md px-lg py-[13px]">
      <Text variant="bodySm" tone="muted">
        {label}
      </Text>
      <Text variant="bodySm" weight="medium" className="flex-shrink text-right">
        {value}
      </Text>
    </View>
  );
}
