import React from "react";
import styled from "styled-components";

const Button = styled.button`
  background: #faec25b9;
  border: none;
  border-bottom: 4px solid #10292e;
  color: #10292e;
  text-shadow: 1px 1px 1px rgba(0, 0, 0, 0.4);
  font-size: 15px;
  text-align: center;

  cursor: pointer;
  margin: 0 5px 0 5px;
  border-radius: 12px;
  background-color: #ffee00;

  &:focus {
    outline: none;
  }
  &:hover {
    outline: none;
    box-shadow: 0px 3px 0px 0px rgba(0, 0, 0, 0.2);
  }
`;

const DrawerToggleButton = (props) => {
  return (
    <Button onClick={props.onClick}>
      <i className="fa fa-reorder fa-lg" />
    </Button>
  );
};

export default DrawerToggleButton;
