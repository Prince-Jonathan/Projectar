import React, { useState, useEffect } from "react";
import styled from "styled-components";
import {
  useRouteMatch,
  useHistory,
  useLocation,
  useParams,
} from "react-router-dom";

import Button from "../../uiElements/Button";

const TaskDetailsStatus = (props) => {
  const history = useHistory();
  const { url } = useRouteMatch();
  const location = useLocation();
  const { id } = useParams();

  const fetchTasks = (projectId) =>
    // props
    //   .onFetchData(`/api/project/task/${projectId}`)
    //   .then(({ data }) => (data.success ? setDetails(data.data) : null));
    //could pass the state of the details above through route to the Project component: in order to refresh list on rendering TaskDetailsStatus
    useEffect(
      () => {
        fetchTasks(props.projectID);
      },
      [props.toggler, props.projectID]
    );
  // const oTasks = React.useMemo(
  //   () => {
  //     try {
  //       return details.filter(
  //         (task) => parseInt(task.details[0].achieved) !== 100
  //       );
  //     } catch (err) {}
  //   },
  //   [details]
  // );
  const status = [null, "New", "Executed", "Rescheduled"];
  const color = ["white", "gainsboro", "lawngreen", "yellow"];
  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
      }}
    >
      <Button
        onClick={() =>
          history.push(`${url}/${props.task ? props.task.id : "0"}/details`, {
            ...location.state,
            taskDetails: props.task && props.task.details,
            taskInfo: props.task && props.task.title.toUpperCase(),
            taskID: props.task && props.task.id,
            projectID: props.task.project_id,
            projectName: props.projectName,
          })
        }
        style={{ cursor: "pointer" }}
      >
        Task History:{" "}
        <div style={{ color: "#ffee00", fontWeight: 700 }}>
          {props.task ? props.task.details.length || "-" : null}
        </div>{" "}
      </Button>
      <Button>
        Recent Status:{" "}
        <div
          style={{
            color: props.task
              ? color[props.task.details[0].entry_type]
              : "white",
            fontWeight: 500,
          }}
        >
          {props.task ? status[props.task.details[0].entry_type] : null}
        </div>
      </Button>
    </div>
  );
};

export default TaskDetailsStatus;
