import React, { createContext, useEffect, useState } from "react";
import PouchDB from "pouchdb";
import { map, get, mapValues } from "lodash";
import simplify from "simplify-js";
// @todo get fron context metrics of interest
import { metrics } from "../constants/metrics";

export const GrillStatusContext = createContext({});

export const GrillStatusContextProvider = ({ children }) => {
  const [recent, setRecent] = useState([]);
  const [recentGrouppedByMetric, setRecentGrouppedByMetric] = useState({});
  useEffect(() => {
    const db = new PouchDB(
      `http://${window.location.hostname}:5984/${process.env.REACT_APP_DB_NAME}`
    );
    const getRecent = () => {
      db.allDocs({
        include_docs: true,
        skip: 0,
        limit: 20,
        descending: true,
      }).then((data) => {
        setRecent(data.rows.map(({ doc }) => doc).reverse());
      });
    };
    getRecent();
    if (process.env.REACT_APP_LIVE === "true") {
      console.log("Using live changes");
      db.changes({
        live: true,
        since: "now",
      }).on("change", function (change) {
        getRecent();
      });
    }
  }, [setRecent]);

  useEffect(() => {
    // @todo move into context
    const mapped = {};
    metrics.forEach(({ metric, getY }) => {
      mapped[metric] = map(recent, (pt) => ({
        x: get(pt, "timestamp"),
        y: getY ? getY(pt) : get(pt, metric),
      }));
    });
    mapValues(mapped, (values, key) => {
      const simplified = simplify(values, 0.8, true);
      console.debug(`Simplified ${key} from ${values.length} to ${simplified.length}`);
      return simplified;
    });
    setRecentGrouppedByMetric(mapped);
  }, [recent]);

  return (
    <GrillStatusContext.Provider
      value={{
        recent,
        recentGrouppedByMetric
      }}
    >
      {children}
    </GrillStatusContext.Provider>
  );
};

export default GrillStatusContext;
