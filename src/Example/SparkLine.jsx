import React, { useMemo, useContext } from "react";
import { scaleTime, scaleLinear } from "@visx/scale";
import { Group } from "@visx/group";
import { extent } from "d3-array";
import { LinearGradient } from '@visx/gradient';

import GrillStatusContext from "../contexts/GrillStatusContext";
import { getDate, getY } from "../constants/chart-data-getters";
import { LinePath, AreaClosed } from "@visx/shape";

// @todo break into legend, chart components and use ParentSize to make chart responsive
function SparkLine({ width = 300, height = 75, metric }) {
  const { recentGrouppedByMetric } = useContext(GrillStatusContext);
  const data = recentGrouppedByMetric[metric] || [];

  const margin = {
    top: 5,
    left: 5,
    bottom: 5,
    right: 5,
  };

  // Then we'll create some bounds
  const xPositionMax = width - margin.left - margin.right;
  const yPositionMax = height - margin.top - margin.bottom;

  // scales
  const dateScale = useMemo(
    () =>
      scaleTime({
        range: [0, xPositionMax],
        // @todo move extent into context, use first and last points
        domain: extent(data, getDate),
      }),
    [xPositionMax, data]
  );

  const tempScale = useMemo(
    () =>
      scaleLinear({
        range: [yPositionMax, 0],
        domain: extent(data, getY),
      }),
    [yPositionMax, data]
  );

  if (data.length === 0) {
    return <p className="loading">Loading...</p>;
  }

  return (
    <>
      <svg width={width} height={height}>
        <LinearGradient
          id="area-gradient"
          from="gray"
          to="gray"
          fromOpacity={0.1}
        />
        <Group left={margin.left} top={margin.top}>
          <AreaClosed
            yScale={tempScale}
            data={data}
            x={(d) => dateScale(getDate(d)) || 0}
            y={(d) => tempScale(getY(d)) || 0}
            stroke="url(#area-gradient)"
            fill="url(#area-gradient)"
          />
        </Group>
      </svg>
    </>
  );
}

export default SparkLine;
