import React, { useState, useEffect } from "react";
import {
  Switch,
  Route,
  Link,
  useLocation,
  useHistory,
  useRouteMatch,
} from "react-router-dom";
import styled from "styled-components";
import Select from "react-select";

import { Row, Column } from "../../Grid";
import Element from "./Element";
import Announcements from "./Announcements";
import Can from "../../Can";
import Bay from "../../bay/Bay";

import "./Workspace.css";

// const Button = styled.button`
//   background: #faec25b9;
//   border: none;
//   border-bottom: 4px solid #10292e;
//   color: #10292e;
//   /* font-family: 'Open Sans', sans-serif; */
//   text-shadow: 1px 1px 1px rgba(0, 0, 0, 0.4);
//   font-size: 15px;
//   text-align: center;
//   box-shadow: 0px 3px 0px 0px rgba(0, 0, 0, 0.2);
//   cursor: pointer;
//   margin: 0 5px 0 5px;
//   border-radius: 12px;
//   background-color: #ffee00;

//   &::active {
//     box-shadow: 0px 2px 0px 0px rgba(0, 0, 0, 0.2);
//   }
// `;
const Button = styled.button`
  border: none;
  color: white;
  font-size: 15px;
  text-align: center;
  box-shadow: 0px 3px 0px 0px rgba(0, 0, 0, 0.2);
  cursor: pointer;
  margin: 0 5px 0 5px;
  border-radius: 12px;
  background-color: #10292e;
  &::active {
    box-shadow: 0px 2px 0px 0px rgba(0, 0, 0, 0.2);
  }
`;

