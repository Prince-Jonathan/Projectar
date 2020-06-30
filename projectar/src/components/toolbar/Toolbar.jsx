import React from "react";

import DrawerToggleButton from "./DrawerToggleButton";

import "./Toolbar.css";

const Toolbar = (props) => {
  return (
    <div className="toolbar">
      <div className="button">
        <DrawerToggleButton onClick={props.onClick}/>
      </div>
      <div className="Logo">Projectar Logo</div>
    </div>
  );
};

export default Toolbar;
