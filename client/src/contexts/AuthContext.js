import React, { useState, useContext, useEffect } from "react";
import { createUser, authenticateUser, validateAuthToken } from "../api/api";

export const AuthContext = React.createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState({
    token: undefined,
    user: undefined,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isInitialised, setIsInitialised] = useState(false);

  useEffect(() => {
    const checkLoggedIn = async () => {
      const token = localStorage.getItem("auth-token");
      if (token === null) {
        // Exit out if not specified
        // Ensure state is updated before returning early
        setIsInitialised(true);
        setIsLoading(false);
        return;
      }
      const tokenRes = await validateAuthToken(token);
      if (tokenRes.result === "success") {
        setCurrentUser({
          token: token,
          user: tokenRes.userData,
        });
        setIsAuthenticated(true);
      }
      // Update state
      setIsInitialised(true);
      setIsLoading(false);
    };
    checkLoggedIn();
  }, []);

  async function loginUser(email, password) {
    setIsLoading(true);
    const userDataRes = await authenticateUser(email, password);
    localStorage.setItem("auth-token", userDataRes.token);
    setCurrentUser(userDataRes);
    setIsLoading(false);
    setIsAuthenticated(true);
  }

  function signupUser(email, password) {
    return createUser(email, password);
  }

  function logoutUser() {
    // Clear localstorage of token
    localStorage.removeItem("auth-token");
    // Update userData
    setCurrentUser({
      token: undefined,
      user: undefined,
    });
    setIsAuthenticated(false);
  }

  const value = {
    currentUser,
    setCurrentUser,
    loginUser,
    signupUser,
    logoutUser,
    isLoading,
    isAuthenticated,
    isInitialised,
  };

  return (
    <AuthContext.Provider value={value}>
      {isLoading ? <h1>Loading...</h1> : children}
    </AuthContext.Provider>
  );
}
