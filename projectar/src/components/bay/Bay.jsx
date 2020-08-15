import React, { useState } from "react";
import DatePicker from "react-datepicker";
import Select from "react-select";

import BackDrop from "../backdrop/Backdrop";
import Tasks from "../content/project/task/Tasks";

import "./Bay.css";
import "react-datepicker/dist/react-datepicker.css";

const Bay = (props) => {
  let backdrop = props.showTasks ? (
    <BackDrop onClick={props.onCloseTasks} />
  ) : null;

  return (
    <div>
      {backdrop}
      <div className="bay">
        <Tasks
          showTasks={props.showTasks}
          onShowTasks={props.onShowTasks}
          onCloseTasks={props.onCloseTasks}
          postData={props.postData}
          selectedID={props.selectedID}
          onAlert={props.onAlert}
          onFetchTasks={props.onFetchTasks}
          onTaskUpdate={props.onTaskUpdate}
        />
      </div>
    </div>
  );
};

export default Bay;
