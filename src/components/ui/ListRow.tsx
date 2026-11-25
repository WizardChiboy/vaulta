import type { ReactNode } from 'react';
import { Pressable, View } from 'react-native';

import { Switch } from '@/components/forms/Switch';
import { useTheme } from '@/components/layout/ThemeProvider';
import { Text } from '@/components/ui/Text';
import { ChevronRight, ICON_STROKE, type LucideIcon } from '@/constants/icons';
import { cn } from '@/lib/cn';

export type RowIconTone = 'neutral' | 'accent' | 'danger';

const iconTileClasses: Record<RowIconTone, string> = {
  neutral: 'bg-surface-muted',
  accent: 'bg-accent-soft',
  danger: 'bg-danger-soft',
};

/** 36px rounded icon tile (.ic): grey for settings, green or red for status. */
export function RowIcon({
  icon: Icon,
  tone = 'neutral',
}: {
  icon: LucideIcon;
  tone?: RowIconTone | undefined;
}) {
  const { colors } = useTheme();
  const color =
    tone === 'accent' ? colors.accent : tone === 'danger' ? colors['danger-text'] : colors.label;

  return (
    <View
      className={cn('h-9 w-9 items-center justify-center rounded-[10px]', iconTileClasses[tone])}
    >
      <Icon size={18} color={color} strokeWidth={ICON_STROKE} />
    </View>
  );
}

/** Grey 13px heading above a group of rows (.sh). */
export function SectionLabel({
  children,
  className,
}: {
  children: string;
  className?: string | undefined;
}) {
  return (
    <Text
      variant="caption"
      weight="semibold"
      tone="muted"
      accessibilityRole="header"
      className={cn('mb-sm mt-lg', className)}
    >
      {children}
    </Text>
  );
}

export type ListRowProps = {
  title: string;
  subtitle?: string | undefined;
  icon?: LucideIcon | undefined;
  iconTone?: RowIconTone | undefined;
  /** Muted text before the chevron, e.g. "Light". */
  value?: string | undefined;
  /** Custom content on the right, e.g. a badge or button. */
  trailing?: ReactNode | undefined;
  /** Makes the row a button with a chevron. */
  onPress?: (() => void) | undefined;
  /** Renders a switch on the right instead of a chevron. */
  toggle?:
    | { value: boolean; onValueChange: (value: boolean) => void; disabled?: boolean | undefined }
    | undefined;
  /** Top border between rows in the same card. */
  divider?: boolean | undefined;
  className?: string | undefined;
};

/**
 * Settings / list row (.sr, .r) used on Profile (34) and the settings screens (36–39):
 * optional icon tile, title + subtitle, then a value, switch or chevron.
 */
export function ListRow({
  title,
  subtitle,
  icon,
  iconTone,
  value,
  trailing,
  onPress,
  toggle,
  divider = false,
  className,
}: ListRowProps) {
  const { colors } = useTheme();
  const rowClass = cn(
    'min-h-[60px] flex-row items-center gap-md px-lg py-[11px]',
    divider && 'border-t border-surface-muted',
    className
  );

  const content = (
    <>
      {icon && <RowIcon icon={icon} tone={iconTone} />}
      <View className="flex-1">
        <Text variant="body" weight="medium">
          {title}
        </Text>
        {subtitle && (
          <Text variant="small" tone="muted" className="mt-0.5">
            {subtitle}
          </Text>
        )}
      </View>
      {trailing}
      {value && (
        <Text variant="caption" tone="muted">
          {value}
        </Text>
      )}
      {toggle && (
        <Switch
          value={toggle.value}
          onValueChange={toggle.onValueChange}
          disabled={toggle.disabled}
          accessibilityLabel={subtitle ? `${title}. ${subtitle}` : title}
        />
      )}
      {onPress && !toggle && (
        <ChevronRight size={18} color={colors.subtle} strokeWidth={ICON_STROKE} />
      )}
    </>
  );

  if (onPress && !toggle) {
    return (
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={[title, value, subtitle].filter(Boolean).join(', ')}
        onPress={onPress}
        className={cn(rowClass, 'active:bg-surface-hover')}
      >
        {content}
      </Pressable>
    );
  }

  return <View className={rowClass}>{content}</View>;
}
