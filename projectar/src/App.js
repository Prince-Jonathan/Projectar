import React, { Component } from "react";
import Aside from "./components/sidemenu/SideMenu";
import { Row, Column } from "./components/Grid";
import "./App.css";

class App extends Component {
  render() {
    return (
      <Row className="main">
        <Column flex="1" xs="1" className="aside">
         <Aside/>
        </Column>
        <Column flex="4" xs="4" className="section">
          Dashboard
        </Column>
      </Row>
    );
  }
}

export default App;
