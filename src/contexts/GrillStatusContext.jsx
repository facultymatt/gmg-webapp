import React, { createContext, useEffect, useState } from "react";
import PouchDB from "pouchdb";

export const GrillStatusContext = createContext({});

export const GrillStatusContextProvider = ({ children }) => {
  const [recent, setRecent] = useState([]);
  useEffect(() => {
    const db = new PouchDB("http://localhost:5984/pork_test_1");
    console.log(db);
    const getRecent = () => {
      db.allDocs({
        include_docs: true,
        skip: 2500,
        limit: 7200,
        descending: true,
      }).then((data) => {
        setRecent(data.rows.map(({ doc }) => doc).reverse());
      });
    };
    getRecent();
    db.changes({
      live: true,
      since: "now",
    }).on("change", function (change) {
      getRecent();
    });
  }, [setRecent]);
  // db.allDocs({ include_docs: true }).then(function (doc) {
  //   console.log(">>>", doc);
  // });
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
