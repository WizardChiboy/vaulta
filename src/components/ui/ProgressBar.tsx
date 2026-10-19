import { View } from 'react-native';

import { cn } from '@/lib/cn';

export type ProgressBarProps = {
  /** 0–1 */
  value: number;
  /** 'thin' = 4px step indicator (design 03); 'default' = 8px goal/budget bars. */
  size?: 'thin' | 'default' | undefined;
  className?: string | undefined;
};

export function ProgressBar({ value, size = 'default', className }: ProgressBarProps) {
  const percent = Math.round(Math.min(Math.max(value, 0), 1) * 100);
  const height = size === 'thin' ? 'h-1' : 'h-2';

  return (
    <View
      accessibilityRole="progressbar"
      accessibilityValue={{ min: 0, max: 100, now: percent }}
      className={cn(
        'overflow-hidden rounded-full',
        height,
        size === 'thin' ? 'bg-border' : 'bg-accent-soft',
        className
      )}
    >
      <View className={cn('rounded-full bg-primary', height)} style={{ width: `${percent}%` }} />
    </View>
  );
}
