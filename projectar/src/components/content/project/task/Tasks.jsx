import React, { useState } from "react";
import DatePicker from "react-datepicker";
import Select from "react-select";

import "./Task.css";
import "react-datepicker/dist/react-datepicker.css";

const Tasks = (props) => {
  const [startDate, setStartDate] = useState({ date: new Date() });
  const [state, setState] = useState({
    title: "",
    description: "",
    target: "",
    personnel: null,
  });

  const [selectedOption, setSelectedOption] = useState({
    isOpen: false,
    isFixed: false,
    portalPlacement: "top",
  });

  const options = [
    { value: "chocolate", label: "Chocolate" },
    { value: "strawberry", label: "Strawberry" },
    { value: "vanilla", label: "Vanilla" },
    { value: "chocolate", label: "Chocolate" },
    { value: "strawberry", label: "Strawberry" },
    { value: "vanilla", label: "Vanilla" },
    { value: "chocolate", label: "Chocolate" },
    { value: "strawberry", label: "Strawberry" },
    { value: "vanilla", label: "Vanilla" },
  ];

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
    props
      .postData("/api/task/add", task)
      .then(() =>
        props.onAlert("success", "Task Saved", {
          timeout: 5000,
          position: "bottom center",
        })
      )
      .then(() => props.onTaskUpdate())
      .then(() => props.onCloseTasks())
      .catch(() =>
        props.onAlert("error", "Failed to Save Task", {
          timeout: 3000,
          position: "bottom center",
        })
      );
  };

  const handleSelection = (selectedOption) => {
    setState({ ...state, personnel: selectedOption });
  };

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
      <form onSubmit={handleSubmit} className="form-container">
        <span>
          <strong>Assign Task To Specific Days</strong>
        </span>

        <input
          // autoFocus
          tabIndex="0"
          type="text"
          style={{ flex: "1" }}
          placeholder="Enter Title"
          name="title"
          value={state.title}
          onChange={handleChange}
          required
        />

        <textarea
          tabIndex="0"
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
            justifyContent: "space-around",
            alignItems: "baseline",
            margin: "10px",
          }}
        >
          <DatePicker
            tabIndex="2"
            selected={startDate.date}
            onChange={(date) => setStartDate({ date })}
            customInput={<ExampleCustomInput />}
          />

          <input
            tabIndex="3"
            style={{ width: "75px" }}
            type="text"
            placeholder="Target(%)"
            name="target"
            value={state.target}
            onChange={handleChange}
            required
          />
        </div>

        <Select
          isMulti
          placeholder="Assign to:"
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
  );
};

export default Tasks;
