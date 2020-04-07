import React, { createContext, useEffect } from "react";
import PouchDB from "pouchdb";

export const GrillStatusSyncContext = createContext({});

export const GrillStatusSyncContextProvider = ({ children }) => {
  useEffect(() => {
    const db = new PouchDB("grill_local");
    const remoteDb = new PouchDB("http://localhost:5984/grill");
    db.sync(remoteDb, {
      live: true,
    })
      .on("change", function (change) {
        console.warn("**change", change);
      })
      .on("error", function (err) {
        console.error("**err", err);
      });
  }, []);
  return (
    <GrillStatusSyncContext.Provider value={{}}>
      {children}
    </GrillStatusSyncContext.Provider>
  );
};

export default GrillStatusSyncContext;
