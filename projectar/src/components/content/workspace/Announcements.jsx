import React, { useState } from "react";
import styled from "styled-components";
import { useHistory, useRouteMatch } from "react-router-dom";

import { isMobile } from "../../Responsive";

import "./Workspace.css";

const Button = styled.button`
  border: none;
  color: white;
  font-size: 15px;
  text-align: center;
  box-shadow: 0px 3px 0px 0px rgba(0, 0, 0, 0.2);
  cursor: pointer;
  margin: 5px;
  border-radius: 12px;
  background-color: #10292e;

  &::active {
    box-shadow: 0px 2px 0px 0px rgba(0, 0, 0, 0.2);
  }
`;

const Announcements = (props) => {
  const history = useHistory();
  const { url } = useRouteMatch();
  const [announcement, setAnnouncement] = useState(
    <div style={{ marginTop: "5%", color: "#b2beb5" }}>
      <i className="fa fa-bullhorn fa-3x" aria-hidden="true" />
      <div>
        Project status of project, make announcement to appreciate teams, share
        important information or wish on birthdays
      </div>
    </div>
  );
  const fixWidth = isMobile ? null : { width: "800px" };
  return (
    <div>
      <div className="slate" style={fixWidth}>
        <div className="header">
          <strong>Announcements</strong>
          <Button onClick={() => history.push("/send-announcement")}>
            {" "}
            <i
              style={{ color: "#ffee00" }}
              className="fa fa-plus"
              aria-hidden="true"
            />{" "}
            Add
          </Button>
        </div>
        <div>{announcement}</div>
      </div>
    </div>
  );
};

export default Announcements;
