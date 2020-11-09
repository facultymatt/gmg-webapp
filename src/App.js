import React, { useMemo } from "react";
import "../node_modules/react-vis/dist/style.css";
import "./App.css";
import { GrillStatusContextProvider } from "./contexts/GrillStatusContext";
import Example from "./Example";
import ParentSize from '@visx/responsive/lib/components/ParentSize';

function App() {
  return useMemo(
    () => (
      <GrillStatusContextProvider>
        <ParentSize>
          {({ width, height }) => <Example width={width} height={height} />}
        </ParentSize>
      </GrillStatusContextProvider>
    ),
    []
  );
}

export default App;
