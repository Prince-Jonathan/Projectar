import React, { Component } from "react";
import { Switch, Route, Redirect, withRouter } from "react-router-dom";
import OneSignal from "react-onesignal";

import Aside from "./components/sidemenu/Aside";
import Layout from "./components/layout/Layout";
import Workspace from "./components/content/Workspace";
import Projects from "./components/content/Projects";

import "./App.css";

OneSignal.initialize('09517753-05fb-4fa2-a189-0ac214f501f4');

class App extends Component {
  state = { name: "", showSideMenu: false };
  baseUrl="https://projectar.devcodes.co"
  fetchData = (url) => {
    return fetch(this.baseUrl+url).then((res) => res.json());
  };
  componentDidMount() {
    this.fetchData("/api").then((data) => this.setState(data));
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
