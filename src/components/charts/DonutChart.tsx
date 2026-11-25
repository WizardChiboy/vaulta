import type { ReactNode } from 'react';
import { View } from 'react-native';
import Svg, { Circle, G } from 'react-native-svg';

export type DonutSegment = {
  key: string;
  value: number;
  color: string;
};

export type DonutChartProps = {
  segments: readonly DonutSegment[];
  size?: number | undefined;
  strokeWidth?: number | undefined;
  /** Read instead of the chart. */
  accessibilityLabel: string;
  /** Centred in the hole, e.g. the total. */
  children?: ReactNode | undefined;
};

/** Gap between segments along the ring, in px (design 31). */
const SEGMENT_GAP = 2;

/** Ring of proportional segments, clockwise from 12 o'clock (design 31). */
export function DonutChart({
  segments,
  size = 150,
  strokeWidth = 20,
  accessibilityLabel,
  children,
}: DonutChartProps) {
  const total = segments.reduce((sum, segment) => sum + Math.max(segment.value, 0), 0);
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const centre = size / 2;
  // Only separate segments when there is more than one.
  const gap = segments.length > 1 ? SEGMENT_GAP : 0;

  const lengths = segments.map((segment) =>
    total > 0 ? (Math.max(segment.value, 0) / total) * circumference : 0
  );
  const arcs = segments.map((segment, index) => ({
    ...segment,
    length: Math.max((lengths[index] ?? 0) - gap, 0),
    // Distance along the ring to where this segment starts.
    offset: lengths.slice(0, index).reduce((sum, length) => sum + length, 0),
  }));

  return (
    <View
      accessible
      accessibilityRole="image"
      accessibilityLabel={accessibilityLabel}
      style={{ width: size, height: size }}
    >
      <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <G transform={`rotate(-90 ${centre} ${centre})`}>
          {arcs.map((arc) => (
            <Circle
              key={arc.key}
              cx={centre}
              cy={centre}
              r={radius}
              fill="none"
              stroke={arc.color}
              strokeWidth={strokeWidth}
              strokeDasharray={`${arc.length} ${circumference - arc.length}`}
              strokeDashoffset={-arc.offset}
            />
          ))}
        </G>
      </Svg>
      {children !== undefined && (
        <View className="absolute inset-0 items-center justify-center">{children}</View>
      )}
    </View>
  );
}
