import React from "react";

import Table from "../table/Table";
import Slate from "./slate/Slate";

const Projects = (props) => {
  return (
    <Slate>
      <Table fetchData={props.fetchData} />
      <hr />
      <div>
        <strong>Add Some Projects Here</strong>
      </div>
    </Slate>
  );
};

export default Projects;
