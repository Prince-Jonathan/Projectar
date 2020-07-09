import React from "react";
import "./Button.css";

const DrawerToggleButton = (props) => {
  return (
    <button
      onClick={props.onClick}
      // style={{ backgroundColor: "", height: "25px", width: "50px" }}
      className="button"
    >
      <i className="fa fa-reorder fa-lg" />
    </button>
  );
};

export default DrawerToggleButton;
