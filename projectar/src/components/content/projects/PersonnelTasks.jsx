import React, { useState, useEffect } from "react";
import { Link, useHistory } from "react-router-dom";
import styled from "styled-components";

import Table from "../../table/Table";
import Slate from "../slate/Slate";
import { isMobile } from "../../Responsive";
import TasksStatus from "../project/task/TasksStatus";
import Caption from "../Caption";
import SliderFilter from "../../table/filters/SliderFilter";
import filterGreaterThan from "../../table/filters/filterGreaterThan";

import "./Projects.css";

const Button = styled.button`
  background: #faec25b9;
  border: none;
  border-bottom: 4px solid #10292e;
  color: #10292e;
  /* font-family: 'Open Sans', sans-serif; */
  text-shadow: 1px 1px 1px rgba(0, 0, 0, 0.4);
  font-size: 15px;
  text-align: center;
  box-shadow: 0px 3px 0px 0px rgba(0, 0, 0, 0.2);
  cursor: pointer;
  margin: 0 5px 0 5px;
  border-radius: 12px;
  background-color: #ffee00;

  &::active {
    box-shadow: 0px 2px 0px 0px rgba(0, 0, 0, 0.2);
  }
`;

const Styles = styled.div`
  .project {
    display: flex;
    flex-direction: row;
    align-items: center;
  }
  .left {
    display: flex;
    flex-flow: column wrap;
    align-items: flex-start;
    justify-content: space-evenly;
    height: 100%;
    border-right: solid #ffee00;
    margin-right: 5px;
  }
  .left > button {
    margin: 5px 5px 5px 0;
  }
  .delete {
    color: white;
    border-bottom: 2px solid #f44336;
  }
`;

const PersonnelTasks = (props) => {
  const history = useHistory();

  const data = React.useMemo(() => props.tasks, [props.tasks]);

  data.sort((a, b) => {
    let dateA = new Date(a.date),
      dateB = new Date(b.date);
    return dateA - dateB;
  });

  const columns = React.useMemo(
    () => {
      const column = [
        {
          Header: "Title",
          accessor: "title",
        },
        {
          Header: "Target (%)",
          accessor: "target",
          Filter: SliderFilter,
          filter: filterGreaterThan,
        },
        {
          Header: "Achieved (%)",
          accessor: "Achieved",
          Filter: SliderFilter,
          filter: filterGreaterThan,
        },
        {
          Header: "Date Scheduled",
          accessor: "date",
          Filter: () => null,
        },
      ];
      return isMobile ? column.splice(0, 2) : column;
    },
    [isMobile]
  );
  return (
    <React.Fragment>
      <Caption flabel="Tasks" slabel={` -${props.personnelName}`} />
      <Slate>
        {console.log(data)}
        <Table columns={columns} data={data} />
      </Slate>
    </React.Fragment>
  );
};

export default PersonnelTasks;
