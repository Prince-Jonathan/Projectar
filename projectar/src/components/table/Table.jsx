import React, { useState, useEffect } from "react";
import { useTable } from "react-table";

import "./Table.css";

const Table = (props) => {
  const [data, setData] = useState([]);
  useEffect(() => {
    async function getData() {
      let res = await props.fetchData("/project/all");
      setData(res);
      console.log(res);
    }
    getData();
  }, []);
  // const data = React.useMemo(
  //   () => [
  //     {
  //       col2: "Hello",
  //       col1: "World",
  //       col3: "adf",
  //       col4: "another",
  //     },
  //     {
  //       col1: "react-table",
  //       col2: "rocks",
  //     },
  //     {
  //       col1: "whatever",
  //       col2: "you want",
  //     },
  //   ],
  //   []
  // );
  const columns = React.useMemo(
    () => [
      {
        Header: "ID",
        accessor: "id",
      },
      {
        Header: "Name",
        accessor: "name",
      },
      {
        Header: "Client",
        accessor: "client",
      },
      {
        Header: "Lat",
        accessor: "lat",
      },
      {
        Header: "Lon",
        accessor: "lon",
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
