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
import Config from "./components/config/Config";
import { useClearCache } from "react-clear-cache";

import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";

import Logo2 from "./logos/tagg.png";
import Logo from "./logos/logo2.png";

const App = (props) => {
  const { isLatestVersion, emptyCacheStorage } = useClearCache();
  const alert = useAlert();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [user, setUser] = useState({});
  const [projects, setProjects] = useState([]);
  const [projectsPersonnel, setProjectsPersonnel] = useState([]);
  const [projectsTasks, setProjectsTasks] = useState([]);
  const [personnelTasks, setPersonnelTasks] = useState([]);
  const [personnel, setPersonnel] = useState();
  const [showSideMenu, setShowSideMenu] = useState(false);
  const [showTask, setShowTask] = useState(false);
  const [selectedID, setSelectedID] = useState(null);
  const [selectedTaskID, setSeletedTaskID] = useState(0);
  //lots of code refactoring can be done...but at the expense of time
  const [isTaskUpdated, setIsTaskUpdated] = useState(false);
  const [isTaskCreated, setIsTaskCreated] = useState(false);
  const [isTaskDeleted, setIsTaskDeleted] = useState(true);
  const [announcement, setAnnouncement] = useState(null);
  const [announcementSpan, setAnnouncementSpan] = useState();

  const baseUrl = "https://projectar.automationghana.com";
  // const baseUrl = "https://6be0ddc2367e.ngrio";
  // const baseUrl = "http://localhost:8050";
  // const baseUrl = "http://10.20.100.27:8050";

  const OneSignal = window.OneSignal;
  try {
    localStorage.getItem("netsuite") &&
      OneSignal.push(function() {
        OneSignal.setExternalUserId(
          JSON.parse(localStorage.getItem("netsuite")).id
        );
      });
  } catch (err) {}

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
  let userRole =
    localStorage.getItem("netsuite") &&
    JSON.parse(localStorage.getItem("netsuite")).role.toLowerCase();
  const fetchProjects = (userID) =>
    fetchData(
      `/api/project/all/${
        userRole === "viewer" || userRole === "project_admin" ? 0 : userID
      }`
    ).then(({ data: { data } }) => {
      // fetchData(`/api/project/all`).then(({ data: { data } }) => {
      const concat = data
        ? data.map((project) => {
            return {
              ...project,
              ...{ name: `${project.number} - ${project.name}` },
            };
          })
        : null;
      setProjects(concat);
    });
  // const fetchProjectsPersonnel = (userID) =>
  //   fetchData(`/api/user/projects_personnel/${userID}`).then(({ data }) => {
  //     setProjectsPersonnel(data);
  //   });

  // useEffect(
  //   () => {
  //     let temp = [];
  //     const fetchProjectPersonnel = async () => {
  //       try {
  //         projects.forEach((project) =>
  //           fetchData(`/api/project/enrolments/${project.id}`)
  //             .then((data) => {
  //               return data;
  //             })
  //             .then(({ data: { data } }) => {
  //               try {
  //                 temp = temp.concat([
  //                   {
  //                     projectID: project.id,
  //                     projectName: project.name,
  //                     personnel: data,
  //                   },
  //                 ]);
  //                 setProjectsPersonnel(temp);
  //               } catch (err) {}
  //             })
  //         );
  //       } catch (err) {}
  //     };
  //     fetchProjectPersonnel();
  //   },
  //   [projects]
  // );

  useEffect(() => {
    const fetchAnnouncements = async () => {
      fetchData(
        `/api/announcements/${JSON.parse(localStorage.getItem("netsuite")).id}`
      ).then(({ data }) => data.success && setAnnouncement(data.data));
    };
    JSON.parse(localStorage.getItem("netsuite")) && fetchAnnouncements();
  }, []);

  const fetchProjectTasks = () => {
    fetchData("/api/task/all").then(({ data }) => setProjectsTasks(data));
  };
  const fetchPersonnelTasks = (userID) =>
    fetchData(`/api/user/tasks/${userID}`).then(({ data }) =>
      data.success ? setPersonnelTasks(data.data) : setPersonnelTasks([])
    );
  const fetchPersonnel = () =>
    fetchData("/api/user/all").then(({ data }) => setPersonnel(data));

  useEffect(() => {
    // syncEvents();
    // fetchProjects();
    fetchProjectTasks();
    JSON.parse(localStorage.getItem("netsuite")) &&
      fetchPersonnelTasks(JSON.parse(localStorage.getItem("netsuite")).id);
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
    let types = { user: "personnel", project_admin: "projects" };
    push(`/${value}`, {
      taskType:
        types[JSON.parse(localStorage.getItem("netsuite")).role.toLowerCase()],
      ...extras,
    });
  };
  const handleAlert = (method, msg, options) => {
    alert[method](msg, { ...options });
  };
  const handleTaskCreated = () => {
    setIsTaskCreated((prevState) => !prevState);
    fetchProjectTasks();
    JSON.parse(localStorage.getItem("netsuite")) &&
      fetchPersonnelTasks(JSON.parse(localStorage.getItem("netsuite")).id);
    fetchPersonnel();
  };
  const handleTaskUpdate = () => {
    setIsTaskUpdated((prevState) => !prevState);
  };
  const handleTaskDelete = () => {
    JSON.parse(localStorage.getItem("netsuite")) &&
      fetchPersonnelTasks(JSON.parse(localStorage.getItem("netsuite")).id);
    fetchProjectTasks();
  };
  return (
    <div>
      {!isLatestVersion && (
        <p style={{ backgroundColor: "10292E" }}>
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              emptyCacheStorage();
            }}
          >
            Update version
          </a>
        </p>
      )}
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
              fetchPersonnelTasks={fetchPersonnelTasks}
              logo={Logo}
            />
          </Row>
        </Route>
        <Layout
          showSideMenu={showSideMenu}
          aside={<Aside onPopUpClick={handlePopUpClick} />}
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
              onAlert={handleAlert}
              projects={projects}
              announcement={announcement}
              projectsPersonnel={projectsPersonnel}
              selectedID={selectedID}
              postData={postData}
              onFetchData={fetchData}
              toggler={isTaskCreated}
              announcementSpan={announcementSpan}
            />
          </PrivateRoute>
          <PrivateRoute isAuthenticated={isAuthenticated} path="/personnel">
            <Personnel
              onSelect={(id) => setSelectedID(id)}
              personnel={personnel}
              projectsTasks={projectsTasks}
              selectedID={selectedID}
              onFetchData={fetchData}
              onAlert={handleAlert}
              projects={projects}
              postData={postData}
              onTaskUpdate={handleTaskCreated}
            />
          </PrivateRoute>
          <PrivateRoute isAuthenticated={isAuthenticated} path="/project/:id">
            <Project
              onShowTask={(id) => {
                handleShowTask();
                setSeletedTaskID(id);
              }}
              tasks={projectsTasks}
              personnelTasks={personnelTasks}
              selectedTaskID={selectedTaskID}
              onFetchData={fetchData}
              onAlert={handleAlert}
              toggler={handleTaskDelete}
              onTaskUpdate={handleTaskCreated}
              postData={postData}
              projects={projects}
            />
          </PrivateRoute>
          <PrivateRoute isAuthenticated={isAuthenticated} path="/all-projects">
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
          <PrivateRoute isAuthenticated={isAuthenticated} path="/reports">
            <Report />
          </PrivateRoute>
          <PrivateRoute isAuthenticated={isAuthenticated} path="/config">
            <Bay>
              <Config />
            </Bay>
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
