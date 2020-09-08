import React from "react";

import "./Workspace.css";

const Element = ({ icon, flabel, slabel, onClick }) => {
  return (
    <div
      onClick={onClick}
      style={{ display: "flex", flexDirection: "column", alignItems: "center" }}
    >
      {" "}
      <div className="circular">
        <i
          style={{ textShadow: "1px 1px 1px #ccc" }}
          className={icon}
          aria-hidden="true"
        />
      </div>
      <div className="text">
        <span style={{ color: "white " }}>{flabel} </span>
        {slabel}
      </div>{" "}
    </div>
  );
};

export default Element;
