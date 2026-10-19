const {
  palette,
  themes,
  fontFamily,
  typeScale,
  spacing,
  radii,
} = require('./src/constants/tokens');

/** Semantic colours resolve to CSS variables set by <ThemeProvider />. */
const semanticColors = Object.fromEntries(
  Object.keys(themes.light).map((key) => [key, `rgb(var(--color-${key}) / <alpha-value>)`])
);

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  // Theme is controlled in-app via <ThemeProvider />. 'class' is also required on
  // web: with the default 'media', NativeWind 4.2's web runtime throws on load.
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        ...semanticColors,
        gray: palette.gray,
        green: palette.green,
      },
      fontFamily: {
        sans: [fontFamily.regular],
        'sans-medium': [fontFamily.medium],
        'sans-semibold': [fontFamily.semibold],
        'sans-bold': [fontFamily.bold],
      },
      fontSize: Object.fromEntries(
        Object.entries(typeScale).map(([key, [size, lineHeight, letterSpacing]]) => [
          key,
          [`${size}px`, { lineHeight: `${lineHeight}px`, letterSpacing: `${letterSpacing}px` }],
        ])
      ),
      spacing: Object.fromEntries(
        Object.entries(spacing).map(([key, value]) => [key, `${value}px`])
      ),
      borderRadius: Object.fromEntries(
        Object.entries(radii).map(([key, value]) => [key, `${value}px`])
      ),
    },
  },
  plugins: [],
};
