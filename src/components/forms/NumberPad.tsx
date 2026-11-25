import { Pressable, View } from 'react-native';

import { useTheme } from '@/components/layout/ThemeProvider';
import { Text } from '@/components/ui/Text';
import { Delete, ICON_STROKE } from '@/constants/icons';

export type NumberPadKey = '0' | '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '.' | 'del';

const ROWS: readonly (readonly NumberPadKey[])[] = [
  ['1', '2', '3'],
  ['4', '5', '6'],
  ['7', '8', '9'],
  ['.', '0', 'del'],
];

/** Largest whole part the pad accepts (₦999,999,999). */
const MAX_WHOLE_DIGITS = 9;

/**
 * Applies a key press to a raw amount string ("75000", "12.5"): no leading zeros,
 * one decimal point, at most 2 decimal places and 9 whole digits.
 */
export function applyAmountKey(previous: string, key: NumberPadKey): string {
  if (key === 'del') return previous.slice(0, -1);
  if (key === '.') {
    if (previous.includes('.')) return previous;
    return previous === '' ? '0.' : `${previous}.`;
  }
  if (previous === '0') return key;
  const dot = previous.indexOf('.');
  if (dot !== -1 && previous.length - dot > 2) return previous;
  if (dot === -1 && previous.length >= MAX_WHOLE_DIGITS) return previous;
  return previous + key;
}

/** Raw amount string for display, e.g. "75000" → "75,000", "12.5" → "12.5". */
export function formatAmountInput(raw: string): string {
  if (!raw) return '';
  const dot = raw.indexOf('.');
  const wholePart = dot === -1 ? raw : raw.slice(0, dot);
  const decimals = dot === -1 ? undefined : raw.slice(dot + 1);
  const whole = parseInt(wholePart, 10);
  const formatted = Number.isNaN(whole) ? '' : whole.toLocaleString('en-NG');
  return decimals !== undefined ? `${formatted}.${decimals}` : formatted;
}

export type NumberPadProps = { onKey: (key: NumberPadKey) => void };

/** On-screen digit pad for amount entry (designs 19, 29). */
export function NumberPad({ onKey }: NumberPadProps) {
  const { colors } = useTheme();

  return (
    <View style={{ gap: 4 }} accessibilityLabel="Number pad">
      {ROWS.map((row) => (
        <View key={row.join()} style={{ flexDirection: 'row', gap: 4 }}>
          {row.map((key) => (
            <Pressable
              key={key}
              accessibilityRole="button"
              accessibilityLabel={key === 'del' ? 'Delete' : key === '.' ? 'Decimal point' : key}
              onPress={() => onKey(key)}
              style={({ pressed }) => ({
                flex: 1,
                height: 52,
                borderRadius: 12,
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: pressed ? colors['surface-hover'] : 'transparent',
              })}
            >
              {key === 'del' ? (
                <Delete size={24} color={colors.foreground} strokeWidth={ICON_STROKE} />
              ) : (
                <Text style={{ fontSize: 24 }} className="font-sans-medium text-foreground">
                  {key}
                </Text>
              )}
            </Pressable>
          ))}
        </View>
      ))}
    </View>
  );
}
