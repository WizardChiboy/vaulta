// @ts-check
/**
 * VAULTA design tokens — the single source of truth.
 *
 * Values are taken from the screen designs in assets/vaulta-ui (README + CSS).
 * Plain CommonJS so it can be required by tailwind.config.js (Node) and
 * imported by app code (see ./theme.ts for the typed export).
 * Change a value here and both NativeWind classes and JS consumers update.
 */

/** Raw colour palette. Prefer the semantic `themes` below in components. */
const palette = {
  white: '#FFFFFF',
  black: '#000000',
  /** Neutral ramp used throughout the designs (navy-tinted greys). */
  gray: {
    25: '#FCFCFD',
    50: '#F9FAFB',
    75: '#F5F7FA', // app background
    100: '#F2F4F7',
    150: '#E4E7EC', // default border
    200: '#EAECF0',
    300: '#D0D5DD',
    400: '#98A2B3',
    500: '#667085',
    600: '#475467',
    700: '#344054',
    800: '#1D2939',
    850: '#161B26',
    900: '#101828', // VAULTA navy
    950: '#0C111D',
  },
  /** Brand green. 500 is the primary action colour; 700 is used for green text on white (contrast). */
  green: {
    50: '#EAF8F1',
    100: '#CFF0E1',
    200: '#C4EBD9',
    300: '#7AD3AE',
    400: '#6CE9A6',
    500: '#16A875',
    600: '#13965F',
    700: '#0E7F57',
    800: '#0B6646',
  },
  success: { 50: '#ECFDF3', 500: '#12B76A', 700: '#067647' },
  warning: { 50: '#FFFAEB', 200: '#FEDF89', 500: '#F79009', 700: '#B54708' },
  danger: { 50: '#FEF3F2', 100: '#FEE4E2', 200: '#FECDCA', 500: '#F04438', 700: '#B42318' },
  /** Dark-mode surfaces and text, from assets/vaulta-ui-dark (README + CSS). */
  night: {
    background: '#0B0F17',
    surface: '#161B26',
    hover: '#1D2433',
    raised: '#1F2633',
    hero: '#1A2232', // balance card
    border: '#262E3D',
    'border-strong': '#333C4D', // dashed "Open a new account"
    text: '#F2F4F7',
    label: '#CDD3DD',
    muted: '#8D96A5',
    green: '#3CCB91', // green text
    'green-tint': '#10291F',
    'success-text': '#47CD89',
    'warning-text': '#F5A524',
    'danger-text': '#F97066',
  },
};

/**
 * Semantic colours per theme. Exposed to Tailwind as CSS variables so a
 * dark theme only needs a different value set — no class changes.
 */
const themes = {
  light: {
    background: palette.gray[75],
    surface: palette.white,
    'surface-muted': palette.gray[100], // icon tiles, dividers
    'surface-hover': palette.gray[50],
    'surface-sunken': palette.gray[200], // segmented control track
    border: palette.gray[150],
    'border-strong': palette.gray[300], // inputs, secondary buttons
    foreground: palette.gray[900],
    label: palette.gray[700],
    muted: palette.gray[500],
    subtle: palette.gray[400],
    // Primary action: green with navy text, as in the designs.
    primary: palette.green[500],
    'primary-pressed': palette.green[600],
    'primary-foreground': palette.gray[900],
    secondary: palette.white,
    'secondary-foreground': palette.gray[900],
    // Navy brand surface (balance card, dark panels).
    brand: palette.gray[900],
    'brand-raised': palette.gray[800],
    'brand-foreground': palette.white,
    'brand-muted': palette.gray[400],
    // Green used as text/icon colour (links, active tab, incoming amounts).
    accent: palette.green[700],
    'accent-soft': palette.green[50],
    disabled: palette.gray[150],
    'disabled-foreground': palette.gray[500],
    success: palette.success[500],
    'success-text': palette.success[700],
    'success-soft': palette.success[50],
    warning: palette.warning[500],
    'warning-text': palette.warning[700],
    'warning-soft': palette.warning[50],
    danger: palette.danger[500],
    'danger-text': palette.danger[700],
    'danger-soft': palette.danger[50],
    // 4px input rings (focus / error) from the auth screens.
    'focus-ring': palette.green[50],
    'danger-ring': palette.danger[100],
  },
  // From the dark screen designs (assets/vaulta-ui-dark). Values the designs don't show are derived.
  dark: {
    background: palette.night.background,
    surface: palette.night.surface,
    'surface-muted': palette.night.raised,
    'surface-hover': palette.night.hover,
    'surface-sunken': palette.night.background,
    border: palette.night.border,
    'border-strong': palette.night['border-strong'],
    foreground: palette.night.text,
    label: palette.night.label,
    muted: palette.night.muted,
    subtle: palette.gray[500],
    primary: palette.green[500],
    'primary-pressed': palette.green[600],
    'primary-foreground': palette.gray[900],
    secondary: palette.night.surface,
    'secondary-foreground': palette.night.text,
    brand: palette.night.hero,
    'brand-raised': palette.gray[800],
    'brand-foreground': palette.white,
    'brand-muted': palette.gray[400],
    accent: palette.night.green,
    'accent-soft': palette.night['green-tint'],
    disabled: palette.night.raised,
    'disabled-foreground': palette.gray[500],
    success: palette.success[500],
    'success-text': palette.night['success-text'],
    'success-soft': palette.night['green-tint'],
    warning: palette.warning[500],
    'warning-text': palette.night['warning-text'],
    'warning-soft': palette.night.raised,
    danger: palette.danger[500],
    'danger-text': palette.night['danger-text'],
    'danger-soft': palette.night.raised,
    'focus-ring': palette.night['green-tint'],
    'danger-ring': palette.night.raised,
  },
};

