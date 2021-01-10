import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Link } from 'react-router-dom';

const HomePage = props => {
    const {
        currentUser,
        logoutUser
    } = useAuth();

    return (
        <div>
            <h1>Workout Tracker!</h1>
            <Link to='/private'>Private, Keep Out!</Link>
            <Link className='btn btn-primary' to='/buildprogram'>Build Program</Link>
            { currentUser.user === undefined ? (
                <Link className='btn btn-primary' to='/login'>
                    Log In
                </Link>
            ) : (
                <div>
                    <h3>Welcome, {currentUser.user?.email}</h3>
                    <button onClick={logoutUser}>Log out</button>
                </div>
            )}
        </div>
    );
};

export default HomePage;
