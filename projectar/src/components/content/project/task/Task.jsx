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
          )
        : [];
    },
    [location.state, props.data]
  );

  useEffect(
    () => {
      // setStartDate({ date: new Date(task[0].date) });
      setState({ ...task[0] });
      try {
        setStartDate({ date: new Date(task[0].date) });
      } catch (error) {}
    },
    [task]
  );

  // useEffect(
  //   () => {
  //     const assignedPersonnel = location.state
  //       ? props.tasksPersonnel.filter(
  //           (personnel) =>
  //             parseInt(personnel.id) === parseInt(location.state.taskID)
  //         )
  //       : null;
  //     console.log(assignedPersonnel);
  //     setTaskPersonnel(assignedPersonnel);
  //   },
  //   [props.taskPersonnel, location.state]
  // );

  // useEffect(() => console.log({ ...state, personnel: taskPersonnel }), [task]);

  let assignedPersonnel = location.state
    ? props.tasksPersonnel.filter(
        (personnel) =>
          parseInt(personnel.id) === parseInt(location.state.taskID)
      )
    : null;

  // useEffect(() => console.log({ ...state, personnel: assignedPersonnel }), [
  //   assignedPersonnel,
  // ]);
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
      let personnel = state.personnel || {
        personnel: assignedPersonnel.map((personnel) => personnel.value),
      };

      let task = {
        ...state,
        ...startDate,
        project_id: props.selectedID,
        comment: comment,
        targets: state.personnel,
        ...personnel,
      };
      console.log(task, "assignedPersonnel", assignedPersonnel);
      props.onAlert("info", "Executing...", {
        timeout: 3000,
        position: "bottom center",
      });
      props
        .postData(`/api/task/update/${location.state.taskID}`, task)
        .then((data) => console.log("returned from post", data))
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
          <Caption flabel="Task" slabel=" -Outstanding" />
          {/* <Slate>
            <form onSubmit={handleSubmit} className="form-container">
              <span>
                <strong>Execute Task</strong>
              </span>

              <input
                type="text"
                style={{ flex: "1", backgroundColor: "#B2BEB5" }}
                name="title"
                placeholder={state.title}
                value={state.title}
                readOnly
              />

              <textarea
                type="text"
                style={{ flex: "1", backgroundColor: "#B2BEB5" }}
                name="description"
                placeholder={state.description}
                value={state.description}
                required
                rows="5"
                cols="37"
                readOnly
              />
              <div
                style={{
                  display: "flex",
                  alignContent: "center",
                  justifyContent: "space-around",
                  alignItems: "center",
                  margin: "5px",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignContent: "center",
                    justifyContent: "space-around",
                    alignItems: "baseline",
                    margin: "5px",
                  }}
                >
                  <label>
                    Target(%):
                    <input
                      style={{ backgroundColor: "#B2BEB5" }}
                      type="text"
                      name="target"
                      placeholder={state.target}
                      value={state.target}
                      readOnly
                    />
                  </label>
                  <label>
                    Achieved(%):
                    <input
                      style={{ flexBasis: "auto", backgroundColor: "#B2BEB5" }}
                      type="text"
                      name="achieved"
                      value={state.achieved}
                      onChange={handleChange}
                      required
                    />
                  </label>
                </div>
                <DatePicker
                  selected={startDate.date}
                  customInput={<CustomInput />}
                  withPortal={isMobile}
                  disabled
                />
              </div>

              <Select
                isMulti
                onChange={handleSelection}
                options={options}
                defaultValue={assignedPersonnel}
                isClearable
                styles={{ menuPortal: (base) => ({ ...base, zIndex: 200 }) }}
                menuPortalTarget={document.body}
                isSearchable
                name="color"
                menuPosition={selectedOption.isFixed ? "fixed" : "absolute"}
                menuPlacement={selectedOption.portalPlacement}
              />

              <div
                style={{
                  display: "flex",
                  alignContent: "center",
                  justifyContent: "center",
                }}
              >
                <Button type="submit" className="btn">
                  Save
                </Button>
                <Button
                  type="button"
                  className="btn cancel"
                  onClick={handleClose}
                >
                  Close
                </Button>
              </div>
              <div className="report-wrapper">
                <CKEditor
                  editor={ClassicEditor}
                  data="<p><i>What will you want to report?</i></p>"
                  // onInit={(editor) => {
                  //   // You can store the "editor" and use when it is needed.
                  //   console.log("Editor is ready to use!", editor);
                  // }}
                  onChange={handleEditorChange}
                  config={{
                    ckfinder: {
                      uploadUrl: "https://projectar.devcodes.co/upload",
                    },
                  }}
                  // onBlur={(event, editor) => {
                  //   console.log("Blur.", editor);
                  // }}
                  // onFocus={(event, editor) => {
                  //   console.log("Focus.", editor);
                  // }}
                />
              </div>
            </form>
          </Slate> */}
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
