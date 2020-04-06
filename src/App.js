import React from "react";
import logo from "./logo.svg";
import "./App.css";
import PouchDB from "pouchdb";

function App() {
  var db = new PouchDB("http://localhost:5984/kittens");

  db.info().then(function (info) {
    console.log(info);
  });

  db.allDocs({ include_docs: true }).then(function (doc) {
    console.log(">>>", doc);
  });

  db.changes({
    since: new Date().getTime(),
    live: true,
    include_docs: true
  })
    .on("change", function (change) {
      // received a change
      console.log('something was changed');
      console.log(change);
    })
    .on("error", function (err) {
      // handle errors
      console.error('something was errored');
      console.error(err);
    });

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
