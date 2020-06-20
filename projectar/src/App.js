import React, { Component } from "react";
import Aside from "./components/sidemenu/SideMenu";
import "./App.css";

class App extends Component {
  render() {
    return (
      <div className="main">Main
        <div className="aside">aside</div>
        <div className="section">section</div>
      </div>
    );
  }
}

export default App;
