import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useHistory } from "react-router-dom";

const Button = styled.button`
  border: none;
  color: white;
  font-size: 15px;
  text-align: center;
  box-shadow: 0px 3px 0px 0px rgba(0, 0, 0, 0.2);
  cursor: pointer;
  margin: 5px;
  border-radius: 12px;
  background-color: #10292e;

  &::active {
    box-shadow: 0px 2px 0px 0px rgba(0, 0, 0, 0.2);
  }
`;

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
      <Button
        onClick={() =>
          history.push(`/project/${props.projectID}/outstanding-tasks`)
        }
        style={{ cursor: "pointer" }}
      >
        Outstanding Tasks:{" "}
        <div style={{ color: "#ffee00", fontWeight: 700 }}>
          {oTasks.length || "-"}
        </div>{" "}
      </Button>
      <Button
      className="btn btn-success"
        onClick={() =>
          history.push(`/project/${props.projectID}/completed-tasks`)
        }
      >
        Completed Tasks:{" "}
        <div style={{ color: "white", fontWeight: 500 }}>
          {tasks.length - oTasks.length ? (
            <span style={{ color: "#00ff00" }}>
              {tasks.length - oTasks.length}
            </span>
          ) : (
            <span style={{ color: "red" }}>---</span>
          )}
        </div>
      </Button>
    </div>
  );
};

export default TasksStatus;
