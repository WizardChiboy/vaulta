import { createContext, useContext, useMemo, type ReactNode } from 'react';
import { View } from 'react-native';
import { vars } from 'nativewind';

import { themes, themeVariables, type ThemeColors, type ThemeName } from '@/constants/theme';

type ThemeContextValue = {
  name: ThemeName;
  /** Hex values for places classes can't reach (icon colours, ActivityIndicator, etc.). */
  colors: ThemeColors;
};

const ThemeContext = createContext<ThemeContextValue>({ name: 'light', colors: themes.light });

const variableStyles = {
  light: vars(themeVariables('light')),
  dark: vars(themeVariables('dark')),
};

type ThemeProviderProps = {
  theme?: ThemeName | undefined;
  children: ReactNode;
};

/**
 * Injects the semantic colour CSS variables used by Tailwind classes such as
 * `bg-surface` or `text-muted`. Switching `theme` re-skins the whole tree.
 */
export function ThemeProvider({ theme = 'light', children }: ThemeProviderProps) {
  const value = useMemo(() => ({ name: theme, colors: themes[theme] }), [theme]);

  return (
    <ThemeContext.Provider value={value}>
      <View style={variableStyles[theme]} className="flex-1 bg-background">
        {children}
      </View>
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
