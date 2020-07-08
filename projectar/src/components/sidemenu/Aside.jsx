import React from "react";
import { useHistory } from "react-router-dom";
import SideMenu from "react-sidemenu";
import items from "./menuList";

// default react-sidemenu styling
import "./side-menu.css";
// customized react-sidemenu styling
import "./Side-menu-custom.css";

const Aside = (props) => {
  let history = useHistory();
  return (
    <div>
      <SideMenu
        key={items.length}
        items={items}
        onMenuItemClick={(value, extras) => (history.push(`/${value}`))}
      />
    </div>
  );
};
export default Aside;
