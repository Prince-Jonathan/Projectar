// import React from "react";
import { useMediaQuery } from "react-responsive";
let isDesktop
let isTablet
let isMobile
let isNotMobile 

const Desktop = ({ children }) => {
  isDesktop= useMediaQuery({ minWidth: 992 });
  return isDesktop ? children : null;
};
const Tablet = ({ children }) => {
  isTablet = useMediaQuery({ minWidth: 768, maxWidth: 991 });
  return isTablet ? children : null;
};
const Mobile = ({ children }) => {
  isMobile= useMediaQuery({ maxWidth: 499 });
  return isMobile ? children : null;
};
const Default = ({ children }) => {
  isNotMobile= useMediaQuery({ minWidth: 500 });
  return isNotMobile ? children : null;
};

export { Desktop, Tablet, Mobile, Default, isMobile };
