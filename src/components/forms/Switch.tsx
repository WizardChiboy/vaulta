import { useEffect, useState } from 'react';
import { Animated, Platform, Pressable } from 'react-native';

import { palette } from '@/constants/theme';
import { cn } from '@/lib/cn';

/** Knob travel: 48px track − 22px knob − 2 × 3px inset. */
const TRAVEL = 20;

const knobStyle = {
  width: 22,
  height: 22,
  borderRadius: 11,
  backgroundColor: palette.white,
  boxShadow: '0px 1px 2px rgba(16, 24, 40, 0.25)',
};

export type SwitchProps = {
  value: boolean;
  onValueChange: (value: boolean) => void;
  /** Required: the switch has no visible text of its own. */
  accessibilityLabel: string;
  disabled?: boolean | undefined;
  className?: string | undefined;
};

/** Design .sw: 48 × 28 track, 22px white knob; green when on (18 25 31 36–39). */
export function Switch({
  value,
  onValueChange,
  accessibilityLabel,
  disabled = false,
  className,
}: SwitchProps) {
  // Created once (lazy state initialiser); 0 = off, 1 = on.
  const [position] = useState(() => new Animated.Value(value ? 1 : 0));
  const [translateX] = useState(() =>
    position.interpolate({ inputRange: [0, 1], outputRange: [0, TRAVEL] })
  );

  useEffect(() => {
    Animated.timing(position, {
      toValue: value ? 1 : 0,
      duration: 160,
      useNativeDriver: Platform.OS !== 'web',
    }).start();
  }, [position, value]);

  return (
    <Pressable
      accessibilityRole="switch"
      accessibilityLabel={accessibilityLabel}
      accessibilityState={{ checked: value, disabled }}
      disabled={disabled}
      onPress={() => onValueChange(!value)}
      hitSlop={8}
      className={cn(
        'h-7 w-12 justify-center rounded-full px-[3px]',
        value ? 'bg-primary' : 'bg-border-strong',
        disabled && 'opacity-50',
        className
      )}
    >
      {/* Animated.View: style, not className (NativeWind doesn't map it). */}
      <Animated.View style={[knobStyle, { transform: [{ translateX }] }]} />
    </Pressable>
  );
}
