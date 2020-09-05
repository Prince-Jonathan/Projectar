import React, { useState, useEffect } from "react";
import styled from "styled-components";
import DatePicker from "react-datepicker";
import Select from "react-select";

import { isMobile } from "../../../Responsive";

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

const AddTask = (props) => {
  const [startDate, setStartDate] = useState({ date: new Date() });
  const [state, setState] = useState({
    title: "",
    description: "",
    target: "",
    achieved: "",
    personnel: null,
  });

  const data = props.personnel;

  const options = data.map((personnel) => {
    const { first_name: firstName, last_name: lastName, id: value } = personnel;
    return { label: `${firstName} ${lastName}`, value: value };
  });

  // const options = [
  //   { value: "chocolate", label: "Chocolate" },
  //   { value: "strawberry", label: "Strawberry" },
  //   { value: "vanilla", label: "Vanilla" },
  // ];

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
    props
      .postData("/api/task/add", task)
      .then((data) => console.log(data))
      .then(() =>
        props.onAlert("success", "Task Saved", {
          timeout: 5000,
          position: "bottom center",
        })
      )
      .then(() => props.onTaskUpdate())
      .then(() => props.postData("/api/notify/new-task", task))
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
      <form onSubmit={handleSubmit} className="form-container">
        <span>
          <strong>Assign Task To Specific Days</strong>
        </span>

        <input
          // autoFocus
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
            justifyContent: "space-around",
            alignItems: "baseline",
            margin: "5px",
          }}
        >
          <input
            // style={{ width: "75px" }}
            type="text"
            placeholder="Target(%)"
            name="target"
            value={state.target}
            onChange={handleChange}
            required
          />
          <DatePicker
            selected={startDate.date}
            onChange={(date) => setStartDate({ date })}
            customInput={<CustomInput />}
            withPortal={isMobile}
            showTimeInput
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
      </form>
    </div>
  );
};

export default AddTask;
