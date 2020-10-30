import React, { useState, useEffect } from "react";
import {
  Link,
  useHistory,
  Route,
  useRouteMatch,
  Switch,
} from "react-router-dom";
import styled from "styled-components";

import Table from "../../table/Table";
import Slate from "../slate/Slate";
import { isMobile } from "../../Responsive";
import TasksStatus from "../project/task/TasksStatus";
import Caption from "../Caption";
import PersonnelTasks from "./PersonnelTasks";

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

const Personnel = (props) => {
  const history = useHistory();
  const { url, path } = useRouteMatch();
  const [tasks, setTasks] = useState([]);

  const [personnelName, setPersonnelName] = useState("");

  const data = React.useMemo(() => props.personnel, [props.personnel]);
  console.log("prop", props.personnel);
  const fetchTasks = (personnelID) =>
    props
      .onFetchData(`/api/user/tasks/${personnelID}`)
      //check if messsage exists: msg only exist on error
      .then(({ data }) => (data.success ? setTasks(data.data) : null));

  const columns = React.useMemo(
    () => {
      const column = [
        {
          Header: "Name",
          accessor: "name",
        },
        {
          Header: "Email",
          accessor: "email",
        },
      ];
      return isMobile ? column.splice(0, 1) : column;
    },
    [isMobile]
  );
  const handleClick = ({ row }) => {
    fetchTasks(row.original.id);
    setPersonnelName(row.original.name);
    history.push(`${path}/${row.original.id}/tasks`);
  };
  return (
    <div>
      <Switch>
        <Route exact path={path}>
          <Caption flabel="Personnel" slabel="List" />
          <Slate>
            <Table
              columns={columns}
              data={data || []}
              clickable={handleClick}
            />
          </Slate>
        </Route>
        <Route path={`${path}/:id/tasks`}>
          <PersonnelTasks
            tasks={tasks}
            personnelName={personnelName}
            onFetchData={props.onFetchData}
            onAlert={props.onAlert}
          />
          {/* <div>this is it</div> */}
        </Route>
      </Switch>
    </div>
  );
};

export default Personnel;
