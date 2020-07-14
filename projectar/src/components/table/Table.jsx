import React from "react";
import { useTable } from "react-table";

import "./Table.css";

const Table = (props) => {
  const data = React.useMemo(
    () => [
      {
        col2: "Hello",
        col1: "World",
        col3: "adf",
        col4: "another",
      },
      {
        col1: "react-table",
        col2: "rocks",
      },
      {
        col1: "whatever",
        col2: "you want",
      },
    ],
    []
  );
  const columns = React.useMemo(
    () => [
      {
        Header: "Name",
        columns: [
          {
            Header: "First Name",
            accessor: "col1",
          },
          {
            Header: "Last Name",
            accessor: "col2",
          },
        ],
      },
      {
        Header: "Column 3",
        accessor: "col3",
      },
      {
        Header: "Column 4",
        accessor: "col4",
      },
      {
        Header: "Column 5",
        accessor: "col5",
      },
      {
        Header: "Column 5",
        accessor: "col6",
      },
      {
        Header: "Column 5",
        accessor: "col7",
      },
      {
        Header: "Column 5",
        accessor: "col8",
      },
      {
        Header: "Column 5",
        accessor: "col9",
      },
      {
        Header: "Column 5",
        accessor: "col10",
      },
      {
        Header: "Column 5",
        accessor: "col11",
      },
      {
        Header: "Column 5",
        accessor: "col12",
      },
    ],
    []
  );
  const tableInstance = useTable({ columns, data });
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
  } = tableInstance;
  return (
    // apply the table props
    <table {...getTableProps()}>
      <thead>
        {// Loop over the header rows
        headerGroups.map((headerGroup) => (
          // Apply the header row props
          <tr {...headerGroup.getHeaderGroupProps()}>
            {// Loop over the headers in each row
            headerGroup.headers.map((column) => (
              // Apply the header cell props
              <th {...column.getHeaderProps()}>
                {// Render the header
                column.render("Header")}
              </th>
            ))}
          </tr>
        ))}
      </thead>
      {/* Apply the table body props */}
      <tbody {...getTableBodyProps()}>
        {// Loop over the table rows
        rows.map((row) => {
          // Prepare the row for display
          prepareRow(row);
          return (
            // Apply the row props
            <tr {...row.getRowProps()}>
              {// Loop over the rows cells
              row.cells.map((cell) => {
                // Apply the cell props
                return (
                  <td {...cell.getCellProps()}>
                    {// Render the cell contents
                    cell.render("Cell")}
                  </td>
                );
              })}
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

export default Table;
