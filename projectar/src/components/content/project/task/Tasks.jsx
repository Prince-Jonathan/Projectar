import React, { useState } from "react";
import DatePicker from "react-datepicker";

import BackDrop from "../../../backdrop/Backdrop";

import "./Task.css";
import "react-datepicker/dist/react-datepicker.css";

const Tasks = (props) => {
  const [startDate, setStartDate] = useState({ date: new Date() });
  const [state, setState] = useState({
    title: "",
    description: "",
    target: "",
  });

  const handleChange = (event) => {
    setState({ ...state, [event.target.name]: event.target.value });
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    let task = { ...state, ...startDate, project_id: props.selectedID };
    props
      .postData("/api/task/add", task)
      .then(() =>
        props.onAlert("success", "Task Saved", {
          timeout: 5000,
          position: "bottom center",
        })
      )
      .then(() => props.onCloseTasks());
  };

  let tasksClass = ["task", "hide"];
  if (props.showTasks) {
    tasksClass.push("show");
  }

  let backdrop = props.showTasks ? (
    <BackDrop onClick={props.onCloseTasks} />
  ) : null;

  const ExampleCustomInput = ({ value, onClick }) => (
    <button
      style={{ cursor: "pointer" }}
      required
      className="date"
      onClick={onClick}
      value={value}
    >
      {value}
    </button>
  );

  return (
    <div>
      {backdrop}
      <div className={tasksClass.join(" ")}>
        <form onSubmit={handleSubmit} className="form-container">
          <h4>Assign Task To Specific Days</h4>
          <input
            autoFocus
            type="text"
            style={{ flex: "1" }}
            placeholder="Enter Title"
            name="title"
            value={state.title}
            onChange={handleChange}
            required
          />

          <textarea
            type="text"
            style={{ flex: "1" }}
            placeholder="Enter Task Description"
            name="description"
            value={state.description}
            onChange={handleChange}
            required
            rows="5"
            cols="37"
          />
          <div
            style={{
              display: "flex",
              alignContent: "center",
              justifyContent: "center",
              alignItems: "baseline",
              margin: "5px",
            }}
          >
            <DatePicker
              selected={startDate.date}
              onChange={(date) => setStartDate({ date })}
              customInput={<ExampleCustomInput />}
            />

            <input
              style={{ width: "75px", margin: "10px" }}
              type="text"
              placeholder="Target(%)"
              name="target"
              value={state.target}
              onChange={handleChange}
              required
            />
          </div>
          <div
            style={{
              display: "flex",
              alignContent: "center",
              justifyContent: "center",
            }}
          >
            <button type="submit" className="btn">
              Save
            </button>
            <button
              type="button"
              className="btn cancel"
              onClick={props.onCloseTasks}
            >
              Close
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Tasks;
