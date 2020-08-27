import React, { useState, useEffect } from "react";
import { Link, useHistory } from "react-router-dom";
import styled from "styled-components";

import Table from "../../table/Table";
import Slate from "../slate/Slate";
import { isMobile } from "../../Responsive";
import TasksStatus from "../project/task/TasksStatus";
import Caption from "../Caption";
import Export from "../Export";

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

const Projects = (props) => {
  const history = useHistory();
  const [rowID, setRowID] = useState(0);

  const data = React.useMemo(() => props.projects, [props.projects]);

  useEffect(
    () => {
      props.onSelect(rowID);
    },
    [rowID]
  );

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
          Header: "Name",
          accessor: "name",
        },
        {
          Header: "Consultant",
          accessor: "project_consultant",
        },
        {
          Header: "Manager",
          accessor: "project_manager",
        },
      ];
      return isMobile ? column.splice(0, 2) : column;
    },
    [isMobile]
  );
  const renderRowSubComponent = React.useCallback(
    ({ row }) => (
      <Styles>
        <div className="project">
          <div className="left">
            <Button
              onClick={() => {
                setRowID(row.original.id);
                props.onShowTask();
              }}
            >
              Add Task
            </Button>

            <Export
              projectID={row.original.id}
              onFetchData={props.onFetchData}
              caption="Report"
              title={`${row.original.name}- Report`}
            />
            <Button>Attendance</Button>
          </div>
          <TasksStatus
            projectID={row.original.id}
            onFetchData={props.onFetchData}
            toggler={props.toggler}
          />
        </div>
      </Styles>
    ),
    [props.toggler]
  );
  return (
    <React.Fragment>
      <Caption flabel="Projects" slabel="List" />
      <Slate>
        <Table
          columns={columns}
          data={data}
          renderRowSubComponent={renderRowSubComponent}
        />
      </Slate>
    </React.Fragment>
  );
};

export default Projects;
