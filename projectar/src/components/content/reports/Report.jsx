import React, { useState } from "react";
import CKEditor from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import Caption from "../Caption";

import "./Reports.css";

const App = (props) => {
  const [value, setValue] = useState("");
  const handleOnChange = (event, editor) => {
    setValue(editor.getData());
    // console.log({ event, editor, data });
  };
  return (
    <div>
      <Caption flabel="Draft" slabel="Report" />
      <div className="report-wrapper" style={{ color: "white" }}>
        <CKEditor
          editor={ClassicEditor}
          name="comment"
          // data="<p><i>What will you want to report?</i></p>"
          onInit={(editor) => {}}
          onChange={handleOnChange}
          config={{
            // ckfinder: { uploadUrl: "http://localhost:9000/upload" },
            ckfinder: { uploadUrl: "https://projectar.devcodes.co/upload" },
            placeholder: "What report will you want drafted?",
          }}
          // onBlur={(event, editor) => {
          //   console.log("Blur.", editor);
          // }}
          // onFocus={(event, editor) => {
          //   console.log("Focus.", editor);
          // }}
        />
      </div>
      <button onClick={() => console.log(value)}>Log</button>
    </div>
  );
};

export default App;
