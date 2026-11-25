import { View } from 'react-native';

import { cn } from '@/lib/cn';

export type ProgressBarProps = {
  /** 0–1 */
  value: number;
  /** 'thin' = 4px step indicator (03); 'medium' = 6px category budgets (32); 'default' = 8px goal bars. */
  size?: 'thin' | 'medium' | 'default' | undefined;
  /** Fill colour: green, amber when nearly used up, red when over budget (32). */
  tone?: ProgressTone | undefined;
  /** Track colour for default bars: soft green (Home 08) or neutral grey (Savings 26). */
  track?: 'soft' | 'muted' | undefined;
  className?: string | undefined;
};

export type ProgressTone = 'primary' | 'warning' | 'danger';

const fillClasses: Record<ProgressTone, string> = {
  primary: 'bg-primary',
  warning: 'bg-warning',
  danger: 'bg-danger',
};

const heightClasses = { thin: 'h-1', medium: 'h-1.5', default: 'h-2' } as const;

export function ProgressBar({
  value,
  size = 'default',
  track = 'soft',
  tone = 'primary',
  className,
}: ProgressBarProps) {
  const percent = Math.round(Math.min(Math.max(value, 0), 1) * 100);
  const height = heightClasses[size];

  return (
    <View
      accessibilityRole="progressbar"
      accessibilityValue={{ min: 0, max: 100, now: percent }}
      className={cn(
        'overflow-hidden rounded-full',
        height,
        size === 'thin' ? 'bg-border' : track === 'muted' ? 'bg-surface-muted' : 'bg-accent-soft',
        className
      )}
    >
      <View
        className={cn('rounded-full', fillClasses[tone], height)}
        style={{ width: `${percent}%` }}
      />
    </View>
  );
}
