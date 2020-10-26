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
  const { path } = useRouteMatch();
  const history = useHistory();
  // const [projectID, setProjectID] = useState(history.location.state.projectID);
  // const [projectPersonnel, setProjectPersonnel] = useState([]);

  // const fetchProjectPersonnel = async () => {
  //   try {
  //     props
  //       .onFetchData(
  //         `/api/project/enrolments/${history.location.state.projectID}`
  //       )
  //       .then(({ data: { data } }) => {
  //         setProjectPersonnel(data);
  //         console.log(data);
  //       });
  //   } catch (err) {}
  // };

  // useEffect(
  //   () => {
  //     fetchProjectPersonnel();
  //     console.log("inside useeffect");
  //   },
  //   [history.location.state.projectID]
  // );

  let backdrop = <BackDrop />;

  return (
    <div>
      <Switch>
        <Route path={path}>
          {backdrop}
          <div className="bay">{props.children}</div>
        </Route>
      </Switch>
    </div>
  );
};

export default Bay;
