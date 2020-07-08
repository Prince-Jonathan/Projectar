import React from "react";
import { Default, Mobile } from "../Responsive";
import { Row, Column } from "../Grid";
import Wall from "../Wall";
import Toolbar from "../toolbar/Toolbar";
import BackDrop from "../backdrop/Backdrop";

import "./Layout.css";

const Layout = (props) => {
  const bgcolor = "#10292E";
  let asideClass = ["drawer", "aside"];
  if (props.showSideMenu) {
    asideClass.push("open");
  }
  return (
    <div>
      <Default>
        <Row backgroundColor={bgcolor}>
          <Column className="aside" backgroundColor={bgcolor}>
            {props.aside}
          </Column>
          <Column xs="2" sm="3" md="4" lg="5" className="section">
            <Row
              flexWrap="wrap"
              justifyContent="space-evenly"
              alignItems="center"
              overflow="auto"
              className="pad"
            >
              {props.children}
              {/* <Wall name={props.name} /> */}
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
            <Row
              flexWrap="wrap"
              justifyContent="space-evenly"
              alignItems="center"
              overflow="auto"
              className="section pad"

            >
              <Column
                className={asideClass.join(" ")}
                backgroundColor={bgcolor}
              >
                {props.aside}
              </Column>

              {props.children}
              <Wall name={props.name} />
            </Row>
          </Column>
          {props.showSideMenu ? (
            <BackDrop onClick={props.onShowSideMenu} />
          ) : null}
        </Row>
      </Mobile>
    </div>
  );
};

export default Layout;
