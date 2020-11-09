import React, { useState, useMemo, useContext } from "react";
import { scaleTime, scaleLinear, scaleOrdinal } from "@visx/scale";
import { Group } from "@visx/group";
import appleStock, { AppleStock } from "@visx/mock-data/lib/mocks/appleStock";
import { Brush } from "@visx/brush";
import { Bounds } from "@visx/brush/lib/types";
import { PatternLines } from "@visx/pattern";
import { LinearGradient } from "@visx/gradient";
import { max, extent } from "d3-array";
import { legendGlyphSize } from "./../constants/chart-legend";
import { metrics } from "./../constants/metrics";
import { map, get } from "lodash";

import { LegendOrdinal, LegendItem, LegendLabel } from "@visx/legend";

import AreaChart from "./AreaChart";
import GrillStatusContext from "../contexts/GrillStatusContext";
import { accentColor, colors } from "../constants/chart-colors";
import { getDate, getStockValue } from "../constants/chart-data-getters";

function Example({
  compact = false,
  width,
  height,
  margin = {
    top: 20,
    left: 50,
    bottom: 20,
    right: 20,
  },
}) {
  const { recent } = useContext(GrillStatusContext);
  // Initialize some variables
  const stock = {};
  metrics.forEach(({ metric, getY }) => {
    stock[metric] = map(recent, (pt) => ({
      x: get(pt, "timestamp"),
      y: getY ? getY(pt) : get(pt, metric),
    }));
  });

  console.log(stock);

  const brushMargin = { top: 10, bottom: 15, left: 50, right: 20 };
  const chartSeparation = 30;
  const PATTERN_ID = "brush_pattern";
  const GRADIENT_ID = "brush_gradient";
  const selectedBrushStyle = {
    fill: `url(#${PATTERN_ID})`,
    stroke: "black",
  };

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

  // @todo
  // const [filteredStock, setFilteredStock] = useState(stock["currentGrillTemp"]);
  const filteredStock = stock["currentGrillTemp"];

  console.log("filteredStock", filteredStock);

  const onBrushChange = (domain) => {
    if (!domain) return;
    const { x0, x1, y0, y1 } = domain;
    const stockCopy = stock["currentGrillTemp"].filter((s) => {
      const x = getDate(s).getTime();
      const y = getStockValue(s);
      return x > x0 && x < x1 && y > y0 && y < y1;
    });
    // setFilteredStock(stockCopy);
  };

  const innerHeight = height - margin.top - margin.bottom;
  const topChartBottomMargin = compact
    ? chartSeparation / 2
    : chartSeparation + 10;
  const topChartHeight = 0.8 * innerHeight - topChartBottomMargin;
  const bottomChartHeight = innerHeight - topChartHeight - chartSeparation;

  // bounds
  const xMax = Math.max(width - margin.left - margin.right, 0);
  const yMax = Math.max(topChartHeight, 0);
  const xBrushMax = Math.max(width - brushMargin.left - brushMargin.right, 0);
  const yBrushMax = Math.max(
    bottomChartHeight - brushMargin.top - brushMargin.bottom,
    0
  );

  // scales
  const dateScale = useMemo(
    () =>
      scaleTime({
        range: [0, xMax],
        domain: extent(filteredStock, getDate),
      }),
    [xMax, filteredStock]
  );
  const stockScale = useMemo(
    () =>
      scaleLinear({
        range: [yMax, 0],
        domain: [0, max(filteredStock, getStockValue) || 0],
        nice: true,
      }),
    [yMax, filteredStock]
  );
  const brushDateScale = useMemo(
    () =>
      scaleTime({
        range: [0, xBrushMax],
        domain: extent(stock["currentGrillTemp"], getDate),
      }),
    [xBrushMax, stock]
  );
  const brushStockScale = useMemo(
    () =>
      scaleLinear({
        range: [yBrushMax, 0],
        domain: [0, max(stock["currentGrillTemp"], getStockValue) || 0],
        nice: true,
      }),
    [yBrushMax, stock]
  );

  const initialBrushPosition = useMemo(
    () => ({
      start: { x: brushDateScale(getDate(stock["currentGrillTemp"][50])) },
      end: { x: brushDateScale(getDate(stock["currentGrillTemp"][100])) },
    }),
    [brushDateScale, stock]
  );

  if (stock.length === 0) {
    return <h1>No data</h1>;
  }

  return (
    <div>
      <LegendOrdinal
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
      </LegendOrdinal>
      <svg width={width} height={height}>
        <Group>
          {metrics.forEach(({ metric }) => {
            console.log("stock[metric]", stock[metric]);
            return (
              <AreaChart
                data={stock[metric]}
                width={width}
                margin={{ ...margin, bottom: topChartBottomMargin }}
                yMax={yMax}
                xScale={dateScale}
                yScale={stockScale}
                lineColor={"black"}
              />
            );
          })}
        </Group>
      </svg>
    </div>
  );
}

export default Example;
