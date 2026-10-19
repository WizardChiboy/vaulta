import { Pressable, type PressableProps } from 'react-native';

import { useTheme } from '@/components/layout/ThemeProvider';
import { ICON_STROKE, type LucideIcon } from '@/constants/icons';
import type { ThemeColors } from '@/constants/theme';
import { cn } from '@/lib/cn';

// 'outline' matches the designs' .ib: 44px, 12px radius, white with a light border.
const variantClasses = {
  outline: 'border border-border bg-surface active:bg-surface-hover',
  ghost: 'bg-transparent active:bg-surface-muted',
  soft: 'bg-surface-muted active:opacity-70',
  primary: 'bg-primary active:bg-primary-pressed',
} as const;

const iconColor: Record<IconButtonVariant, keyof ThemeColors> = {
  outline: 'foreground',
  ghost: 'foreground',
  soft: 'label',
  primary: 'primary-foreground',
};

const sizeClasses = { sm: 'h-9 w-9', md: 'h-11 w-11', lg: 'h-14 w-14' } as const;
const iconSize = { sm: 18, md: 20, lg: 24 } as const;

export type IconButtonVariant = keyof typeof variantClasses;

export type IconButtonProps = Omit<PressableProps, 'children'> & {
  icon: LucideIcon;
  /** Required: icon-only controls need a screen-reader label. */
  accessibilityLabel: string;
  variant?: IconButtonVariant | undefined;
  size?: keyof typeof sizeClasses | undefined;
  /** Fully round instead of the default 12px corner radius. */
  round?: boolean | undefined;
  className?: string | undefined;
};

export function IconButton({
  icon: Icon,
  variant = 'outline',
  size = 'md',
  round = false,
  disabled,
  className,
  ...props
}: IconButtonProps) {
  const { colors } = useTheme();

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled: !!disabled }}
      disabled={disabled}
      hitSlop={8}
      className={cn(
        'items-center justify-center',
        round ? 'rounded-full' : 'rounded-md',
        sizeClasses[size],
        variantClasses[variant],
        disabled && 'opacity-40',
        className
      )}
      {...props}
    >
      <Icon size={iconSize[size]} color={colors[iconColor[variant]]} strokeWidth={ICON_STROKE} />
    </Pressable>
  );
}
