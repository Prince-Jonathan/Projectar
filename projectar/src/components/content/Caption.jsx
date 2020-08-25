import React from "react";

const Caption = (props) => {
  const wrapper = {
    display: "flex",
    justifyContent: "flex-start",
    margin: "5px",
    fontSize: 25,
    marginRight: "auto",
  };
  const text = {
    color: "white",
    fontFamily: "Open Sans, sans-serif",
    fontWeight: 900,
  };

  return (
    <div style={wrapper}>
      <span style={text}>{props.flabel} </span> {props.slabel}
      <span style={text}>{props.tlabel}</span>
    </div>
  );
};

export default Caption;
