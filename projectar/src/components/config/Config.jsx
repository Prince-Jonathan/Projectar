import React from "react";
import { Switch, Route, useRouteMatch, useHistory } from "react-router-dom";

import Button from "../content/uiElements/Button";
import Input from "../content/uiElements/Input";

const Config = (props) => {
  const { url } = useRouteMatch();
  const history = useHistory();
  return (
    <div>
      <Switch>
        <Route path={`${url}`}>
          <div
            style={{
              padding: 5,
              color: "#10292e",
              borderRadius: 5,
              backgroundColor: "#adb7a9c2",
              minWidth: "min-content",
              margin: "2vh",
            }}
          >
            <div className="header">
              <strong>Configuration</strong>
              <div>
                {" "}
                <Button
                  onClick={() => history.push("/", { sendAnnouncement: true })}
                >
                  <i
                    style={{ color: "#ffee00", marginRight: 5 }}
                    className="fa fa-plus"
                    aria-hidden="true"
                  />
                  Save
                </Button>
                <Button
                  type="button"
                  backgroundColor="red"
                  onClick={() => history.goBack()}
                >
                  Close
                </Button>
              </div>
            </div>
            Announcement Lifespan
            <Input />
          </div>
        </Route>
      </Switch>
    </div>
  );
};

export default Config;
