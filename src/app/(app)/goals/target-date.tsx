import { useState } from 'react';
import { Pressable, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';

import { useTheme } from '@/components/layout/ThemeProvider';
import { Screen } from '@/components/layout/Screen';
import { IconButton, Text } from '@/components/ui';
import { Check, ICON_STROKE, X } from '@/constants/icons';
import { cn } from '@/lib/cn';
import { useSavings } from '@/store/savings';
import { formatLongDate, monthEnds } from '@/utils/savings';

/** Month-end dates offered, starting next month. */
const MONTHS_OFFERED = 36;

function sameDay(a: string, b: string | undefined) {
  return b !== undefined && new Date(a).toDateString() === new Date(b).toDateString();
}

// Target date picker for New savings goal (27), shown as a form sheet.
// Goals end on a month end, so a list of month ends replaces a full calendar.
export default function TargetDateScreen() {
  const { colors } = useTheme();
  const { selected } = useLocalSearchParams<{ selected?: string }>();
  const { setDraftTargetDate } = useSavings();
  const [dates] = useState(() => monthEnds(MONTHS_OFFERED));

  const choose = (iso: string) => {
    setDraftTargetDate(iso);
    router.back();
  };

  return (
    <Screen scroll background="surface" edges={['bottom']} contentClassName="pb-lg">
      <View className="mt-2.5 h-[5px] w-10 self-center rounded-full bg-border-strong" />

      <View className="mt-md flex-row items-center justify-between">
        <Text variant="h1" accessibilityRole="header" style={{ fontSize: 24, lineHeight: 32 }}>
          Target date
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
      <Text variant="bodySm" tone="muted" className="mt-1">
        Goals finish on the last day of the month you pick.
      </Text>

      <View accessibilityRole="radiogroup" className="mt-md">
        {dates.map((iso, index) => {
          const isSelected = sameDay(iso, selected);
          return (
            <Pressable
              key={iso}
              accessibilityRole="radio"
              accessibilityState={{ checked: isSelected }}
              onPress={() => choose(iso)}
              className={cn(
                'flex-row items-center py-[14px] active:opacity-70',
                index > 0 && 'border-t border-surface-muted'
              )}
            >
              <Text variant="body" weight={isSelected ? 'semibold' : 'medium'} className="flex-1">
                {formatLongDate(iso)}
              </Text>
              {isSelected && <Check size={20} color={colors.accent} strokeWidth={ICON_STROKE} />}
            </Pressable>
          );
        })}
      </View>
    </Screen>
  );
}
