import { Pressable, View } from 'react-native';

import { useTheme } from '@/components/layout/ThemeProvider';
import { Text } from '@/components/ui/Text';
import { ICON_STROKE, type LucideIcon } from '@/constants/icons';
import { cn } from '@/lib/cn';

export type QuickActionProps = {
  icon: LucideIcon;
  label: string;
  onPress: () => void;
  className?: string | undefined;
};

/** Design .qa: 56px bordered tile with an accent icon, 13px label underneath (08). */
export function QuickAction({ icon: Icon, label, onPress, className }: QuickActionProps) {
  const { colors } = useTheme();

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      onPress={onPress}
      className={cn('items-center gap-sm active:opacity-70', className)}
    >
      <View className="h-14 w-14 items-center justify-center rounded-lg border border-border bg-surface">
        <Icon size={24} color={colors.accent} strokeWidth={ICON_STROKE} />
      </View>
      <Text variant="caption" weight="medium" tone="label">
        {label}
      </Text>
    </Pressable>
  );
}
