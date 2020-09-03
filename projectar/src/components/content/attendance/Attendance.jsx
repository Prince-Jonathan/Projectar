import React, { useState, useMemo, forwardRef, useRef } from "react";
import Table from "../../table/Table";

import Slate from "../slate/Slate";

const Attendance = (props) => {

  const data = useMemo(() => props.personnel, [props.personnel]);
  const columns = useMemo(
    () => [
      {
        id: "selection",
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
      { Header: "First Name", accessor: "first_name" },
      { Header: "Last Name", accessor: "last_name" },
    ],
    []
  );
  const IndeterminateCheckbox = forwardRef(
    ({ indeterminate, ...rest }, ref) => {
      const defaultRef = useRef();
      const resolvedRef = ref || defaultRef;

      React.useEffect(
        () => {
          resolvedRef.current.indeterminate = indeterminate;
        },
        [resolvedRef, indeterminate]
      );

      return (
        <>
          <input type="checkbox" ref={resolvedRef} {...rest} />
        </>
      );
    }
  );
  let rows;
  const extractData = (data) => {
    rows = data.map((row) => row.original.id);
  };
  return (
    <React.Fragment>
      <Slate>
        <Table
          data={data}
          columns={columns}
          selectedRows={(data) => extractData(data)}
        />
      </Slate>
      <button onClick={() => console.log("this is it", rows)}>click</button>
    </React.Fragment>
  );
};

export default Attendance;
