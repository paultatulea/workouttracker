import "bootstrap/dist/css/bootstrap.min.css";
import React from "react";
import { Route, Switch } from "react-router-dom";
import Header from './components/Header';
import HomePage from "./components/HomePage";
import NotFoundPage from "./components/NotFoundPage";
import LoginForm from "./components/LoginForm";
import Signup from "./components/Signup";
import BuildProgram from "./components/BuildProgram";
import { AuthProvider } from "./contexts/AuthContext";
import PrivateRoute from "./components/PrivateRoute";
import Programs from './components/Programs';
import ProgramPage from './components/ProgramPage';

const App = () => {
  return (
    <AuthProvider>
      <Header />
      <Switch>
        <Route path="/" exact component={HomePage} />
        <Route path="/login" component={LoginForm} />
        <Route path="/signup" component={Signup} />
        <PrivateRoute path='/programs/:id' component={ProgramPage} />
        <PrivateRoute path='/programs' component={Programs} />
        <PrivateRoute path="/buildprogram" component={BuildProgram} />
        <Route component={NotFoundPage} />
      </Switch>
    </AuthProvider>
  );
};

export default App;
