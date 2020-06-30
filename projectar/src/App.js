import React, { Component } from "react";

import { Row, Column } from "./components/Grid";
import { Default, Mobile } from "./components/Responsive";
import Toolbar from "./components/toolbar/Toolbar";
import Aside from "./components/sidemenu/Aside";
import BackDrop from "./components/backdrop/Backdrop";
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
    this.setState((prevState) => {
      return { showSideMenu: !prevState.showSideMenu };
    });
  };
  handleCloseSideMenu = () => {
    this.setState({ showSideMenu: false });
  };

  render() {
    const bgcolor = "#10292E";
    let asideClass = ["drawer", "aside"];
    if (this.state.showSideMenu) {
      asideClass.push("open");
    }
    return (
      <div>
        <Default>
          <Row background_color={bgcolor} className="main">
            <Column background_color={bgcolor}>
              <Aside />
            </Column>
            <Column xs="2" sm="3" md="4" lg="5" className="section">
              <Wall name={this.state.name} />
            </Column>
          </Row>
        </Default>
        <Mobile>
          <Row
            flex_direction="column"
            background_color={bgcolor}
            className="main"
          >
            <Column>
              <Toolbar onClick={this.handleShowSideMenu} />
            </Column>
            <Row>
              <Column
                className={asideClass.join(" ")}
                background_color={bgcolor}
              >
                <Aside />
              </Column>
              <Column xs="2" sm="3" md="4" lg="5" className="section">
                <Wall name={this.state.name} />
              </Column>
              {this.state.showSideMenu ? (
                <BackDrop onClick={this.handleShowSideMenu} />
              ) : null}
            </Row>
          </Row>
        </Mobile>
      </div>
    );
  }
}

export default App;
