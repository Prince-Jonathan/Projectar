import React from "react";
import SideMenu from "react-sidemenu";
import items from "./menuList";

// default react-sidemenu styling
import "./side-menu.css";
// customized react-sidemenu styling
import "./Side-menu-custom.css";

const Aside = (props) => {
  return (
    <div>
      <SideMenu items={items} />
    </div>
  );
};
export default Aside;
