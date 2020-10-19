import React, { useState, useEffect } from "react";
import { Link, useHistory } from "react-router-dom";
import styled from "styled-components";

import { Row, Column } from "../../Grid";
import Element from "./Element";
import Announcements from "./Announcements";
import Can from "../../Can";

import "./Workspace.css";

// const Button = styled.button`
//   background: #faec25b9;
//   border: none;
//   border-bottom: 4px solid #10292e;
//   color: #10292e;
//   /* font-family: 'Open Sans', sans-serif; */
//   text-shadow: 1px 1px 1px rgba(0, 0, 0, 0.4);
//   font-size: 15px;
//   text-align: center;
//   box-shadow: 0px 3px 0px 0px rgba(0, 0, 0, 0.2);
//   cursor: pointer;
//   margin: 0 5px 0 5px;
//   border-radius: 12px;
//   background-color: #ffee00;

//   &::active {
//     box-shadow: 0px 2px 0px 0px rgba(0, 0, 0, 0.2);
//   }
// `;

const Style = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  flex-wrap: wrap;
`;
// tempStyle=

const Workspace = (props) => {
  const history = useHistory();
  return (
    <div>
      <Row>
        <Column>
          <Style>
            <Element
              onClick={() => history.push("/")}
              flabel="Add"
              slabel="Task"
              icon="fa fa-tasks fa-lg"
            />
            {/* view single personnel tasks */}
            <Can
              role={JSON.parse(
                localStorage.getItem("netsuite")
              ).role.toLowerCase()}
              perform="tasks:list"
              yes={() => (
                <>
                  <Element
                    onClick={() =>
                      history.push("/project/all/tasks", {
                        taskType: "personnel",
                      })
                    }
                    flabel="View"
                    slabel="Tasks"
                    icon="fa fa-tasks fa-lg"
                  />
                </>
              )}
            />
            {/* view all tasks (administrative privilege) */}
            <Can
              role={JSON.parse(
                localStorage.getItem("netsuite")
              ).role.toLowerCase()}
              perform="tasks:lists"
              yes={() => (
                <>
                  <Element
                    onClick={() =>
                      history.push("/project/all/tasks", {
                        taskType: "projects",
                      })
                    }
                    flabel="View"
                    slabel="Tasks"
                    icon="fa fa-file-text-o  fa-lg"
                  />
                </>
              )}
            />

            <Element
              onClick={() => history.push("/personnel")}
              flabel="View"
              slabel="Personnel"
              icon="fa fa-users fa-lg"
            />
            <Element
              onClick={() => history.push("/reports")}
              flabel="Recent"
              slabel="Reports"
              icon="fa fa-folder-open-o fa-lg"
            />
          </Style>

          <Announcements />
        </Column>
      </Row>
    </div>
  );
};

export default Workspace;
