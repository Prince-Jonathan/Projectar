import React from "react";
import "./Backdrop.css";

const BackDrop = (props) => {
  return <div onClick={props.onClick} className="backdrop fade-in" />;
};

export default BackDrop;
