import React, { useEffect } from "react";
import { useTable, useFilters, useExpanded, useRowSelect } from "react-table";

import ColumnFilter from "./filters/ColumnFilter";

import "./Table.css";

// Create a default prop getter
const defaultPropGetter = () => ({});

const Table = ({
  columns,
  data,
  renderRowSubComponent,
  clickable,
  selectedRows,
  getHeaderProps = defaultPropGetter,
  getCellProps = defaultPropGetter,
  getColumnProps = defaultPropGetter,
}) => {
  const defaultColumn = React.useMemo(
    () => ({
      // setting up default Filter UI
      Filter: ColumnFilter,
    }),
    []
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    visibleColumns,
    selectedFlatRows,
    state: { expanded },
  } = useTable(
    {
      columns,
      data,
      defaultColumn,
    },
    useExpanded,
    useFilters,
    useRowSelect
  );

  const cursor = clickable ? { cursor: "pointer" } : null;

  const firstPageRows = rows.slice(0, 2);
  return (
    <table id="tableComp" {...getTableProps()}>
      <thead>
        {headerGroups.map((headerGroup) => (
          <tr {...headerGroup.getHeaderGroupProps()}>
            {headerGroup.headers.map((column) => (
              <th
                // Return an array of prop objects and react-table will merge them appropriately
                {...column.getHeaderProps([
                  {
                    className: column.className,
                    style: column.style,
                  },
                  getColumnProps(column),
                  getHeaderProps(column),
                ])}
              >
                {column.render("Header")}
                {/* Render the columns filter UI */}

                <div>{column.canFilter ? column.render("Filter") : null}</div>
              </th>
            ))}
          </tr>
        ))}
      </thead>
      <tbody {...getTableBodyProps()}>
        {rows.map((row, i) => {
          prepareRow(row);
          return (
            // Use a React.Fragment here so the table markup is still valid
            <React.Fragment key={i}>
              <tr {...row.getRowProps()} className="mainComp" style={cursor}>
                {row.cells.map((cell) => {
                  return (
                    <td
                      // Return an array of prop objects and react-table will merge them appropriately
                      {...cell.getCellProps([
                        {
                          className: cell.column.className,
                          style: cell.column.style,
                        },
                        getColumnProps(cell.column),
                        getCellProps(cell),
                      ])}
                      //custom on click event handler for row via cells (refactorable)
                      onClick={() =>
                        clickable && cell.column.id !== "expander"
                          ? clickable({ row })
                          : null
                      }
                      // {...cell.getCellProps()}
                    >
                      {cell.render("Cell")}
                    </td>
                  );
                })}
              </tr>
              {row.isSelected ? selectedRows(selectedFlatRows) : null}
              {/*
                If the row is in an expanded state, render a row with a
                column that fills the entire length of the table.
              */}
              {row.isExpanded ? (
                <tr className="subComp">
                  <td colSpan={visibleColumns.length}>
                    {/*
                      Inside it, call our renderRowSubComponent function. In reality,
                      you could pass whatever you want as props to
                      a component like this, including the entire
                      table instance. But for this example, we'll just
                      pass the row
                    */}
                    {renderRowSubComponent({ row })}
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
