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
            <Toolbar
              onClick={props.onShowSideMenu}
              onFetchData={props.onFetchData}
              onAlert={props.onAlert}
              logo={props.logo}
              onSync={props.onSync}
            />
          </Column>
          <Column className={asideClass.join(" ")} backgroundColor={bgcolor}>
            {props.aside}
          </Column>
          <Column scroll xs="2" sm="3" md="4" lg="5" className="section">
            <Row justifyContent="space-evenly">
              <Column>
                <Route exact path="/">
                  <Greeting
                    name={JSON.parse(localStorage.getItem("netsuite")) && JSON.parse(localStorage.getItem("netsuite")).name}
                  />
                </Route>
                {props.children}
                <Route path="/">
                  <Wall
                    name={JSON.parse(localStorage.getItem("netsuite")) && JSON.parse(localStorage.getItem("netsuite")).name}
                  />
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
            <Toolbar
              onSync={props.onSync}
              onClick={props.onShowSideMenu}
              logo={props.logo}
              onFetchData={props.onFetchData}
            />
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
                  <Greeting
                    name={JSON.parse(localStorage.getItem("netsuite")) && JSON.parse(localStorage.getItem("netsuite")).name}
                  />
                </Route>
                {props.children}
                <Wall
                  name={JSON.parse(localStorage.getItem("netsuite")) && JSON.parse(localStorage.getItem("netsuite")).name}
                />
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
