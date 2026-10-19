import { useRef, useState, type ComponentRef } from 'react';
import { Pressable, TextInput, View } from 'react-native';

import { useTheme } from '@/components/layout/ThemeProvider';
import { Text } from '@/components/ui/Text';
import { cn } from '@/lib/cn';

export type OtpInputProps = {
  value: string;
  onChange: (value: string) => void;
  length?: number | undefined;
  autoFocus?: boolean | undefined;
  error?: boolean | undefined;
};

/**
 * One-time code boxes (design 04). A single hidden TextInput receives the digits, so
 * paste and SMS autofill (iOS oneTimeCode / Android sms-otp) fill every box at once.
 */
export function OtpInput({
  value,
  onChange,
  length = 6,
  autoFocus = false,
  error = false,
}: OtpInputProps) {
  const { colors } = useTheme();
  const inputRef = useRef<ComponentRef<typeof TextInput>>(null);
  const [focused, setFocused] = useState(autoFocus);
  const activeIndex = Math.min(value.length, length - 1);

  return (
    <Pressable
      onPress={() => inputRef.current?.focus()}
      accessibilityLabel="One-time code"
      className="flex-row justify-between"
    >
      {Array.from({ length }, (_, i) => {
        const active = focused && i === activeIndex;
        return (
          <View
            key={i}
            accessibilityLabel={`Digit ${i + 1}`}
            className={cn(
              'h-[58px] w-12 items-center justify-center rounded-md bg-surface',
              error
                ? 'border border-danger'
                : active
                  ? 'border-2 border-primary'
                  : 'border border-border-strong'
            )}
            style={active ? { boxShadow: `0px 0px 0px 4px ${colors['focus-ring']}` } : undefined}
          >
            <Text variant="h2" weight="semibold" style={{ fontSize: 24, lineHeight: 30 }}>
              {value[i] ?? ''}
            </Text>
          </View>
        );
      })}

      <TextInput
        ref={inputRef}
        value={value}
        onChangeText={(text) => onChange(text.replace(/\D/g, '').slice(0, length))}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        autoFocus={autoFocus}
        keyboardType="number-pad"
        textContentType="oneTimeCode"
        autoComplete="sms-otp"
        maxLength={length}
        caretHidden
        // Invisible but focusable; the boxes above render its value.
        className="absolute h-full w-full opacity-0"
        accessibilityLabel="One-time code"
      />
    </Pressable>
  );
}
