import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";

const TasksStatus = (props) => {
  const [tasks, setTasks] = useState([]);
  const history = useHistory();

  const fetchTasks = (projectId) =>
    props
      .onFetchData(`/api/project/task/${projectId}`)
      //check if messsage exists: msg only exist on error
      .then(({ data }) => (data.msg ? null : setTasks(data)));

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
    <div>
      <div
        onClick={() =>
          history.push(`/project/${props.projectID}/outstanding-tasks`)
        }
        style={{ cursor: "pointer" }}
      >
        Outstanding Tasks:{" "}
        <div style={{ color: "#ffee00", fontWeight: 700 }}>
          {oTasks.length || "-"}
        </div>{" "}
      </div>
      <div
        onClick={() =>
          history.push(`/project/${props.projectID}/completed-tasks`)
        }
      >
        Completed Tasks:{" "}
        <div style={{ color: "white", fontWeight: 500 }}>
          {tasks.length - oTasks.length || (
            <span style={{ color: "red" }}>---</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default TasksStatus;
