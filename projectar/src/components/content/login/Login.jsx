import React, { useState, useEffect } from "react";
import { useHistory, useLocation } from "react-router-dom";
import { SimpleLoginForm } from "simple-login-form";
import CryptoJS from "crypto-js";

import "./Login.css";
import enc_dec from "../../../enc_dec";

const Login = (props) => {
  const [user, setUser] = useState({});
  const history = useHistory();
  let location = useLocation();

  let { from } = location.state || { from: { pathname: "/" } };
  let login = (user) => {
    props.authenticate(user);
    props.fetchProjects(user.user_id);
    props.fetchPersonnelTasks(user.user_id);
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
    if (userInfo.username === "" || userInfo.password === "") {
      props.onAlert("error", "Both Fields Required", {
        timeout: 3000,
        position: "bottom center",
      });
    } else {
      props
        .postData("/api/authenticate", userInfo)
        .then(({ data }) => {
          if (data.success) {
            //expecting obj
            // login(data.message[0]);
            localStorage.setItem(
              "netsuite",
              JSON.stringify({
                id: data.data.user_id,
                name: data.data.name,
                role: data.data.role,
              })
            );
            // let x = JSON.stringify({
            //   id: data.data.user_id,
            //   name: data.data.name,
            //   role: data.data.role,
            // });
            // let y = CryptoJS.AES.encrypt(x, "Secret Passphrase").toString();
            // let z = CryptoJS.AES.decrypt(y, "Secret Passphrase").toString(
            //   CryptoJS.enc.Utf8
            // );
            // console.log(x, y, z);
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
    }
  };
  return (
    <div>
      <SimpleLoginForm
        getUserInfo={sendUserInfoToDatabase}
        style={formStyle}
        photoIcon={props.logo}
      />
    </div>
  );
};

export default Login;
