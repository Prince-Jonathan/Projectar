import React from "react";
import CKEditor from "@ckeditor/ckeditor5-react";
import DatePicker from "react-datepicker";
import styled from "styled-components";
import Select from "react-select";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";

import Slate from "../../slate/Slate";
import { isMobile } from "../../../Responsive";

const Button = styled.button`
  border: none;
  color: white;
  font-size: 15px;
  text-align: center;
  box-shadow: 0px 3px 0px 0px rgba(0, 0, 0, 0.2);
  cursor: pointer;
  margin: 0 5px 0 5px;
  border-radius: 12px;
  background-color: #10292e;

  &::active {
    box-shadow: 0px 2px 0px 0px rgba(0, 0, 0, 0.2);
  }
`;

const ExecuteTask = (props) => {
  const CustomInput = ({ value, onClick }) => (
    <Button
      type="button"
      style={{ cursor: "pointer" }}
      required
      className="date"
      onClick={onClick}
      value={value}
    >
      {value}
    </Button>
  );

  return (
    <div>
      <Slate>
        <form onSubmit={props.handleSubmit} className="form-container">
          <span>
            <strong>Execute Task</strong>
          </span>

          <input
            type="text"
            style={{ flex: "1", backgroundColor: "#B2BEB5" }}
            name="title"
            placeholder={props.state.title}
            value={props.state.title}
            readOnly
          />

          <textarea
            type="text"
            style={{ flex: "1", backgroundColor: "#B2BEB5" }}
            name="description"
            placeholder={props.state.description}
            value={props.state.description}
            required
            rows="5"
            cols="37"
            readOnly
          />
          <div
            style={{
              display: "flex",
              alignContent: "center",
              justifyContent: "space-around",
              alignItems: "center",
              margin: "5px",
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignContent: "center",
                justifyContent: "space-around",
                alignItems: "baseline",
                margin: "5px",
              }}
            >
              <label>
                Target(%):
                <input
                  style={{ backgroundColor: "#B2BEB5" }}
                  type="text"
                  name="target"
                  placeholder={props.state.target}
                  value={props.state.target}
                  readOnly
                />
              </label>
              <label>
                Achieved(%):
                <input
                  style={{ flexBasis: "auto", backgroundColor: "#B2BEB5" }}
                  type="text"
                  name="achieved"
                  value={props.state.achieved}
                  onChange={props.handleChange}
                  required
                />
              </label>
            </div>
            <DatePicker
              selected={props.startDate.date}
              customInput={<CustomInput />}
              withPortal={isMobile}
              disabled
            />
          </div>

          <Select
            isMulti
            onChange={props.handleSelection}
            options={props.options}
            defaultValue={props.assignedPersonnel}
            isClearable
            styles={{ menuPortal: (base) => ({ ...base, zIndex: 200 }) }}
            menuPortalTarget={document.body}
            isSearchable
            name="color"
            menuPosition={props.selectedOption.isFixed ? "fixed" : "absolute"}
            menuPlacement={props.selectedOption.portalPlacement}
          />

          <div
            style={{
              display: "flex",
              alignContent: "center",
              justifyContent: "center",
            }}
          >
            <Button type="submit" className="btn">
              Save
            </Button>
            <Button
              type="button"
              className="btn cancel"
              onClick={props.handleClose}
            >
              Close
            </Button>
          </div>
          <div className="report-wrapper">
            <CKEditor
              editor={ClassicEditor}
              data="<p><i>What will you want to report?</i></p>"
              onChange={props.handleEditorChange}
              config={{
                ckfinder: {
                  uploadUrl: "https://projectar.devcodes.co/upload",
                },
              }}
            />
          </div>
        </form>
      </Slate>
    </div>
  );
};

export default ExecuteTask;