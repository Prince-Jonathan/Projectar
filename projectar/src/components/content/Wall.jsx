import React from "react";

const Wall = (props) => {
  const text = {
    color: "white",
    fontFamily: "Open Sans, sans-serif",
    fontStyle: "italic",
  };
  let name = props.name ? `${props.name}'s ` : "";
  return (
    <div>
      <span style={{ fontWeight: 300 }}>{name}</span>
      <span style={text}>Project</span>
      ar
    </div>
  );
};

export default Wall;
