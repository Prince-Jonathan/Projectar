import React, { useState, useEffect, useMemo } from "react";
import { useLocation, useHistory } from "react-router-dom";
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

const EditTask = (props) => {
  const location = useLocation();
  const history = useHistory();

  const [startDate, setStartDate] = useState({ date: new Date() });
  const [projectPersonnel, setProjectPersonnel] = useState([]);
  const [taskPersonnel, setTaskPersonnel] = useState([]);

  const [state, setState] = useState({
    title: "",
    description: "",
    target: "",
    achieved: "",
    personnel: null,
  });

  const fetchProjectPersonnel = async () => {
    try {
      props
        .onFetchData(`/api/project/enrolments/${location.state.projectID}`)
        .then(({ data: { data } }) => {
          setProjectPersonnel(data);
          console.log(data);
        });
    } catch (err) {}
  };

  const fetchTaskPersonnel = async () => {
    try {
      props
        .onFetchData(`/api/task/enrolments/${location.state.taskID}`)
        .then(({ data }) => {
          let personnel = data.map((personnel) => {
            return { label: personnel.name, value: personnel.id };
          });
          setTaskPersonnel(personnel);
          console.log(personnel);
        });
    } catch (err) {}
  };

  useEffect(
    () => {
      fetchProjectPersonnel();
      fetchTaskPersonnel();
    },
    [location.state]
  );

  // const fetchPersonnel = (taskID) =>
  //   props
  //     .onFetchData(`/api/task/enrolments/${taskID}`)
  //     //check if messsage exists: msg only exist on error
  //     .then(({ data }) => (data.msg ? null : setPersonnel(data)));

  // useEffect(() => {
  //   fetchPersonnel(location.state.taskID);
  // }, []);

  // const assignedPersonnel = useMemo(
  //   () =>
  //     taskPersonnel
  //       ? taskPersonnel.map((personnel) => {
  //           return { label: personnel.name, value: personnel.id };
  //         })
  //       : null,
  //   [taskPersonnel]
  // );
  const options = useMemo(
    () =>
      projectPersonnel
        ? projectPersonnel.map((personnel) => {
            return { label: personnel.name, value: personnel.id };
          })
        : null,
    [projectPersonnel]
  );

  let task;
  useEffect(
    () => {
      task = props.tasks.filter(
        (t) => parseInt(t.id) === location.state.taskID
      );
      console.log("query move", location.state.taskID);
      setState(task[0]);
      setStartDate({ date: new Date(task[0].date) });
    },
    [location.state, props.tasks]
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

    let task = {
      ...state,
      ...startDate,
      project_id: props.selectedID,
      targets: state.personnel,
    };
    props.onAlert("info", "Updating...", {
      timeout: 3000,
      position: "bottom center",
    });
    console.log("this is the outgoing", task);
    props
      .postData(`/api/task/update/${location.state.taskID}`, task)
      .then((data) => console.log("returned from post", data))
      .then(() =>
        props.onAlert("success", "Task Updated", {
          timeout: 5000,
          position: "bottom center",
        })
      )
      .then(() => props.onTaskUpdate())
      .then(() => props.postData("/api/notify/edited-task", task))
      // .then(() => props.resetSelectedTaskID())
      .then(() => history.goBack())
      .catch(() =>
        props.onAlert("error", "Failed to Update Task", {
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
          placeholder={state.title}
          name="title"
          value={state.title}
          onChange={handleChange}
          required
        />

        <textarea
          type="text"
          style={{ flex: "1" }}
          placeholder={state.description}
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
            placeholder={state.target}
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
          />
        </div>

        <Select
          isMulti
          placeholder="Assign to:"
          onChange={handleSelection}
          defaultValue={[{label: "Samuel Keketsor", value: 189}]}
          options={options}
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
            onClick={() => history.goBack()}
          >
            Close
          </Button>
        </div>
      </form>
    </div>
  );
};

export default EditTask;
