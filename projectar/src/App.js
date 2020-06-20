import React, { Component } from "react";
import Aside from "./components/sidemenu/Aside";
import { Row, Column } from "./components/Grid";
import "./App.css";

class App extends Component {
  render() {
    return (
      <Row className="main">
        <Column flex="1" background_color="#1A2226" xs="0" className="aside">
          <Aside />
        </Column>
        <Column flex="4"  background_color="#92B1CF" xs="1" className="section">
          Workstation
        </Column>
      </Row>
    );
  }
}

export default App;
