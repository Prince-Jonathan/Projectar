import React, { useState } from "react";
import DatePicker from "react-datepicker";
import MultiSelect from "react-multi-select-component";

import BackDrop from "../../../backdrop/Backdrop";
import Outstanding from "./OutstandingTask";

import "./Task.css";
import "react-datepicker/dist/react-datepicker.css";

const Tasks = (props) => {
  const [startDate, setStartDate] = useState({ date: new Date() });
  const [state, setState] = useState({
    title: "",
    description: "",
    target: "",
  });
  const [selected, setSelected] = useState([]);

  const options = [
    { label: "asdf ", value: "asdf" },
    { label: "3ed ", value: "3ed" },
    { label: "ales ", value: "ales", disabled: true },
    { label: "max ", value: "max" },
    { label: "say ", value: "say" },
    { label: "Apple ", value: "Apple" },
  ];

  const handleChange = (event) => {
    setState({ ...state, [event.target.name]: event.target.value });
    console.log(event.target.value);
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
    // add an option button or combo box for selecting assigned to
    <div>
      {backdrop}
      <div className="wrapper">
        <div className="task">
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
            <div>
              <MultiSelect
                options={options}
                value={selected}
                onChange={setSelected}
                labelledBy={"Assign to"}
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
    </div>
  );
};

export default Tasks;
