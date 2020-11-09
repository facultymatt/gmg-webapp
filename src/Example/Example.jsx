import React, { useMemo, useContext } from "react";
import { scaleTime, scaleLinear, scaleOrdinal } from "@visx/scale";
import { Group } from "@visx/group";
import { extent } from "d3-array";
import { legendGlyphSize } from "./../constants/chart-legend";
import { metrics } from "./../constants/metrics";
import { map, get } from "lodash";

import { LegendOrdinal, LegendItem, LegendLabel } from "@visx/legend";

import GrillStatusContext from "../contexts/GrillStatusContext";
import { colors } from "../constants/chart-colors";
import { getDate, getY } from "../constants/chart-data-getters";
import { LinePath } from "@visx/shape";
import { AxisBottom, AxisLeft } from "@visx/axis";
import {
  axisBottomTickLabelProps,
  axisLeftTickLabelProps,
} from "../constants/chart-axis";

function Example({ width, height }) {
  const { recent } = useContext(GrillStatusContext);
  // @todo move into context
  const recentGrouppedByMetric = {};
  metrics.forEach(({ metric, getY }) => {
    recentGrouppedByMetric[metric] = map(recent, (pt) => ({
      x: get(pt, "timestamp"),
      y: getY ? getY(pt) : get(pt, metric),
    }));
  });
  // @todo support all, for now just use one metric
  const dataForSingleMetric = recentGrouppedByMetric["currentGrillTemp"];

  /**
   * Create legend with key and color value
   */
  const ordinalColorScaleValues = {
    domain: [],
    range: [],
  };
  metrics.forEach(({ metric }) => {
    ordinalColorScaleValues.domain.push(metric);
    ordinalColorScaleValues.range.push(colors[metric]);
  });
  const ordinalColorScale = scaleOrdinal(ordinalColorScaleValues);

  const margin = {
    top: 20,
    left: 50,
    bottom: 40,
    right: 20,
  };

  // Then we'll create some bounds
  const xMax = width - margin.left - margin.right;
  const yMax = height - margin.top - margin.bottom;

  // scales
  const dateScale = useMemo(
    () =>
      scaleTime({
        range: [0, xMax],
        domain: extent(dataForSingleMetric, getDate),
      }),
    [xMax, dataForSingleMetric]
  );
  const tempScale = useMemo(
    () =>
      scaleLinear({
        range: [yMax, 0],
        domain: [130, 180]
      }),
    [yMax]
  );

  if (dataForSingleMetric.length === 0) {
    return <h1>No data</h1>;
  }

  return (
    <>
      {/* <LegendOrdinal
        scale={ordinalColorScale}
        labelFormat={(label) => `${label.toUpperCase()}`}
      >
        {(labels) => (
          <div style={{ display: "flex", flexDirection: "row" }}>
            {labels.map((label, i) => (
              <LegendItem
                key={`legend-quantile-${i}`}
                margin="0 5px"
                onClick={() => {
                  alert(`clicked: ${JSON.stringify(label)}`);
                }}
              >
                <svg width={legendGlyphSize} height={legendGlyphSize}>
                  <rect
                    fill={label.value}
                    width={legendGlyphSize}
                    height={legendGlyphSize}
                  />
                </svg>
                <LegendLabel align="left" margin="0 0 0 4px">
                  {label.text}
                </LegendLabel>
              </LegendItem>
            ))}
          </div>
        )}
      </LegendOrdinal> */}
      <svg width={width} height={height}>
        <Group left={margin.left} top={margin.top}>
          {metrics.map(({ metric }) => (
            <LinePath
              key={metric}
              data={recentGrouppedByMetric[metric]}
              x={(d) => dateScale(getDate(d)) || 0}
              y={(d) => tempScale(getY(d)) || 0}
              stroke={colors[metric]}
            />
          ))}
        </Group>
        <AxisBottom
          top={yMax + margin.top}
          left={margin.left}
          scale={dateScale}
        />
        <AxisLeft
          top={margin.top}
          left={width - xMax - margin.right}
          scale={tempScale}
        />
      </svg>
    </>
  );
}

export default Example;
