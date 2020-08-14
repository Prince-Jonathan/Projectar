import React, { useState, useEffect } from "react";

const OutstandingTask = (props) => {
  const [tasks, setTasks] = useState([]);
  
  const fetchTasks = (projectId) =>
    props
      .onFetchData(`/api/project/task/${projectId}`)
      .then(({ data }) => setTasks(data));
  useEffect(() => {fetchTasks(props.projectID)}, [props.projectID]);
  return <div style={{}}>{("number", tasks.length)}</div>;
};

export default OutstandingTask;
