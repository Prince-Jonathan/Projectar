import React, { useState, useEffect, useCallback } from "react";
import CKEditor from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import styled from "styled-components";
import {
  Route,
  useRouteMatch,
  useParams,
  Switch,
  Redirect,
  useHistory,
  useLocation,
} from "react-router-dom";
import { trackPromise } from "react-promise-tracker";

import Table from "../../table/Table";
import Slate from "../slate/Slate";
import { isMobile } from "../../Responsive";
import SliderFilter from "../../table/filters/SliderFilter";
import filterGreaterThan from "../../table/filters/filterGreaterThan";
import Description from "../project/task/Description";
import Caption from "../Caption";
import Task from "./task/Task";
import EditTask from "./task/EditTask";
import AllTasks from "./AllTasks";
import Attendance from "../attendance/Attendance";
import Bay from "../../bay/Bay";
import Button from "../uiElements/Button";
import TaskDetailsStatus from "./task/TaskDetailsStatus";
import Can from "../../Can";

const Styles = styled.div`
  .project {
    display: flex;
    flex-direction: row;
    align-items: center;
  }
  .left {
    display: flex;
    flex-flow: column wrap;
    align-items: flex-start;
    justify-content: space-evenly;
    height: 100%;
    border-right: solid #ffee00;
    margin-right: 5px;
  }
  .left > button {
    margin: 5px 5px 5px 0;
  }
`;
const Wrapper = styled.div`
  display: flex;
  flex-direction: ${(props) => (props.isMobile ? "row" : "column")};
  justify-content: space-around;
  flex-wrap: wrap;
`;

