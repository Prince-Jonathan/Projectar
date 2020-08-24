import React, { useState, useEffect } from "react";
import { useHistory, useLocation } from "react-router-dom";
import { SimpleLoginForm } from "simple-login-form";

import "simple-login-form/dist/index.css";

const Login = (props) => {
  const [user, setUser] = useState({});
  const history = useHistory();
  let location = useLocation();

  let { from } = location.state || { from: { pathname: "/" } };
  let login = (user) => {
    props.authenticate(user);
    history.replace(from);
  };

  const formStyle = {
    maxWidth: "350px",
    maxHeight: "525px",
    background: "linear-gradient(#10292e, #10292e)",
    borderRadius: "2%",
  };
  const sendUserInfoToDatabase = (userInfo, event) => {
    event.preventDefault();

    props
      .postData("/api/login", userInfo)
      .then(({ data }) => {
        if (data.success) {
          login(data.data);
        } else {
          throw "Incorrect credentials";
        }
      })
      .catch((e) =>
        props.onAlert("error", e, {
          timeout: 3000,
          position: "bottom center",
        })
      );
  };
  return (
    <React.Fragment>
      <SimpleLoginForm
        getUserInfo={sendUserInfoToDatabase}
        style={formStyle}
        // photoIcon={}
      />
    </React.Fragment>
  );
};

export default Login;
