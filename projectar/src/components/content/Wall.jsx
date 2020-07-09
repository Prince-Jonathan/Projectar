import React from "react";

const Wall = (props) => {
  const text = {
    color: "white",
    fontFamily: "consolas, Open Sans, sans-serif",
    fontStyle: "italic",
  };
  let name = props.name ? `${props.name}'s ` : "";
  return (
    <div>
      {name}
      <span style={text}>Project</span>
      ar
    </div>
  );
};

export default Wall;
