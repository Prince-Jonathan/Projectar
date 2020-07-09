import React from "react";

const Wall = (props) => {
  const wall = {
    color: "white",
    fontFamily: "consolas, Open Sans, sans-serif",
    fontStyle: "italic",
  };
  let name = props.name ? `${props.name}'s ` : "";
  return (
    <div>
      {name}
      <span style={wall}>Project</span>
      ar
    </div>
  );
};

export default Wall;
