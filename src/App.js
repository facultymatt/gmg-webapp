import React, { useMemo } from "react";
import "../node_modules/react-vis/dist/style.css";
import "./App.css";
import { GrillStatusContextProvider } from "./contexts/GrillStatusContext";
import Example from "./Example";
import TemperaturesDisplay from "./TemperaturesDisplay";

function App() {
  return useMemo(
    () => (
      <GrillStatusContextProvider>
        <TemperaturesDisplay />
        <Example/>
      </GrillStatusContextProvider>
    ),
    []
  );
}

export default App;
