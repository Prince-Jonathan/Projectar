import React, { useState, useEffect } from "react";
import { Switch, Route, Redirect, withRouter } from "react-router-dom";

import Aside from "./components/sidemenu/Aside";
import Layout from "./components/layout/Layout";
import Workspace from "./components/content/Workspace";
import Projects from "./components/content/Projects";

import "./App.css";

const App = (props) => {
  const [name, setName] = useState("");
  const [showSideMenu, setShowSideMenu] = useState(false);

  const baseUrl = "https://projectar.devcodes.co";

  const fetchData = (url) => {
    return fetch(baseUrl + url).then((res) => res.json());
  };
  useEffect(() => {
    fetchData("/api").then((data) => setName(data.name));
  }, []);
  const handleShowSideMenu = () => {
    setShowSideMenu((prevState) => !prevState);
  };
  const handleCloseSideMenu = () => {
    setShowSideMenu(false);
  };
  const handlePopUpClick = (value, extras) => {
    const {
      history: { push },
    } = props;
    handleCloseSideMenu();
    push(`/${value}`);
  };

  return (
    <Layout
      showSideMenu={showSideMenu}
      aside={<Aside onPopUpClick={handlePopUpClick} />}
      name={name}
      onShowSideMenu={handleShowSideMenu}
    >
      <Switch>
        <Route path="/workspace">
          <Workspace />
        </Route>
        <Route path="/all-projects">
          <Projects fetchData={fetchData} />
        </Route>
        <Route path="*">
          <Redirect to="/" />
        </Route>
      </Switch>
    </Layout>
  );
};

export default withRouter(App);
