import React, { useState, useEffect } from "react";

const Description = (props) => {
  const [personnel, setPersonnel] = useState([]);

  const fetchPersonnel = (taskID) =>
    props
      .onFetchData(`/api/task/enrolments/${taskID}`)
      //check if messsage exists: msg only exist on error
      .then(({ data }) => (data.msg ? null : setPersonnel(data)));

  useEffect(() => {
    fetchPersonnel(props.taskID);
  }, []);
  return (
    <div style={{ color: "10292e", fontWeight: 700 }}>
      <div>
        Description:{" "}
        <div
          style={{
            color: "white",
            fontWeight: 600,
            textShadow: "1px 1px 1px #000",
          }}
        >
          {props.description}
        </div>{" "}
      </div>
      <div>
        Personnel:{" "}
        {personnel.map((p) => (
          <div
            style={{
              color: "white",
              fontWeight: 600,
              textShadow: "1px 1px 1px #000",
            }}
          >
            {p.first_name + " " + p.last_name}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Description;
