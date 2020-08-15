import React, { useState, useEffect } from "react";

const OutstandingTask = (props) => {
  const [tasks, setTasks] = useState([]);
  const [count, setCount] = useState(0);

  const fetchTasks = (projectId) =>
    props
      .onFetchData(`/api/project/task/${projectId}`)
      .then(({ data }) => setTasks(data));

  useEffect(
    () => {
      fetchTasks(props.projectID);
    },
    [props.toggler, props.projectID]
  );
  const oTasks = React.useMemo(
    () => tasks.filter((task) => task.achieved < 100),
    [tasks]
  );
  return (
    <div style={{}}>
      Outstanding Tasks:{" "}
      <span style={{ color: "#ffee00", fontWeight: 700 }}>{oTasks.length}</span>{" "}
      Completed Tasks:{" "}
      <span style={{ color: "white", fontWeight: 500 }}>
        {tasks.length - oTasks.length}
      </span>
    </div>
  );
};

export default OutstandingTask;
