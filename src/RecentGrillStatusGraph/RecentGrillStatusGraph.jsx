import React, { useContext, useMemo, useState, useCallback } from "react";
import { range, map } from "lodash";
import GrillStatusContext from "../contexts/GrillStatusContext";

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
  const filtered = useCallback(
    map(recent, ({ timestamp, currentGrillTemp }) => ({
      x: timestamp,
      y: currentGrillTemp,
    })),
    [recent]
  );
  const filtered2 = useCallback(
    map(recent, ({ timestamp, desiredGrillTemp }) => ({
      x: timestamp,
      y: desiredGrillTemp,
    })),
    [recent]
  );
  const filtered3 = useCallback(
    map(recent, ({ timestamp, fanModeActive }) => ({
      x: timestamp,
      y: fanModeActive ? 600 : 0,
    })),
    [recent]
  );
  const [value, setValue] = useState();
  const [value2, setValue2] = useState();
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
          <LineSeries
            data={filtered}
            yDomain={yDomain}
            onNearestX={(value) => {
              setValue(value);
            }}
          />
          <LineSeries
            data={filtered2}
            yDomain={yDomain}
            onNearestX={(value) => {
              setValue2(value);
            }}
          />
          <LineSeries
            data={filtered3}
            yDomain={yDomain}
          />
          {value && (
            <Crosshair values={[value]}>
              <div style={{ background: "black" }}>
                <p>currentGrillTemp: {value.y}</p>
                <p>desiredGrillTemp: {value2.y}</p>
              </div>
            </Crosshair>
          )}
          <DiscreteColorLegend
            items={["currentGrillTemp", "desiredGrillTemp", "fanModeActive"]}
            orientation="horizontal"
          />
        </FlexibleXYPlot>
      </>
    ),
    [filtered, filtered2, filtered3, tickValues, value, value2, yDomain]
  );
}

export default App;
