import { useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, View } from 'react-native';
import { router } from 'expo-router';

import { Switch } from '@/components/forms/Switch';
import { TextField } from '@/components/forms/TextField';
import { useTheme } from '@/components/layout/ThemeProvider';
import { Screen } from '@/components/layout/Screen';
import { ScreenHeader } from '@/components/layout/ScreenHeader';
import { Button, getInitials, Text } from '@/components/ui';
import { Check, ChevronDown, ICON_STROKE, Landmark } from '@/constants/icons';
import { showMessage } from '@/lib/notify';
import { getBank } from '@/mock/banks';
import { ACCOUNT_NUMBER_LENGTH, lookupAccount, maskAccountNumber } from '@/services/recipients';
import { useRecipients } from '@/store/recipients';
import type { AccountLookup } from '@/types/recipient';
import { firstName } from '@/utils/format';

/** "TUNDE ADEWALE BAKARE" → "Tunde Bakare", as recipients are listed (16, 17). */
function displayName(accountName: string) {
  const parts = accountName.trim().toLowerCase().split(/\s+/);
  const titled = parts.map((part) => part.charAt(0).toUpperCase() + part.slice(1));
  return titled.length > 2 ? `${titled[0] ?? ''} ${titled.at(-1) ?? ''}` : titled.join(' ');
}

