import React from "react";
import { Route } from "react-router-dom";

import { Default, Mobile } from "../Responsive";
import { Row, Column } from "../Grid";
import Wall from "../content/Wall";
import Greeting from "../content/Greeting";
import Toolbar from "../toolbar/Toolbar";
import BackDrop from "../backdrop/Backdrop";

import "./Layout.css";

const Layout = (props) => {
  const bgcolor = "#10292E";
  let asideClass = ["drawer", "aside"];
  if (props.showSideMenu) {
    asideClass.push("open");
  }
  let backdrop = props.showSideMenu ? (
    <BackDrop onClick={props.onShowSideMenu} />
  ) : null;
  return (
    <div>
      <Default>
        <Row flexDirection="column" backgroundColor={bgcolor}>
          <Column>
            <Toolbar onClick={props.onShowSideMenu} />
          </Column>
          <Column className={asideClass.join(" ")} backgroundColor={bgcolor}>
            {props.aside}
          </Column>
          <Column xs="2" sm="3" md="4" lg="5" className="section">
            <Row justifyContent="space-evenly">
              <Column>
                <Route exact path="/">
                  <Greeting name={props.name} />
                </Route>
                {props.children}
                <Route path="/">
                  <Wall name={props.name} />
                </Route>
              </Column>
            </Row>
          </Column>
          {backdrop}
        </Row>
      </Default>
      <Mobile>
        <Row flexDirection="column" backgroundColor={bgcolor}>
          <Column>
            <Toolbar onClick={props.onShowSideMenu} />
          </Column>
          <Column>
            <Row justifyContent="space-evenly">
              <Column
                className={asideClass.join(" ")}
                backgroundColor={bgcolor}
              >
                {props.aside}
              </Column>
              <Column className="section pad">
                <Route exact path="/">
                  <Greeting name={props.name} />
                </Route>
                {props.children}
                <Wall name={props.name} />
              </Column>
            </Row>
          </Column>
          {backdrop}
        </Row>
      </Mobile>
    </div>
  );
};

export default Layout;
