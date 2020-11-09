import React, { createContext, useEffect, useState } from "react";
import PouchDB from "pouchdb";

export const GrillStatusContext = createContext({});

export const GrillStatusContextProvider = ({ children }) => {
  const [recent, setRecent] = useState([]);
  useEffect(() => {
    console.log('Connecting to database', process.env.REACT_APP_DB_NAME)
    const db = new PouchDB(
      `http://${window.location.hostname}:5984/${process.env.REACT_APP_DB_NAME}`
    );
    const getRecent = () => {
      db.allDocs({
        include_docs: true,
        skip: 0,
        limit: 500,
        descending: true,
      }).then((data) => {
        setRecent(data.rows.map(({ doc }) => doc).reverse());
      });
    };
    getRecent();
    if (process.env.REACT_APP_LIVE === "true") {
      console.log('Using live changes');
      db.changes({
        live: true,
        since: "now",
      }).on("change", function (change) {
        getRecent();
      });
    }
  }, [setRecent]);
  return (
    <GrillStatusContext.Provider
      value={{
        recent,
      }}
    >
      {children}
    </GrillStatusContext.Provider>
  );
};

export default GrillStatusContext;
