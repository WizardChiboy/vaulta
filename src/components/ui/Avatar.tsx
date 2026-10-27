import { Image, View, type ImageSourcePropType } from 'react-native';

import { useTheme } from '@/components/layout/ThemeProvider';
import type { LucideIcon } from '@/constants/icons';
import { cn } from '@/lib/cn';
import { Text, type TextTone, type TextVariant } from './Text';

// Sizes and font sizes from the designs (recipient list 40, header 44, transfer 52, profile 80).
const sizes = {
  sm: { box: 'h-10 w-10', px: 40, variant: 'caption', icon: 18 },
  md: { box: 'h-11 w-11', px: 44, variant: 'body', icon: 20 },
  lg: { box: 'h-[52px] w-[52px]', px: 52, variant: 'body', icon: 22 },
  xl: { box: 'h-20 w-20', px: 80, variant: 'h2', icon: 32 },
} as const satisfies Record<string, { variant: TextVariant } & Record<string, unknown>>;

// The profile avatar uses 26px initials, which sits between type-scale steps.
const xlTextStyle = { fontSize: 26, lineHeight: 32 };

const toneClasses = {
  green: 'bg-accent-soft',
  neutral: 'bg-disabled',
  brand: 'bg-brand',
  /** Dashed outline, e.g. the "New recipient" shortcut. */
  add: 'border-[1.5px] border-dashed border-subtle bg-surface',
} as const;

const textTone: Record<AvatarTone, TextTone> = {
  green: 'accent',
  neutral: 'label',
  brand: 'inverse',
  add: 'label',
};

export type AvatarSize = keyof typeof sizes;
export type AvatarTone = keyof typeof toneClasses;

export type AvatarProps = {
  /** Full name; used for initials and the accessibility label. */
  name: string;
  size?: AvatarSize | undefined;
  tone?: AvatarTone | undefined;
  /** Photo. Falls back to initials when absent. */
  source?: ImageSourcePropType | undefined;
  /** Shown instead of initials (e.g. a plus icon for "add"). */
  icon?: LucideIcon | undefined;
  /** 3px ring in the background colour, for avatars overlapping other content. */
  ring?: boolean | undefined;
  className?: string | undefined;
};

export function getInitials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  const first = parts[0]?.[0] ?? '';
  const last = parts.length > 1 ? (parts.at(-1)?.[0] ?? '') : '';
  return (first + last).toUpperCase();
}

export function Avatar({
  name,
  size = 'md',
  tone = 'green',
  source,
  icon: Icon,
  ring = false,
  className,
}: AvatarProps) {
  const { colors } = useTheme();
  const s = sizes[size];

  return (
    <View
      accessibilityRole="image"
      accessibilityLabel={name}
      className={cn(
        'items-center justify-center overflow-hidden rounded-full',
        s.box,
        toneClasses[tone],
        ring && 'border-[3px] border-background',
        className
      )}
    >
      {source ? (
        <Image source={source} style={{ width: s.px, height: s.px }} resizeMode="cover" />
      ) : Icon ? (
        <Icon size={s.icon} color={tone === 'brand' ? colors['brand-foreground'] : colors.label} />
      ) : (
        <Text
          variant={s.variant}
          weight="bold"
          tone={textTone[tone]}
          style={size === 'xl' ? xlTextStyle : undefined}
        >
          {getInitials(name)}
        </Text>
      )}
    </View>
  );
}
