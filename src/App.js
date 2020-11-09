import React, { useMemo } from "react";
import '../node_modules/react-vis/dist/style.css';
import "./App.css";
import { GrillStatusContextProvider } from "./contexts/GrillStatusContext";
import BarGraph from "./BarGraph";

function App() {
  return useMemo(
    () => (
      <GrillStatusContextProvider>
        <BarGraph />
      </GrillStatusContextProvider>
    ),
    []
  );
}

export default App;
