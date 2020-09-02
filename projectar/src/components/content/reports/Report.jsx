import React, { useState } from "react";
import CKEditor from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";

import Caption from "../Caption";

import "./Reports.css";

const App = (props) => {
  const [value, setValue] = useState("");
  const handleOnChange = (event, editor) => {
    const data = editor.getData();
    setValue(data);
    // console.log({ event, editor, data });
  };
  return (
    <React.Fragment>
      <Caption flabel="Draft" slabel="Report" />
      <div className="report-wrapper">
        <CKEditor
          editor={ClassicEditor}
          data="<p><i>What will you want to report?</i></p>"
          // onInit={(editor) => {
          //   // You can store the "editor" and use when it is needed.
          //   console.log("Editor is ready to use!", editor);
          // }}
          onChange={handleOnChange}
          config={{
            ckfinder: { uploadUrl: "http://localhost:3001/upload" },
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
    </React.Fragment>
  );
};

export default App;