const Style = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  flex-wrap: wrap;
`;
// tempStyle=

const Workspace = (props) => {
  const history = useHistory();
  const location = useLocation();
  const { path } = useRouteMatch();
  const [selectedProjects, setSelectedProjects] = useState([]);
  const [projectsPersonnel, setProjectsPersonnel] = useState([]);
  const [personnelOptions, setPersonnelOptions] = useState([]);
  // const options = React.useMemo(
  //   () =>
  //     props.projectsPersonnel
  //       ? props.projectsPersonnel.map((project) => {
  //           return { label: project.project_name, value: project.personnel };
  //         })
  //       : null,
  //   [props.projectsPersonnel]
  // );
  const options = React.useMemo(
    () =>
      props.projects
        ? props.projects.map((project) => {
            return { label: project.name, value: project.id };
          })
        : null,
    [props.projects]
  );
  const [selectedOption, setSelectedOption] = useState({
    isOpen: false,
    isFixed: false,
    value: "fetching projects list...",
    portalPlacement: "top",
  });
  // const difference = (setA, setB) => {
  //   var diff = new Set(setA);
  //   for (var elem of setB) {
  //     diff.delete(elem);
  //   }
  //   return diff;
  // };
  const handleProjectSelection = (selectedOption) => {
    if (selectedOption) {
      let projects = selectedOption.map((project) => project.value);
      projects.forEach(
        (id) =>
          !selectedProjects.includes(id) &&
          props
            .onFetchData(`/api/project/enrolments/${id}`)
            .then(({ data: { data } }) => {
              setProjectsPersonnel((prevState) =>
                prevState.concat(
                  data.map((personnel) => {
                    return {
                      projectID: id,
                      label: personnel.name,
                      value: personnel.id,
                    };
                  })
                )
              );
            })
      );
      selectedProjects.forEach(
        (id) =>
          !projects.includes(id) &&
          setProjectsPersonnel((prevState) =>
            prevState.filter((data) => data.projectID !== id)
          )
      );
      setSelectedProjects(projects);
    } else {
      setSelectedProjects([]);
      setProjectsPersonnel([]);
    }
    // let temp = [];
    // projects.forEach((id) =>
    //   props
    //     .onFetchData(`/api/project/enrolments/${id}`)
    //     .then((data) => {
    //       console.log(data);
    //       return data;
    //     })
    //     .then(({ data: { data } }) => {
    //       try {
    //         temp = temp.concat(data);
    //         setProjectsPersonnel((prevState) => prevState.concat(temp));
    //       } catch (err) {}
    //     })
    // );
  };
  const handlePersonnelSelection = (selectedOption) => {
    console.log(selectedOption);
  };
  return (
    <div>
      <Row>
        <Column>
          <Style>
            <Element
              onClick={() => history.push("/")}
              flabel="Add"
              slabel="Task"
              icon="fa fa-tasks fa-lg"
            />
            {/* view single personnel tasks */}
            <Can
              role={JSON.parse(
                localStorage.getItem("netsuite")
              ).role.toLowerCase()}
              perform="tasks:list"
              yes={() => (
                <>
                  <Element
                    onClick={() =>
                      history.push("/project/all/tasks", {
                        taskType: "personnel",
                      })
                    }
                    flabel="View"
                    slabel="Tasks"
                    icon="fa fa-tasks fa-lg"
                  />
                </>
              )}
            />
            {/* view all tasks (administrative privilege) */}
            <Can
              role={JSON.parse(
                localStorage.getItem("netsuite")
              ).role.toLowerCase()}
              perform="tasks:lists"
              yes={() => (
                <>
                  <Element
                    onClick={() =>
                      history.push("/project/all/tasks", {
                        taskType: "projects",
                      })
                    }
                    flabel="View"
                    slabel="Tasks"
                    icon="fa fa-file-text-o  fa-lg"
                  />
                </>
              )}
            />

            <Element
              onClick={() => history.push("/personnel")}
              flabel="View"
              slabel="Personnel"
              icon="fa fa-users fa-lg"
            />
            <Element
              onClick={() => history.push("/reports")}
              flabel="Recent"
              slabel="Reports"
              icon="fa fa-folder-open-o fa-lg"
            />
          </Style>
          <Announcements />
          {location.state && location.state.sendAnnouncement ? (
            <Bay>
              <div>
                <form
                  className="form-container column"
                  style={{ color: "white", minWidth: "80vw" }}
                >
                  <textarea
                    type="text"
                    style={{ flex: "1", margin: "5px 0px" }}
                    placeholder="What will you want to put across?"
                    name="description"
                    // value={state.description}
                    // onChange={handleChange}
                    required
                    rows="5"
                    cols="37"
                  />
                  <Select
                    isMulti
                    placeholder="Include from project list:"
                    onChange={handleProjectSelection}
                    options={options}
                    defaultValue={selectedOption.value}
                    isClearable
                    styles={{
                      menuPortal: (base) => ({
                        ...base,
                        zIndex: 200,
                      }),
                    }}
                    menuPortalTarget={document.body}
                    isSearchable
                    name="projectsList"
                    menuPosition={selectedOption.isFixed ? "fixed" : "absolute"}
                    menuPlacement={selectedOption.portalPlacement}
                  />
                  <Select
                    isMulti
                    placeholder="Target personnel"
                    onChange={handlePersonnelSelection}
                    options={projectsPersonnel}
                    defaultValue={projectsPersonnel}
                    isClearable
                    styles={{
                      menuPortal: (base) => ({
                        ...base,
                        zIndex: 200,
                      }),
                    }}
                    menuPortalTarget={document.body}
                    isSearchable
                    name="projectsList"
                    menuPosition={selectedOption.isFixed ? "fixed" : "absolute"}
                    menuPlacement={selectedOption.portalPlacement}
                  />
                  <div
                    style={{
                      display: "flex",
                      width: "20vw",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignContent: "center",
                      }}
                    >
                      <Button type="submit" className="btn">
                        Send
                      </Button>
                      <Button
                        type="button"
                        className="btn cancel"
                        onClick={() => {
                          history.goBack();
                        }}
                      >
                        Close
                      </Button>
                    </div>
                  </div>
                </form>
              </div>
            </Bay>
          ) : null}
        </Column>
      </Row>
    </div>
  );
};

export default Workspace;
