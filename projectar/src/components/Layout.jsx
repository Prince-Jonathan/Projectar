import React from "react";
import { Default, Mobile } from "./Responsive";
import { Row, Column } from "./Grid";
import Wall from "./Wall";
import Toolbar from "./toolbar/Toolbar";
import BackDrop from "./backdrop/Backdrop";

const Layout = (props) => {
  const bgcolor = "#10292E";
  let asideClass = ["drawer", "aside"];
  if (props.showSideMenu) {
    asideClass.push("open");
  }
  return (
    <div>
      <Default>
        <Row background_color={bgcolor} className="main">
          <Column background_color={bgcolor}>
            {/* <Aside /> */}
            {props.aside}
          </Column>
          <Column xs="2" sm="3" md="4" lg="5" className="section">
            <Row flex_direction="column" justify_content="space-evenly">
              {/* <div>How's </div>
              <div>the </div>
              <div>projection</div>
              <div>from</div> */}
              {props.children}
              <Wall name={props.name} />
            </Row>
          </Column>
        </Row>
      </Default>
      <Mobile>
        <Row
          flex_direction="column"
          background_color={bgcolor}
          className="main"
        >
          <Column>
            <Toolbar onClick={props.onShowSideMenu} />
          </Column>
          <Row
            flex_direction="column"
            justify_content="space-evenly"
            className="section"
          >
            <Column className={asideClass.join(" ")} background_color={bgcolor}>
              {/* <Aside /> */}
              {props.aside}
            </Column>

            {/* <div>project</div>
            <div>your</div>
            <div>outcome </div>
            <div>with</div> */}
            {props.children}
            <Wall name={props.name} />
          </Row>
          {props.showSideMenu ? (
            <BackDrop onClick={props.onShowSideMenu} />
          ) : null}
        </Row>
      </Mobile>
    </div>
  );
};

export default Layout;
