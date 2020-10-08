import React from "react";
import CKEditor from "@ckeditor/ckeditor5-react";
import DatePicker from "react-datepicker";
import styled from "styled-components";
import Select from "react-select";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";

import Slate from "../../slate/Slate";
import { isMobile } from "../../../Responsive";

const Row = styled.div`
  display: "flex",
 &::-webkit-scrollbar {
    display: none;
  }
  display: flex;
  overflow: hidden;
  height: 82vh;
  position: relative;
  min-height: min-content;
  width: 100%;
  color: #ffff;
  backface-visibility: hidden;
  will-change: overflow;
  ${({ backgroundColor }) => `background-color:${backgroundColor}`};
  ${({ flexDirection }) => `flex-direction:${flexDirection}`};
  ${({ justifyContent }) => `justify-content:${justifyContent}`};
  ${({ flexWrap }) => `flex-wrap:${flexWrap}`};
  ${({ alignItems }) => `align-items:${alignItems}`};
`;

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
      required
      className="btn date"
      onClick={onClick}
      value={value}
      style={{ width: `${isMobile ? "None" : "100%"}` }}
    >
      {value}
    </Button>
  );

  //currently working on finishing creator notification

  return isMobile ? (
    <div>
      <Slate>
        <form onSubmit={props.handleSubmit} className="form-container column">
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
              justifyContent: "space-between",
              alignItems: "center",
              marginTop: "10%",
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
                style={{ flexBasis: "auto", backgroundColor: "white" }}
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
          <div style={{ flex: 5, padding: 10 }}>
            <div className="report-wrapper">
              <CKEditor
                editor={ClassicEditor}
                data={
                  props.state.details
                    ? props.state.details[0].comment ||
                      "<p><i>What is your comment?</i></p>"
                    : "<p><i>What is your comment?</i></p>"
                }
                onChange={props.handleEditorChange}
                config={{
                  ckfinder: {
                    maxSize: 3000,
                    uploadUrl: "https://projectar.devcodes.co/upload",
                  },
                }}
              />
            </div>
          </div>
        </form>
      </Slate>
    </div>
  ) : (
    <Row justifyContent="center">
      <div style={{ flex: 1, padding: 10, backgroundColor: "#adb7a9c2" }}>
        <form onSubmit={props.handleSubmit} className="form-container">
          <div style={{ display: "flex" }}>
            <div style={{ flex: 1, padding: 10 }}>
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
                  justifyContent: "space-between",
                  alignItems: "center",
                  margin: "5px",
                }}
              >
                <div>
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
                </div>
                <div>
                  <label>
                    Achieved(%):
                    <input
                      style={{ flexBasis: "auto", backgroundColor: "white" }}
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
                menuPosition={
                  props.selectedOption.isFixed ? "fixed" : "absolute"
                }
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
            </div>
            <div style={{ flex: 5, padding: 10 }}>
              <div className="report-wrapper">
                <CKEditor
                  editor={ClassicEditor}
                  data={
                    props.state.details
                      ? props.state.details[0].comment ||
                        "<p><i>What is your comment?</i></p>"
                      : "<p><i>What is your comment?</i></p>"
                  }
                  onChange={props.handleEditorChange}
                  config={{
                    ckfinder: {
                      maxSize: 3000,
                      uploadUrl: "https://projectar.devcodes.co/upload",
                    },
                  }}
                />
              </div>
            </div>
          </div>
        </form>
      </div>
    </Row>
  );
};

export default ExecuteTask;
