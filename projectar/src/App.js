import React, { useState, useEffect } from "react";
import axios from "axios";
import { Switch, Route, Redirect, withRouter } from "react-router-dom";
import { useAlert } from "react-alert";
import { jsPDF } from "jspdf";

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
import Attendance from "./components/content/attendance/Attendance";
import Export from "./components/content/Export";

import "./App.css";

import Logo2 from "./logos/tagg.png";
import Logo from "./logos/logo2.png";

const App = (props) => {
  const alert = useAlert();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState({});
  const [projects, setProjects] = useState([]);
  const [projectTasks, setProjectTasks] = useState([]);
  const [personnel, setPersonnel] = useState();
  const [showSideMenu, setShowSideMenu] = useState(false);
  const [showTask, setShowTask] = useState(false);
  const [selectedID, setSeletedID] = useState(undefined);
  const [selectedTaskID, setSeletedTaskID] = useState(undefined);
  //lots of code refactoring can be done...but at the expense of time
  const [isTaskUpdated, setIsTaskUpdated] = useState(false);
  const [isTaskCreated, setIsTaskCreated] = useState(false);
  const [isTaskDeleted, setIsTaskDeleted] = useState(true);

  // const baseUrl = "http://192.168.69.100:8050";
  const baseUrl = "https://4ec697312d36.ngrok.io";

  const data = [
    { name: "Keanu Reeves", profession: "Actor" },
    { name: "Lionel Messi", profession: "Football Player" },
    { name: "Cristiano Ronaldo", profession: "Football Player" },
    { name: "Jack Nicklaus", profession: "Golf Player" },
  ];

  const headers = ["NAME", "PROFESSION"];
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

  const fetchProjects = () =>
    fetchData("/api/project/all").then(({ data }) => setProjects(data));
  const fetchProjectTasks = () =>
    fetchData("/api/task/all").then(({ data }) => setProjectTasks(data));
  const fetchPersonnel = () =>
    fetchData("/api/user/all").then(({ data }) => setPersonnel(data));

  useEffect(() => {
    fetchProjects();
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
    <React.Fragment>
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
              logo={Logo}
            />
          </Row>
        </Route>
        <Layout
          showSideMenu={showSideMenu}
          aside={<Aside onPopUpClick={handlePopUpClick} />}
          name={user.first_name}
          onShowSideMenu={handleShowSideMenu}
          logo={Logo2}
        >
          <PrivateRoute exact isAuthenticated={isAuthenticated} path="/">
            <Workspace
              onShowTask={handleShowTask}
              onSelect={(id) => setSeletedID(id)}
              projects={projectTasks}
              selectedID={selectedID}
              onFetchData={fetchData}
              toggler={isTaskCreated}
            />
          </PrivateRoute>
          <PrivateRoute isAuthenticated={isAuthenticated} path="/personnel">
            <Personnel
              onSelect={(id) => setSeletedID(id)}
              personnel={personnel}
              selectedID={selectedID}
              onFetchData={fetchData}
              toggler={isTaskCreated}
            />
          </PrivateRoute>
          <PrivateRoute isAuthenticated={isAuthenticated} path="/project/:id">
            <Project
              onShowTask={(id) => {
                handleShowTask();
                setSeletedTaskID(id);
              }}
              tasks={projectTasks}
              selectedTaskID={selectedTaskID}
              onFetchData={fetchData}
              onAlert={handleAlert}
              toggler={handleTaskDelete}
              onTaskUpdate={handleTaskCreated}
              onAlert={handleAlert}
              postData={postData}
              projects={projects}
            />
          </PrivateRoute>
          <PrivateRoute isAuthenticated={isAuthenticated} path="/all-projects">
            <Projects
              onShowTask={handleShowTask}
              onSelect={(id) => setSeletedID(id)}
              projects={projects}
              selectedID={selectedID}
              onFetchData={fetchData}
              toggler={isTaskCreated}
              logo={Logo2}
            />
          </PrivateRoute>
          <PrivateRoute isAuthenticated={isAuthenticated} path="/reports">
            <Report />
          </PrivateRoute>
          <PrivateRoute isAuthenticated={isAuthenticated} path="/">
            <Attendance />
          </PrivateRoute>
          <Route path="*">
            <Redirect to="/" />
          </Route>

          {showTask ? (
            <Bay
              showTask={showTask}
              onShowTask={handleShowTask}
              onCloseTasks={handleCloseTasks}
              postData={postData}
              selectedID={selectedID}
              selectedTaskID={selectedTaskID}
              onAlert={handleAlert}
              onTaskUpdate={handleTaskCreated}
              personnel={personnel}
              tasks={projectTasks}
              resetSelectedTaskID={() => setSeletedTaskID(undefined)}
              onFetchData={fetchData}
            />
          ) : null}
        </Layout>
      </Switch>
    </React.Fragment>
  );
};

export default withRouter(App);
