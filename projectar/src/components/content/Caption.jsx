import React from "react";

const Caption = (props) => {
  const wrapper = {
    margin: "15px",
    fontSize: 25,
  };
  const text = {
    color: "white",
    fontFamily: "Open Sans, sans-serif",
    fontWeight: 900,
  };

  let name = props.name ? `${props.name}` : "User";
  return (
    <div style={wrapper}>
      <span style={text}>{greet}, </span>
      {name}
      <span style={text}>!</span>
    </div>
  );
};

export default Caption;
