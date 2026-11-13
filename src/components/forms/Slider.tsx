import { useRef, useState } from 'react';
import { View, type AccessibilityActionEvent, type GestureResponderEvent } from 'react-native';

import { shadows } from '@/constants/theme';
import { cn } from '@/lib/cn';

const THUMB_SIZE = 24;

export type SliderProps = {
  min: number;
  max: number;
  step: number;
  value: number;
  onChange: (value: number) => void;
  /** Spoken label, e.g. "Monthly limit". */
  accessibilityLabel: string;
  /** Spoken value, e.g. "₦300,000". */
  formatValue: (value: number) => string;
  className?: string | undefined;
};

/**
 * Single-thumb slider (design 25): 4px track, green up to the thumb, 24px white thumb with
 * a 2px green ring. Tap anywhere on the track to jump, or drag. Built on the core responder
 * system like RangeSlider, so it needs no gesture library and works in Expo Go and on web.
 */
export function Slider({
  min,
  max,
  step,
  value,
  onChange,
  accessibilityLabel,
  formatValue,
  className,
}: SliderProps) {
  const [width, setWidth] = useState(0);
  // Where the current drag started, in page coordinates and slider values.
  const drag = useRef({ pageX: 0, value: 0 });
  const span = max - min;
  const valuePerPixel = width > 0 ? span / width : 0;
  const left = span > 0 ? ((value - min) / span) * width : 0;

  const update = (raw: number) => {
    const snapped = Math.round((raw - min) / step) * step + min;
    const clamped = Math.min(Math.max(snapped, min), max);
    if (clamped !== value) onChange(clamped);
  };

  return (
    <View
      onLayout={(event) => setWidth(event.nativeEvent.layout.width)}
      onStartShouldSetResponder={() => true}
      // Keep the drag when a parent scroll view asks for it.
      onResponderTerminationRequest={() => false}
      onResponderGrant={(event: GestureResponderEvent) => {
        // Jump to the touch point, then drag relative to it.
        const touched = min + event.nativeEvent.locationX * valuePerPixel;
        drag.current = { pageX: event.nativeEvent.pageX, value: touched };
        update(touched);
      }}
      onResponderMove={(event: GestureResponderEvent) => {
        const dx = event.nativeEvent.pageX - drag.current.pageX;
        update(drag.current.value + dx * valuePerPixel);
      }}
      accessible
      accessibilityRole="adjustable"
      accessibilityLabel={accessibilityLabel}
      accessibilityValue={{ text: formatValue(value) }}
      accessibilityActions={[{ name: 'increment' }, { name: 'decrement' }]}
      onAccessibilityAction={(event: AccessibilityActionEvent) =>
        update(value + (event.nativeEvent.actionName === 'increment' ? step : -step))
      }
      hitSlop={{ top: 10, bottom: 10 }}
      className={cn('h-6 justify-center', className)}
    >
      <View pointerEvents="none" className="h-1 rounded-full bg-border" />
      <View
        pointerEvents="none"
        className="absolute top-2.5 h-1 rounded-full bg-primary"
        style={{ left: 0, width: left }}
      />
      <View
        pointerEvents="none"
        className="absolute top-0 rounded-full border-2 border-primary bg-surface"
        style={{
          width: THUMB_SIZE,
          height: THUMB_SIZE,
          left: left - THUMB_SIZE / 2,
          boxShadow: shadows.sm,
        }}
      />
    </View>
  );
}
