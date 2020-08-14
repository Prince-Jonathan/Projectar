import React, { useState, useEffect } from "react";
import axios from "axios";
import { Switch, Route, Redirect, withRouter } from "react-router-dom";
import { useAlert } from "react-alert";

import Aside from "./components/sidemenu/Aside";
import Layout from "./components/layout/Layout";
import Workspace from "./components/content/Workspace";
import Projects from "./components/content/projects/Projects";
import Project from "./components/content/project/Project";
import Bay from "./components/bay/Bay";
import Tasks from "./components/content/project/task/Tasks";

import "./App.css";

const App = (props) => {
  const alert = useAlert();
  const [name, setName] = useState("");
  const [projects, setProjects] = useState([]);
  const [showSideMenu, setShowSideMenu] = useState(false);
  const [showTasks, setShowTasks] = useState(false);
  const [selectedID, setSeletedID] = useState(0);

  const baseUrl = " http://192.168.69.101:8050";

  const fetchData = (url) => axios.get(baseUrl + url);
  const postData = (url, data) => axios.post(baseUrl + url, data);

  const fetchUser = () =>
    fetchData("/api").then(({ data }) => setName(data.name));
  const fetchProjects = () =>
    fetchData("/api/project/all").then(({ data }) => setProjects(data));


  useEffect(() => {
    fetchUser();
    fetchProjects();
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
            onShowTasks={handleShowTasks}
            onSelect={(id) => setSeletedID(id)}
            projects={projects}
            selectedID={selectedID}
            onFetchData={fetchData}
          />
        </Route>
        <Route path="*">
          <Redirect to="/" />
        </Route>
      </Switch>
      {showTasks ? (
        <Bay
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
