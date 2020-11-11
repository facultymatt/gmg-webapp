import React, { useMemo, useContext } from "react";
import { scaleTime, scaleLinear, scaleOrdinal } from "@visx/scale";
import { Group } from "@visx/group";
import { extent } from "d3-array";
import { legendGlyphSize } from "./../constants/chart-legend";
import { metrics } from "./../constants/metrics";
import { find, get } from "lodash";
import { MarkerX, MarkerArrow } from "@visx/marker";

import { LegendOrdinal, LegendItem, LegendLabel } from "@visx/legend";

import GrillStatusContext from "../contexts/GrillStatusContext";
import { colors, metricStyle } from "../constants/chart-colors";
import { getDate, getY } from "../constants/chart-data-getters";
import { LinePath } from "@visx/shape";
import { AxisBottom, AxisLeft } from "@visx/axis";
import Trendline from "./Trendline";
import SparkLine from "./SparkLine";

// @todo break into legend, chart components and use ParentSize to make chart responsive
function Example({ width = 1000, height = 300 }) {
  const { recentGrouppedByMetric, trends } = useContext(GrillStatusContext);

  // @todo support all, for now just use one metric
  const dataForSingleMetric = get(
    recentGrouppedByMetric,
    "currentProbe2Temp",
    []
  );

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
  const xPositionMax = width - margin.left - margin.right;
  const yPositionMax = height - margin.top - margin.bottom;

  // scales
  const dateScale = useMemo(
    () =>
      scaleTime({
        range: [0, xPositionMax],
        // @todo move extent into context, use first and last points
        domain: extent(dataForSingleMetric, getDate),
      }),
    [xPositionMax, dataForSingleMetric]
  );

  const tempScale = useMemo(
    () =>
      scaleLinear({
        range: [yPositionMax, 0],
        domain: [0, 250],
      }),
    [yPositionMax]
  );

  if (dataForSingleMetric.length === 0) {
    return <p className="loading">Loading...</p>;
  }

  return (
    <>
      <LegendOrdinal
        scale={ordinalColorScale}
        labelFormat={(label) => {
          return find(metrics, ({ metric }) => metric === label).display;
        }}
      >
        {(labels) => (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              whiteSpace: "nowrap",
            }}
          >
            {labels.map((label, i) => {
              const { strokeWidth } = metricStyle[label.datum];
              return (
                <LegendItem
                  key={`legend-quantile-${i}`}
                  margin="0 5px"
                  onClick={() => {
                    // @TODO make set visibility
                    // alert(`clicked: ${JSON.stringify(label)}`);
                  }}
                >
                  <svg width={legendGlyphSize} height={strokeWidth}>
                    <line
                      {...metricStyle[label.datum]}
                      x1={0}
                      y1={strokeWidth / 2}
                      x2={legendGlyphSize}
                      y2={strokeWidth / 2}
                    />
                  </svg>
                  <LegendLabel align="left" margin="0 0 0 4px">
                    {label.text}
                    <Trendline metric={label.datum} />
                    <SparkLine metric={label.datum} />
                  </LegendLabel>
                </LegendItem>
              );
            })}
          </div>
        )}
      </LegendOrdinal>
      <svg width={width} height={height}>
        <MarkerX
          id="marker-x"
          stroke="#333"
          size={10}
          strokeWidth={2}
          markerUnits="userSpaceOnUse"
        />
        <MarkerArrow
          id="marker-arrow"
          stroke="red"
          size={10}
          strokeWidth={2}
          markerUnits="userSpaceOnUse"
        />
        <Group left={margin.left} top={margin.top}>
          {metrics.map(({ metric }) => (
            <Group key={metric}>
              <LinePath
                data={recentGrouppedByMetric[metric]}
                x={(d) => dateScale(getDate(d)) || 0}
                y={(d) => tempScale(getY(d)) || 0}
                {...metricStyle[metric]}
                markerStart="url(#marker-x)"
              />
              <LinePath
                data={trends[metric]}
                x={(d) => dateScale(getDate(d)) || 0}
                y={(d) => tempScale(getY(d)) || 0}
                {...metricStyle[metric]}
                strokeDasharray="1,10"
                markerEnd="url(#marker-arrow)"
              />
            </Group>
          ))}
        </Group>
        <AxisBottom
          top={yPositionMax + margin.top}
          left={margin.left}
          scale={dateScale}
        />
        <AxisLeft
          top={margin.top}
          left={width - xPositionMax - margin.right}
          scale={tempScale}
        />
      </svg>
    </>
  );
}

export default Example;
