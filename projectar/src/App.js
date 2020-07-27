import React, { Component } from "react";
import { Switch, Route, Redirect, withRouter } from "react-router-dom";

import Aside from "./components/sidemenu/Aside";
import Layout from "./components/layout/Layout";
import Workspace from "./components/content/Workspace";
import Projects from "./components/content/Projects";

import "./App.css";

class App extends Component {
  state = { name: "", showSideMenu: false };
  fetchData = (url) => {
    return fetch(url).then((res) => res.json());
  };
  componentDidMount() {
    this.fetchData("https://projectar.devcodes.co/api").then((data) => this.setState(data));
  }
  handleShowSideMenu = () => {
    this.setState((prevState) => {
      return { showSideMenu: !prevState.showSideMenu };
    });
  };
  handleCloseSideMenu = () => {
    this.setState({ showSideMenu: false });
  };
  handlePopUpClick = (value, extras) => {
    const {
      history: { push },
    } = this.props;
    this.handleCloseSideMenu();
    push(`/${value}`);
  };

  render() {
    return (
      <Layout
        showSideMenu={this.state.showSideMenu}
        aside={<Aside onPopUpClick={this.handlePopUpClick} />}
        name={this.state.name}
        onShowSideMenu={this.handleShowSideMenu}
      >
        <Switch>
          <Route path="/workspace">
            <Workspace />
          </Route>
          <Route path="/all-projects">
            <Projects fetchData={this.fetchData} />
          </Route>
          <Route path="*">
            <Redirect to="/" />
          </Route>
        </Switch>
      </Layout>
    );
  }
}

export default withRouter(App);
