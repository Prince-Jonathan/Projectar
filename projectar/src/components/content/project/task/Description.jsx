import React, { useState, useEffect } from "react";
import CKEditor from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";

const Description = (props) => {
  const assignedPersonnel = props.tasksPersonnel.filter(
    (personnel) => parseInt(personnel.id) === parseInt(props.taskID)
  );

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
        {assignedPersonnel.map((p, i) => (
          <div
            key={i}
            style={{
              color: "white",
              fontWeight: 600,
              textShadow: "1px 1px 1px #000",
            }}
          >
            {p.label}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Description;
