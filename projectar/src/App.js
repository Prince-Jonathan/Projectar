import React, { Component } from "react";
import Aside from "./components/sidemenu/Aside";
import { Row, Column } from "./components/Grid";
import "./App.css";

class App extends Component {
  state = { name: "" };
  componentDidMount() {
    fetch("/api")
      .then((res) => res.json())
      .then((data) => this.setState(data));
  }
  render() {
    return (
      <Row background_color="#10292E" className="main">
        <Column flex="1" background_color="#1A2226" xs="0">
          <Aside />
        </Column>
        <Column flex="4" xs="1" className="section">
          {this.state.name ? `${this.state.name}'s ` : ""}
          <span style={{ color: "white", fontStyle: "italic" }}>Work</span>
          space
        </Column>
      </Row>
    );
  }
}

export default App;
