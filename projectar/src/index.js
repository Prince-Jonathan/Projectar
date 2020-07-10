import React from "react";
import ReactDOM from "react-dom";
import {BrowserRouter} from "react-router-dom";
import App from "./App";
import Table from "./components/table/Table";

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      {/* <App /> */}
      <Table/>
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById("root")
);
