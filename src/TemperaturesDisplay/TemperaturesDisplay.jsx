import React, { useContext, useMemo } from "react";
import GrillStatusContext from "../contexts/GrillStatusContext";

const TemperaturesDisplay = () => {
  const { current } = useContext(GrillStatusContext);
  // var orientation = (screen.orientation || {}).type || screen.mozOrientation || screen.msOrientation;
  return useMemo(
    () => (
      <>
        <p>
          {/* <pre>{JSON.stringify(current, null, 2)}</pre> */}
          time: {current.timestamp}<br />
          state: {current.state}<br />
          grill current: {current.currentGrillTemp}<br />
          grill desired: {current.desiredGrillTemp}<br />
          p1 current: {current.currentProbe1Temp}<br />
          p2 desired: {current.desiredProbe1Temp}<br />
          p2 current: {current.currentProbe2Temp}<br />
          p2 desired: {current.desiredProbe2Temp}<br />
        </p>
      </>
    ),
    [current]
  );
};

export default TemperaturesDisplay;
