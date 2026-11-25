import { useState } from 'react';
import { Pressable, TextInput, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';

import {
  applyAmountKey,
  formatAmountInput,
  NumberPad,
  type NumberPadKey,
} from '@/components/forms/NumberPad';
import { useTheme } from '@/components/layout/ThemeProvider';
import { Screen } from '@/components/layout/Screen';
import { ScreenHeader } from '@/components/layout/ScreenHeader';
import { Avatar, Button, Card, Text } from '@/components/ui';
import { Chip } from '@/components/ui/Chip';
import { ICON_STROKE, Pencil } from '@/constants/icons';
import { fontFamily, typeScale } from '@/constants/theme';
import { currentAccount } from '@/mock/accounts';
import { useRecipients } from '@/store/recipients';
import { formatCurrency, formatWholeCurrency } from '@/utils/format';

const QUICK_AMOUNTS = [5000, 10000, 75000, 100000] as const;

/** NIP fee for a bank transfer (₦0 for Vaulta-to-Vaulta). */
export function calcTransferFee(amount: number, isVaulta: boolean): number {
  if (isVaulta || amount <= 0) return 0;
  if (amount <= 5000) return 10.75;
  return 26.88;
}

// Design 19 — Enter amount.
export default function EnterAmountScreen() {
  const { colors } = useTheme();
  const { recipientId } = useLocalSearchParams<{ recipientId: string }>();
  const { getRecipient } = useRecipients();

  const recipient = getRecipient(recipientId);
  const [rawInput, setRawInput] = useState('');
  const [note, setNote] = useState('');

  const numAmount = parseFloat(rawInput) || 0;
  const isValid = numAmount > 0 && numAmount <= currentAccount.balance;

  function handleKey(key: NumberPadKey): void {
    setRawInput((previous) => applyAmountKey(previous, key));
  }

  function goToReview(): void {
    router.push({
      pathname: '/transfers/review',
      params: { recipientId, amount: rawInput, note },
    });
  }

  return (
    <Screen scroll edges={['top', 'bottom']}>
      <ScreenHeader title="Send money" />

      {recipient ? (
        <Card padded={false} className="mt-sm flex-row items-center gap-md px-[14px] py-md">
          <Avatar name={recipient.fullName} tone={recipient.tone} size="sm" />
          <View className="flex-1">
            <Text variant="body" weight="semibold">
              {recipient.fullName}
            </Text>
            <Text variant="caption" tone="muted" className="mt-0.5">
              {recipient.bank} · {recipient.maskedAccount}
            </Text>
          </View>
          <Pressable
            accessibilityRole="link"
            accessibilityLabel="Change recipient"
            onPress={() => router.back()}
            hitSlop={8}
          >
            <Text variant="bodySm" weight="semibold" tone="accent">
              Change
            </Text>
          </Pressable>
        </Card>
      ) : null}

      {/* Amount display */}
      <View className="items-center" style={{ paddingTop: 26 }}>
        <Text variant="caption" weight="medium" tone="muted">
          Amount
        </Text>
        <View className="mt-1.5 flex-row items-center justify-center">
          <Text
            style={{ fontSize: 30, color: colors.muted, marginRight: 2 }}
            className="font-sans-semibold"
          >
            ₦
          </Text>
          <Text
            style={{ fontSize: 44, letterSpacing: -1.5 }}
            className="font-sans-bold text-foreground"
            accessibilityLabel={`Amount: ${formatAmountInput(rawInput) || '0'} naira`}
          >
            {formatAmountInput(rawInput) || '0'}
          </Text>
          <View
            style={{ width: 2, height: 40, backgroundColor: colors.primary, marginLeft: -6 }}
            aria-hidden
          />
        </View>
        <Text variant="caption" tone="muted" className="mt-1.5">
          Available balance:{' '}
          <Text variant="caption" weight="semibold">
            {formatCurrency(currentAccount.balance)}
          </Text>
        </Text>
      </View>

      {/* Quick amount chips */}
      <View className="mt-lg flex-row gap-sm">
        {QUICK_AMOUNTS.map((qAmt) => (
          <Chip
            key={qAmt}
            label={formatWholeCurrency(qAmt)}
            selected={numAmount === qAmt}
            onPress={() => setRawInput(String(qAmt))}
            className="flex-1"
          />
        ))}
      </View>

      {/* Note input */}
      <View className="relative mt-[14px]">
        <Pencil
          size={18}
          color={colors.muted}
          strokeWidth={ICON_STROKE}
          style={{ position: 'absolute', left: 14, top: 15, zIndex: 1 }}
        />
        <TextInput
          placeholder="Add a note (optional)"
          placeholderTextColor={colors.subtle}
          value={note}
          onChangeText={setNote}
          returnKeyType="done"
          cursorColor={colors.primary}
          selectionColor={colors.primary}
          accessibilityLabel="Note (optional)"
          className="h-12 rounded-md border border-border-strong bg-surface text-foreground"
          style={{
            fontFamily: fontFamily.regular,
            fontSize: typeScale.body[0],
            paddingLeft: 42,
            paddingRight: 14,
          }}
        />
      </View>

      {/* Continue button */}
      <Button
        label="Continue"
        fullWidth
        disabled={!isValid}
        onPress={goToReview}
        className="mt-lg"
      />

      {/* Number pad — pushed to bottom of scroll content */}
      <View className="mt-auto pb-6 pt-lg">
        <NumberPad onKey={handleKey} />
      </View>
    </Screen>
  );
}
