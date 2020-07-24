import React, { useState, useEffect, useMemo, useCallback } from "react";

import Table from "../table/Table";
import Slate from "./slate/Slate";
import { useFetch } from "../useFetch";
function getData(arr) {
  if (!arr) {
    return [];
  }
  console.log("getData called");
  return arr;
}
const Projects = (props) => {
  // const [res, setRes] = useState([]);
  // useEffect(() => {
  //   getData();
  //   console.log("projects mounted")
  // }, [getData()]);
  // let getData=useCallback(async() =>{
  //   let val = await props.fetchData("/project/all");
  //   setRes(val);
  // },[res])
  const { data } = useFetch("/project/all");

  let proj = useMemo(() => getData(data), [data]);
  let columns = useMemo(
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
      <Table url={"/project/all"} columns={columns} data={proj} />
      <hr />
      <div>
        <strong>Add Some Projects Here</strong>
      </div>
    </Slate>
  );
};

export default Projects;
