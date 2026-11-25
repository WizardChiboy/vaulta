import type { ReactNode } from 'react';
import { View } from 'react-native';
import Svg, { Circle } from 'react-native-svg';

import { useTheme } from '@/components/layout/ThemeProvider';

export type ProgressRingProps = {
  /** 0–1 */
  value: number;
  size?: number | undefined;
  strokeWidth?: number | undefined;
  /** Spoken instead of the default "N% complete". */
  accessibilityLabel?: string | undefined;
  /** Centred over the ring, e.g. the percentage. */
  children?: ReactNode | undefined;
};

/** Circular goal progress: soft green track, green arc from 12 o'clock (design 28). */
export function ProgressRing({
  value,
  size = 168,
  strokeWidth = 14,
  accessibilityLabel,
  children,
}: ProgressRingProps) {
  const { colors } = useTheme();
  const share = Math.min(Math.max(value, 0), 1);
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const centre = size / 2;
  const percent = Math.round(share * 100);

  return (
    <View
      accessible
      accessibilityRole="progressbar"
      accessibilityLabel={accessibilityLabel ?? `${percent}% complete`}
      accessibilityValue={{ min: 0, max: 100, now: percent }}
      style={{ width: size, height: size }}
    >
      <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <Circle
          cx={centre}
          cy={centre}
          r={radius}
          fill="none"
          stroke={colors['accent-soft']}
          strokeWidth={strokeWidth}
        />
        {share > 0 && (
          <Circle
            cx={centre}
            cy={centre}
            r={radius}
            fill="none"
            stroke={colors.primary}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={`${share * circumference} ${circumference}`}
            transform={`rotate(-90 ${centre} ${centre})`}
          />
        )}
      </Svg>
      {children !== undefined && (
        <View className="absolute inset-0 items-center justify-center">{children}</View>
      )}
    </View>
  );
}
