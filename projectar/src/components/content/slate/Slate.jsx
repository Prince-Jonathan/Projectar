import React from "react";
import { Row, Column } from "../../Grid";
import "./Slate.css";

const Slate = (props) => {
  return (
    <div>
      <Row slate className="slate">
        <Column scroll style={{ alignSelf: "center" }}>
          {props.children}
        </Column>
      </Row>
    </div>
  );
};

export default Slate;
