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
  const [personnel, setPersonnel] = useState();
  const [showSideMenu, setShowSideMenu] = useState(false);
  const [showTasks, setShowTasks] = useState(false);
  const [selectedID, setSeletedID] = useState(0);
  const [toggler, setToggler] = useState(false);

  const baseUrl = "https://14f1e68cb745.ngrok.io";

  const fetchData = (url, params) =>
    axios.get(baseUrl + url, {
      params: {
        ...params,
      },
    });
  const postData = (url, body, params) =>
    axios.post(baseUrl + url, body, {
      params: {
        ...params,
      },
    });

  const fetchUser = () =>
    fetchData("/api").then(({ data }) => setName(data.name));
  const fetchProjects = () =>
    fetchData("/api/project/all").then(({ data }) => setProjects(data));
  const fetchPersonnel = () =>
    fetchData("/api/user/all").then(({ data }) => setPersonnel(data));

  useEffect(() => {
    fetchUser();
    fetchProjects();
    fetchPersonnel();
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
  const handleTaskUpdate = () => {
    setToggler((prevState) => !prevState);
    console.log("it has changed state");
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
            toggler={toggler}
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
          onTaskUpdate={handleTaskUpdate}
          personnel={personnel}
        />
      ) : null}
    </Layout>
  );
};

export default withRouter(App);
