import { useEffect, useMemo, useState } from 'react';
import { Pressable, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';

import { formatAmountInput } from '@/components/forms/NumberPad';
import { TextField } from '@/components/forms/TextField';
import { useTheme } from '@/components/layout/ThemeProvider';
import { Screen } from '@/components/layout/Screen';
import { ScreenHeader } from '@/components/layout/ScreenHeader';
import { goalIconLabels, goalIcons } from '@/components/money/goalIcons';
import { Button, SegmentedControl, Text } from '@/components/ui';
import { Calendar, ICON_STROKE, Lightbulb } from '@/constants/icons';
import { cn } from '@/lib/cn';
import { currentAccount } from '@/mock/accounts';
import { useSavings } from '@/store/savings';
import type { AutoSaveFrequency, SavingsGoalIcon } from '@/types/savings';
import { formatDate, formatWholeCurrency } from '@/utils/format';
import { autoSaveAmount, formatLongDate, monthEnds } from '@/utils/savings';

/** The six icons on the design's picker, in order. */
const PICKER_ICONS: readonly SavingsGoalIcon[] = [
  'house',
  'shield',
  'plane',
  'laptop',
  'graduation-cap',
  'car',
];

const FREQUENCIES = [
  { value: 'weekly', label: 'Weekly' },
  { value: 'monthly', label: 'Monthly' },
  { value: 'manual', label: 'Manual' },
] as const satisfies readonly { value: AutoSaveFrequency; label: string }[];

const MIN_TARGET = 1000;
const MAX_TARGET_DIGITS = 10;
const MAX_NAME_LENGTH = 30;

function isGoalIcon(value: string | undefined): value is SavingsGoalIcon {
  return value !== undefined && value in goalIcons;
}

// Design 27 — New savings goal. Suggestions on Savings (26) pass a name and icon.
export default function NewGoalScreen() {
  const { colors } = useTheme();
  const params = useLocalSearchParams<{ name?: string; icon?: string }>();
  const { createGoal, draftTargetDate, setDraftTargetDate } = useSavings();

  const suggestedIcon = isGoalIcon(params.icon) ? params.icon : undefined;
  const [icon, setIcon] = useState<SavingsGoalIcon>(suggestedIcon ?? 'house');
  const [name, setName] = useState(params.name ?? '');
  const [targetDigits, setTargetDigits] = useState('');
  const [frequency, setFrequency] = useState<AutoSaveFrequency>('monthly');

  // A suggestion's icon that isn't on the picker (e.g. gifts) takes the last slot.
  const pickerIcons = useMemo(
    () =>
      suggestedIcon && !PICKER_ICONS.includes(suggestedIcon)
        ? [...PICKER_ICONS.slice(0, -1), suggestedIcon]
        : PICKER_ICONS,
    [suggestedIcon]
  );

  // Default: the end of the month three months out (design: mid-Oct → 31 Jan).
  const [defaultDate] = useState(() => monthEnds(1, new Date(), 3)[0] ?? new Date().toISOString());
  const targetDate = draftTargetDate ?? defaultDate;

  // The date choice belongs to this form; clear it when the form closes.
  useEffect(() => () => setDraftTargetDate(null), [setDraftTargetDate]);

  const target = Number(targetDigits) || 0;
  const tooSmall = target > 0 && target < MIN_TARGET;
  const valid = name.trim().length > 0 && target >= MIN_TARGET;

  const perPeriod = autoSaveAmount(target, targetDate, frequency);
  const monthly = autoSaveAmount(target, targetDate, 'monthly');
  const byDate = formatDate(targetDate);

  const submit = () => {
    if (!valid) return;
    const goal = createGoal({
      name: name.trim(),
      icon,
      target,
      targetDate,
      autoSave: { frequency, amount: perPeriod },
    });
    // Replace so Back from the new goal returns to Savings, not this form.
    router.replace({ pathname: '/goals/[id]', params: { id: goal.id } });
  };

  return (
    <Screen scroll contentClassName="pb-3xl">
      <ScreenHeader largeTitle="New savings goal" />

      <View className="pt-[18px]">
        <Text variant="caption" weight="medium" tone="label" className="mb-1.5">
          Choose an icon
        </Text>
        <View accessibilityRole="radiogroup" className="flex-row gap-2">
          {pickerIcons.map((key) => {
            const Icon = goalIcons[key];
            const selected = key === icon;
            return (
              <Pressable
                key={key}
                accessibilityRole="radio"
                accessibilityLabel={goalIconLabels[key]}
                accessibilityState={{ checked: selected }}
                onPress={() => setIcon(key)}
                className={cn(
                  'h-[52px] flex-1 items-center justify-center rounded-button',
                  selected
                    ? 'border-2 border-primary bg-accent-soft'
                    : 'border border-border bg-surface active:bg-surface-hover'
                )}
              >
                <Icon
                  size={22}
                  color={selected ? colors.accent : colors.label}
                  strokeWidth={ICON_STROKE}
                />
              </Pressable>
            );
          })}
        </View>
      </View>

      <View className="gap-[14px] pt-[18px]">
        <TextField
          label="Goal name"
          value={name}
          onChangeText={setName}
          placeholder="e.g. Rent 2027"
          autoCapitalize="sentences"
          maxLength={MAX_NAME_LENGTH}
          returnKeyType="next"
        />

        <TextField
          label="Target amount"
          value={formatAmountInput(targetDigits)}
          onChangeText={(text) =>
            setTargetDigits(text.replace(/\D/g, '').replace(/^0+/, '').slice(0, MAX_TARGET_DIGITS))
          }
          keyboardType="number-pad"
          inputMode="numeric"
          placeholder="0"
          error={
            tooSmall ? `Set a target of at least ${formatWholeCurrency(MIN_TARGET)}` : undefined
          }
          leading={
            <Text variant="bodyLg" tone="muted" className="-mr-1" accessible={false}>
              ₦
            </Text>
          }
          returnKeyType="done"
        />

        <View className="gap-1.5">
          <Text variant="caption" weight="medium" tone="label" accessible={false}>
            Target date
          </Text>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={`Target date, ${formatLongDate(targetDate)}`}
            accessibilityHint="Opens a list of dates"
            onPress={() =>
              router.push({ pathname: '/goals/target-date', params: { selected: targetDate } })
            }
            className="h-[52px] flex-row items-center gap-2.5 rounded-md border border-border-strong bg-surface px-[14px] active:bg-surface-hover"
          >
            <Text variant="bodyLg" className="flex-1">
              {formatLongDate(targetDate)}
            </Text>
            <Calendar size={20} color={colors.muted} strokeWidth={ICON_STROKE} />
          </Pressable>
        </View>

        <View className="gap-1.5">
          <Text variant="caption" weight="medium" tone="label">
            Auto-save
          </Text>
          <SegmentedControl
            options={FREQUENCIES}
            value={frequency}
            onChange={setFrequency}
            accessibilityLabel="Auto-save"
          />
        </View>
      </View>

      <View
        accessibilityLiveRegion="polite"
        className="mt-[14px] flex-row items-start gap-2.5 rounded-md bg-accent-soft px-[14px] py-md"
      >
        <Lightbulb size={18} color={colors.accent} strokeWidth={ICON_STROKE} />
        <Text variant="caption" tone="label" className="flex-1" style={{ lineHeight: 19 }}>
          {target <= 0 ? (
            'Enter a target amount to see how much to put away.'
          ) : frequency === 'manual' ? (
            <>
              You’ll add money yourself. Aim for about{' '}
              <Text variant="caption" weight="semibold">
                {formatWholeCurrency(monthly)} a month
              </Text>{' '}
              to reach this by {byDate}.
            </>
          ) : (
            <>
              Save about{' '}
              <Text variant="caption" weight="semibold">
                {formatWholeCurrency(perPeriod)} a {frequency === 'weekly' ? 'week' : 'month'}
              </Text>{' '}
              from {currentAccount.name} to reach this by {byDate}.
            </>
          )}
        </Text>
      </View>

      <View className="mt-auto pt-xl">
        <Button label="Create goal" fullWidth disabled={!valid} onPress={submit} />
      </View>
    </Screen>
  );
}
