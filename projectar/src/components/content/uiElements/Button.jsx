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
  opacity: 0.95;
  transition: all 0.2s ease-in-out;

  &:hover {
    text-shadow: none;
    box-shadow: 0 2.2px 10px rgba(0, 0, 0, 0.12);
    color: #ffee00;
    opacity: 1;
    transform: scale(1.08);
  }
  &:focus {
    outline: none;
    text-shadow: none;
    box-shadow: 0 2.2px 80px rgba(0, 0, 0, 0.12);
    color: #ffee00;
    opacity: 1;
  }
`;

export default Button;
