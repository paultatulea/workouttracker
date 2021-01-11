import React, { useState } from "react";
import useFormValidation from "../useFormValidation";
import { Link, Redirect } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const INITIAL_STATE = { email: "", password: "" };

function validateAuth(values) {
  let errors = {};

  // Email errors
  if (!values.email) {
    errors.email = "Email address required";
  } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
    errors.email = "Invalid email address";
  }
  // Password errors
  if (!values.password) {
    errors.password = "Password required";
  } else if (values.password.length < 8) {
    errors.password = "Password must be at least 8 characters";
  }
  return errors;
}

export default function LoginForm(props) {
  const {
    values,
    errors,
    isSubmitting,
    handleChange,
    handleBlur,
    handleSubmit,
  } = useFormValidation(INITIAL_STATE, validateAuth, authenticateUser);
  const [serverError, setServerError] = useState("");
  const { loginUser, isAuthenticated } = useAuth();
  let referrer = props.location.state?.referrer || "/";

  function authenticateUser() {
    const { email, password } = values;
    try {
      loginUser(email, password);
    } catch (err) {
      setServerError("Email or password is incorrect");
    }
  }

  if (isAuthenticated) {
    return <Redirect to={referrer} />;
  }

  return (
    <>
      <h2>Login to WorkoutTracker</h2>
      <form onSubmit={handleSubmit}>
        {serverError && <div className="alert alert-danger">{serverError}</div>}
        <div className="form-group">
          <label>Email Address</label>
          <input
            className={`form-control${errors.email ? " is-invalid" : ""}`}
            name="email"
            placeholder="Email"
            onChange={handleChange}
            value={values.email}
          />
          {errors.email && (
            <div className="invalid-feedback">{errors.email}</div>
          )}
        </div>
        <div className="form-group">
          <label>Password</label>
          <input
            className={`form-control${errors.password ? " is-invalid" : ""}`}
            name="password"
            type="password"
            placeholder="Password"
            onChange={handleChange}
            value={values.password}
          />
          {errors.password && (
            <div className="invalid-feedback">{errors.password}</div>
          )}
        </div>
        <button
          type="submit"
          className="btn btn-primary"
          disabled={isSubmitting}
        >
          Log In
        </button>
      </form>
      <div className="w-100 text-center mt-2">
        <Link to="/signup">Sign up for WorkoutTracker</Link>
      </div>
    </>
  );
}
