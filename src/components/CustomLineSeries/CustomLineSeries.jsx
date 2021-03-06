// @note this does not work in react-vis because components
// need to be directly nested under their parent to get the correct props
// injected :(
import React, { useContext, useCallback, useMemo } from "react";
import GrillStatusContext from "../../contexts/GrillStatusContext";
import { get, map } from "lodash";
import { LineSeries } from "react-vis";

const CustomLineSeries = ({ metric, yDomain, getNull = () => false }) => {
  const { recent } = useContext(GrillStatusContext);
  const filtered = useCallback(
    map(recent, (pt) => ({
      x: get(pt, "timestamp"),
      y: get(pt, metric),
    })),
    [recent]
  );
  return useMemo(() => <LineSeries data={filtered} yDomain={yDomain} />, [
    filtered,
    yDomain,
  ]);
};

export default CustomLineSeries;
