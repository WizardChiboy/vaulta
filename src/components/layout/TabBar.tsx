import { Pressable, View } from 'react-native';
import type { BottomTabBarProps } from 'expo-router/js-tabs';

import { useTheme } from '@/components/layout/ThemeProvider';
import { Text } from '@/components/ui/Text';
import {
  ArrowRightLeft,
  BriefcaseMedical,
  House,
  ICON_STROKE,
  User,
  type LucideIcon,
} from '@/constants/icons';
import { showMessage } from '@/lib/notify';

/** All four tabs from the designs. Tabs whose route isn't built yet show a message instead. */
const TABS: readonly { name: string; label: string; icon: LucideIcon }[] = [
  { name: 'index', label: 'Home', icon: House },
  { name: 'transfer', label: 'Transfer', icon: ArrowRightLeft },
  { name: 'savings', label: 'Savings', icon: BriefcaseMedical },
  { name: 'profile', label: 'Profile', icon: User },
];

/**
 * Bottom tab bar from the designs (.nav): surface background, top border, 6px top padding,
 * 50px items above the safe area, 11px labels, active tab in accent green.
 */
export function TabBar({ state, emitter, navigateToTab, insets }: BottomTabBarProps) {
  const { colors } = useTheme();
  const focusedKey = state.routes[state.index]?.key;

  return (
    <View
      accessibilityRole="tablist"
      className="flex-row border-t border-border bg-surface px-md pt-1.5"
      style={{ paddingBottom: insets.bottom }}
    >
      {TABS.map(({ name, label, icon: Icon }) => {
        const route = state.routes.find((r) => r.name === name);
        const focused = !!route && route.key === focusedKey;

        const onPress = () => {
          if (!route) {
            showMessage(label, 'This is a demo — this tab is coming in a later module.');
            return;
          }
          const event = emitter.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });
          if (!focused && !event.defaultPrevented) navigateToTab(route.key);
        };

        return (
          <Pressable
            key={name}
            accessibilityRole="tab"
            accessibilityLabel={label}
            accessibilityState={{ selected: focused }}
            onPress={onPress}
            className="h-[50px] flex-1 items-center justify-center gap-1 active:opacity-70"
          >
            <Icon
              size={24}
              color={focused ? colors.accent : colors.muted}
              strokeWidth={ICON_STROKE}
            />
            <Text
              variant="xs"
              weight={focused ? 'semibold' : 'medium'}
              tone={focused ? 'accent' : 'muted'}
            >
              {label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}
