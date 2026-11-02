import { useRef, useState } from 'react';
import { View, type AccessibilityActionEvent, type GestureResponderEvent } from 'react-native';

import { shadows } from '@/constants/theme';
import { cn } from '@/lib/cn';

const THUMB_SIZE = 28;

export type RangeSliderProps = {
  min: number;
  max: number;
  step: number;
  low: number;
  high: number;
  onChange: (low: number, high: number) => void;
  /** Spoken value, e.g. "₦5,000". */
  formatValue: (value: number) => string;
  accessibilityLabel?: string | undefined;
  className?: string | undefined;
};

type Thumb = 'low' | 'high';

/**
 * Two-thumb slider (design 14): 4px track, green between the thumbs, 28px white thumbs
 * with a green ring. Built on the core responder system, so it needs no gesture library
 * and works in Expo Go and on web. Thumbs snap to `step`, keep one step apart, and
 * support screen-reader increment/decrement.
 */
export function RangeSlider({
  min,
  max,
  step,
  low,
  high,
  onChange,
  formatValue,
  accessibilityLabel,
  className,
}: RangeSliderProps) {
  const [width, setWidth] = useState(0);
  const span = max - min;

  const position = (value: number) => (span > 0 ? ((value - min) / span) * width : 0);

  const update = (thumb: Thumb, raw: number) => {
    const snapped = Math.round((raw - min) / step) * step + min;
    if (thumb === 'low') onChange(Math.min(Math.max(snapped, min), high - step), high);
    else onChange(low, Math.max(Math.min(snapped, max), low + step));
  };

  return (
    <View
      accessibilityLabel={accessibilityLabel}
      className={cn('h-7 justify-center', className)}
      onLayout={(event) => setWidth(event.nativeEvent.layout.width)}
    >
      <View className="h-1 rounded-full bg-border" />
      <View
        className="absolute top-3 h-1 rounded-full bg-primary"
        style={{ left: position(low), width: position(high) - position(low) }}
      />
      {(['low', 'high'] as const).map((thumb) => (
        <SliderThumb
          key={thumb}
          label={thumb === 'low' ? 'Minimum' : 'Maximum'}
          value={thumb === 'low' ? low : high}
          left={position(thumb === 'low' ? low : high)}
          valuePerPixel={width > 0 ? span / width : 0}
          step={step}
          formatValue={formatValue}
          onChange={(value) => update(thumb, value)}
        />
      ))}
    </View>
  );
}

type SliderThumbProps = {
  label: string;
  value: number;
  /** Centre of the thumb, in px from the start of the track. */
  left: number;
  valuePerPixel: number;
  step: number;
  formatValue: (value: number) => string;
  /** Receives the unsnapped value under the finger. */
  onChange: (value: number) => void;
};

function SliderThumb({
  label,
  value,
  left,
  valuePerPixel,
  step,
  formatValue,
  onChange,
}: SliderThumbProps) {
  // Where the current drag started, in page coordinates and slider values.
  const drag = useRef({ pageX: 0, value: 0 });

  return (
    <View
      onStartShouldSetResponder={() => true}
      // Keep the drag when the sheet or a scroll view asks for it.
      onResponderTerminationRequest={() => false}
      onResponderGrant={(event: GestureResponderEvent) => {
        drag.current = { pageX: event.nativeEvent.pageX, value };
      }}
      onResponderMove={(event: GestureResponderEvent) => {
        const dx = event.nativeEvent.pageX - drag.current.pageX;
        onChange(drag.current.value + dx * valuePerPixel);
      }}
      accessible
      accessibilityRole="adjustable"
      accessibilityLabel={label}
      accessibilityValue={{ text: formatValue(value) }}
      accessibilityActions={[{ name: 'increment' }, { name: 'decrement' }]}
      onAccessibilityAction={(event: AccessibilityActionEvent) =>
        onChange(value + (event.nativeEvent.actionName === 'increment' ? step : -step))
      }
      hitSlop={10}
      className="absolute top-0 rounded-full border-2 border-primary bg-surface"
      style={{
        width: THUMB_SIZE,
        height: THUMB_SIZE,
        left: left - THUMB_SIZE / 2,
        boxShadow: shadows.sm,
      }}
    />
  );
}
