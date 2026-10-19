import { ActivityIndicator, Pressable, View, type PressableProps } from 'react-native';

import { useTheme } from '@/components/layout/ThemeProvider';
import type { LucideIcon } from '@/constants/icons';
import type { ThemeColors } from '@/constants/theme';
import { cn } from '@/lib/cn';
import { Text, type TextTone } from './Text';

// Matches the designs: .bp (green, navy text), .bs (white, gray-300 border), .bd (disabled).
const containerClasses = {
  primary: 'bg-primary active:bg-primary-pressed',
  secondary: 'border border-border-strong bg-secondary active:bg-surface-hover',
  outline: 'border border-border-strong bg-transparent active:bg-surface-hover',
  /** Outlined button on the navy brand surface (e.g. Welcome "Sign in"). */
  outlineInverse: 'border border-gray-600 bg-transparent active:bg-brand-raised',
} as const;

const labelTone: Record<ButtonVariant, TextTone> = {
  primary: 'primary',
  secondary: 'default',
  outline: 'default',
  outlineInverse: 'inverse',
};

const foregroundColor: Record<ButtonVariant, keyof ThemeColors> = {
  primary: 'primary-foreground',
  secondary: 'secondary-foreground',
  outline: 'foreground',
  outlineInverse: 'brand-foreground',
};

const sizeClasses = {
  sm: 'h-10 px-4 rounded-md',
  md: 'h-[52px] px-5 rounded-button',
  lg: 'h-14 px-6 rounded-button',
} as const;

const iconSize = { sm: 16, md: 20, lg: 20 } as const;

export type ButtonVariant = keyof typeof containerClasses;
export type ButtonSize = keyof typeof sizeClasses;

export type ButtonProps = Omit<PressableProps, 'children'> & {
  label: string;
  variant?: ButtonVariant | undefined;
  size?: ButtonSize | undefined;
  loading?: boolean | undefined;
  fullWidth?: boolean | undefined;
  leadingIcon?: LucideIcon | undefined;
  trailingIcon?: LucideIcon | undefined;
  className?: string | undefined;
};

export function Button({
  label,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  fullWidth = false,
  leadingIcon: LeadingIcon,
  trailingIcon: TrailingIcon,
  className,
  ...props
}: ButtonProps) {
  const { colors } = useTheme();
  // While loading, keep the variant's colours; only a real disable greys the button out.
  const isInactive = disabled || loading;
  const contentColor = disabled ? colors['disabled-foreground'] : colors[foregroundColor[variant]];

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled: isInactive, busy: loading }}
      disabled={isInactive}
      className={cn(
        'flex-row items-center justify-center',
        sizeClasses[size],
        disabled ? 'bg-disabled' : containerClasses[variant],
        fullWidth && 'w-full',
        className
      )}
      {...props}
    >
      {loading ? (
        <ActivityIndicator size="small" color={contentColor} />
      ) : (
        <View className="flex-row items-center gap-2">
          {LeadingIcon && <LeadingIcon size={iconSize[size]} color={contentColor} />}
          <Text
            variant={size === 'sm' ? 'bodySm' : 'bodyLg'}
            weight="semibold"
            tone={disabled ? 'disabled' : labelTone[variant]}
          >
            {label}
          </Text>
          {TrailingIcon && <TrailingIcon size={iconSize[size]} color={contentColor} />}
        </View>
      )}
    </Pressable>
  );
}
