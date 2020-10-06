import React, { useState, useEffect } from "react";
// import OneSignal from "../public/Notification";
import axios from "axios";
import { Switch, Route, Redirect, withRouter } from "react-router-dom";
import { useAlert } from "react-alert";
import { jsPDF } from "jspdf";
import { trackPromise } from "react-promise-tracker";

import Aside from "./components/sidemenu/Aside";
import Layout from "./components/layout/Layout";
import Workspace from "./components/content/workspace/Workspace";
import Projects from "./components/content/projects/Projects";
import Personnel from "./components/content/projects/Personnel";
import Project from "./components/content/project/Project";
import AllTasks from "./components/content/project/AllTasks";
import Bay from "./components/bay/Bay";
import AddTask from "./components/content/project/task/AddTask";
import Login from "./components/content/login/Login";
import PrivateRoute from "./components/content/PrivateRoute";
import { Column, Row } from "./components/Grid";
import Report from "./components/content/reports/Report";
import Export from "./components/content/Export";
import LoadingIndicator from "./components/loader/LoadingIndicator";

import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";

import Logo2 from "./logos/tagg.png";
import Logo from "./logos/logo2.png";

const App = (props) => {
  const alert = useAlert();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [user, setUser] = useState({});
  const [projects, setProjects] = useState([]);
  const [projectsTasks, setProjectsTasks] = useState([]);
  const [personnel, setPersonnel] = useState();
  const [showSideMenu, setShowSideMenu] = useState(false);
  const [showTask, setShowTask] = useState(false);
  const [selectedID, setSelectedID] = useState(null);
  const [selectedTaskID, setSeletedTaskID] = useState(0);
  //lots of code refactoring can be done...but at the expense of time
  const [isTaskUpdated, setIsTaskUpdated] = useState(false);
  const [isTaskCreated, setIsTaskCreated] = useState(false);
  const [isTaskDeleted, setIsTaskDeleted] = useState(true);

  // const baseUrl = "https://projectar.devcodes.co";
  // const baseUrl = "https://664db5f169e6.ngrok.io";
  const baseUrl = "http://localhost:8050";

  const OneSignal = window.OneSignal;
  OneSignal.push(function() {
    OneSignal.setExternalUserId(user.user_id);
  });

  const axiosWithCookies = axios.create({
    withCredentials: true,
  });
  const authenticateRoute = (url, body, params) =>
    axiosWithCookies.post(baseUrl + url, body, {
      params: {
        ...params,
      },
      // withCredentials: true,
    });
  // const promise = axiosWithCookies.get(url);

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
  const syncEvents = () => {
    setSyncing(true);
    !syncing &&
      handleAlert("info", "Syncing events", {
        timeout: 3000,
        position: "bottom center",
      });
    !syncing &&
      fetchData("/api/project/sync")
        .then(() => {
          handleAlert("success", "Syncing complete", {
            timeout: 5000,
            position: "bottom center",
          });
          setSyncing(false);
        })
        .catch(() =>
          handleAlert("error", "Failed to sync events", {
            timeout: 3000,
            position: "bottom center",
          })
        );
  };
  const fetchProjects = (userID) =>
    // trackPromise(
    fetchData(`/api/project/all/${userID}`).then(({ data: { data } }) => {
      // fetchData(`/api/project/all`).then(({ data: { data } }) => {
      const concat = data.map((project) => {
        return {
          ...project,
          ...{ name: `${project.number} - ${project.name}` },
        };
      });
      setProjects(concat);
    });
  // );
  const fetchProjectTasks = () =>
    fetchData("/api/task/all").then(({ data }) => setProjectsTasks(data));
  const fetchPersonnel = () =>
    fetchData("/api/user/all").then(({ data }) => setPersonnel(data));

  useEffect(() => {
    // syncEvents();
    // fetchProjects();
    fetchProjectTasks();
    fetchPersonnel();
  }, []);

  const handleAuthenticate = (user) => {
    setIsAuthenticated(true);
    setUser(user);
  };

  const handleShowSideMenu = () => {
    setShowSideMenu((prevState) => !prevState);
  };
  const handleShowTask = () => {
    setShowTask((prevState) => !prevState);
  };
  const handleCloseSideMenu = () => {
    setShowSideMenu(false);
  };
  const handleCloseTasks = () => {
    setShowTask(false);
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
  const handleTaskCreated = () => {
    setIsTaskCreated((prevState) => !prevState);
    fetchProjectTasks();
  };
  const handleTaskUpdate = () => {
    setIsTaskUpdated((prevState) => !prevState);
  };
  const handleTaskDelete = () => {
    // setIsTaskDeleted((prevState) => !prevState);
    fetchProjectTasks();
  };
  return (
    <div>
      <Switch>
        <Route exact path="/login">
          <Row
            alignItems="center"
            justifyContent="center"
            style={{ backgroundColor: "#10292e" }}
          >
            <Login
              postData={postData}
              onAlert={handleAlert}
              authenticate={handleAuthenticate}
              fetchProjects={fetchProjects}
              logo={Logo}
            />
          </Row>
        </Route>
        <Layout
          showSideMenu={showSideMenu}
          aside={<Aside onPopUpClick={handlePopUpClick} />}
          name={user.name}
          onShowSideMenu={handleShowSideMenu}
          onFetchData={fetchData}
          onSync={syncEvents}
          onAlert={handleAlert}
          logo={Logo2}
        >
          <PrivateRoute
            fetchProjects={fetchProjects}
            exact
            isAuthenticated={isAuthenticated}
            path="/"
          >
            <Workspace
              onShowTask={handleShowTask}
              onSelect={(id) => setSelectedID(id)}
              projects={projectsTasks}
              selectedID={selectedID}
              onFetchData={fetchData}
              toggler={isTaskCreated}
            />
          </PrivateRoute>
          <PrivateRoute
            fetchProjects={fetchProjects}
            isAuthenticated={isAuthenticated}
            path="/personnel"
          >
            <Personnel
              onSelect={(id) => setSelectedID(id)}
              personnel={personnel}
              selectedID={selectedID}
              onFetchData={fetchData}
              toggler={isTaskCreated}
            />
          </PrivateRoute>
          <PrivateRoute
            fetchProjects={fetchProjects}
            isAuthenticated={isAuthenticated}
            path="/project/:id"
          >
            <Project
              onShowTask={(id) => {
                handleShowTask();
                setSeletedTaskID(id);
              }}
              tasks={projectsTasks}
              selectedTaskID={selectedTaskID}
              onFetchData={fetchData}
              onAlert={handleAlert}
              toggler={handleTaskDelete}
              onTaskUpdate={handleTaskCreated}
              postData={postData}
              projects={projects}
            />
          </PrivateRoute>
          <PrivateRoute
            fetchProjects={fetchProjects}
            isAuthenticated={isAuthenticated}
            path="/all-projects"
          >
            <Projects
              onShowTask={handleShowTask}
              onSelect={(id) => setSelectedID(id)}
              projects={projects}
              selectedID={selectedID}
              onFetchData={fetchData}
              toggler={isTaskCreated}
              logo={Logo2}
              postData={postData}
              onTaskUpdate={handleTaskCreated}
              onAlert={handleAlert}
            />
          </PrivateRoute>
          <PrivateRoute
            fetchProjects={fetchProjects}
            isAuthenticated={isAuthenticated}
            path="/reports"
          >
            <Report />
          </PrivateRoute>
          {/* <Route path="*">
            <Redirect to="/" />
          </Route> */}
          {/* {showTask ? (
            <Bay
              showTask={showTask}
              onShowTask={handleShowTask}
              onCloseTasks={handleCloseTasks}
              postData={postData}
              selectedID={selectedID}
              resetSelectedID={() => setSelectedID((prevState) => prevState)}
              selectedTaskID={selectedTaskID}
              onAlert={handleAlert}
              onTaskUpdate={handleTaskCreated}
              personnel={personnel}
              tasks={projectsTasks}
              resetSelectedTaskID={() => setSeletedTaskID(0)}
              onFetchData={fetchData}
            />
          ) : null} */}
        </Layout>
      </Switch>
    </div>
  );
};

export default withRouter(App);
