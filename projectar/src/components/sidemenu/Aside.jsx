import React, { Component } from "react";
import SideMenu from "react-sidemenu";
import items from "./menuList";
import "./side-menu.css";

class Aside extends Component {
  render() {
    return (
      <div>
        <SideMenu items={items} />
      </div>
    );
  }
}
export default Aside;
