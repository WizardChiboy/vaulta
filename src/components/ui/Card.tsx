import { View, type ViewProps } from 'react-native';

import { shadows } from '@/constants/theme';
import { cn } from '@/lib/cn';

const variantClasses = {
  /** Default in the designs: white, 1px light border, 16px radius. */
  outlined: 'rounded-lg border border-border bg-surface',
  elevated: 'rounded-lg bg-surface',
  filled: 'rounded-lg bg-surface-muted',
  /** Navy panel, e.g. the balance card (20px radius). */
  brand: 'rounded-xl bg-brand',
} as const;

export type CardVariant = keyof typeof variantClasses;

export type CardProps = ViewProps & {
  variant?: CardVariant | undefined;
  /** Default 16px padding. Set false to supply your own (e.g. `p-[18px]`) or none. */
  padded?: boolean | undefined;
  className?: string | undefined;
};

export function Card({
  variant = 'outlined',
  padded = true,
  className,
  style,
  ...props
}: CardProps) {
  return (
    <View
      className={cn(padded && 'p-lg', variantClasses[variant], className)}
      style={[variant === 'elevated' && { boxShadow: shadows.md }, style]}
      {...props}
    />
  );
}
