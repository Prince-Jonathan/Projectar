import React from "react";
import { Row, Column } from "../../Grid";
import "./Slate.css";

const Slate = (props) => {
  return (
    <div>
      <Row className="slate" slate>
        <Column scroll>{props.children}</Column>
      </Row>
    </div>
  );
};

export default Slate;
