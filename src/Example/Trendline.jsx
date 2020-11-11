import React, { useMemo, useContext } from "react";
import { scaleTime, scaleLinear } from "@visx/scale";
import { Group } from "@visx/group";
import { extent } from "d3-array";
import { MarkerArrow } from "@visx/marker";

import GrillStatusContext from "../contexts/GrillStatusContext";
import { getDate, getY } from "../constants/chart-data-getters";
import { LinePath } from "@visx/shape";

// @todo break into legend, chart components and use ParentSize to make chart responsive
function Trendline({ width = 100, height = 100 }) {
  const { trend } = useContext(GrillStatusContext);

  const margin = {
    top: 10,
    left: 10,
    bottom: 10,
    right: 10,
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
        domain: extent(trend, getDate),
      }),
    [xPositionMax, trend]
  );

  const tempScale = useMemo(
    () =>
      scaleLinear({
        range: [yPositionMax, 0],
        domain: [0, extent(trend, getY)[1]],
      }),
    [yPositionMax, trend]
  );

  if (trend.length === 0) {
    return <p className="loading">Loading...</p>;
  }

  return (
    <>
      <p>trend: {Math.round(trend[1].y - trend[0].y)}</p>
      <br />
      <svg width={width} height={height}>
        <MarkerArrow
          id="marker-arrow"
          stroke="red"
          size={10}
          strokeWidth={2}
          markerUnits="userSpaceOnUse"
        />
        <Group left={margin.left} top={margin.top}>
          <LinePath
            data={trend}
            x={(d) => dateScale(getDate(d)) || 0}
            y={(d) => tempScale(getY(d)) || 0}
            stroke="black"
            markerEnd="url(#marker-arrow)"
          />
        </Group>
      </svg>
    </>
  );
}

export default Trendline;
