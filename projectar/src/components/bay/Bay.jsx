import React, { useState, useEffect } from "react";
import { Switch, Route, useRouteMatch, useHistory } from "react-router-dom";
import DatePicker from "react-datepicker";
import Select from "react-select";

import BackDrop from "../backdrop/Backdrop";
import AddTask from "../content/project/task/AddTask";
import EditTask from "../content/project/task/EditTask";

import "./Bay.css";
import "react-datepicker/dist/react-datepicker.css";

const Bay = (props) => {
  const { url, path } = useRouteMatch();
  const history = useHistory();
  // const [projectID, setProjectID] = useState(history.location.state.projectID);
  const [projectPersonnel, setProjectPersonnel] = useState([]);

  const fetchProjectPersonnel = async () => {
    try {
      props
        .onFetchData(
          `/api/project/enrolments/${history.location.state.projectID}`
        )
        .then(({ data: { data } }) => {
          setProjectPersonnel(data);
          console.log(data);
        });
    } catch (err) {}
  };

  useEffect(
    () => {
      fetchProjectPersonnel();
      console.log("inside useeffect");
    },
    [history.location.state.projectID]
  );

  let backdrop = <BackDrop onClick={console.log("backdrop clicked")} />;

  return (
    <div>
      <Switch>
        <Route path={path}>
          {backdrop}
          {console.log("selectedId", history.location.state.projectID)}
          <div className="bay" >
            <AddTask
              showTask={props.showTask}
              onShowTask={props.onShowTask}
              onCloseTasks={props.onCloseTasks}
              postData={props.postData}
              projectPersonnel={projectPersonnel}
              onAlert={props.onAlert}
              onFetchTasks={props.onFetchTasks}
              onTaskUpdate={props.onTaskUpdate}
              personnel={props.personnel}
              onFetchData={props.onFetchData}
              resetSelectedID={props.resetSelectedID}
            />

            {/* <EditTask
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
          />  */}
          </div>
        </Route>
      </Switch>
    </div>
  );
};

export default Bay;
