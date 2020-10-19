import React from "react";
import { useLocation } from "react-router-dom";
import CKEditor from "@ckeditor/ckeditor5-react";
import DatePicker from "react-datepicker";
import styled from "styled-components";
import Select from "react-select";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";

import Slate from "../../slate/Slate";
import { isMobile } from "../../../Responsive";
import Caption from "../../Caption";
import Can from "../../../Can";

const Row = styled.div`
  display: flex;
  flex-direction: column;
  overflow: visible;
  border-radius: 5px;
  position: relative;
  min-height: max-content;
  width: 100%;
  color: #ffff;
  backface-visibility: hidden;
  backdrop-filter: blur(3px);
  box-shadow: 0 8px 6px -6px black;
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
  const location = useLocation();
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

  // // verify if task is updatable: against 24hrs
  // const isUpdatable = props.state.details
  //   ? new Date().getTime() -
  //       new Date(props.state.details[0].date_updated).getTime() <
  //     1000 * 60 * 60 * 24
  //   : true;

  // const limitUpdateLabel = !isUpdatable ? (
  //   <Caption
  //     style={{ fontSize: 18, color: "#adb7a9c2" }}
  //     flabel="Update session expired!"
  //   />
  // ) : null;

  return isMobile ? (
    <div>
      {/* {location.state.taskStatus === "completed" && limitUpdateLabel} */}
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
            <Can
              role={JSON.parse(
                localStorage.getItem("netsuite")
              ).role.toLowerCase()}
              perform="tasks:execute"
              yes={() => (
                <Button
                  // disabled={
                  //   location.state.taskStatus === "completed" && !isUpdatable
                  // }
                  type="submit"
                  className="btn"
                >
                  Save
                </Button>
              )}
              data={{
                userID: JSON.parse(localStorage.getItem("netsuite")).id,
                assignedPersonnel: props.assignedPersonnel.map(
                  (personnel) => personnel.value
                ),
              }}
            />

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
                  props.state.details ? props.state.details[0].comment : null
                }
                onChange={props.handleEditorChange}
                onInit={(editor) => {
                  if (props.state.details) {
                    props.state.details[0].comment
                      ? editor.setData(props.state.details[0].comment)
                      : editor.setData("");
                  }
                }}
                config={{
                  ckfinder: {
                    maxSize: 3000,
                    uploadUrl: "https://projectar.devcodes.co/upload",
                  },
                  placeholder: "What is your comment?",
                }}
              />
            </div>
          </div>
        </form>
      </Slate>
    </div>
  ) : (
    <Row justifyContent="center">
      {/* {limitUpdateLabel} */}
      <div style={{ flex: 1, padding: 8, backgroundColor: "#adb7a9c2" }}>
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
                <Can
                  role={JSON.parse(
                    localStorage.getItem("netsuite")
                  ).role.toLowerCase()}
                  perform="tasks:execute"
                  yes={() => (
                    <Button
                      // disabled={
                      //   location.state.taskStatus === "completed" && !isUpdatable
                      // }
                      type="submit"
                      className="btn"
                    >
                      Save
                    </Button>
                  )}
                  data={{
                    userID: JSON.parse(localStorage.getItem("netsuite")).id,
                    pmcID: props.projects
                      .filter(
                        (project) =>
                          project.id === parseInt(location.state.projectID)
                      )
                      .map((p) => [p.consultant_id, p.manager_id])[0],
                  }}
                />
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
              <div className="report-wrapper" style={{ color: "white" }}>
                <CKEditor
                  editor={ClassicEditor}
                  data={
                    props.state.details ? props.state.details[0].comment : null
                  }
                  onChange={props.handleEditorChange}
                  onInit={(editor) => {
                    if (props.state.details) {
                      props.state.details[0].comment
                        ? editor.setData(props.state.details[0].comment)
                        : editor.setData("");
                    }
                  }}
                  config={{
                    ckfinder: {
                      maxSize: 3000,
                      uploadUrl: "https://projectar.devcodes.co/upload",
                    },
                    placeholder: "What is your comment?",
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
