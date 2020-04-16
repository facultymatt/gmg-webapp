import React, { useContext, useMemo } from "react";
import { range, map, get } from "lodash";
import GrillStatusContext from "../contexts/GrillStatusContext";

import {
  FlexibleXYPlot,
  LineSeries,
  HorizontalGridLines,
  VerticalGridLines,
  XAxis,
  YAxis,
  DiscreteColorLegend,
} from "react-vis";

function App() {
  const { recent } = useContext(GrillStatusContext);
  const metrics = [
    { metric: "currentGrillTemp" },
    { metric: "desiredGrillTemp" },
    { metric: "currentProbe1Temp" },
    { metric: "desiredProbe1Temp" },
    { metric: "currentProbe2Temp" },
    { metric: "desiredProbe2Temp" },
    {
      metric: "fanModeActive",
      getY: (d) => (d.fanModeActive ? 600 : 0),
      getNull: (d) => d.y === 600,
    },
    {
      metric: "isOn",
      getY: (d) => (d.isOn ? 600 : 0),
      getNull: (d) => d.y === 600,
    },
  ];
  const filteredData = {};
  metrics.forEach(({ metric, getY }) => {
    filteredData[metric] = map(recent, (pt) => ({
      x: get(pt, "timestamp"),
      y: getY ? getY(pt) : get(pt, metric),
    }));
  });
  const tickValues = range(0, 600, 100);
  const yDomain = [0, 600];
  return useMemo(
    () => (
      <>
        <FlexibleXYPlot xType="time" height={200}>
          <HorizontalGridLines />
          <VerticalGridLines />
          <XAxis />
          <YAxis width={100} tickValues={tickValues} yDomain={yDomain} />
          {metrics.map(({ metric, getNull = () => true }) => {
            return (
              <LineSeries
                key={metric}
                data={filteredData[metric]}
                yDomain={yDomain}
                getNull={getNull}
              />
            );
          })}
          <DiscreteColorLegend
            items={metrics.map(({ metric }) => metric)}
            orientation="horizontal"
          />
        </FlexibleXYPlot>
      </>
    ),
    [filteredData, yDomain, metrics, tickValues]
  );
}

export default App;
