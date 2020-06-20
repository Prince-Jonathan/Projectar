import styled from "styled-components";

// Responsible for enabling responsive website

const Row = styled.div.attrs((props) => ({ className: props.className }))`
  &::after {
    content: "";
    clear: both;
    display: table;
  }
`;

function getWidthString(span, subTag) {
  if (!span) return;
  let width = (span / 12) * 100;
  return `width:${width}%;`;
}

const Column = styled.div.attrs((props) => ({ className: props.className }))`
  float: left;

  @media only screen and (max-width: 650px) {
    ${'' /* ${({ subTag, xs}) =>
      xs
        ? `.${subTag}{width:100 !important}` 
        : `.${subTag}{background-color:pink}`}; */}
  }

  @media only screen and (min-width: 650px) {
  }

  @media only screen and (min-width: 768px) {
   
  }
  @media only screen and (min-width: 992px) {

  }
  @media only screen and (min-width: 1200px) {

  }
`;
export { Row, Column };
