import React, { useEffect } from "react";
import { Route, Redirect } from "react-router-dom";

const PrivateRoute = ({
  children,
  fetchProjects,
  isAuthenticated,
  ...rest
}) => {
  useEffect(() => {
    // isAuthenticated || localStorage.getItem("netsuite_id")
    //   ? fetchProjects(localStorage.getItem("netsuite_id"))
    fetchProjects(localStorage.getItem("netsuite_id"));
    //   : null,
    console.log("in here");
  }, []);
  return (
    <Route
      {...rest}
      render={
        ({ location }) =>
          // onFetchData("/api/check_loggedin").then(({ data }) =>
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
