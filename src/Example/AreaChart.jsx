import React from 'react';
import { Group } from '@visx/group';
import { LinePath } from '@visx/shape';
import { AxisLeft, AxisBottom } from '@visx/axis';
import { curveMonotoneX } from '@visx/curve';
import { colors } from '../constants/chart-colors';
import { axisBottomTickLabelProps, axisLeftTickLabelProps } from '../constants/chart-axis';
import { getDate, getStockValue } from '../constants/chart-data-getters';
import { axisColor } from '../constants/chart-colors';

export default function AreaChart({
  data,
  width,
  yMax,
  margin,
  xScale,
  yScale,
  hideBottomAxis = false,
  hideLeftAxis = false,
  top,
  left,
  children,
}) {
  if (width < 10) return null;
  return (
    <Group left={left || margin.left} top={top || margin.top}>
      <LinePath
        data={data}
        x={d => xScale(getDate(d)) || 0}
        y={d => yScale(getStockValue(d)) || 0}
        yScale={yScale}
        strokeWidth={1}
        stroke={colors['currentProbe1Temp']}
        curve={curveMonotoneX}
      />
      {!hideBottomAxis && (
        <AxisBottom
          top={yMax}
          scale={xScale}
          numTicks={width > 520 ? 10 : 5}
          stroke={axisColor}
          tickStroke={axisColor}
          tickLabelProps={() => axisBottomTickLabelProps}
        />
      )}
      {!hideLeftAxis && (
        <AxisLeft
          scale={yScale}
          numTicks={5}
          stroke={axisColor}
          tickStroke={axisColor}
          tickLabelProps={() => axisLeftTickLabelProps}
        />
      )}
      {children}
    </Group>
  );
}