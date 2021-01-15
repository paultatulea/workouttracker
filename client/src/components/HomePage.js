import React from 'react';
import { useAuth } from '../contexts/AuthContext';

const HomePage = props => {
    const {
        isAuthenticated,
        currentUser
    } = useAuth();

    return (
        <div>
            <h1>Workout Tracker!</h1>
            {isAuthenticated && <p>{`Welcome, ${currentUser.user.email}!`}</p>}
        </div>
    );
};

export default HomePage;
