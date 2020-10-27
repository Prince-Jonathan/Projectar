import React, { useState, useEffect, useMemo } from "react";
import { useHistory, useLocation } from "react-router-dom";
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
  const location = useLocation();
  const history = useHistory();

  const [projectPersonnel, setProjectPersonnel] = useState([]);

  const fetchProjectPersonnel = async () => {
    try {
      props
        .onFetchData(`/api/project/enrolments/${location.state.projectID}`)
        .then(({ data: { data } }) => {
          setProjectPersonnel(data);
        });
    } catch (err) {}
  };

  useEffect(
    () => {
      fetchProjectPersonnel();
    },
    [location.state.projectID]
  );

  const [startDate, setStartDate] = useState({ date: new Date() });
  const [state, setState] = useState({
    title: "",
    description: "",
    target: null,
    achieved: null,
    personnel: null,
  });

  const options = useMemo(
    () =>
      projectPersonnel
        ? projectPersonnel.map((personnel) => {
            return { label: personnel.name, value: personnel.id };
          })
        : null,
    [projectPersonnel]
  );

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
    let targets = state.personnel.map((personnel) => personnel.id);
    const task = {
      ...state,
      ...startDate,
      project_id: location.state.projectID,
      targets: targets,
      entry_type: location.state.entry_type,
      comment: null,
      achieved: null,
      creator: JSON.parse(localStorage.getItem("netsuite")).id,
      url:
        window.location.protocol +
        "//" +
        window.location.hostname +
        "/project/" +
        location.state.projectID +
        "/outstanding-tasks",
    };
    const taskDetails = {};
    props.onAlert("info", "Saving...", {
      timeout: 3000,
      position: "bottom center",
    });
    props
      .postData("/api/task/add", task)
      .then(() => {
        props.onTaskUpdate();
        props.onAlert("success", "Task Saved", {
          timeout: 5000,
          position: "bottom center",
        });
        props.postData("/api/notify/new_task", task);
      })
      .then(() => history.goBack())
      .catch(() =>
        props.onAlert("error", "Failed to Save Task", {
          timeout: 3000,
          position: "bottom center",
        })
      );
  };

  const handleSelection = (selectedOption) => {
    const personnel = selectedOption.map((option) => {
      return { name: option.label, id: option.value };
    });
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
      <form onSubmit={handleSubmit} className="form-container column">
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
              onClick={() => {
                history.goBack();
              }}
            >
              Close
            </Button>
        </div>
      </form>
    </div>
  );
};

export default AddTask;
