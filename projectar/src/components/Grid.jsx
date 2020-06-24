import styled from "styled-components";

const Row = styled.div.attrs((props) => ({ className: props.className }))`
  display: flex;
  overflow: hidden;
  height: 100vh;
  position: relative;
  width: 100%;
  backface-visibility: hidden;
  will-change: overflow;
  ${({ background_color }) => `background-color:${background_color}`};
`;

const Column = styled.div.attrs((props) => ({ className: props.className }))`
  &::-webkit-scrollbar {
    display: none;
    
  }
  ${'' /* min-width:159px; */}
  overflow: auto;
  height: auto;
  ${({ flex }) => `flex:${flex}`};
  ${({ flexDirection }) => `flex-direction:${flexDirection}`};
  ${({ background_color }) => `background-color:${background_color}`};

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