const Project = (props) => {
  const { path, url } = useRouteMatch();
  const location = useLocation();
  const history = useHistory();
  const { id } = useParams();

  const tasks = React.useMemo(() => props.tasks, [props.tasks]);
  const personnelTasks = React.useMemo(() => props.personnelTasks, [
    props.personnelTasks,
  ]);
  // component serves view of all tasks(admin, and user) and project specific tasks
  const taskType = { personnel: personnelTasks, projects: tasks };
  let data =
    id === "all"
      ? taskType[location.state && location.state.taskType]
      : tasks
      ? tasks.filter((task) => task.project_id === parseInt(id))
      : [];
  const projects = React.useMemo(() => props.projects, [props.projects]);
  const project =
    projects && projects.filter((project) => project.id === parseInt(id));
  const [toggleFetchAttendance, setToggleFetchAttendance] = useState(false);
  const [attendance, setAttendance] = useState([]);
  const [attendanceDate, setAttendanceDate] = useState(new Date());

  const [projectPersonnel, setProjectPersonnel] = useState([]);
  const [tasksPersonnel, setTasksPersonnel] = useState([]);

  const fetchProjectPersonnel = async () => {
    try {
      trackPromise(
        props
          .onFetchData(`/api/project/enrolments/${id}`)
          .then(({ data: { data } }) => {
            setProjectPersonnel(data);
          })
      );
    } catch (err) {}
  };

  useEffect(() => {
    fetchProjectPersonnel();
  }, []);

  useEffect(
    () => {
      let assignedPersonnel = [];
      const fetchTasksPersonnel = async () => {
        try {
          data.forEach((task) =>
            trackPromise(
              props
                .onFetchData(`/api/task/enrolments/${task.id}`)
                .then((data) => {
                  return data;
                })
                .then(({ data }) => {
                  try {
                    let personnel = data.map((personnel) => {
                      return {
                        label: personnel.name,
                        value: personnel.id,
                        id: task.id,
                      };
                    });
                    assignedPersonnel = assignedPersonnel.concat(personnel);
                    setTasksPersonnel(assignedPersonnel);
                  } catch (err) {}
                })
            )
          );
        } catch (err) {}
      };
      fetchTasksPersonnel();
    },
    [tasks]
  ); //the location.state changes after editing success: this should refresh assigned personnel list

  const fetchAttendance = async () => {
    trackPromise(
      props.onFetchData(`/api/attendance/${id}/all`).then(({ data }) => {
        const filtered =
          data &&
          data.filter((register) => {
            return (
              +new Date(register.date) ===
                +new Date(new Date(attendanceDate).toDateString()) &&
              register.is_present === true
            );
          });
        setAttendance(filtered);
      })
    );
  };

  useEffect(
    () => {
      fetchAttendance();
    },
    [attendanceDate, toggleFetchAttendance]
  );

  data =
    data &&
    data.sort((a, b) => {
      let dateA = new Date(a.details[0].target_date);
      let dateB = new Date(b.details[0].target_date);
      return dateB - dateA;
    });

  const columns = React.useMemo(
    () => {
      const column = [
        {
          // Make an expander cell
          Header: () => null, // No header
          id: "expander", // It needs an ID
          Cell: ({ row }) => {
            return (
              // Use Cell to render an expander for each row.
              // We can use the getToggleRowExpandedProps prop-getter
              // to build the expander.
              <span {...row.getToggleRowExpandedProps()}>
                {row.isExpanded ? (
                  <i className="fa fa-compress" aria-hidden="true" />
                ) : (
                  <i className="fa fa-expand" aria-hidden="true" />
                )}
              </span>
            );
          },
        },
        {
          Header: "Title",
          accessor: "title",
        },
        {
          Header: "Target (%)",
          accessor: "details[0].target",
          Filter: location.state
            ? location.state.taskStatus !== "completed"
              ? SliderFilter
              : () => null
            : SliderFilter,
          filter: filterGreaterThan,
        },
        {
          Header: "Achieved (%)",
          accessor: "details[0].achieved",
          Filter: location.state
            ? location.state.taskStatus !== "completed"
              ? SliderFilter
              : () => null
            : SliderFilter,
          filter: filterGreaterThan,
        },
        {
          Header: "Scheduled Date",
          accessor: "details[0].target_date",
          Filter: () => null,
        },
      ];
      return isMobile ? column.splice(0, 2) : column;
    },
    [isMobile, props.project]
  );
  const deleteTask = useCallback((taskID) => {
    props.onAlert("info", "Deleting...", {
      timeout: 3000,
      position: "bottom center",
    });
    props
      .onFetchData(`/api/task/delete/${taskID}`)
      .then(() => props.toggler())
      .then(() =>
        props.onAlert("success", "Task Deleted", {
          timeout: 5000,
          position: "bottom center",
        })
      );
  }, []);

  const renderRowSubComponent = React.useCallback(
    ({ row, i }) => (
      <div key={i} styles={{ display: "flex", flexDirection: "column" }}>
        <Styles>
          <div className="project">
            <div className="left">
              <Can
                role={JSON.parse(
                  localStorage.getItem("netsuite")
                ).role.toLowerCase()}
                perform="tasks:edit"
                yes={() => (
                  <>
                    <Button
                      onClick={() => {
                        // props.onShowTask(row.original.id);
                        history.push(`${url}`, {
                          ...{
                            taskType: location.state && location.state.taskType,
                          },
                          taskID: row.original.id,
                          projectID: row.original.project_id,
                        });
                      }}
                    >
                      Edit
                    </Button>
                    <Button
                      onClick={() => {
                        history.push(`${url}`, {
                          ...{
                            taskType: location.state && location.state.taskType,
                          },
                          taskID: row.original.id,
                          projectID: id,
                          reAssign: { entry_type: 3 },
                        });
                      }}
                    >
                      Re-assign
                    </Button>
                    <Button onClick={() => deleteTask(row.original.id)}>
                      Delete
                    </Button>
                  </>
                )}
                data={{
                  userID: JSON.parse(localStorage.getItem("netsuite")).id,
                  taskCreatorID: row.original.creator,
                }}
              />
            </div>
            <Description
              onFetchData={props.onFetchData}
              description={row.original.description}
              comment={row.original.details[0].comment}
              taskID={row.original.id}
              tasksPersonnel={tasksPersonnel}
            />
            <TaskDetailsStatus
              task={data.find((task) => task.id === row.original.id)}
              projectName={project[0] && project[0].name}
            />
          </div>
        </Styles>
        {row.original.details[0].comment ? (
          <div style={{ color: "10292e", fontWeight: 700 }}>
            Comment:{" "}
            <div
              style={{
                color: "white",
                fontWeight: 300,
                // padding: 10,
                marginTop: 5,
                maxWidth: "90vw",
              }}
            >
              <CKEditor
                editor={ClassicEditor}
                name="comment"
                data={row.original.details[0].comment}
                type="inline"
                onInit={(editor) => {
                  editor.isReadOnly = true;
                }}
                config={{
                  // removePlugins: "toolbar",
                  ckfinder: {
                    uploadUrl: "https://projectar.devcodes.co/upload",
                  },
                }}
              />
            </div>
          </div>
        ) : null}
      </div>
    ),
    [tasksPersonnel, data, project]
  );
  const outstandingTasks =
    data && data.filter((task) => parseInt(task.details[0].achieved) !== 100);
  const completedTasks =
    data && data.filter((task) => parseInt(task.details[0].achieved) === 100);

  const handleOClick = ({ row }) => {
    history.push(`${url}/outstanding-tasks/${row.original.id}/execute`, {
      taskID: row.original.id,
      projectID: row.original.project_id,
      entry_type: 2,
      taskStatus: "outstanding",
    });
  };

  const handleCClick = ({ row }) => {
    history.push(`${url}/completed-tasks/${row.original.id}/execute`, {
      taskID: row.original.id,
      projectID: row.original.project_id,
      entry_type: 2,
      taskStatus: "completed",
    });
  };
  const handleAllClick = ({ row }) => {
    history.push(`${url}/tasks/${row.original.id}/execute`, {
      ...location.state,
      taskID: row.original.id,
      projectID: row.original.project_id,
      entry_type: 2,
      taskStatus: "all",
    });
  };
  const handleSetAttendanceDate = (date) => {
    setAttendanceDate(date);
  };
  const handleToggleFetchAttendance = () => {
    setToggleFetchAttendance((prevState) => !prevState);
  };
  const caption = {
    default: "",
    outstanding: "-Outstanding",
    completed: "-Completed",
    allOutstanding: "-All Outstanding",
    allCompleted: "-All Completed",
  };
  return (
    <div>
      <Styles>
        <Switch>
          <Route exact path={path}>
            <Caption flabel="Tasks" slabel="List" />
            <Wrapper isMobile>
              <Slate>
                <Table
                  columns={columns}
                  data={data}
                  renderRowSubComponent={renderRowSubComponent}
                />
              </Slate>
            </Wrapper>
            {location.state ? (
              <Bay>
                <EditTask
                  postData={props.postData}
                  onAlert={props.onAlert}
                  onFetchTasks={props.onFetchTasks}
                  onTaskUpdate={props.onTaskUpdate}
                  projectPersonnel={projectPersonnel}
                  tasksPersonnel={tasksPersonnel}
                  tasks={props.tasks}
                  resetSelectedTaskID={props.resetSelectedTaskID}
                  onFetchData={props.onFetchData}
                />{" "}
              </Bay>
            ) : null}
          </Route>
          <Route path={`${path}/attendance`}>
            <Attendance
              personnel={projectPersonnel}
              postData={props.postData}
              projectID={id}
              project={project}
              onAlert={props.onAlert}
              attendance={attendance}
              date={attendanceDate}
              onHandleSetAttendanceDate={handleSetAttendanceDate}
              onHandleToggleFetchAttendance={handleToggleFetchAttendance}
            />
          </Route>
          <Route path={`${path}/outstanding-tasks`}>
            <Task
              // outstanding={true}
              captions={
                <>
                  <Caption
                    flabel="Tasks"
                    slabel={
                      caption[
                        location.state ? location.state.taskStatus : "default"
                      ]
                    }
                  />
                  <Caption
                    flabel={
                      project ? (project[0] ? project[0].name : null) : null
                    }
                    style={{ fontSize: 15, color: "white" }}
                  />
                </>
              }
              columns={columns}
              data={outstandingTasks}
              renderRowSubComponent={renderRowSubComponent}
              clickable={handleOClick}
              // selectedTaskID={selectedTaskID}
              onTaskUpdate={props.onTaskUpdate}
              projectPersonnel={projectPersonnel}
              tasksPersonnel={tasksPersonnel}
              onAlert={props.onAlert}
              postData={props.postData}
              project={project}
            />
          </Route>
          <Route path={`${path}/completed-tasks`}>
            {/* <Caption flabel="Tasks" slabel=" -Completed" />
            <Caption
              flabel={() => {
                if (typeof project === "undefined") {
                  return null;
                } else {
                  return project[0].name;
                }
              }}
              style={{ fontSize: 15, color: "white" }}
            /> */}
            {/* <Table
                columns={columns}
                data={completedTasks}
                renderRowSubComponent={renderRowSubComponent}
              /> */}
            <Task
              columns={columns}
              data={completedTasks}
              captions={
                <>
                  <Caption
                    flabel="Tasks"
                    slabel={
                      caption[
                        location.state ? location.state.taskStatus : "default"
                      ]
                    }
                  />
                  <Caption
                    flabel={
                      project ? (project[0] ? project[0].name : null) : null
                    }
                    style={{ fontSize: 15, color: "white" }}
                  />
                </>
              }
              renderRowSubComponent={renderRowSubComponent}
              clickable={handleCClick}
              onTaskUpdate={props.onTaskUpdate}
              // selectedTaskID={selectedTaskID}
              projectPersonnel={projectPersonnel}
              tasksPersonnel={tasksPersonnel}
              onAlert={props.onAlert}
              postData={props.postData}
              project={project}
            />
          </Route>
          <Route path={`${path}/tasks`}>
            {/* <AllTasks
              tasks={props.tasks}
              tasksPersonnel={tasksPersonnel}
              selectedTaskID={props.selectedTaskID}
              onFetchData={props.onFetchData}
              onAlert={props.onAlert}
              toggler={props.toggler}
            /> */}
            <Task
              // outstanding={true}
              captions={
                <>
                  <Caption flabel="Tasks" slabel="List" />
                  {/* <Caption
                    flabel=""
                    style={{ fontSize: 15, color: "white" }}
                  /> */}
                </>
              }
              columns={columns}
              data={data}
              renderRowSubComponent={renderRowSubComponent}
              clickable={handleAllClick}
              // selectedTaskID={selectedTaskID}
              onTaskUpdate={props.onTaskUpdate}
              projectPersonnel={projectPersonnel}
              tasksPersonnel={tasksPersonnel}
              onAlert={props.onAlert}
              postData={props.postData}
              project={project}
              projects={projects}
            />
          </Route>
          <Route path={`${path}/*`}>
            <Redirect to={url} />
          </Route>
        </Switch>
      </Styles>
    </div>
  );
};

export default Project;
