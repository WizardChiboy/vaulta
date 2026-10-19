import { Text, type TextProps } from './Text';

/**
 * Green semibold link text. Works standalone or nested inside another <Text>
 * for inline links ("New to Vaulta? <TextLink>Create an account</TextLink>").
 */
export function TextLink({ variant = 'bodySm', ...props }: Omit<TextProps, 'tone' | 'weight'>) {
  return (
    <Text
      accessibilityRole="link"
      suppressHighlighting
      variant={variant}
      weight="semibold"
      tone="accent"
      {...props}
    />
  );
}
