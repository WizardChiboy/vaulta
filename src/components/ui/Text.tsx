import { Text as RNText, type TextProps as RNTextProps } from 'react-native';

import { typeScale } from '@/constants/theme';
import { cn } from '@/lib/cn';
import { usePreferences } from '@/store/preferences';

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

/** Type-scale token for each variant. */
const variantScale = {
  display: 'display',
  h1: 'h1',
  h2: 'h2',
  h3: 'h3',
  bodyLg: 'body-lg',
  body: 'body',
  bodySm: 'body-sm',
  caption: 'caption',
  small: 'small',
  xs: 'xs',
  overline: 'overline',
} as const satisfies Record<TextVariant, keyof typeof typeScale>;

export function Text({
  variant = 'body',
  weight,
  tone = 'default',
  className,
  style,
  ...props
}: TextProps) {
  // Text size from Appearance (39). Explicit font sizes in `style` still win.
  const { textScale } = usePreferences();
  const [fontSize, lineHeight] = typeScale[variantScale[variant]];
  const scaled =
    textScale === 1 || fontSize === undefined || lineHeight === undefined
      ? undefined
      : { fontSize: fontSize * textScale, lineHeight: Math.round(lineHeight * textScale) };

  return (
    <RNText
      className={cn(
        variantClasses[variant],
        weightClasses[weight ?? defaultWeight[variant]],
        toneClasses[tone],
        className
      )}
      style={scaled ? [scaled, style] : style}
      {...props}
    />
  );
}
