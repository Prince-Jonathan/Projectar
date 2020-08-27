import React from "react";
import { Link, useHistory } from "react-router-dom";

import DrawerToggleButton from "./button/DrawerToggleButton";

import "./Toolbar.css";

const Toolbar = (props) => {
  const history = useHistory();

  return (
    <div className="toolbar">
      <div className="button">
        <DrawerToggleButton onClick={props.onClick} />
      </div>
      <div className="Logo">
        <img
          onClick={() => history.push("/")}
          src={props.logo}
          alt="Client Logo"
          width="50"
          height="50"
          style={{ cursor: "pointer" }}
        />
      </div>
      <Link to="/login" className="right">
        <i class="fa fa-user-o" aria-hidden="true" /> Logout
      </Link>
    </div>
  );
};

export default Toolbar;
