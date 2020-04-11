import React, { useContext, useMemo, useState, useCallback } from "react";
import { range, map, get } from "lodash";
import GrillStatusContext from "../contexts/GrillStatusContext";
import CustomLineSeries from "../components/CustomLineSeries";

import {
  FlexibleXYPlot,
  LineSeries,
  HorizontalGridLines,
  VerticalGridLines,
  XAxis,
  YAxis,
  Crosshair,
  DiscreteColorLegend,
} from "react-vis";

function App() {
  const { recent } = useContext(GrillStatusContext);
  const metrics = [
    "currentGrillTemp",
    "desiredGrillTemp",
    // "currentProbe1Temp",
    "desiredProbe1Temp",
    // "currentProbe2Temp",
    "desiredProbe2Temp",
    // "fanModeActive",
    // "isOn",
  ];
  const filteredData = {};
  metrics.forEach((metric) => {
    filteredData[metric] = map(recent, (pt) => ({
      x: get(pt, "timestamp"),
      y: get(pt, metric),
    }));
  });
  const tickValues = range(0, 600, 100);
  const yDomain = [0, 600];
  return useMemo(
    () => (
      <>
        <FlexibleXYPlot
          xType="time"
          height={200}
          // getX={(d) => d.timestamp}
          // getY={(d) => d}
        >
          <HorizontalGridLines />
          <VerticalGridLines />
          <XAxis />
          <YAxis width={100} tickValues={tickValues} yDomain={yDomain} />
          {metrics.map((metric) => {
            return (
              <LineSeries
                data={filteredData[metric]}
                yDomain={yDomain}
                // getNull={(d) => {
                //   return d.y === 600;
                // }}
              />
            );
          })}
          {/* neSeries
            data={filtered3}
            yDomain={yDomain}
            getNull={(d) => {
              return d.y === 600;
            }}
          />
          <LineSeries
            getNull={(d) => {
              return d.y === 600;
            }}
            data={filtered4}
            yDomain={yDomain}
          /> */}
          {/* {value && (
            <Crosshair values={[value]}>
              <div style={{ background: "black" }}>
                <p>currentGrillTemp: {value.y}</p>
                <p>desiredGrillTemp: {value2.y}</p>
              </div>
            </Crosshair>
          )} */}
          <DiscreteColorLegend items={metrics} orientation="horizontal" />
        </FlexibleXYPlot>
      </>
    ),
    [filteredData, yDomain, metrics, tickValues]
  );
}

export default App;
