import React, { useState, useEffect, useMemo } from "react";
import { Switch, Route, useRouteMatch } from "react-router-dom";
import styled from "styled-components";
import DatePicker from "react-datepicker";
import Select from "react-select";

import { isMobile } from "../../../Responsive";
import Report from "../../reports/Report";
import Slate from "../../slate/Slate";
import Table from "./../../../table/Table";
import Caption from "../../Caption";

import "./Task.css";
import "react-datepicker/dist/react-datepicker.css";

const Button = styled.button`
  border: none;
  color: white;
  font-size: 15px;
  text-align: center;
  box-shadow: 0px 3px 0px 0px rgba(0, 0, 0, 0.2);
  cursor: pointer;
  margin: 0 5px 0 5px;
  border-radius: 12px;
  background-color: #10292e;

  &::active {
    box-shadow: 0px 2px 0px 0px rgba(0, 0, 0, 0.2);
  }
`;

const Task = (props) => {
  const [startDate, setStartDate] = useState({ date: new Date() });
  const [state, setState] = useState({
    title: "Submit WBS",
    description: "Consider all proceedings and instructions",
    target: "100%",
    achieved: "",
    personnel: null,
  });
  const { url, path } = useRouteMatch();
  let task = useMemo(
    () =>
      props.data.filter((task) => parseInt(task.id) === props.selectedTaskID),
    [props.selectedTaskID, props.data]
  );
  console.log("the new task", task);

  // const data = props.personnel;

  // const options = data.map((personnel) => {
  //   const { first_name: firstName, last_name: lastName, id: value } = personnel;
  //   return { label: `${firstName} ${lastName}`, value: value };
  // });

  const options = [
    { value: "chocolate", label: "Chocolate" },
    { value: "strawberry", label: "Strawberry" },
    { value: "vanilla", label: "Vanilla" },
  ];

  const [selectedOption, setSelectedOption] = useState({
    isOpen: false,
    isFixed: false,
    portalPlacement: "top",
  });

  const handleChange = (event) => {
    setState({ ...state, [event.target.name]: event.target.value });
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    let task = { ...state, ...startDate, project_id: props.selectedID };
    props.onAlert("info", "Saving...", {
      timeout: 3000,
      position: "bottom center",
    });
    console.log(task);
    props
      .postData("/api/task/add", task)
      .then((data) => console.log(data))
      .then(() =>
        props.onAlert("success", "Task Saved", {
          timeout: 5000,
          position: "bottom center",
        })
      )
      .then(() => props.onTaskUpdate("setUpdateTask"))
      .then(() => props.onCloseTasks())
      .catch(() =>
        props.onAlert("error", "Failed to Save Task", {
          timeout: 3000,
          position: "bottom center",
        })
      );
  };

  const handleSelection = (selectedOption) => {
    const personnel = selectedOption.map((option) => option.value);
    setState({ ...state, personnel });
  };

  const CustomInput = ({ value, onClick }) => (
    <Button
      type="button"
      style={{ cursor: "pointer" }}
      required
      className="date"
      onClick={onClick}
      value={value}
    >
      {value}
    </Button>
  );

  return (
    <div>
      <Switch>
        <Route exact path={path}>
          <Caption flabel="Tasks" slabel=" -Outstanding" />
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
          <Slate>
            <form onSubmit={handleSubmit} className="form-container">
              <span>
                <strong>Execute Task</strong>
              </span>

              <input
                type="text"
                style={{ flex: "1", backgroundColor: "#B2BEB5" }}
                name="title"
                placeholder="{state.title}"
                value={state.title}
                required
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
                      required
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
                  onChange={(date) => setStartDate({ date })}
                  customInput={<CustomInput />}
                  withPortal={isMobile}
                />
              </div>

              <Select
                isMulti
                onChange={handleSelection}
                options={options}
                defaultValue={selectedOption.value}
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
                {console.log("outsanding state in focus:", state)}
                <Button type="submit" className="btn">
                  Save
                </Button>
                <Button
                  type="button"
                  className="btn cancel"
                  onClick={props.onCloseTasks}
                >
                  Close
                </Button>
              </div>
              <Report />
            </form>
          </Slate>
        </Route>
      </Switch>
    </div>
  );
};

export default Task;
