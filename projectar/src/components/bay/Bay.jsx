import React, { useState } from "react";
import DatePicker from "react-datepicker";
import Select from "react-select";

import BackDrop from "../backdrop/Backdrop";
import AddTask from "../content/project/task/AddTask";

import "./Bay.css";
import "react-datepicker/dist/react-datepicker.css";

const Bay = (props) => {
  let backdrop = props.showTask ? (
    <BackDrop onClick={props.onCloseTasks} />
  ) : null;

  return (
    <div>
      {backdrop}
      <div className="bay">
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
      </div>
    </div>
  );
};

export default Bay;
