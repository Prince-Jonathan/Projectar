import React, { Component } from "react";
import { Switch, Route, Redirect } from "react-router-dom";

import Aside from "./components/sidemenu/Aside";
import Layout from "./components/layout/Layout";
import Slate from "./components/content/Slate";

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
    return (
      <Layout
        showSideMenu={this.state.showSideMenu}
        aside={<Aside />}
        name={this.state.name}
        onShowSideMenu={this.handleShowSideMenu}
      >
        <Switch>
          <Route path="/workspace">
            <Slate>
              Lorem ipsum dolor sit amet, consectetur adipisicing elit. Eaque
              cupiditate aliquid illum blanditiis aspernatur dicta officiis
              ducimus. Sed repellat ad, esse possimus officia nesciunt deleniti
              perferendis, dolorum quidem autem vel.Lorem ipsum dolor sit amet,
              consectetur adipisicing elit. Eaque cupiditate aliquid illum
              blanditiis aspernatur dicta officiis ducimus. Sed repellat ad,
              esse possimus officia nesciunt deleniti perferendis, dolorum
              quidem autem vel.
              <hr />
              <div>
                <strong>The User Workspace</strong>
              </div>
            </Slate>
          </Route>
          <Route path="/add-project">
            <Slate>
              perferendis, dolorum quidem autem vel.Lorem ipsum dolor sit amet,
              consectetur adipisicing elit. Eaque cupiditate aliquid illum
              blanditiis aspernatur dicta officiis ducimus. Sed repellat Lorem
              ipsum dolor sit amet, consectetur adipisicing elit. Eaque
              cupiditate aliquid illum blanditiis aspernatur dicta officiis
              ducimus. Sed repellat ad, esse possimus officia nesciunt deleniti
              ad, esse possimus officia nesciunt deleniti perferendis, dolorum
              quidem autem vel.
              <hr />
              <div>
                <strong>Add Some Projects Here</strong>
              </div>
            </Slate>
          </Route>
          <Route path="*">
            <Redirect to="/" />
          </Route>
        </Switch>
      </Layout>
    );
  }
}

export default App;
