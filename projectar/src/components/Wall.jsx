import React from "react";

const Wall = (props) => {
  return (
    <div>
      {props.name ? `${props.name}'s ` : ""}
      <span
        style={{
          color: "white",
          fontFamily: "consolas, Open Sans, sans-serif",
          fontStyle: "italic",
        }}
      >
        Project
      </span>
      ar{" "}
    </div>
  );
};

export default Wall;
