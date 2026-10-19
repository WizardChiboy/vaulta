import type { ReactNode } from 'react';
import { View } from 'react-native';
import { router } from 'expo-router';

import { IconButton } from '@/components/ui/IconButton';
import { Text } from '@/components/ui/Text';
import { ChevronLeft } from '@/constants/icons';
import { cn } from '@/lib/cn';

export type ScreenHeaderProps = {
  /** Small centred title in the header row (e.g. "Send money"). */
  title?: string | undefined;
  /** Large 28px title below the header row (e.g. "Accounts"). */
  largeTitle?: string | undefined;
  /** Show the back button. Defaults to true. */
  back?: boolean | undefined;
  /** Override the back action. Defaults to going back, or home if there's no history. */
  onBack?: (() => void) | undefined;
  /** Right-hand action, usually an <IconButton />. */
  right?: ReactNode | undefined;
  className?: string | undefined;
};

function goBack() {
  if (router.canGoBack()) router.back();
  else router.replace('/');
}

/**
 * Header row from the designs: 56px tall, 44px bordered back button on the left,
 * optional centred title and right action, optional large title underneath.
 * Used instead of the native stack header, which can't render this back button.
 */
export function ScreenHeader({
  title,
  largeTitle,
  back = true,
  onBack = goBack,
  right,
  className,
}: ScreenHeaderProps) {
  // Keeps the title centred when only one side has a button.
  const spacer = <View className="h-11 w-11" />;
  // Tab roots have only a large title; skip the empty 56px row (designs 16, 26, 34).
  const showRow = back || !!title || !!right;

  return (
    <View className={cn(!showRow && 'pt-md', className)}>
      {showRow && (
        <View className="h-14 flex-row items-center justify-between gap-md">
          {back ? (
            <IconButton icon={ChevronLeft} accessibilityLabel="Back" onPress={onBack} />
          ) : (
            spacer
          )}
          {title ? (
            <Text variant="h3" weight="semibold" numberOfLines={1} className="flex-1 text-center">
              {title}
            </Text>
          ) : (
            <View className="flex-1" />
          )}
          {right ?? spacer}
        </View>
      )}
      {largeTitle && (
        <Text variant="h1" accessibilityRole="header" className="pt-1">
          {largeTitle}
        </Text>
      )}
    </View>
  );
}
