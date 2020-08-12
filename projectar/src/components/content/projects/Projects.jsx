import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

import Table from "../../table/Table";
import Slate from "../slate/Slate";
import { isMobile } from "../../Responsive";

import "./Projects.css";

const Projects = (props) => {
  const [data, setData] = useState([]);
  const [rowID, setRowID] = useState(0);

  useEffect(() => {
    async function getData() {
      let { data } = await props.fetchData("/api/project/all");
      setData(data);
    }
    getData();
  }, []);

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
        <button onClick={props.onShowTasks}>Tasks</button>
        {setRowID(row.original.id)}

        <button>Report</button>

        <button>Attendance</button>
      </div>
    ),
    []
  );
  return (
    <Slate>
      <Table
        columns={columns}
        data={data}
        renderRowSubComponent={renderRowSubComponent}
      />
      <hr />
      <div>
        <strong>Click to Access Project</strong>
      </div>
    </Slate>
  );
};

export default Projects;
