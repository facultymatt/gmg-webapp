import React, { useContext, useCallback } from "react";
import { ResponsiveLine } from "@nivo/line";
import { generateDrinkStats } from "@nivo/generators";
import { map } from 'lodash';
import GrillStatusContext from "../contexts/GrillStatusContext";

const data = generateDrinkStats(18);

const commonProperties = {
  margin: { top: 20, right: 20, bottom: 60, left: 80 },
  data,
  animate: true,
  enableSlices: "x",
};

const CustomSymbol = ({ size, color, borderWidth, borderColor }) => (
  <g>
    <circle
      fill="#fff"
      r={size / 2}
      strokeWidth={borderWidth}
      stroke={borderColor}
    />
    <circle
      r={size / 5}
      strokeWidth={borderWidth}
      stroke={borderColor}
      fill={color}
      fillOpacity={0.35}
    />
  </g>
);

const NivoGraphTest = () => {
  const { recent } = useContext(GrillStatusContext);
  const filtered = useCallback(
    map(recent, ({ timestamp, currentGrillTemp }) => ({
      x: new Date(timestamp),
      y: currentGrillTemp,
    })),
    [recent]
  );
  return (
    <div style={{ height: 300 }}>
      <ResponsiveLine
        {...commonProperties}
        data={[
          {
            id: "fake corp. A",
            data: filtered,
          },
          // {
          //   id: "fake corp. B",
          //   data: [
          //     { x: "2018-01-04", y: 14 },
          //     { x: "2018-01-05", y: 14 },
          //     { x: "2018-01-06", y: 15 },
          //     { x: "2018-01-07", y: 11 },
          //     { x: "2018-01-08", y: 10 },
          //     { x: "2018-01-09", y: 12 },
          //     { x: "2018-01-10", y: 9 },
          //     { x: "2018-01-11", y: 7 },
          //   ],
          // },
        ]}
        xScale={{ type: 'time', format: 'native' }}
        xFormat="time:%Y-%m-%d"
        yScale={{
          type: "linear",
          stacked: false,
          min: 0,
          max: 600
        }}
        axisLeft={{
          legend: "linear scale",
          legendOffset: 12,
        }}
        colors="yellow_orange_red"
        axisBottom={{
          format: "%b %d",
          tickValues: "every 2 days",
          legend: "time scale",
          legendOffset: -12,
        }}
        curve="monotoneX"
        enablePoints={true}
        // enablePointLabel={true}
        // pointSymbol={CustomSymbol}
        pointSize={2}
        // pointBorderWidth={1}
        // pointBorderColor={{
        //   from: "color",
        //   modifiers: [["darker", 0.3]],
        // }}
        useMesh={true}
        enableSlices={false}
      />
    </div>
  );
};

export default NivoGraphTest;
