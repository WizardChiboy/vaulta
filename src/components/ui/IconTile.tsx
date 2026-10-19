import { View } from 'react-native';

import { useTheme } from '@/components/layout/ThemeProvider';
import { ICON_STROKE, type LucideIcon } from '@/constants/icons';
import { cn } from '@/lib/cn';

export type IconTileProps = {
  icon: LucideIcon;
  className?: string | undefined;
};

/** 52px soft-green rounded square with an accent icon (designs 04, 05). */
export function IconTile({ icon: Icon, className }: IconTileProps) {
  const { colors } = useTheme();

  return (
    <View
      className={cn(
        'h-[52px] w-[52px] items-center justify-center rounded-lg bg-accent-soft',
        className
      )}
    >
      <Icon size={24} color={colors.accent} strokeWidth={ICON_STROKE} />
    </View>
  );
}
