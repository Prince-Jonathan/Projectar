import React, { Component } from "react";
import Aside from "./components/sidemenu/Aside";
import { Row, Column } from "./components/Grid";
import Wall from "./components/Wall";
import "./App.css";

class App extends Component {
  state = { name: "" };
  componentDidMount() {
    fetch("/api")
      .then((res) => res.json())
      .then((data) => this.setState(data));
  }
  bgcolor = "#10292E";
  render() {
    return (
      <Row background_color={this.bgcolor} className="main">
        <Column background_color={this.bgcolor} xxs="1">
          <Aside />
        </Column>
        <Column xxs="0" xs="2" sm="3" md="4" lg="5" className="section">
          <Wall name={this.state.name} />
        </Column>
      </Row>
    );
  }
}

export default App;
