import React, { useState } from "react";
import CKEditor from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import Caption from "../Caption";

import "./Reports.css";

const App = (props) => {
  const [value, setValue] = useState("");
  const handleOnChange = (event, editor) => {
    setValue(editor.getData());
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
            // ckfinder: { uploadUrl: "http://localhost:8000/upload" },
            ckfinder: {
              uploadUrl: "https://projectar.automationghana.com/upload",
            },
            placeholder: "What report will you want drafted?",
          }}
          // onBlur={(event, editor) => {
          // }}
          // onFocus={(event, editor) => {
          // }}
        />
      </div>
      <button>Log</button>
    </div>
  );
};

export default App;
