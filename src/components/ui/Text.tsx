import { Text as RNText, type TextProps as RNTextProps } from 'react-native';

import { cn } from '@/lib/cn';

const variantClasses = {
  display: 'text-display',
  h1: 'text-h1',
  h2: 'text-h2',
  h3: 'text-h3',
  bodyLg: 'text-body-lg',
  body: 'text-body',
  bodySm: 'text-body-sm',
  caption: 'text-caption',
  small: 'text-small',
  xs: 'text-xs',
  overline: 'text-overline uppercase',
} as const;

// Custom fonts ship one file per weight, so weight is selected via font family.
const weightClasses = {
  regular: 'font-sans',
  medium: 'font-sans-medium',
  semibold: 'font-sans-semibold',
  bold: 'font-sans-bold',
} as const;

const defaultWeight: Record<TextVariant, TextWeight> = {
  display: 'bold',
  h1: 'bold',
  h2: 'semibold',
  h3: 'semibold',
  bodyLg: 'regular',
  body: 'regular',
  bodySm: 'regular',
  caption: 'regular',
  small: 'regular',
  xs: 'medium',
  overline: 'semibold',
};

const toneClasses = {
  default: 'text-foreground',
  label: 'text-label',
  muted: 'text-muted',
  subtle: 'text-subtle',
  accent: 'text-accent',
  /** Text on the navy brand surface. */
  inverse: 'text-brand-foreground',
  inverseMuted: 'text-brand-muted',
  /** Text on a primary (green) button. */
  primary: 'text-primary-foreground',
  disabled: 'text-disabled-foreground',
  // Status tones use the darker "-text" shades for contrast on light backgrounds.
  success: 'text-success-text',
  warning: 'text-warning-text',
  danger: 'text-danger-text',
} as const;

export type TextVariant = keyof typeof variantClasses;
export type TextWeight = keyof typeof weightClasses;
export type TextTone = keyof typeof toneClasses;

export type TextProps = RNTextProps & {
  variant?: TextVariant | undefined;
  weight?: TextWeight | undefined;
  tone?: TextTone | undefined;
  className?: string | undefined;
};

export function Text({
  variant = 'body',
  weight,
  tone = 'default',
  className,
  ...props
}: TextProps) {
  return (
    <RNText
      className={cn(
        variantClasses[variant],
        weightClasses[weight ?? defaultWeight[variant]],
        toneClasses[tone],
        className
      )}
      {...props}
    />
  );
}
