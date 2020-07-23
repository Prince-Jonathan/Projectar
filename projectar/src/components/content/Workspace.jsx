import React from "react";
import { Switch } from "react-router-dom";

import Slate from "./slate/Slate";

const Workspace = () => {
  return (
    <Switch>
        <Slate>
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Eaque
          cupiditate aliquid illum blanditiis aspernatur dicta officiis ducimus.
          Sed repellat ad, esse possimus officia nesciunt deleniti perferendis,
          dolorum quidem autem vel.Lorem ipsum dolor sit amet, consectetur
          adipisicing elit. Eaque cupiditate aliquid illum blanditiis aspernatur
          dicta officiis ducimus. Sed repellat ad, esse possimus officia
          nesciunt deleniti perferendis, dolorum quidem autem vel.
          <hr />
          <div>
            <strong>The User Workspace</strong>
          </div>
        </Slate>
    </Switch>
  );
};

export default Workspace;
