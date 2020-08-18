import React, { useState, useEffect } from "react";

const Description = (props) => {
  const [personnel, setPersonnel] = useState([]);

  const fetchPersonnel = (taskID) =>
    props
      .onFetchData(`'/api/task/enrolments/${taskID}`)
      //check if messsage exists: msg only exist on error
      .then(({ data }) => (data.msg ? null : setPersonnel(data)));

  useEffect(
    () => {
      fetchPersonnel(props.taskID);
    },
    [props.toggler, props.taskID]
  );
  return (
    <div style={{}}>
      <div>
        Description: <span style={{ color: "white" }}>{props.description}</span>{" "}
      </div>
      <div>
        Personnel: <span style={{ color: "white" }}>{props.description}</span>
      </div>
    </div>
  );
};

export default Description;
