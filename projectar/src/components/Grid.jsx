import styled from "styled-components";

const Row = styled.div.attrs((props) => ({ className: props.className }))`
  &::-webkit-scrollbar {
    display: none;
  }
  display: flex;
  overflow: hidden;
  height: 100vh;
  position: relative;
  width: 100%;
  backface-visibility: hidden;
  will-change: overflow;
  ${({ backgroundColor }) => `background-color:${backgroundColor}`};
  ${({ flexDirection }) => `flex-direction:${flexDirection}`};
  ${({ justifyContent }) => `justify-content:${justifyContent}`};
  ${({ flexWrap }) => `flex-wrap:${flexWrap}`};
  ${({ alignItems }) => `align-items:${alignItems}`};
`;

const Column = styled.div`
  &::-webkit-scrollbar {
    ${(props)=>!props.scroll && "display: none"};
  }
  overflow: auto;
  height: auto;
  ${({ flex }) => `flex:${flex}`};
  ${({ backgroundColor }) => `background-color:${backgroundColor}`};

  @media only screen and (max-width: 500px) {
    ${({ xxs }) => `flex:${xxs}`};
  }

  @media only screen and (min-width: 500px) {
    ${({ xs }) => `flex:${xs}`};
  }

  @media only screen and (min-width: 650px) {
    ${({ sm }) => `flex:${sm}`};
  }

  @media only screen and (min-width: 768px) {
    ${({ md }) => `flex:${md}`};
  }
  @media only screen and (min-width: 992px) {
    ${({ lg }) => `flex:${lg}`};
  }
  @media only screen and (min-width: 1200px) {
    ${({ xl }) => `flex:${xl}`};
  }
`;

export { Row, Column };
