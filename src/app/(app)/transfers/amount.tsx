import { useState } from 'react';
import { Pressable, TextInput, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';

import { useTheme } from '@/components/layout/ThemeProvider';
import { Screen } from '@/components/layout/Screen';
import { ScreenHeader } from '@/components/layout/ScreenHeader';
import { Avatar, Button, Card, Text } from '@/components/ui';
import { Chip } from '@/components/ui/Chip';
import { Delete, ICON_STROKE, Pencil } from '@/constants/icons';
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

/** Format raw digit string for display, e.g. "75000" → "75,000". */
function formatAmountInput(raw: string): string {
  if (!raw) return '';
  const dotIdx = raw.indexOf('.');
  const wholePart = dotIdx === -1 ? raw : raw.slice(0, dotIdx);
  const decPart = dotIdx === -1 ? undefined : raw.slice(dotIdx + 1);
  const wholeNum = parseInt(wholePart, 10);
  const formatted = Number.isNaN(wholeNum) ? '' : wholeNum.toLocaleString('en-NG');
  return decPart !== undefined ? `${formatted}.${decPart}` : formatted;
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

  function handleKey(key: string): void {
    setRawInput((prev) => {
      if (key === 'del') return prev.slice(0, -1);
      if (key === '.') {
        if (prev.includes('.')) return prev;
        return prev === '' ? '0.' : prev + '.';
      }
      // No leading zeros on integer part
      if (prev === '0') return key;
      // Max 2 decimal places
      const dotIdx = prev.indexOf('.');
      if (dotIdx !== -1 && prev.length - dotIdx > 2) return prev;
      // Max 9 integer digits (₦999,999,999)
      const wholePart = dotIdx === -1 ? prev : prev.slice(0, dotIdx);
      if (dotIdx === -1 && wholePart.length >= 9) return prev;
      return prev + key;
    });
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
      <View className="mt-auto pb-6 pt-lg" accessibilityLabel="Number pad">
        <NumberPad onKey={handleKey} />
      </View>
    </Screen>
  );
}

type NumberPadProps = { onKey: (key: string) => void };

function NumberPad({ onKey }: NumberPadProps) {
  const { colors } = useTheme();

  const rows = [
    ['1', '2', '3'],
    ['4', '5', '6'],
    ['7', '8', '9'],
    ['.', '0', 'del'],
  ] as const;

  return (
    <View style={{ gap: 4 }}>
      {rows.map((row) => (
        <View key={row.join()} style={{ flexDirection: 'row', gap: 4 }}>
          {row.map((key) => (
            <Pressable
              key={key}
              accessibilityRole="button"
              accessibilityLabel={key === 'del' ? 'Delete' : key}
              onPress={() => onKey(key)}
              style={({ pressed }) => ({
                flex: 1,
                height: 52,
                borderRadius: 12,
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: pressed ? colors['surface-hover'] : 'transparent',
              })}
            >
              {key === 'del' ? (
                <Delete size={24} color={colors.foreground} strokeWidth={ICON_STROKE} />
              ) : (
                <Text style={{ fontSize: 24 }} className="font-sans-medium text-foreground">
                  {key}
                </Text>
              )}
            </Pressable>
          ))}
        </View>
      ))}
    </View>
  );
}
