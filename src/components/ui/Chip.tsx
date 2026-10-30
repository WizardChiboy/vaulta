import { Pressable } from 'react-native';

import { cn } from '@/lib/cn';
import { Text } from './Text';

export type ChipProps = {
  label: string;
  selected?: boolean | undefined;
  onPress: () => void;
  className?: string | undefined;
};

/** Design .chip: 36px pill; selected is soft green with a green border and text (11 13 14 15 19 22). */
export function Chip({ label, selected = false, onPress, className }: ChipProps) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected }}
      onPress={onPress}
      className={cn(
        'h-9 flex-row items-center justify-center gap-1.5 rounded-full border px-3.5 active:opacity-70',
        selected ? 'border-primary bg-accent-soft' : 'border-border bg-surface',
        className
      )}
    >
      <Text
        variant="bodySm"
        weight={selected ? 'semibold' : 'medium'}
        tone={selected ? 'accent' : 'label'}
      >
        {label}
      </Text>
    </Pressable>
  );
}
