import type { ReactNode } from 'react';
import { View } from 'react-native';

import { IconTile } from '@/components/ui/IconTile';
import { Text } from '@/components/ui/Text';
import type { LucideIcon } from '@/constants/icons';
import { Screen } from './Screen';
import { ScreenHeader } from './ScreenHeader';

export type AuthScreenProps = {
  title: string;
  subtitle?: ReactNode | undefined;
  /** Soft-green icon tile above the title (designs 04, 05). */
  icon?: LucideIcon | undefined;
  /** Right side of the header row, e.g. "Step 1 of 2". */
  headerRight?: ReactNode | undefined;
  /** Content between the header and the title, e.g. the step progress bar. */
  beforeTitle?: ReactNode | undefined;
  children?: ReactNode | undefined;
  /** Pinned to the bottom of the screen (primary action, "Already have an account?"). */
  footer?: ReactNode | undefined;
};

/**
 * Shared layout for auth & onboarding screens (designs 02–06): 56px header row,
 * 24px side padding, 28px title with a muted subtitle, content, bottom-pinned footer.
 */
export function AuthScreen({
  title,
  subtitle,
  icon,
  headerRight,
  beforeTitle,
  children,
  footer,
}: AuthScreenProps) {
  return (
    <Screen scroll padded={false} contentClassName="pb-lg">
      <ScreenHeader className="px-gutter" right={headerRight} />
      {beforeTitle}

      <View className="flex-1 px-gutter-lg">
        <View className="gap-sm pt-sm">
          {icon && <IconTile icon={icon} className="mb-sm" />}
          <Text variant="h1" accessibilityRole="header">
            {title}
          </Text>
          {subtitle &&
            (typeof subtitle === 'string' ? (
              <Text variant="body" tone="muted">
                {subtitle}
              </Text>
            ) : (
              subtitle
            ))}
        </View>
        {children}
      </View>

      {footer && <View className="gap-lg px-gutter-lg pt-xl">{footer}</View>}
    </Screen>
  );
}
