import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';
import { useColorScheme } from 'react-native';

import type { ThemeName } from '@/constants/theme';

/**
 * App preferences from Profile → Security (37), Notifications (38) and Appearance (39).
 * Lives above the theme so the Appearance screen can switch it. In memory only, like the
 * session: a full reload restores the defaults.
 */
export type ThemePreference = ThemeName | 'system';

/** Text size steps on Appearance (39): 1 smallest … 3 default … 5 largest. */
export type TextSizeStep = 1 | 2 | 3 | 4 | 5;

export const TEXT_SIZE_LABELS: Record<TextSizeStep, string> = {
  1: 'Smallest',
  2: 'Small',
  3: 'Default',
  4: 'Large',
  5: 'Largest',
};

const TEXT_SCALES: Record<TextSizeStep, number> = { 1: 0.88, 2: 0.94, 3: 1, 4: 1.1, 5: 1.2 };

export function isTextSizeStep(value: number): value is TextSizeStep {
  return value === 1 || value === 2 || value === 3 || value === 4 || value === 5;
}

export type Preferences = {
  theme: ThemePreference;
  textSize: TextSizeStep;
  reduceMotion: boolean;
  /** Show the balance on Home when it opens; off = start hidden (37 and 39 share this). */
  showBalance: boolean;
  compactTransactions: boolean;
  faceIdSignIn: boolean;
  /** Ask for the PIN on transfers above ₦50,000. */
  transferPin: boolean;
  notifications: {
    push: boolean;
    moneyIn: boolean;
    moneyOut: boolean;
    largeTransactions: boolean;
    offers: boolean;
    savingsTips: boolean;
  };
};

export type NotificationPreference = keyof Preferences['notifications'];

/** Defaults from the designs. */
const DEFAULTS: Preferences = {
  theme: 'light',
  textSize: 3,
  reduceMotion: false,
  showBalance: true,
  compactTransactions: false,
  faceIdSignIn: true,
  transferPin: true,
  notifications: {
    push: true,
    moneyIn: true,
    moneyOut: true,
    largeTransactions: true,
    offers: false,
    savingsTips: true,
  },
};

type PreferencesContextValue = {
  preferences: Preferences;
  /** Theme in use: the preference, or the device's scheme for "system". */
  resolvedTheme: ThemeName;
  /** Multiplier for text sizes (1 = default). */
  textScale: number;
  setPreference: <K extends Exclude<keyof Preferences, 'notifications'>>(
    key: K,
    value: Preferences[K]
  ) => void;
  setNotification: (key: NotificationPreference, value: boolean) => void;
};

const PreferencesContext = createContext<PreferencesContextValue>({
  preferences: DEFAULTS,
  resolvedTheme: 'light',
  textScale: 1,
  setPreference: () => undefined,
  setNotification: () => undefined,
});

export function PreferencesProvider({ children }: { children: ReactNode }) {
  const scheme = useColorScheme();
  const [preferences, setPreferences] = useState(DEFAULTS);

  const setPreference = useCallback(
    <K extends Exclude<keyof Preferences, 'notifications'>>(key: K, value: Preferences[K]) =>
      setPreferences((current) => ({ ...current, [key]: value })),
    []
  );

  const setNotification = useCallback(
    (key: NotificationPreference, value: boolean) =>
      setPreferences((current) => ({
        ...current,
        notifications: { ...current.notifications, [key]: value },
      })),
    []
  );

  const resolvedTheme: ThemeName =
    preferences.theme === 'system' ? (scheme === 'dark' ? 'dark' : 'light') : preferences.theme;

  const value = useMemo(
    () => ({
      preferences,
      resolvedTheme,
      textScale: TEXT_SCALES[preferences.textSize],
      setPreference,
      setNotification,
    }),
    [preferences, resolvedTheme, setPreference, setNotification]
  );

  return <PreferencesContext.Provider value={value}>{children}</PreferencesContext.Provider>;
}

export function usePreferences() {
  return useContext(PreferencesContext);
}
