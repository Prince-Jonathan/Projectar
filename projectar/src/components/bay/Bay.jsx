import React, { useState } from "react";
import DatePicker from "react-datepicker";
import Select from "react-select";

import BackDrop from "../backdrop/Backdrop";
import Task from "../content/project/task/Task";

import "./Bay.css";
import "react-datepicker/dist/react-datepicker.css";

const Bay = (props) => {
  let backdrop = props.showBay ? <BackDrop onClick={props.onCloseBay} /> : null;

  return (
    <div>
      {backdrop}
      <div id="bay" className="bay">
        {/* <Task
          showTasks={props.showTasks}
          onShowTasks={props.onShowTasks}
          onCloseTasks={props.onCloseTasks}
          postData={props.postData}
          selectedID={props.selectedID}
          onAlert={props.onAlert}
          onFetchTasks={props.onFetchTasks}
          onTaskUpdate={props.onTaskUpdate}
          personnel={props.personnel}
        /> */}
      </div>
    </div>
  );
};

export default Bay;
