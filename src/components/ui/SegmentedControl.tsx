import { Pressable, View } from 'react-native';

import { shadows } from '@/constants/theme';
import { cn } from '@/lib/cn';
import { Text } from './Text';

export type SegmentedControlProps<T extends string> = {
  options: readonly { value: T; label: string }[];
  value: T;
  onChange: (value: T) => void;
  accessibilityLabel?: string | undefined;
  className?: string | undefined;
};

/** Sunken track with a raised white selected segment (designs 02, 14). */
export function SegmentedControl<T extends string>({
  options,
  value,
  onChange,
  accessibilityLabel,
  className,
}: SegmentedControlProps<T>) {
  return (
    <View
      accessibilityRole="tablist"
      accessibilityLabel={accessibilityLabel}
      className={cn('flex-row gap-1 rounded-md bg-surface-sunken p-1', className)}
    >
      {options.map((option) => {
        const selected = option.value === value;
        return (
          <Pressable
            key={option.value}
            accessibilityRole="tab"
            accessibilityState={{ selected }}
            onPress={() => onChange(option.value)}
            className={cn(
              'h-10 flex-1 items-center justify-center rounded-[9px]',
              selected && 'bg-surface'
            )}
            style={selected ? { boxShadow: shadows.sm } : undefined}
          >
            <Text
              variant="bodySm"
              weight={selected ? 'semibold' : 'medium'}
              tone={selected ? 'default' : 'muted'}
            >
              {option.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}
