import React, { useState, useEffect, useMemo } from "react";
import {
  Switch,
  Route,
  useRouteMatch,
  useHistory,
  useLocation,
} from "react-router-dom";
import styled from "styled-components";
import DatePicker from "react-datepicker";
import Select from "react-select";
import CKEditor from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";

import { isMobile } from "../../../Responsive";
import Report from "../../reports/Report";
import Slate from "../../slate/Slate";
import Table from "./../../../table/Table";
import Caption from "../../Caption";
import ExecuteTask from "./ExecuteTask";

import "./Task.css";
import "react-datepicker/dist/react-datepicker.css";

const Task = (props) => {
  const history = useHistory();
  const location = useLocation();

  const [startDate, setStartDate] = useState({ date: new Date() });
  const [state, setState] = useState({
    title: "",
    description: "",
    target: "",
    achieved: "",
    personnel: null,
  });
  // const [taskPersonnel, setTaskPersonnel] = useState([]);
  const [comment, setComment] = useState("");

  const { url, path } = useRouteMatch();

  let task = useMemo(
    () => {
      // replace filter with find
      return location.state
        ? props.data.filter(
            (task) => parseInt(task.id) === location.state.taskID
          )[0]
        : [];
    },
    [location.state, props.data]
  );

  useEffect(
    () => {
      // setStartDate({ date: new Date(task[0].date) });
      try {
        setState({
          ...task,
          target: task.details[0].target,
          achieved: task.details[0].achieved,
        });
      } catch (err) {}
      try {
        setStartDate({ date: new Date(task.details[0].target_date) });
      } catch (error) {}
    },
    [task]
  );

  let assignedPersonnel = location.state
    ? props.tasksPersonnel.filter(
        (personnel) =>
          parseInt(personnel.id) === parseInt(location.state.taskID)
      )
    : null;

  const options = useMemo(
    () =>
      props.projectPersonnel
        ? props.projectPersonnel.map((personnel) => {
            return { label: personnel.name, value: personnel.id };
          })
        : null,
    [props.projectPersonnel]
  );

  const [selectedOption, setSelectedOption] = useState({
    isOpen: false,
    isFixed: false,
    portalPlacement: "top",
  });

  const handleChange = (event) => {
    setState({ ...state, [event.target.name]: event.target.value });
  };
  const handleEditorChange = (event, editor) => {
    setComment(editor.getData());
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (
      parseInt(state.achieved) > parseInt(state.target) ||
      parseInt(state.achieved) > 100
    ) {
      props.onAlert("error", "Invalid Achieved Input", {
        timeout: 3000,
        position: "bottom center",
      });
    } else {
      let personnel =
        state.personnel ||
        assignedPersonnel.map((personnel) => {
          return { name: personnel.label, id: personnel.value };
        });
      let targets = state.personnel
        ? state.personnel.map((personnel) => personnel.id)
        : assignedPersonnel.map((personnel) => personnel.value);

      let task = {
        ...state,
        ...startDate,
        project_id: location.state.projectID,
        comment: comment,
        targets: targets,
        personnel: personnel,
        entry_type: location.state.entry_type,
      };
      props.onAlert("info", "Executing...", {
        timeout: 3000,
        position: "bottom center",
      });
      props
        .postData(`/api/task/update/${location.state.taskID}`, task)
        .then(() =>
          props.onAlert("success", "Task Executed", {
            timeout: 5000,
            position: "bottom center",
          })
        )
        .then(() => props.onTaskUpdate())
        .then(() => {
          if (parseInt(state.achieved) === parseInt(state.target)) {
            props.postData("/api/notify/completed-task", task);
          }
        })
        // .then(() => props.resetSelectedTaskID())
        .then(() => handleClose())
        .catch(() =>
          props.onAlert("error", "Failed to Execute Task", {
            timeout: 3000,
            position: "bottom center",
          })
        );
    }
  };

  const handleSelection = (selectedOption) => {
    const personnel = selectedOption.map((option) => option.value);
    setState({ ...state, personnel });
  };

  const handleClose = () => {
    history.goBack();
  };
  return (
    <div>
      <Switch>
        <Route exact path={path}>
          {props.outstanding ? (
            <Caption flabel="Tasks" slabel=" -Outstanding" />
          ) : (
            <Caption flabel="Tasks" slabel=" -Completed" />
          )}
          <Caption
            flabel={props.project[0].name}
            style={{ fontSize: 15, color: "white" }}
          />
          <Slate>
            <Table
              columns={props.columns}
              data={props.data}
              renderRowSubComponent={props.renderRowSubComponent}
              clickable={props.clickable}
            />
          </Slate>
        </Route>
        <Route path={`${path}/:id/execute/`}>
          <Caption flabel="Execute" slabel="Task" />
          <ExecuteTask
            handleSubmit={handleSubmit}
            state={state}
            handleChange={handleChange}
            startDate={startDate}
            handleSelection={handleSelection}
            options={options}
            assignedPersonnel={assignedPersonnel}
            selectedOption={selectedOption}
            handleClose={handleClose}
            handleEditorChange={handleEditorChange}
          />
        </Route>
      </Switch>
    </div>
  );
};

export default Task;
