import React, { useMemo } from "react";
import '../node_modules/react-vis/dist/style.css';
import "./App.css";
import { GrillStatusContextProvider } from "./contexts/GrillStatusContext";
import RecentGrillStatusGraph from "./RecentGrillStatusGraph";

function App() {
  return useMemo(
    () => (
      <GrillStatusContextProvider>
        <RecentGrillStatusGraph />
        {/* <NivoGraphTest /> */}
      </GrillStatusContextProvider>
    ),
    []
  );
}

export default App;
