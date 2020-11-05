import React from "react";
import styled from "styled-components";
import Input from "../../content/uiElements/Input";

const ColumnFilter = ({
  column: { filterValue, preFilteredRows, setFilter },
}) => {
  const count = preFilteredRows.length;
  return (
    <Input
      style={{ color: "black !important" }}
      value={filterValue || ""}
      onChange={(e) => {
        setFilter(e.target.value || undefined); // Set undefined to remove the filter entirely
      }}
      placeholder={
        count
          ? `Search ${count} ${count === 1 ? "record?" : "records..."}`
          : "There are no records..."
      }
    />
  );
};

export default ColumnFilter;
