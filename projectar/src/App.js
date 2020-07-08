import React, { Component } from "react";
import Aside from "./components/sidemenu/Aside";
import Slate from "./components/content/Slate";
import "./App.css";
import Layout from "./components/layout/Layout";

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
        <Slate>
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Eaque
          cupiditate aliquid illum blanditiis aspernatur dicta officiis ducimus.
          Sed repellat ad, esse possimus officia nesciunt deleniti perferendis,
          dolorum quidem autem vel.Lorem ipsum dolor sit amet, consectetur
          adipisicing elit. Eaque cupiditate aliquid illum blanditiis aspernatur
          dicta officiis ducimus. Sed repellat ad, esse possimus officia
          nesciunt deleniti perferendis, dolorum quidem autem vel.{" "}
        </Slate>
      </Layout>
    );
  }
}

export default App;
