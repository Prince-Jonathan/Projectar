import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import DatePicker from "react-datepicker";
import Select from "react-select";

import BackDrop from "../backdrop/Backdrop";
import AddTask from "../content/project/task/AddTask";
import EditTask from "../content/project/task/EditTask";

import "./Bay.css";
import "react-datepicker/dist/react-datepicker.css";

const Bay = (props) => {
  const location = useLocation();
  console.log("where we are", location);
  let backdrop = props.showTask ? (
    <BackDrop onClick={props.onCloseTasks} />
  ) : null;

  return (
    <div>
      {backdrop}
      {console.log(location.pathname.includes("/all-projects"))}
      <div className="bay">
        {location.pathname.includes("/all-projects") ? (
          <AddTask
            showTask={props.showTask}
            onShowTask={props.onShowTask}
            onCloseTasks={props.onCloseTasks}
            postData={props.postData}
            selectedID={props.selectedID}
            onAlert={props.onAlert}
            onFetchTasks={props.onFetchTasks}
            onTaskUpdate={props.onTaskUpdate}
            personnel={props.personnel}
          />
        ) : (
          <EditTask
            showTask={props.showTask}
            onShowTask={props.onShowTask}
            onCloseTasks={props.onCloseTasks}
            postData={props.postData}
            selectedTaskID={props.selectedTaskID}
            onAlert={props.onAlert}
            onFetchTasks={props.onFetchTasks}
            onTaskUpdate={props.onTaskUpdate}
            personnel={props.personnel}
            tasks={props.tasks}
            resetSelectedTaskID={props.resetSelectedTaskID}
            onFetchData={props.onFetchData}
          />
        )}
      </div>
    </div>
  );
};

export default Bay;
