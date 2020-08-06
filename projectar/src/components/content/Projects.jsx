import React, { useState, useEffect } from "react";

import Table from "../table/Table";
import Slate from "./slate/Slate";

const Projects = (props) => {
  const [data, setData] = useState([]);
  useEffect(() => {
    async function getData() {
      let { data } = await props.fetchData("/api/project/all");
      setData(data);
    }
    getData();
  }, []);
  const columns = React.useMemo(
    () => [
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
        Header: "ID",
        accessor: "id",
      },
      {
        Header: "Name",
        accessor: "name",
      },
      {
        Header: "Client",
        accessor: "client",
      },
      {
        Header: "Lat",
        accessor: "lat",
      },
      {
        Header: "Lon",
        accessor: "lon",
      },
    ],
    []
  );
  const renderRowSubComponent = React.useCallback(
    ({ row }) => (
      <pre
        style={{
          fontSize: "10px",
        }}
      >
        <code>{JSON.stringify({ values: row.values }, null, 2)}</code>
      </pre>
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
