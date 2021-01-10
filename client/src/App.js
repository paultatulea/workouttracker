import 'bootstrap/dist/css/bootstrap.min.css';
import React from 'react';
import { Route, Switch } from 'react-router-dom';
import HomePage from "./components/HomePage";
import NotFoundPage from "./components/NotFoundPage";
import LoginForm from "./components/LoginForm";
import Signup from "./components/Signup";
import BuildProgram from "./components/BuildProgram";
import { AuthProvider } from './contexts/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import ProtectedPage from './components/ProtectedPage';


const App = () => {

    return (
        <AuthProvider>
            <div className="container">
                <Switch>
                    <Route path='/' exact component={HomePage} />
                    <Route path='/login' component={LoginForm} />
                    <Route path='/signup' component={Signup} />
                    <PrivateRoute path='/buildprogram' component={BuildProgram} />
                    <PrivateRoute path='/private' component={ProtectedPage} />
                    <Route component={NotFoundPage} />
                </Switch>
            </div>
        </AuthProvider>
    );
};

export default App;
