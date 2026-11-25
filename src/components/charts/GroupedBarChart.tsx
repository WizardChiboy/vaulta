import { View } from 'react-native';
import Svg, { G, Path, Text as SvgText } from 'react-native-svg';

import { useTheme } from '@/components/layout/ThemeProvider';
import { fontFamily } from '@/constants/theme';

export type BarGroup = {
  label: string;
  /** One value per series, in series order. */
  values: readonly number[];
};

export type GroupedBarChartProps = {
  groups: readonly BarGroup[];
  /** Fill for each series, in order. */
  seriesColors: readonly string[];
  /** Read instead of the chart, which is hidden from screen readers. */
  accessibilityLabel: string;
  /** Axis tick text, e.g. 750000 → "750k". */
  formatTick?: ((value: number) => string) | undefined;
};

// Drawing space from design 30; the SVG scales to the card width.
const WIDTH = 345;
const HEIGHT = 180;
const PLOT = { left: 32, right: 340, top: 10, bottom: 150 };
const BAR_WIDTH = 13;
const BAR_GAP = 4;
const GRID_STEPS = 4;
/** Baseline of the x-axis labels. */
const LABEL_BASELINE = 168;
/** "Nice" multipliers for the tick step, per power of ten. */
const NICE_STEPS = [1, 1.5, 2, 2.5, 3, 4, 5, 6, 8, 10];

/** Smallest round step so that GRID_STEPS steps cover `max`. */
function niceStep(max: number) {
  if (max <= 0) return 1;
  const raw = max / GRID_STEPS;
  const magnitude = 10 ** Math.floor(Math.log10(raw));
  const multiplier = NICE_STEPS.find((step) => step * magnitude >= raw) ?? 10;
  return multiplier * magnitude;
}

/** Bar outline with rounded corners (r = 3, as in the design), as an SVG path. */
function barPath(x: number, y: number, width: number, height: number) {
  const r = Math.min(3, width / 2, height / 2);
  return [
    `M${x + r} ${y}`,
    `H${x + width - r}`,
    `A${r} ${r} 0 0 1 ${x + width} ${y + r}`,
    `V${y + height - r}`,
    `A${r} ${r} 0 0 1 ${x + width - r} ${y + height}`,
    `H${x + r}`,
    `A${r} ${r} 0 0 1 ${x} ${y + height - r}`,
    `V${y + r}`,
    `A${r} ${r} 0 0 1 ${x + r} ${y}`,
    'Z',
  ].join('');
}

/** 1000000 → "1m", 1500000 → "1.5m", 750000 → "750k". */
export function formatCompact(value: number) {
  const trim = (number: number) => String(Number(number.toFixed(1)));
  if (value >= 1_000_000) return `${trim(value / 1_000_000)}m`;
  if (value >= 1_000) return `${trim(value / 1_000)}k`;
  return String(value);
}

/**
 * Vertical grouped bars with a y-axis grid (design 30, income vs expenses).
 * The last group is the current period: its label is bold.
 */
export function GroupedBarChart({
  groups,
  seriesColors,
  accessibilityLabel,
  formatTick = formatCompact,
}: GroupedBarChartProps) {
  const { colors } = useTheme();
  const max = Math.max(0, ...groups.flatMap((group) => group.values));
  const step = niceStep(max);
  const top = step * GRID_STEPS;
  const plotHeight = PLOT.bottom - PLOT.top;
  const groupWidth = (PLOT.right - PLOT.left) / Math.max(groups.length, 1);
  const barsWidth = seriesColors.length * BAR_WIDTH + (seriesColors.length - 1) * BAR_GAP;
  const y = (value: number) => PLOT.bottom - (value / top) * plotHeight;
  const ticks = Array.from({ length: GRID_STEPS + 1 }, (_, index) => step * (GRID_STEPS - index));

  return (
    <View
      accessible
      accessibilityRole="image"
      accessibilityLabel={accessibilityLabel}
      style={{ width: '100%', aspectRatio: WIDTH / HEIGHT }}
    >
      <Svg width="100%" height="100%" viewBox={`0 0 ${WIDTH} ${HEIGHT}`}>
        <G stroke={colors['surface-muted']} strokeWidth={1}>
          {ticks.slice(0, -1).map((tick) => (
            <Path key={tick} d={`M${PLOT.left} ${y(tick)}H${PLOT.right}`} />
          ))}
        </G>
        <Path d={`M${PLOT.left} ${PLOT.bottom}H${PLOT.right}`} stroke={colors.border} />

        {ticks.map((tick) => (
          <G key={tick} transform={`translate(${PLOT.left - 6} ${y(tick) + 3})`}>
            <SvgText
              fill={colors.subtle}
              fontSize={10}
              fontFamily={fontFamily.regular}
              textAnchor="end"
            >
              {formatTick(tick)}
            </SvgText>
          </G>
        ))}

        {groups.map((group, groupIndex) => {
          const centre = PLOT.left + groupWidth * (groupIndex + 0.5);
          const start = centre - barsWidth / 2;
          const current = groupIndex === groups.length - 1;
          return (
            <G key={group.label}>
              {seriesColors.map((color, seriesIndex) => {
                const value = group.values[seriesIndex] ?? 0;
                const height = Math.max((value / top) * plotHeight, value > 0 ? 2 : 0);
                if (height <= 0) return null;
                return (
                  <Path
                    key={color}
                    d={barPath(
                      start + seriesIndex * (BAR_WIDTH + BAR_GAP),
                      PLOT.bottom - height,
                      BAR_WIDTH,
                      height
                    )}
                    fill={color}
                  />
                );
              })}
              <G transform={`translate(${centre} ${LABEL_BASELINE})`}>
                <SvgText
                  fill={current ? colors.foreground : colors.muted}
                  fontSize={11}
                  fontFamily={current ? fontFamily.semibold : fontFamily.regular}
                  textAnchor="middle"
                >
                  {group.label}
                </SvgText>
              </G>
            </G>
          );
        })}
      </Svg>
    </View>
  );
}
