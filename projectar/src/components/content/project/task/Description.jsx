import React, { useState, useEffect } from "react";
import CKEditor from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";

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
            {p.name}
          </div>
        ))}
      </div>
      {props.comment ? (
        <div>
          Comment:{" "}
          <div
            style={{
              color: "white",
              fontWeight: 600,
              textShadow: "1px 1px 1px #000",
            }}
          >
            <div style={{ color: "black", textShadow: "none" }}>
              <CKEditor
                // disabled
                editor={ClassicEditor}
                name="comment"
                data={props.comment}
                onInit={(editor, config) => {
                  // You can store the "editor" and use when it is needed.
                  console.log("Editor is ready to use!", editor);
                  console.log("config", config);
                  editor.isReadOnly = true;
                }}
                // onChange={handleOnChange}
                config={{
                  ckfinder: {
                    uploadUrl: "https://projectar.devcodes.co/upload",
                  },
                }}
                // onBlur={(event, editor) => {
                //   console.log("Blur.", editor);
                // }}
                // onFocus={(event, editor) => {
                //   console.log("Focus.", editor);
                // }}
              />
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default Description;
