import React from "react";
import { Link } from "react-router-dom";

import DrawerToggleButton from "./button/DrawerToggleButton";

import "./Toolbar.css";

const Toolbar = (props) => {
  return (
    <div className="toolbar">
      <div className="button">
        <DrawerToggleButton onClick={props.onClick} />
      </div>
      <div className="Logo">
        <img src={props.logo} alt="Projectar Logo" width="50" height="50"/>
      </div>
      <Link to="/login" className="right">
        <i class="fa fa-user-o" aria-hidden="true" /> Logout
      </Link>
    </div>
  );
};

export default Toolbar;
