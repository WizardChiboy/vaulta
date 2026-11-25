import { Pressable, View } from 'react-native';

import { Slider } from '@/components/forms/Slider';
import { useTheme } from '@/components/layout/ThemeProvider';
import { Screen } from '@/components/layout/Screen';
import { ScreenHeader } from '@/components/layout/ScreenHeader';
import { Card, ListRow, SectionLabel, Text } from '@/components/ui';
import { ICON_STROKE, Monitor, Moon, Sun, type LucideIcon } from '@/constants/icons';
import { palette } from '@/constants/theme';
import { cn } from '@/lib/cn';
import { showMessage } from '@/lib/notify';
import {
  isTextSizeStep,
  TEXT_SIZE_LABELS,
  usePreferences,
  type ThemePreference,
} from '@/store/preferences';

/** Colours of the mini previews, fixed so each shows its own theme (design 39). */
const PREVIEWS = {
  light: {
    background: palette.gray[75],
    border: palette.gray[150],
    hero: palette.gray[900],
    card: palette.white,
  },
  dark: {
    background: palette.night.background,
    border: palette.night.border,
    hero: palette.night.hero,
    card: palette.night.surface,
  },
} as const;

const THEMES: readonly { value: ThemePreference; label: string; icon: LucideIcon }[] = [
  { value: 'light', label: 'Light', icon: Sun },
  { value: 'dark', label: 'Dark', icon: Moon },
  { value: 'system', label: 'System', icon: Monitor },
];

// Design 39 — Appearance. Theme switches the whole app; other settings apply straight away.
export default function AppearanceScreen() {
  const { colors } = useTheme();
  const { preferences, setPreference } = usePreferences();

  return (
    <Screen scroll contentClassName="pb-3xl">
      <ScreenHeader largeTitle="Appearance" />

      <SectionLabel className="mt-[18px]">Theme</SectionLabel>
      <View accessibilityRole="radiogroup" className="flex-row gap-2.5">
        {THEMES.map(({ value, label, icon: Icon }) => {
          const selected = preferences.theme === value;
          return (
            <Pressable
              key={value}
              accessibilityRole="radio"
              accessibilityLabel={`${label} theme`}
              accessibilityState={{ checked: selected }}
              onPress={() => setPreference('theme', value)}
              className={cn(
                'flex-1 items-center gap-2.5 rounded-lg bg-surface px-sm pb-2.5 pt-sm',
                selected ? 'border-2 border-primary' : 'm-px border border-border'
              )}
            >
              <ThemePreview theme={value} />
              <View className="flex-row items-center gap-1.5">
                <Icon size={16} color={colors.foreground} strokeWidth={ICON_STROKE} />
                <Text variant="bodySm" weight="semibold">
                  {label}
                </Text>
              </View>
            </Pressable>
          );
        })}
      </View>

      <SectionLabel className="mt-[18px]">Interface</SectionLabel>
      <Card padded={false} className="overflow-hidden">
        <View className="gap-2.5 px-lg py-md">
          <View className="flex-row justify-between">
            <Text variant="body" weight="medium">
              Text size
            </Text>
            <Text variant="caption" tone="muted">
              {TEXT_SIZE_LABELS[preferences.textSize]}
            </Text>
          </View>
          <View className="flex-row items-center gap-md">
            <Text tone="muted" weight="semibold" style={{ fontSize: 13, lineHeight: 18 }}>
              A
            </Text>
            <Slider
              min={1}
              max={5}
              step={1}
              value={preferences.textSize}
              onChange={(value) => {
                if (isTextSizeStep(value)) setPreference('textSize', value);
              }}
              accessibilityLabel="Text size"
              formatValue={(value) => (isTextSizeStep(value) ? TEXT_SIZE_LABELS[value] : '')}
              className="flex-1"
            />
            <Text tone="muted" weight="semibold" style={{ fontSize: 20, lineHeight: 26 }}>
              A
            </Text>
          </View>
        </View>
        <ListRow
          title="Reduce motion"
          subtitle="Fewer animations and transitions"
          toggle={{
            value: preferences.reduceMotion,
            onValueChange: (value) => setPreference('reduceMotion', value),
          }}
          divider
        />
        <ListRow
          title="Show balance on Home"
          subtitle="Hide it for privacy in public"
          toggle={{
            value: preferences.showBalance,
            onValueChange: (value) => setPreference('showBalance', value),
          }}
          divider
        />
        <ListRow
          title="Compact transaction list"
          subtitle="Fit more rows on screen"
          toggle={{
            value: preferences.compactTransactions,
            onValueChange: (value) => setPreference('compactTransactions', value),
          }}
          divider
        />
        <ListRow
          title="Currency display"
          subtitle="₦ Naira · 2 decimal places"
          onPress={() =>
            showMessage(
              'Currency display',
              'This is a demo — Naira is the only currency available for now.'
            )
          }
          divider
        />
      </Card>
    </Screen>
  );
}

/** Mini screen: hero card, two rows and a green button. "System" is split light / dark. */
function ThemePreview({ theme }: { theme: ThemePreference }) {
  if (theme === 'system') {
    return (
      <View
        accessible={false}
        className="h-32 w-full flex-row overflow-hidden rounded-[10px] border"
        style={{ borderColor: PREVIEWS.light.border }}
      >
        <PreviewContent colors={PREVIEWS.light} half="left" />
        <PreviewContent colors={PREVIEWS.dark} half="right" />
      </View>
    );
  }
  const colors = PREVIEWS[theme];
  return (
    <View
      accessible={false}
      className="h-32 w-full overflow-hidden rounded-[10px] border"
      style={{ borderColor: colors.border }}
    >
      <PreviewContent colors={colors} />
    </View>
  );
}

/**
 * The preview's content. For "System" each half renders the full-width layout and is
 * clipped, so the two themes line up as one picture.
 */
function PreviewContent({
  colors,
  half,
}: {
  colors: (typeof PREVIEWS)[keyof typeof PREVIEWS];
  half?: 'left' | 'right' | undefined;
}) {
  const inner = (
    <View className="flex-1 gap-1.5 px-sm py-2.5" style={{ backgroundColor: colors.background }}>
      <View className="h-[30px] rounded-[4px]" style={{ backgroundColor: colors.hero }} />
      <View
        className="h-3.5 rounded-[4px] border"
        style={{ backgroundColor: colors.card, borderColor: colors.border }}
      />
      <View
        className="h-3.5 rounded-[4px] border"
        style={{ backgroundColor: colors.card, borderColor: colors.border }}
      />
      <View className="h-3.5 w-3/5 rounded-[4px] bg-primary" />
    </View>
  );
  if (!half) return inner;

  return (
    <View className="flex-1 overflow-hidden">
      <View
        className="absolute bottom-0 top-0 w-[200%]"
        style={half === 'left' ? { left: 0 } : { right: 0 }}
      >
        {inner}
      </View>
    </View>
  );
}
