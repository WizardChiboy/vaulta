import { View } from 'react-native';

import { cn } from '@/lib/cn';
import { Text, type TextTone } from './Text';

// Design .tag: 11px/600 pill, 3px × 8px padding.
const toneClasses = {
  accent: 'bg-accent-soft',
  neutral: 'bg-surface-muted',
} as const;

const textTone: Record<BadgeTone, TextTone> = {
  accent: 'accent',
  neutral: 'label',
};

export type BadgeTone = keyof typeof toneClasses;

export type BadgeProps = {
  label: string;
  tone?: BadgeTone | undefined;
  className?: string | undefined;
};

export function Badge({ label, tone = 'neutral', className }: BadgeProps) {
  return (
    <View className={cn('rounded-full px-sm py-[3px]', toneClasses[tone], className)}>
      <Text variant="xs" weight="semibold" tone={textTone[tone]}>
        {label}
      </Text>
    </View>
  );
}
