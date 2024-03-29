import React, { useState, useEffect, useCallback } from "react";
import styled from "styled-components";
import {
  Route,
  useRouteMatch,
  useParams,
  Switch,
  Redirect,
  useHistory,
} from "react-router-dom";

import Table from "../../table/Table";
import Slate from "../slate/Slate";
import { isMobile } from "../../Responsive";
import SliderFilter from "../../table/filters/SliderFilter";
import filterGreaterThan from "../../table/filters/filterGreaterThan";
import Description from "./task/Description";
import Caption from "../Caption";
import Task from "./task/Task";

const Button = styled.button`
  background: #faec25b9;
  border: none;
  border-bottom: 4px solid #10292e;
  color: #10292e;
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
`;

const AllTasks = (props) => {
  const { path, url } = useRouteMatch();
  // const { status } = useParams();
  // const history = useHistory();
  const [selectedTaskID, setSelectedTaskID] = useState(undefined);
  // const { id } = useParams();

  const data = React.useMemo(() => props.tasks, [props.tasks]);

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
          Cell: ({ row }) => (
            // Use Cell to render an expander for each row.
            // We can use the getToggleRowExpandedProps prop-getter
            // to build the expander.
            <span {...row.getToggleRowExpandedProps()}>
              {row.isExpanded ? (
                <i class="fa fa-compress" aria-hidden="true" />
              ) : (
                <i class="fa fa-expand" aria-hidden="true" />
              )}
            </span>
          ),
        },
        {
          Header: "Title",
          accessor: "title",
        },
        {
          Header: "Target (%)",
          accessor: "target",
          Filter: SliderFilter,
          filter: filterGreaterThan,
        },
        {
          Header: "Achieved (%)",
          accessor: "Achieved",
          Filter: SliderFilter,
          filter: filterGreaterThan,
        },
        {
          Header: "Date Scheduled",
          accessor: "date",
          Filter: () => null,
        },
      ];
      return isMobile ? column.splice(0, 2) : column;
    },
    [isMobile]
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
    ({ row }) => (
      <Styles>
        <div className="project">
          <div className="left">
            <Button
              onClick={() => {
                props.onShowTask(row.original.id);
              }}
            >
              Edit
            </Button>
            <Button>Re-assign</Button>

            <Button onClick={() => deleteTask(row.original.id)}>Delete</Button>
          </div>
          <Description
            onFetchData={props.onFetchData}
            description={row.original.description}
            taskID={row.original.id}
            tasksPersonnel={props.tasksPersonnel}
          />
        </div>
      </Styles>
    ),
    []
  );
  const outstandingTasks = data.filter(
    (task) => parseInt(task.achieved) !== 100
  );
  const completedTasks = data.filter((task) => parseInt(task.achieved) === 100);

  return (
    <div>
      <Styles>
        <Switch>
          <Route exact path={path}>
            <Caption flabel="Tasks" slabel="List" />
            <Slate>
              <Table
                columns={columns}
                data={data}
                renderRowSubComponent={renderRowSubComponent}
              />
            </Slate>
          </Route>
          <Route path={`${path}/outstanding-tasks`}>
            <Task
              columns={columns}
              data={data}
              renderRowSubComponent={renderRowSubComponent}
              selectedTaskID={selectedTaskID}
              postData={props.postData}
            />
          </Route>
          <Route path={`${path}/completed-tasks`}>
            <Caption flabel="Tasks" slabel=" -Completed" />
            <Table
              columns={columns}
              data={completedTasks}
              renderRowSubComponent={renderRowSubComponent}
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

export default AllTasks;
