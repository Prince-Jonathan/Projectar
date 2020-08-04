import React, { useState, useEffect } from "react";

import Table from "../table/Table";
import Slate from "./slate/Slate";

const Projects = (props) => {
  const [data, setData] = useState([]);
  useEffect(() => {
    async function getData() {
      let {data} = await props.fetchData("/api/project/all");
      setData(data);
    }
    getData();
  }, []);
  const columns = React.useMemo(
    () => [
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
  return (
    <Slate>
      <Table columns={columns} data={data} />
      <hr />
      <div>
        <strong>Click to Access Project</strong>
      </div>
    </Slate>
  );
};

export default Projects;
