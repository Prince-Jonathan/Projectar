import React, { useState, useEffect } from "react";
import { Link, useHistory, useRouteMatch } from "react-router-dom";
import styled from "styled-components";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import CKEditor from "@ckeditor/ckeditor5-react";

import Table from "../../table/Table";
import Slate from "../slate/Slate";
import { isMobile } from "../../Responsive";
import TasksStatus from "../project/task/TasksStatus";
import Caption from "../Caption";
import SliderFilter from "../../table/filters/SliderFilter";
import filterGreaterThan from "../../table/filters/filterGreaterThan";
import Can from "../../Can";
import Description from "../project/task/Description";
import TaskDetailsStatus from "../project/task/TaskDetailsStatus";
import Task from "../project/task/Task";
import fetchTasksPersonnel from "../project/task/fetchTasksPersonnel";

import "./Projects.css";

const Button = styled.button`
  background: #faec25b9;
  border: none;
  border-bottom: 4px solid #10292e;
  color: #10292e;
  /* font-family: 'Open Sans', sans-serif; */
  text-shadow: 1px 1px 1px rgba(0, 0, 0, 0.4);
  font-size: 15px;
  text-align: center;
  box-shadow: 0px 3px 0px 0px rgba(0, 0, 0, 0.2);
  cursor: pointer;
  margin: 0 5px 0 5px;
  border-radius: 12px;
  background-color: #ffee00;

  &::active {
    box-shadow: 0px 2px 0px 0px rgba(0, 0, 0, 0.2);
  }
`;

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
  .delete {
    color: white;
    border-bottom: 2px solid #f44336;
  }
`;

const PersonnelTasks = (props) => {
  const history = useHistory();
  const { url } = useRouteMatch();
  const [tasksPersonnel, setTasksPersonnel] = useState([]);

  let data = React.useMemo(() => props.tasks, [props.tasks]);
  useEffect(
    () => {
      let assignedPersonnel = [];
      fetchTasksPersonnel(
        data,
        props.onFetchData,
        setTasksPersonnel,
        assignedPersonnel
      );
    },
    [data]
  );
  data.sort((a, b) => {
    let dateA = new Date(a.date),
      dateB = new Date(b.date);
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
        },
        {
          Header: "Achieved (%)",
          accessor: "details[0].achieved",
        },
        {
          Header: "Date Scheduled",
          accessor: "details[0].target_date",
          Filter: () => null,
        },
      ];
      return isMobile ? column.splice(0, 1) : column;
    },
    [isMobile]
  );
  const deleteTask = React.useCallback((taskID) => {
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
                          // ...{
                          //   taskType: location.state && location.state.taskType,
                          // },
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
                            // taskType: location.state && location.state.taskType,
                          },
                          taskID: row.original.id,
                          // projectID: id,
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
              projectName={
                props.projects.filter(
                  (project) => project.id === row.original.project_id
                )[0].name
              }
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
    // [tasksPersonnel, data, project]
    [tasksPersonnel, data]
  );
  const handleOClick = ({ row }) => {
    history.push(`${url}/${row.original.id}/execute`, {
      // ...location.state,
      taskID: row.original.id,
      projectID: row.original.project_id,
      entry_type: 2,
      taskStatus:
        parseInt(row.original.details[0].target) === 100 &&
        parseInt(row.original.details[0].target) ===
          parseInt(row.original.details[0].achieved)
          ? "completed"
          : "outstanding",
    });
  };

  return (
    <div>
      {/* <Caption flabel="Tasks" slabel={`-${props.personnelName}`} />
      <Slate>
        <Table
          columns={columns}
          data={data}
          renderRowSubComponent={renderRowSubComponent}
        />
      </Slate> */}

      <Task
        // outstanding={true}
        captions={
          <>
            <Caption flabel="Tasks" slabel={`-${props.personnelName}`} />
            <Caption
              flabel=""
              // flabel={project ? (project[0] ? project[0].name : null) : null}
              style={{ fontSize: 15, color: "white" }}
            />
          </>
        }
        columns={columns}
        data={data}
        renderRowSubComponent={renderRowSubComponent}
        clickable={handleOClick}
        // selectedTaskID={selectedTaskID}
        onTaskUpdate={props.onTaskUpdate}
        projectPersonnel={[]}
        // projectPersonnel={projectPersonnel}
        tasksPersonnel={tasksPersonnel}
        onAlert={props.onAlert}
        postData={props.postData}
        // project={project}
        // projects={projects}
      />
    </div>
  );
};

export default PersonnelTasks;
