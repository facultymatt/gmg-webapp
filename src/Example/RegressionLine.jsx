import React, { useMemo, useContext } from "react";
import { regressionLoess } from "d3-regression";
import { scaleTime, scaleLinear } from "@visx/scale";
import { Group } from "@visx/group";
import { extent } from "d3-array";
import { MarkerArrow } from "@visx/marker";

import GrillStatusContext from "../contexts/GrillStatusContext";
import { getDate, getDateFromArray, getY, getYFromArray } from "../constants/chart-data-getters";
import { LinePath } from "@visx/shape";

// @todo break into legend, chart components and use ParentSize to make chart responsive
function RegressionLine({ width = 300, height = 75, metric }) {
  const { recentGrouppedByMetric } = useContext(GrillStatusContext);

  const regressionGenerator = regressionLoess()
    .x(getDate)
    .y(getY)
    .bandwidth(0.15);

  const data = regressionGenerator(recentGrouppedByMetric[metric] || []);

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
        domain: extent(data, getDateFromArray),
      }),
    [xPositionMax, data]
  );

  const tempScale = useMemo(
    () =>
      scaleLinear({
        range: [yPositionMax, 0],
        domain: extent(data, getYFromArray),
      }),
    [yPositionMax, data]
  );

  

  if (data.length === 0) {
    return <p className="loading">Loading...</p>;
  }

  return (
    <>
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
            data={data}
            x={(d) => dateScale(getDateFromArray(d)) || 0}
            y={(d) => tempScale(getYFromArray(d)) || 0}
            stroke="black"
            markerEnd="url(#marker-arrow)"
          />
        </Group>
      </svg>
    </>
  );
}

export default RegressionLine;
