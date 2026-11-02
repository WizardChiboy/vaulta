import { Pressable, View } from 'react-native';

import { useTheme } from '@/components/layout/ThemeProvider';
import { ICON_STROKE, type LucideIcon } from '@/constants/icons';
import { cn } from '@/lib/cn';
import { Text } from './Text';

export type ChipProps = {
  label: string;
  selected?: boolean | undefined;
  /** 14px icon before the label, e.g. the clock on recent searches (13). */
  leadingIcon?: LucideIcon | undefined;
  /** Green count pill after the label, e.g. unread notifications (15). Hidden at 0. */
  count?: number | undefined;
  onPress: () => void;
  accessibilityLabel?: string | undefined;
  className?: string | undefined;
};

/** Design .chip: 36px pill; selected is soft green with a green border and text (11 13 14 15 19 22). */
export function Chip({
  label,
  selected = false,
  leadingIcon: LeadingIcon,
  count,
  onPress,
  accessibilityLabel,
  className,
}: ChipProps) {
  const { colors } = useTheme();

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      accessibilityState={{ selected }}
      onPress={onPress}
      className={cn(
        'h-9 flex-row items-center justify-center gap-1.5 rounded-full border active:opacity-70',
        LeadingIcon ? 'px-md' : 'px-3.5',
        selected ? 'border-primary bg-accent-soft' : 'border-border bg-surface',
        className
      )}
    >
      {LeadingIcon && (
        <LeadingIcon
          size={14}
          color={selected ? colors.accent : colors.subtle}
          strokeWidth={selected ? 2.6 : ICON_STROKE}
        />
      )}
      <Text
        variant="bodySm"
        weight={selected ? 'semibold' : 'medium'}
        tone={selected ? 'accent' : 'label'}
      >
        {label}
      </Text>
      {!!count && (
        <View className="rounded-full bg-primary px-[7px] py-px">
          <Text variant="xs" weight="bold" tone="primary">
            {count}
          </Text>
        </View>
      )}
    </Pressable>
  );
}
