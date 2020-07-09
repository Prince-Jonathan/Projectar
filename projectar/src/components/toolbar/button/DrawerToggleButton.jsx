import React from "react";
import "./Button.css";

const DrawerToggleButton = (props) => {
  return (
    <button onClick={props.onClick} className="button">
      <i className="fa fa-reorder fa-lg" />
    </button>
  );
};

export default DrawerToggleButton;