// Design 18 — Add recipient.
export default function AddRecipientScreen() {
  const { colors } = useTheme();
  const { selectedBankId, setSelectedBankId, saveRecipient } = useRecipients();
  const bank = getBank(selectedBankId);
  const [accountNumber, setAccountNumber] = useState('');
  const [nickname, setNickname] = useState('');
  const [save, setSave] = useState(true);
  // Lookup result and the bank + number it answers, so a stale response is never shown.
  const [lookup, setLookup] = useState<{ key: string; result: AccountLookup } | null>(null);

  // The bank choice belongs to this form; clear it when the form closes.
  useEffect(() => () => setSelectedBankId(null), [setSelectedBankId]);

  const complete = accountNumber.length === ACCOUNT_NUMBER_LENGTH;
  const bankId = bank?.id;
  const lookupKey = bankId && complete ? `${bankId}:${accountNumber}` : null;

  useEffect(() => {
    if (!bankId || !lookupKey) return;
    let active = true;
    void lookupAccount(bankId, accountNumber).then((result) => {
      if (active) setLookup({ key: lookupKey, result });
    });
    return () => {
      active = false;
    };
  }, [bankId, accountNumber, lookupKey]);

  const result = lookupKey && lookup?.key === lookupKey ? lookup.result : null;
  const verifying = lookupKey !== null && result === null;
  const accountName = result?.found ? result.accountName : null;
  const notFound = result?.found === false;

  const recipientName = accountName ? displayName(accountName) : '';
  const shortName = nickname.trim() || firstName(recipientName);

  const submit = () => {
    if (!bank || !accountName) return;
    if (save) {
      saveRecipient({
        fullName: recipientName,
        shortName,
        bank: bank.shortName,
        maskedAccount: maskAccountNumber(accountNumber),
      });
    }
    showMessage(
      save ? `${shortName} saved` : `Send to ${recipientName}`,
      'This is a demo — entering an amount is coming in a later module.'
    );
    // Back to Select recipient (17), where a saved recipient now appears.
    router.back();
  };

  return (
    <Screen scroll contentClassName="pb-3xl">
      <ScreenHeader largeTitle="Add recipient" />
      <Text variant="body" tone="muted" className="mt-sm" style={{ lineHeight: 22 }}>
        We’ll confirm the account name before you send anything.
      </Text>

      <View className="gap-lg pt-[22px]">
        <View className="gap-1.5">
          <Text variant="caption" weight="medium" tone="label" accessible={false}>
            Bank
          </Text>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={`Bank, ${bank?.name ?? 'not selected'}`}
            accessibilityHint="Opens the list of banks"
            onPress={() => router.push('/transfers/bank')}
            className="h-[52px] flex-row items-center gap-2.5 rounded-md border border-border-strong bg-surface px-[14px] active:bg-surface-hover"
          >
            <View className="h-7 w-7 items-center justify-center rounded-sm bg-surface-muted">
              <Landmark size={16} color={colors.label} strokeWidth={ICON_STROKE} />
            </View>
            <Text variant="bodyLg" tone={bank ? 'default' : 'subtle'} className="flex-1">
              {bank?.name ?? 'Select bank'}
            </Text>
            <ChevronDown size={18} color={colors.muted} strokeWidth={ICON_STROKE} />
          </Pressable>
        </View>

        <TextField
          label="Account number"
          value={accountNumber}
          onChangeText={(text) =>
            setAccountNumber(text.replace(/\D/g, '').slice(0, ACCOUNT_NUMBER_LENGTH))
          }
          keyboardType="number-pad"
          inputMode="numeric"
          maxLength={ACCOUNT_NUMBER_LENGTH}
          placeholder="10-digit account number"
          valid={accountName !== null}
          error={
            notFound
              ? `We couldn’t find this account at ${bank?.shortName ?? 'this bank'}. Check the number and try again.`
              : undefined
          }
          hint={
            !bank && complete
              ? 'Select the bank to confirm the account name'
              : `${accountNumber.length} of ${ACCOUNT_NUMBER_LENGTH} digits`
          }
          trailing={
            accountName ? (
              <View className="h-[22px] w-[22px] items-center justify-center rounded-full bg-primary">
                <Check size={13} color={colors['primary-foreground']} strokeWidth={3} />
              </View>
            ) : undefined
          }
        />

        {verifying && (
          <View
            accessibilityRole="progressbar"
            accessibilityLabel="Verifying account name"
            className="flex-row items-center gap-md rounded-button border border-border bg-surface p-[14px]"
          >
            <ActivityIndicator size="small" color={colors.primary} />
            <Text variant="bodySm" tone="muted">
              Verifying account name…
            </Text>
          </View>
        )}

        {accountName && (
          <View
            accessibilityLiveRegion="polite"
            accessible
            accessibilityLabel={`Account verified: ${accountName}`}
            className="flex-row items-center gap-md rounded-button border border-green-200 bg-accent-soft p-[14px]"
          >
            <View className="h-10 w-10 items-center justify-center rounded-full bg-surface">
              <Text variant="caption" weight="bold" tone="accent">
                {getInitials(recipientName)}
              </Text>
            </View>
            <View className="flex-1">
              <Text variant="small" weight="semibold" tone="accent">
                Account verified
              </Text>
              <Text
                variant="body"
                weight="semibold"
                className="mt-0.5"
                style={{ letterSpacing: 0.15 }}
              >
                {accountName.toUpperCase()}
              </Text>
            </View>
          </View>
        )}

        <TextField
          label="Nickname (optional)"
          value={nickname}
          onChangeText={setNickname}
          placeholder={shortName ? `e.g. ${shortName}` : 'e.g. Tunde'}
          autoCapitalize="words"
          maxLength={24}
          returnKeyType="done"
        />

        <View className="flex-row items-center justify-between gap-lg rounded-button border border-border bg-surface px-lg py-[14px]">
          <View className="flex-1">
            <Text variant="body" weight="medium">
              Save as beneficiary
            </Text>
            <Text variant="caption" tone="muted" className="mt-0.5">
              Find {shortName || 'them'} faster next time
            </Text>
          </View>
          <Switch value={save} onValueChange={setSave} accessibilityLabel="Save as beneficiary" />
        </View>
      </View>

      <View className="mt-auto pt-xl">
        <Button label="Continue" fullWidth disabled={!accountName} onPress={submit} />
      </View>
    </Screen>
  );
}
