import React, { useState } from "react";
import { Link, useHistory } from "react-router-dom";

import DrawerToggleButton from "./button/DrawerToggleButton";

import "./Toolbar.css";

const Toolbar = (props) => {
  const history = useHistory();

  const [syncing, setSyncing] = useState(false);

  const OneSignal = window.OneSignal;

  return (
    <div className="toolbar">
      <div className="button">
        <DrawerToggleButton onClick={props.onClick} />
      </div>
      <div className="Logo">
        <img
          onClick={() => history.push("/")}
          src={props.logo}
          alt="Client Logo"
          width="50"
          height="50"
          style={{ cursor: "pointer" }}
        />
      </div>
      <div className="right">
        <div
          style={{
            marginRight: 10.5,
            cursor: "pointer",
            textDecoration: "none",
            color: "black",
          }}
          disabled={true}
          onClick={props.onSync}
        >
          <i
            className="fa fa-refresh fa-fw"
            aria-hidden="true"
            style={{ color: "green" }}
          />
          Sync
        </div>
        <div
          onClick={() =>
            OneSignal.push(function() {
              OneSignal.removeExternalUserId();
            })
          }
        >
          <Link to="/login" style={{ color: "black", textDecoration: "none" }}>
            <i className="fa fa-user-o fa-fw" aria-hidden="true" />
            Logout
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Toolbar;
