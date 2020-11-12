import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";
import { Provider as AlertProvider } from "react-alert";
import AlertTemplate from "react-alert-template-basic";
import LoadingIndicator from "./components/loader/LoadingIndicator";

import App from "./App";

ReactDOM.render(
  // <React.StrictMode>
  <BrowserRouter>
    <AlertProvider template={AlertTemplate}>
      <App />
      <LoadingIndicator />
    </AlertProvider>
  </BrowserRouter>,

  document.getElementById("react-root")
);

navigator.serviceWorker.register("./OneSignalSDKWorker.js");
