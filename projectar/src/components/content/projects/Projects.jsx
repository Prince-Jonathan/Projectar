import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

import Table from "../../table/Table";
import Slate from "../slate/Slate";
import { isMobile } from "../../Responsive";
import OutstandingTask from "../project/task/OutstandingTask";

import "./Projects.css";

const Projects = (props) => {
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
      <div className="project">
        <div className="left">
          <button
            onClick={() => {
              setRowID(row.original.id);
              props.onShowTasks();
            }}
          >
            Add Task
          </button>

          <button>Report</button>

          <button>Attendance</button>
        </div>
        <OutstandingTask
          projectID={row.original.id}
          onFetchData={props.onFetchData}
          toggler={props.toggler}
        />
      </div>
    ),
    [props.toggler]
  );
  return (
    <Slate>
      <Table
        columns={columns}
        data={data}
        renderRowSubComponent={renderRowSubComponent}
      />
    </Slate>
  );
};

export default Projects;
