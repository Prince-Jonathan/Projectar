import React from "react";
import { Row, Column } from "../Grid";
import "./Slate.css";

const Slate = (props) => {
  return (
    <div>
      <Row className="slate">
        <Column>
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Eaque
          cupiditate aliquid illum blanditiis aspernatur dicta officiis ducimus.
          Sed repellat ad, esse possimus officia nesciunt deleniti perferendis,
          dolorum quidem autem vel.
        </Column>
      </Row>
    </div>
  );
};

export default Slate;
