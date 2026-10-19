import { Image, type ImageSourcePropType, type ImageStyle, type StyleProp } from 'react-native';

import monogramReversed from '../../../assets/vaulta-logo/png/vaulta-monogram-reversed.png';
import monogram from '../../../assets/vaulta-logo/png/vaulta-monogram.png';
import wordmarkMono from '../../../assets/vaulta-logo/png/vaulta-wordmark-mono-black.png';
import wordmarkReversed from '../../../assets/vaulta-logo/png/vaulta-wordmark-reversed.png';
import wordmark from '../../../assets/vaulta-logo/png/vaulta-wordmark.png';

const sources = {
  /** "vaulta." navy with green full stop, for light backgrounds. */
  primary: wordmark,
  /** White with green full stop, for dark backgrounds. */
  reversed: wordmarkReversed,
  /** "v." monogram (light backgrounds). */
  monogram,
  /** "v." monogram (dark backgrounds). */
  'monogram-reversed': monogramReversed,
  /** Single-colour wordmark; set its colour with `color` (e.g. navy on the green card). */
  mono: wordmarkMono,
} as const satisfies Record<string, ImageSourcePropType>;

// Width / height of the source artwork.
const aspectRatio = {
  primary: 2400 / 591,
  reversed: 2400 / 591,
  monogram: 1,
  'monogram-reversed': 1,
  mono: 2400 / 591,
} as const;

export type LogoVariant = keyof typeof sources;

export type LogoProps = {
  variant?: LogoVariant | undefined;
  /** Rendered height in px; width follows the artwork's aspect ratio. */
  height?: number | undefined;
  /** Tint for the `mono` variant. */
  color?: string | undefined;
  style?: StyleProp<ImageStyle> | undefined;
};

export function Logo({ variant = 'primary', height = 24, color, style }: LogoProps) {
  return (
    <Image
      source={sources[variant]}
      resizeMode="contain"
      accessibilityRole="image"
      accessibilityLabel="Vaulta"
      style={[
        { height, width: height * aspectRatio[variant] },
        variant === 'mono' && color ? { tintColor: color } : null,
        style,
      ]}
    />
  );
}
