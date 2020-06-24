import React, { Component } from "react";
import Aside from "./components/sidemenu/Aside";
import { Row, Column } from "./components/Grid";
import Wall from "./components/Wall";
import "./App.css";

class App extends Component {
  state = { name: "", showSideMenu: false };

  componentDidMount() {
    fetch("/api")
      .then((res) => res.json())
      .then((data) => this.setState(data));
  }

  handleShowSideMenu = () => {
    this.setState({ showSideMenu: !this.state.showSideMenu });
  };

  bgcolor = "#10292E";

  render() {
    return (
      <Row background_color={this.bgcolor} className="main">
        <Column flexDirection="column">
          <Column>
            <button
              onClick={this.handleShowSideMenu}
              style={{ backgroundColor: "", height: "30px" }}
            >
              <i className="fa fa-reorder" />
            </button>
          </Column>
          <Column
            background_color={this.bgcolor}
            xxs={!this.state.showSideMenu}
          >
            {this.state.showSideMenu ? <Aside /> : ""}
          </Column>
        </Column>
        <Column xxs="1" xs="2" sm="3" md="4" lg="5" className="section">
          <Wall name={this.state.name} />
        </Column>
      </Row>
    );
  }
}

export default App;
