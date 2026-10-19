import type { ReactNode } from 'react';
import { View } from 'react-native';
import { KeyboardAvoidingView, KeyboardAwareScrollView } from 'react-native-keyboard-controller';
import { useSafeAreaInsets, type Edge } from 'react-native-safe-area-context';

import { cn } from '@/lib/cn';

const backgroundClasses = {
  default: 'bg-background',
  surface: 'bg-surface',
  brand: 'bg-brand',
} as const;

/** Gap kept between the focused input and the top of the keyboard. */
const KEYBOARD_OFFSET = 24;

export type ScreenProps = {
  children: ReactNode;
  /**
   * Scrollable content. Use it for any screen with inputs: the focused field is always
   * scrolled above the keyboard (react-native-keyboard-controller).
   */
  scroll?: boolean | undefined;
  /** Safe-area edges to pad. Omit 'top' under a native header, 'bottom' above a tab bar. */
  edges?: Edge[] | undefined;
  /** Apply the standard horizontal gutter. */
  padded?: boolean | undefined;
  /** Screen background: app background (default), white surface (sheets) or navy brand. */
  background?: keyof typeof backgroundClasses | undefined;
  className?: string | undefined;
  contentClassName?: string | undefined;
};

/**
 * Every screen renders inside <Screen>. It handles safe areas and the keyboard on both
 * platforms (incl. Android edge-to-edge, where the window no longer resizes for it).
 * Don't add another KeyboardAvoidingView or ScrollView around form content.
 */
export function Screen({
  children,
  scroll = false,
  edges = ['top', 'bottom'],
  padded = true,
  background = 'default',
  className,
  contentClassName,
}: ScreenProps) {
  const insets = useSafeAreaInsets();
  const safeArea = {
    paddingTop: edges.includes('top') ? insets.top : 0,
    paddingBottom: edges.includes('bottom') ? insets.bottom : 0,
    paddingLeft: edges.includes('left') ? insets.left : 0,
    paddingRight: edges.includes('right') ? insets.right : 0,
  };
  const content = cn('flex-grow', padded && 'px-gutter', contentClassName);

  return (
    <View className={cn('flex-1', backgroundClasses[background], className)} style={safeArea}>
      {scroll ? (
        <KeyboardAwareScrollView
          bottomOffset={KEYBOARD_OFFSET}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ flexGrow: 1 }}
        >
          <View className={content}>{children}</View>
        </KeyboardAwareScrollView>
      ) : (
        // Third-party component: style, not className (NativeWind doesn't map it).
        <KeyboardAvoidingView behavior="padding" style={{ flex: 1 }}>
          <View className={cn('flex-1', content)}>{children}</View>
        </KeyboardAvoidingView>
      )}
    </View>
  );
}
