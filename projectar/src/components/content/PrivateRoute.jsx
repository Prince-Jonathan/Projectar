import React, { useEffect } from "react";
import { Route, Redirect } from "react-router-dom";

const PrivateRoute = ({
  children,
  fetchProjects,
  isAuthenticated,
  ...rest
}) => {
  useEffect(() => {
    if (localStorage.getItem("netsuite")) {
      fetchProjects &&
        fetchProjects(
          JSON.parse(localStorage.getItem("netsuite")) &&
            JSON.parse(localStorage.getItem("netsuite")).id
        );
    }
  }, []);
  return (
    <Route
      {...rest}
      render={({ location }) =>
        isAuthenticated ||
        (JSON.parse(localStorage.getItem("netsuite")) &&
          JSON.parse(localStorage.getItem("netsuite")).id) ? (
          children
        ) : (
          <Redirect
            to={{
              pathname: "/login",
              state: { from: location.pathname },
            }}
          />
        )
      }
    />
  );
};

export default PrivateRoute;
