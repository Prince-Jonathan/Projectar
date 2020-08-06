import React from "react";
import { useTable, useExpanded } from "react-table";

import "./Table.css";

const Table = ({ columns: userColumns, data, renderRowSubComponent }) => {
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    visibleColumns,
    state: { expanded },
  } = useTable(
    {
      columns: userColumns,
      data,
    },
    useExpanded
  );

  const firstPageRows = rows.slice(0, 2);
  return (
    <table {...getTableProps()}>
      <thead>
        {headerGroups.map((headerGroup) => (
          <tr {...headerGroup.getHeaderGroupProps()}>
            {headerGroup.headers.map((column) => (
              <th {...column.getHeaderProps()}>{column.render("Header")}</th>
            ))}
          </tr>
        ))}
      </thead>
      <tbody {...getTableBodyProps()}>
        {rows.map((row, i) => {
          prepareRow(row);
          return (
            // Use a React.Fragment here so the table markup is still valid
            <React.Fragment {...row.getRowProps()}>
              <tr>
                {row.cells.map((cell) => {
                  return (
                    <td {...cell.getCellProps()}>{cell.render("Cell")}</td>
                  );
                })}
              </tr>
              {/*
                If the row is in an expanded state, render a row with a
                column that fills the entire length of the table.
              */}
              {row.isExpanded ? (
                <tr>
                  <td className="subComp" colSpan={visibleColumns.length}>
                    {/*
                      Inside it, call our renderRowSubComponent function. In reality,
                      you could pass whatever you want as props to
                      a component like this, including the entire
                      table instance. But for this example, we'll just
                      pass the row
                    */}
                    {<div ><button>Add Task</button><br/><div ><button>Add Task</button></div><br/><div ><button>Add Task</button></div><br/><div ><button>Add Task</button></div></div>}
                  </td>
                </tr>
              ) : null}
            </React.Fragment>
          );
        })}
      </tbody>
    </table>
  );
};

export default Table;
