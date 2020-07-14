import React, { Component } from "react";
import { Switch, Route, Redirect, withRouter } from "react-router-dom";

import Aside from "./components/sidemenu/Aside";
import Layout from "./components/layout/Layout";
import Table from "./components/table/Table";
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
          <Route path="/all-projects">
            <Slate>
            <Table/>
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

export default withRouter(App);
