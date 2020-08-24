import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";

import { Row, Column } from "../../Grid";
import Element from "./Element";
import Announcements from "./Announcements";

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
  return (
    <div>
      <Row>
        <Column>
          <Style>
            <Element flabel="Add" slabel="Task" icon="fa fa-tasks fa-lg" />
            <Element
              flabel="View"
              slabel="Tasks"
              icon="fa fa-file-text-o  fa-lg"
            />
            <Element
              flabel="View"
              slabel="Personnel"
              icon="fa fa-users fa-lg"
            />
            <Element
              flabel="Recent"
              slabel="Reports"
              icon="fa fa-archive fa-lg"
            />
          </Style>
          <Announcements />
        </Column>
      </Row>
    </div>
  );
};

export default Workspace;
