import React, { createContext, useEffect, useState } from "react";
import PouchDB from "pouchdb";
import { map, get, mapValues, last } from "lodash";
import simplify from "simplify-js";
// @todo get fron context metrics of interest
import { metrics } from "../constants/metrics";
import { lineFit } from "../helpers/trendline";

export const GrillStatusContext = createContext({});

export const GrillStatusContextProvider = ({ children }) => {
  const [recent, setRecent] = useState([]);
  const [recentGrouppedByMetric, setRecentGrouppedByMetric] = useState({});
  const [current, setCurrent] = useState({});
  const [trends, setTrends] = useState([]);
  useEffect(() => {
    const remoteDb = new PouchDB(
      `http://${window.location.hostname}:5984/pi_second_run`
    );
    // const localDb = new PouchDB(`gmg-local-${process.env.REACT_APP_DB_NAME}`);
    // localDb.sync(remoteDb, { live: true, retry: true });
    const getRecent = () => {
      remoteDb
        .allDocs({
          include_docs: true,
          skip: 0,
          limit: 60, // 10 minutes
          // skip: 0,
          // limit: 100, // 1/2 hour
          descending: true,
        })
        .then((data) => {
          setRecent(data.rows.map(({ doc }) => doc).reverse());
        });
    };
    const getChanges = () => {
      remoteDb
        .changes({
          live: true,
          since: "now",
          include_docs: true
        })
        .on("change", function (change) {
          getRecent();
        });
    };
    getChanges();

    const getView = (whichView = "sensor_values/currentGrillTemp") => {
      remoteDb.query(whichView).then((data) => {
        console.log(whichView, data);
      });
    };

    // getRecent();

    
    // getView('sensor_values/currentGrillTemp');
    // getView('sensor_values/desiredGrillTemp');
    // getRecent();
    // if (process.env.REACT_APP_LIVE === "true") {
    //   console.log("Using live changes");
    //   remoteDb.changes({
    //     live: true,
    //     since: "now",
    //   }).on("change", function (change) {
    //     getRecent();
    //   });
    // }
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
    // mapValues(mapped, (values) => {
    //   const latestTime = last(values);
    //   values.push({ x: latestTime ? latestTime.x : 0, y: latestTime ? latestTime.y + 1 : 0 });
    //   return values;
    // });
    const simplified = mapValues(mapped, (values, key) => {
      const simplified = simplify(values, 0.1, true);
      console.debug(
        `Simplified ${key} from ${values.length} to ${simplified.length}`
      );
      return simplified;
    });
    setRecentGrouppedByMetric(mapped);
  }, [recent]);

  useEffect(() => {
    const trends = mapValues(recentGrouppedByMetric, (values, key) => {
      if (values && values.length >= 2) {
        return lineFit(values);
      }
      return [];
    });
    setTrends(trends);
  }, [recentGrouppedByMetric]);

  useEffect(() => {
    setCurrent(recent.length > 0 ? last(recent) : {});
  }, [recent]);

  return (
    <GrillStatusContext.Provider
      value={{
        trends,
        recent,
        recentGrouppedByMetric,
        current,
      }}
    >
      {children}
    </GrillStatusContext.Provider>
  );
};

export default GrillStatusContext;