/**
 * Loaded font family names (must match the keys passed to useFonts).
 * Manrope — the typeface of the VAULTA wordmark.
 */
const fontFamily = {
  regular: 'Manrope_400Regular',
  medium: 'Manrope_500Medium',
  semibold: 'Manrope_600SemiBold',
  bold: 'Manrope_700Bold',
};

/** Type scale from the designs: [fontSize, lineHeight, letterSpacing] in px. */
const typeScale = {
  display: [32, 40, -0.8], // balance amounts
  h1: [28, 34, -0.84], // screen titles
  h2: [20, 28, -0.2],
  h3: [17, 24, 0], // section headings
  'body-lg': [16, 24, 0], // buttons, inputs
  body: [15, 22, 0], // list item titles
  'body-sm': [14, 20, 0],
  caption: [13, 18, 0], // subtitles, labels
  small: [12, 16, 0],
  xs: [11, 14, 0], // tab labels, tags
  overline: [11, 14, 0.4], // uppercase eyebrow labels
};

/** Spacing scale in px (Tailwind's default 4px scale is kept as well). */
const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  '2xl': 32,
  '3xl': 40,
  '4xl': 48,
  gutter: 20, // horizontal screen padding
  'gutter-lg': 24, // auth & onboarding screens
};

const radii = {
  sm: 8,
  md: 12, // inputs, icon buttons, icon tiles
  button: 14,
  lg: 16, // cards
  xl: 20, // balance card
  '2xl': 24,
  full: 9999,
};

/** Shadows as RN `boxShadow` strings (supported natively on the New Architecture and on web). */
const shadows = {
  none: 'none',
  sm: '0px 1px 2px rgba(16, 24, 40, 0.08)',
  md: '0px 4px 12px rgba(16, 24, 40, 0.10)',
  lg: '0px 12px 32px rgba(16, 24, 40, 0.15)',
};

/**
 * "#RRGGBB" -> "R G B" so Tailwind can apply opacity modifiers to CSS variables.
 * @param {string} hex
 * @returns {string}
 */
function hexToRgbChannels(hex) {
  const value = parseInt(hex.replace('#', ''), 16);
  return `${(value >> 16) & 255} ${(value >> 8) & 255} ${value & 255}`;
}

/**
 * CSS variable map for a theme, e.g. { '--color-background': '245 247 250' }.
 * @param {keyof typeof themes} name
 * @returns {Record<`--${string}`, string>}
 */
function themeVariables(name) {
  /** @type {Record<`--${string}`, string>} */
  const result = {};
  for (const [key, hex] of Object.entries(themes[name])) {
    result[`--color-${key}`] = hexToRgbChannels(hex);
  }
  return result;
}

module.exports = {
  palette,
  themes,
  fontFamily,
  typeScale,
  spacing,
  radii,
  shadows,
  themeVariables,
};
