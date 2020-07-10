import React, { useState, useEffect } from "react";
import { Route } from "react-router-dom";

import { Default, Mobile } from "../Responsive";
import { Row, Column } from "../Grid";
import Wall from "../content/Wall";
import Toolbar from "../toolbar/Toolbar";
import BackDrop from "../backdrop/Backdrop";

import "./Layout.css";

const Layout = (props) => {
  const [user, setUser] = useState({ name: "" });
  useEffect(() => {
    async function fetchData() {
      let data = await props.fetchData();
      setUser(data);
    }
    fetchData();
  }, []);
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
        <Row backgroundColor={bgcolor}>
          <Column className="aside" backgroundColor={bgcolor}>
            {props.aside}
          </Column>
          <Column xs="2" sm="3" md="4" lg="5" className="section">
            <Row justifyContent="space-evenly">
              <Column>
                {props.children}
                <Route exact path="/">
                  <Wall name={user.name} />
                </Route>
              </Column>
            </Row>
          </Column>
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
                {props.children}
                <Wall name={user.name} />
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
