import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import styled from "styled-components";
import DatePicker from "react-datepicker";
import Select from "react-select";

import { isMobile } from "../Responsive";

// import "./Task.css";
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

const Login = (props) => {
  const history = useHistory();
  const [startDate, setStartDate] = useState({ date: new Date() });
  const [state, setState] = useState({
    username: "",
    password: "",
  });

  const handleChange = (event) => {
    setState({ ...state, [event.target.name]: event.target.value });
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    let user = { ...state };
    console.log("this is the outgoing", user);
    props
      .postData("/api/login", user)
      .then((data) => console.log("returned from post", data))
      .then(() =>
        props.onAlert("success", "welcome", {
          timeout: 5000,
          position: "bottom center",
        })
      )
      .then(() => history.push("/"))
      // .then(() => props.resetSelectedTaskID())
      .catch(() =>
        props.onAlert("error", "Incorrect username or password", {
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
          <strong>Login</strong>
        </span>

        <input
          // autoFocus
          type="text"
          style={{ flex: "1" }}
          placeholder={state.username}
          name="username"
          value={state.username}
          onChange={handleChange}
          required
        />
        <input
          // autoFocus
          type="password"
          style={{ flex: "1" }}
          placeholder={state.password}
          name="password"
          value={state.password}
          onChange={handleChange}
          required
        />
        <div
          style={{
            display: "flex",
            alignContent: "center",
            justifyContent: "center",
          }}
        >
          <Button type="submit" className="btn">
            Login
          </Button>
          <Button
            type="button"
            className="btn cancel"
            onClick={() => {
              // props.resetSelectedTaskID();
            }}
          >
            Close
          </Button>
        </div>
      </form>
    </div>
  );
};

export default Login;
