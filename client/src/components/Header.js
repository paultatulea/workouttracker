import React from 'react'
import '../style/Header.css';
import HeaderOption from './HeaderOption';
import HomeIcon from '@material-ui/icons/Home';
import AssignmentIcon from '@material-ui/icons/Assignment';
import SettingsIcon from '@material-ui/icons/Settings';
import { useAuth } from '../contexts/AuthContext';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import { useHistory } from 'react-router-dom';
import MeetingRoomIcon from '@material-ui/icons/MeetingRoom';
import BookIcon from '@material-ui/icons/Book';

function Header() {
    const { isAuthenticated, logoutUser } = useAuth();
    let history = useHistory();

    return (
        <div className='header'>
            <div className='header__right'>
                <HeaderOption Icon={HomeIcon} title='Home' onClick={() => history.push('/')} />
                <HeaderOption Icon={AssignmentIcon} title='Programs' onClick={() => history.push('/programs')}/>
                <HeaderOption Icon={BookIcon} title='Workout Log' />
                <HeaderOption Icon={SettingsIcon} title='Settings' />
                {isAuthenticated ? (
                    <HeaderOption Icon={ExitToAppIcon} title='Logout' onClick={logoutUser} />
                ) : (
                    <HeaderOption Icon={MeetingRoomIcon} title='Login' onClick={() => history.push('/login')} />
                )}
            </div>
        </div>
    )
}

export default Header
