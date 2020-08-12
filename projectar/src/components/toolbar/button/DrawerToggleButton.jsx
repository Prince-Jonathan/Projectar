import React from "react";
import "./Button.css";

const DrawerToggleButton = (props) => {
  return (
    <button onClick={props.onClick}>
      <i className="fa fa-reorder fa-lg" />
    </button>
  );
};

export default DrawerToggleButton;
