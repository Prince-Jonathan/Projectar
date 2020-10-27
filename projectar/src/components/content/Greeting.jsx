import React from "react";

const Greeting = (props) => {
  const wrapper = {
    margin: "15px",
    fontSize: 25,
  };
  const text = {
    color: "white",
    fontFamily: "Open Sans, sans-serif",
    fontWeight: 900,
  };

  let greet;
  let date = new Date();
  let hour = date.getHours();
  let minute = date.getMinutes();
  let second = date.getSeconds();
  if (minute < 10) {
    minute = "0" + minute;
  }
  if (second < 10) {
    second = "0" + second;
  }
  if (hour < 12) {
    greet = "Good Morning";
  } else if (hour < 17) {
    greet = "Good Afternoon";
  } else {
    greet = "Good Evening";
  }
  let name = props.name ? `${props.name}` : "User";
  return (
    <div style={wrapper}>
      <span style={text}>{greet}, </span>
      {name}
      <span style={text}>..</span>
    </div>
  );
};

export default Greeting;
