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
  bgcolor="#10292E";
  render() {
    return (
      <Row background_color={this.bgcolor} className="main">
        <Column  background_color={this.bgcolor} xxs="1">
          <Aside />
        </Column>
        <Column  xxs="0" xs="2" sm="3" md="4" lg="5" className="section">
          {this.state.name ? `${this.state.name}'s ` : ""}
          <span
            style={{
              color: "white",
              fontFamily: "consolas, sans serif",
              fontStyle: "italic",
            }}
          >
            Project
          </span>
          ar
        </Column>
      </Row>
    );
  }
}

export default App;
