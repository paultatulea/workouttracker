import React from "react";
import { Route, Redirect } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export default function PrivateRoute({ component: Component, ...rest }) {
  const { isInitialised, isAuthenticated } = useAuth();

  return (
    <Route
      {...rest}
      render={(props) =>
        isAuthenticated ? (
          <Component {...props} />
        ) : !isInitialised ? (
          ""
        ) : (
          <Redirect
            to={{
              pathname: "/login",
              state: { referrer: props.location },
            }}
          />
        )
      }
    />
  );
}
