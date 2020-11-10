import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useHistory } from "react-router-dom";

import Button from "../../uiElements/Button";

const TasksStatus = (props) => {
  const [tasks, setTasks] = useState([]);
  const history = useHistory();
  const fetchTasks = (projectId) =>
    props
      .onFetchData(`/api/project/task/${projectId}`)
      .then(({ data }) => (data.success ? setTasks(data.data) : null));
  //could pass the state of the tasks above through route to the Project component: in order to refresh list on rendering TasksStatus
  useEffect(
    () => {
      // fetchTasks(props.projectID);
    },
    [props.toggler, props.projectID]
  );
  const oTasks = React.useMemo(
    () => {
      try {
        return tasks.filter(
          (task) => parseInt(task.details[0].achieved) !== 100
        );
      } catch (err) {}
    },
    [tasks]
  );

  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
      }}
    >
      <Button
        onClick={() =>
          history.push(`/project/${props.projectID}/outstanding-tasks`, {
            taskStatus: "outstanding",
          })
        }
        style={{ cursor: "pointer" }}
      >
        Outstanding Tasks:{" "}
        <div style={{ color: "#ffee00", fontWeight: 700 }}>
          {oTasks.length || "-"}
        </div>{" "}
      </Button>
      <Button
        onClick={() =>
          history.push(`/project/${props.projectID}/completed-tasks`, {
            taskStatus: "completed",
          })
        }
      >
        Completed Tasks:{" "}
        <div style={{ color: "white", fontWeight: 500 }}>
          {tasks.length - oTasks.length ? (
            <span style={{ color: "#00ff00" }}>
              {tasks.length - oTasks.length}
            </span>
          ) : (
            <span style={{ color: "red" }}>--</span>
          )}
        </div>
      </Button>
    </div>
  );
};

export default TasksStatus;
