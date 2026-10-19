import { ActivityIndicator, View } from 'react-native';

import { useTheme } from '@/components/layout/ThemeProvider';
import { cn } from '@/lib/cn';
import { Text } from './Text';

export type LoaderProps = {
  label?: string | undefined;
  size?: 'small' | 'large' | undefined;
  /** Fill the available space and centre the indicator. */
  fullScreen?: boolean | undefined;
  className?: string | undefined;
};

export function Loader({ label, size = 'large', fullScreen = false, className }: LoaderProps) {
  const { colors } = useTheme();

  return (
    <View
      accessibilityRole="progressbar"
      accessibilityLabel={label ?? 'Loading'}
      className={cn('items-center justify-center gap-md', fullScreen && 'flex-1', className)}
    >
      <ActivityIndicator size={size} color={colors.primary} />
      {label && (
        <Text variant="bodySm" tone="muted">
          {label}
        </Text>
      )}
    </View>
  );
}
