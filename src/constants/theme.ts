import tokens from './tokens';

export const { palette, themes, fontFamily, typeScale, spacing, radii, shadows, themeVariables } =
  tokens;

export type ThemeName = keyof typeof themes;
export type ThemeColors = (typeof themes)['light'];
