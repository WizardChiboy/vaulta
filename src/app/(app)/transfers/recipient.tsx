import { useState } from 'react';
import { Pressable, TextInput, View } from 'react-native';
import { router } from 'expo-router';

import { useTheme } from '@/components/layout/ThemeProvider';
import { Screen } from '@/components/layout/Screen';
import { ScreenHeader } from '@/components/layout/ScreenHeader';
import { Avatar, Badge, Card, Text } from '@/components/ui';
import { ChevronRight, CircleX, ICON_STROKE, Plus, Search, Star } from '@/constants/icons';
import { fontFamily, typeScale } from '@/constants/theme';
import { cn } from '@/lib/cn';
import { showMessage } from '@/lib/notify';
import { useRecipients } from '@/store/recipients';
import type { Recipient } from '@/types/recipient';

const compact = (value: string) => value.toLowerCase().replace(/[\s•]/g, '');

/** Matches name, nickname, bank or account digits ("0123", "@kel"). */
function matches(recipient: Recipient, query: string) {
  const needle = compact(query);
  return [recipient.fullName, recipient.shortName, recipient.bank, recipient.maskedAccount].some(
    (field) => compact(field).includes(needle)
  );
}

// Design 17 — Select recipient.
export default function SelectRecipientScreen() {
  const { colors } = useTheme();
  const { recipients } = useRecipients();
  const [query, setQuery] = useState('');
  const [focused, setFocused] = useState(false);
  const trimmed = query.trim();
  const shown = trimmed
    ? recipients.filter((recipient) => matches(recipient, trimmed))
    : recipients;

  const selectRecipient = (recipient: Recipient) =>
    showMessage(
      `Send to ${recipient.fullName}`,
      'This is a demo — entering an amount is coming in a later module.'
    );

  return (
    <Screen scroll edges={['top', 'bottom']} contentClassName="pb-xl">
      <ScreenHeader largeTitle="Send to" />

      <View
        className={cn(
          'mt-lg h-12 flex-row items-center rounded-md bg-surface',
          focused ? 'border-2 border-primary px-3' : 'border border-border-strong px-[13px]'
        )}
      >
        <Search size={20} color={colors.muted} strokeWidth={ICON_STROKE} />
        <TextInput
          value={query}
          onChangeText={setQuery}
          autoCorrect={false}
          autoCapitalize="none"
          returnKeyType="search"
          enterKeyHint="search"
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          accessibilityLabel="Search recipients"
          placeholder="Name, account number or bank"
          placeholderTextColor={colors.subtle}
          cursorColor={colors.primary}
          selectionColor={colors.primary}
          // fontSize only: a fixed lineHeight misaligns TextInput text on iOS.
          className="h-full flex-1 px-2.5 text-foreground"
          style={{ fontFamily: fontFamily.regular, fontSize: typeScale.body[0] }}
        />
        {query !== '' && (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Clear search"
            onPress={() => setQuery('')}
            hitSlop={8}
            className="-mr-1 h-10 w-10 items-center justify-center"
          >
            <CircleX size={18} color={colors.surface} fill={colors['border-strong']} />
          </Pressable>
        )}
      </View>

      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Add new recipient. Send to someone for the first time"
        onPress={() => router.push('/transfers/add-recipient')}
        className="mt-[14px] flex-row items-center gap-md rounded-lg border border-border bg-surface px-lg py-md active:bg-surface-hover"
      >
        <View className="h-10 w-10 items-center justify-center rounded-full bg-primary">
          <Plus size={20} color={colors['primary-foreground']} strokeWidth={2.2} />
        </View>
        <View className="flex-1">
          <Text variant="body" weight="semibold">
            Add new recipient
          </Text>
          <Text variant="caption" tone="muted" className="mt-0.5">
            Send to someone for the first time
          </Text>
        </View>
        <ChevronRight size={18} color={colors.subtle} strokeWidth={ICON_STROKE} />
      </Pressable>

      <Text
        variant="caption"
        weight="semibold"
        tone="muted"
        accessibilityRole="header"
        accessibilityLiveRegion="polite"
        className="mb-sm mt-5"
      >
        {trimmed
          ? `${shown.length} ${shown.length === 1 ? 'match' : 'matches'} for “${trimmed}”`
          : `Saved recipients · ${recipients.length}`}
      </Text>

      {shown.length > 0 ? (
        <Card padded={false} className="overflow-hidden">
          {shown.map((recipient, index) => (
            <RecipientRow
              key={recipient.id}
              recipient={recipient}
              divider={index > 0}
              onPress={() => selectRecipient(recipient)}
            />
          ))}
        </Card>
      ) : (
        <Text variant="bodySm" tone="muted" className="mt-md text-center">
          No saved recipients match. Add them as a new recipient instead.
        </Text>
      )}
    </Screen>
  );
}

type RecipientRowProps = {
  recipient: Recipient;
  divider: boolean;
  onPress: () => void;
};

function RecipientRow({ recipient, divider, onPress }: RecipientRowProps) {
  const { colors } = useTheme();
  const subtitle = `${recipient.bank} · ${recipient.maskedAccount}`;
  const extras = [recipient.favourite && 'favourite', recipient.vaulta && 'free transfer']
    .filter(Boolean)
    .join(', ');

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${recipient.fullName}, ${subtitle}${extras ? `, ${extras}` : ''}`}
      onPress={onPress}
      className={cn(
        'flex-row items-center gap-md px-lg py-[11px] active:bg-surface-hover',
        divider && 'border-t border-surface-muted'
      )}
    >
      <Avatar name={recipient.fullName} size="sm" tone={recipient.tone} />
      <View className="flex-1">
        <Text variant="body" weight="medium" numberOfLines={1}>
          {recipient.fullName}
        </Text>
        <Text variant="caption" tone="muted" numberOfLines={1} className="mt-0.5">
          {subtitle}
        </Text>
      </View>
      {recipient.vaulta && <Badge label="Free" tone="accent" />}
      {recipient.favourite && (
        <Star size={18} color={colors.warning} fill={colors.warning} strokeWidth={ICON_STROKE} />
      )}
    </Pressable>
  );
}
