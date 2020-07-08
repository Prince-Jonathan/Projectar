import React, { Component } from "react";
import Aside from "./components/sidemenu/Aside";
import { Route, Switch } from "react-router-dom";
import Slate from "./components/content/Slate"

import "./App.css";
import Layout from "./components/toolbar/layout/Layout";

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
    return (
      <Layout
        showSideMenu={this.state.showSideMenu}
        aside={<Aside />}
        name={this.state.name}
        onShowSideMenu={this.handleShowSideMenu}
      >
       <Slate/>
       <Slate/>
       <Slate/>
       <Slate/>
      </Layout>
    );
  }
}

export default App;
