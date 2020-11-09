import React from "react";
import { Group } from "@visx/group";
import { LinePath } from "@visx/shape";
import { AxisLeft, AxisBottom } from "@visx/axis";
import { curveMonotoneX } from "@visx/curve";
import {
  axisBottomTickLabelProps,
  axisLeftTickLabelProps,
} from "../constants/chart-axis";
import { getDate, getY } from "../constants/chart-data-getters";
import { axisColor } from "../constants/chart-colors";

export default function LineChart({
  data,
  width,
  yMax,
  margin,
  xScale,
  yScale,
  lineColor,
  top,
  left,
  children,
}) {
  console.log('LineChart data', data);
  if (width < 10) return null;
  return (
    <Group left={left || margin.left} top={top || margin.top}>
      <LinePath
        data={data}
        x={(d) => xScale(getDate(d)) || 0}
        y={(d) => yScale(getY(d)) || 0}
        strokeWidth={1}
        stroke={lineColor}
        curve={curveMonotoneX}
      />
      <AxisBottom
        top={yMax}
        scale={xScale}
        numTicks={width > 520 ? 10 : 5}
        stroke={axisColor}
        tickStroke={axisColor}
        tickLabelProps={() => axisBottomTickLabelProps}
      />
      <AxisLeft
        scale={yScale}
        numTicks={5}
        stroke={axisColor}
        tickStroke={axisColor}
        tickLabelProps={() => axisLeftTickLabelProps}
      />
      {children}
    </Group>
  );
}
