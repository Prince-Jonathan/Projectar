import React from "react";
import styled from "styled-components";

const Input = styled.input`
  padding: 0.5em;
  margin: 0.5em;
  color: black;
  background: white;
  border: none;
  border-radius: 3px;
`;
const ColumnFilter = ({
  column: { filterValue, preFilteredRows, setFilter },
}) => {
  const count = preFilteredRows.length;
  return (
    <Input
      value={filterValue || ""}
      onChange={(e) => {
        setFilter(e.target.value || undefined); // Set undefined to remove the filter entirely
      }}
      placeholder={`Search ${count} ${count === 1 ? "record?" : "records..."}`}
    />
  );
};

export default ColumnFilter;
