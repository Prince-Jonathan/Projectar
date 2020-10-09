import React, { useEffect } from "react";
import { Route, Redirect } from "react-router-dom";

const PrivateRoute = ({
  children,
  fetchProjects,
  isAuthenticated,
  ...rest
}) => {
  useEffect(() => {
    fetchProjects(localStorage.getItem("netsuite_id"));
  }, []);
  return (
    <Route
      {...rest}
      render={
        ({ location }) =>
          isAuthenticated || localStorage.getItem("netsuite_id") ? (
            children
          ) : (
            <Redirect
              to={{
                pathname: "/login",
                state: { from: location.pathname },
              }}
            />
          )
        // )
      }
    />
  );
};

export default PrivateRoute;
