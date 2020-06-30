import React from "react";

const DrawerToggleButton = (props) => {
  return (
    <button
      onClick={props.onClick}
      style={{ backgroundColor: "", height: "25px", width:"25px" }}
    >
      <i className="fa fa-reorder" />
    </button>
  );
};

export default DrawerToggleButton;
