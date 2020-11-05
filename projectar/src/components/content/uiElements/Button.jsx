import styled from "styled-components";
const Button = styled.button`
  background: #faec25b9;
  border: none;
  border-bottom: 4px solid #10292e;
  color: white;
  text-shadow: 1px 1px 1px rgba(0, 0, 0, 0.4);
  font-size: 15px;
  text-align: center;
  cursor: pointer;
  margin: 0 5px 0 5px;
  border-radius: 12px;
  background-color: #10292E;
  transition: all 0.2s ease-in-out;
  
  padding: 8px ;
  opacity: 0.8;

  ${({ bright }) =>
    bright &&
    `color: white;background-color: green;border-bottom: 0 2.2px 10px rgba(0, 0, 0, 0.12);`}

  &:hover {
    text-shadow: none;
    box-shadow: 0 2.2px 10px rgba(0, 0, 0, 0.12);
    color: #ffee00;
    opacity: 1;
    transform: scale(1.08);

    ${({ bright }) =>
      bright &&
      `color: #ffee00; border-bottom: 4px solid rgba(0, 128, 0, 0.199)`}
  }
  &:focus {
    outline: none;
    text-shadow: none;
    box-shadow: 0 2.2px 80px rgba(0, 0, 0, 0.12);
    color: #ffee00;
    opacity: 0.85;

    ${({ bright }) =>
      bright &&
      `color: #ffee00; border-bottom: 4px solid rgba(0, 128, 0, 0.199)`}
  }
  ${({ backgroundColor }) =>
    backgroundColor &&
    `background-color: ${backgroundColor}; border-bottom: none`}
  }
`;

export default Button;
