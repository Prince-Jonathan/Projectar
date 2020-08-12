import React, { useState, useEffect } from "react";
import axios from "axios";
import { Switch, Route, Redirect, withRouter } from "react-router-dom";
import { useAlert } from "react-alert";

import Aside from "./components/sidemenu/Aside";
import Layout from "./components/layout/Layout";
import Workspace from "./components/content/Workspace";
import Projects from "./components/content/projects/Projects";
import Project from "./components/content/project/Project";
import Tasks from "./components/content/project/task/Tasks";

import "./App.css";

const App = (props) => {
  const alert = useAlert();
  const [name, setName] = useState("");
  const [showSideMenu, setShowSideMenu] = useState(false);
  const [showTasks, setShowTasks] = useState(false);
  const [selectedID, setSeletedID] = useState(0);

  const baseUrl = " https://1b217afd847d.ngrok.io";

  const fetchData = (url) => {
    return axios.get(baseUrl + url);
  };
  const postData = (url, data) => axios.post(baseUrl + url, data);

  useEffect(() => {
    fetchData("/api").then(({ data }) => setName(data.name));
  }, []);
  const handleShowSideMenu = () => {
    setShowSideMenu((prevState) => !prevState);
  };
  const handleShowTasks = () => {
    setShowTasks((prevState) => !prevState);
  };
  const handleCloseSideMenu = () => {
    setShowSideMenu(false);
  };
  const handleCloseTasks = () => {
    setShowTasks(false);
  };
  const handlePopUpClick = (value, extras) => {
    const {
      history: { push },
    } = props;
    handleCloseSideMenu();
    push(`/${value}`);
  };
  const handleAlert = (method, msg, options) => {
    alert[method](msg, { ...options });
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
          <Projects
            fetchData={fetchData}
            onShowTasks={handleShowTasks}
            onSelect={(id) => setSeletedID(id)}
          />
        </Route>
        <Route path="*">
          <Redirect to="/" />
        </Route>
      </Switch>
      {showTasks ? (
        <Tasks
          showTasks={showTasks}
          onShowTasks={handleShowTasks}
          onCloseTasks={handleCloseTasks}
          postData={postData}
          selectedID={selectedID}
          onAlert={handleAlert}
        />
      ) : null}
    </Layout>
  );
};

export default withRouter(App);
