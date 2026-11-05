import { useState } from 'react';
import { Pressable, View } from 'react-native';
import { router } from 'expo-router';

import { TextField } from '@/components/forms/TextField';
import { useTheme } from '@/components/layout/ThemeProvider';
import { Screen } from '@/components/layout/Screen';
import { IconButton, Text } from '@/components/ui';
import { Check, ICON_STROKE, Landmark, Search, X } from '@/constants/icons';
import { cn } from '@/lib/cn';
import { banks } from '@/mock/banks';
import { useRecipients } from '@/store/recipients';

// Bank picker for Add recipient (18), shown as a form sheet.
export default function SelectBankScreen() {
  const { colors } = useTheme();
  const { selectedBankId, setSelectedBankId } = useRecipients();
  const [query, setQuery] = useState('');
  const needle = query.trim().toLowerCase();
  const shown = needle
    ? banks.filter((bank) => `${bank.name} ${bank.shortName}`.toLowerCase().includes(needle))
    : banks;

  const choose = (id: string) => {
    setSelectedBankId(id);
    router.back();
  };

  return (
    <Screen scroll background="surface" edges={['bottom']} contentClassName="pb-lg">
      <View className="mt-2.5 h-[5px] w-10 self-center rounded-full bg-border-strong" />

      <View className="mt-md flex-row items-center justify-between">
        <Text variant="h1" accessibilityRole="header" style={{ fontSize: 24, lineHeight: 32 }}>
          Select bank
        </Text>
        <IconButton
          icon={X}
          variant="ghost"
          iconSize={22}
          accessibilityLabel="Close"
          onPress={() => router.back()}
          className="-mr-2.5"
        />
      </View>

      <TextField
        value={query}
        onChangeText={setQuery}
        leadingIcon={Search}
        accessibilityLabel="Search banks"
        placeholder="Search banks"
        autoCorrect={false}
        returnKeyType="search"
        containerClassName="mt-md"
      />

      <View className="mt-md">
        {shown.map((bank, index) => {
          const selected = bank.id === selectedBankId;
          return (
            <Pressable
              key={bank.id}
              accessibilityRole="radio"
              accessibilityState={{ selected }}
              accessibilityLabel={bank.name}
              onPress={() => choose(bank.id)}
              className={cn(
                'flex-row items-center gap-md py-md active:opacity-70',
                index > 0 && 'border-t border-surface-muted'
              )}
            >
              <View className="h-9 w-9 items-center justify-center rounded-md bg-surface-muted">
                <Landmark size={18} color={colors.label} strokeWidth={ICON_STROKE} />
              </View>
              <Text variant="body" weight={selected ? 'semibold' : 'medium'} className="flex-1">
                {bank.name}
              </Text>
              {selected && <Check size={20} color={colors.accent} strokeWidth={ICON_STROKE} />}
            </Pressable>
          );
        })}
        {shown.length === 0 && (
          <Text variant="bodySm" tone="muted" className="mt-md text-center">
            No banks match “{query.trim()}”.
          </Text>
        )}
      </View>
    </Screen>
  );
}
