import React, { useState, useEffect } from "react";
import { Link, useHistory } from "react-router-dom";
import styled from "styled-components";

import Table from "../../table/Table";
import Slate from "../slate/Slate";
import { isMobile } from "../../Responsive";
import TasksStatus from "../project/task/TasksStatus";
import Caption from "../Caption";
import Export from "../Export";

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
const Wrapper = styled.div`
  display: flex;
  flex-direction: ${props=>props.isMobile ? "row" : "column"};
  justify-content: space-around;
  flex-wrap: wrap;
`;

const Projects = (props) => {
  const history = useHistory();
  const [rowID, setRowID] = useState(0);

  const data = React.useMemo(() => props.projects, [props.projects]);

  useEffect(
    () => {
      props.onSelect(rowID);
    },
    [rowID]
  );

  const IndeterminateCheckbox = React.forwardRef(
    ({ indeterminate, ...rest }, ref) => {
      const defaultRef = React.useRef()
      const resolvedRef = ref || defaultRef
  
      React.useEffect(() => {
        resolvedRef.current.indeterminate = indeterminate
      }, [resolvedRef, indeterminate])
  
      return (
        <>
          <input type="checkbox" ref={resolvedRef} {...rest} />
        </>
      )
    }
  )

  const columns = React.useMemo(
    () => {
      const columns = [
        {
          id: 'selection',
          // The header can use the table's getToggleAllRowsSelectedProps method
          // to render a checkbox
          Header: ({ getToggleAllRowsSelectedProps }) => (
            <div>
              <IndeterminateCheckbox {...getToggleAllRowsSelectedProps()} />
            </div>
          ),
          // The cell can use the individual row's getToggleRowSelectedProps method
          // to the render a checkbox
          Cell: ({ row }) => (
            <div>
              <IndeterminateCheckbox {...row.getToggleRowSelectedProps()} />
            </div>
          ),
        },
        {
          // Make an expander cell
          Header: () => null, // No header
          id: "expander", // It needs an ID
          Cell: ({ row }) => (
            // Use Cell to render an expander for each row.
            // We can use the getToggleRowExpandedProps prop-getter
            // to build the expander.
            <span {...row.getToggleRowExpandedProps()}>
              {row.isExpanded ? (
                <i class="fa fa-compress" aria-hidden="true" />
              ) : (
                <i class="fa fa-expand" aria-hidden="true" />
              )}
            </span>
          ),
        },
        {
          Header: "Name",
          accessor: "name",
        },
        {
          Header: "Consultant",
          accessor: "project_consultant",
        },
        {
          Header: "Manager",
          accessor: "project_manager",
        },
      ];
      return isMobile ? columns.splice(0, 2) : columns;
    },
    [isMobile]
  );
  const renderRowSubComponent = React.useCallback(
    ({ row }) => (
      <Styles>
        <div className="project">
          <div className="left">
            <Button
              onClick={() => {
                setRowID(row.original.id);
                props.onShowTask();
              }}
            >
              Add Task
            </Button>

            <Export
              projectID={row.original.id}
              onFetchData={props.onFetchData}
              caption="Report"
              title={`${row.original.name} - Tasks List [Target vs. Achieved]`}
              logo={props.logo}
            />
            <Button onClick={()=>history.push(`/project/${row.original.id}/attendance`)}>Attendance</Button>
          </div>
          <TasksStatus
            projectID={row.original.id}
            onFetchData={props.onFetchData}
            toggler={props.toggler}
          />
        </div>
      </Styles>
    ),
    [props.toggler]
  );
  return (
    <React.Fragment>
      <Wrapper isMobile={isMobile}>
        <Caption flabel="Projects" slabel="List" />
        <Slate>
          <Table
            columns={columns}
            data={data}
            renderRowSubComponent={renderRowSubComponent}
          />
        </Slate>
      </Wrapper>
    </React.Fragment>
  );
};

export default Projects;
