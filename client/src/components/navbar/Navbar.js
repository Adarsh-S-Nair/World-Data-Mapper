import React from 'react';
import { LOGOUT } from '../../cache/mutations';
import { useMutation, useApolloClient } from '@apollo/client';
import { Link, useLocation, useHistory } from 'react-router-dom';

const Navbar = (props) => {
    const client = useApolloClient();
    const [Logout] = useMutation(LOGOUT);

    const loggedIn = props.user === null ? false : true;
    const history = useHistory();

    const handleLogout = async (e) => {
        Logout();
        const { data } = await props.fetchUser();
        if (data) {
            window.location.reload();
            //await client.resetStore();
            history.push("/");
            console.log("hi");
        }
    }

    const buttonStyle = {
        color: 'white',
        textDecoration: 'none'
    }

    const location = useLocation();
    let navbarOptions = (
            <div className="navbar-options">
                <Link style={buttonStyle} to='/signup'>
                    <div className="nav-button">Sign Up</div>
                </Link>
                <Link style={buttonStyle} to='/login'>
                    <div className="nav-button">Login</div>
                </Link>
            </div>
    );

    if(loggedIn) {
        if(location.pathname == '/update-account'){
            navbarOptions = (
                <div className="navbar-options">
                    <div className="username">{props.user.name}</div>
                    <Link style={buttonStyle} to='/'>
                        <div onClick={handleLogout} class="nav-button">Logout</div>
                    </Link>
                </div>
            )
        }
        else {
            navbarOptions = (
                <div className="navbar-options">
                    <Link style={buttonStyle} to="/update-account">
                        <div className="nav-button username">{props.user.name}</div>
                    </Link>
                    <Link style={buttonStyle} to='/'>
                        <div onClick={() => {
                            handleLogout();
                            handleLogout();
                        }} className="nav-button">Logout</div>
                    </Link>
                </div>
            )
        }
    }
    else{
        if(location.pathname == '/signup') {
            navbarOptions = (
                <div className="navbar-options">
                    <Link style={buttonStyle} to='/login'>
                        <div class="nav-button">Login</div>
                    </Link>
                </div>
            );
        }
        else if(location.pathname == '/login') {
            navbarOptions = (
                <div className="navbar-options">
                    <Link style={buttonStyle} to='/signup'>
                        <div className="nav-button">Sign Up</div>
                    </Link>
                </div>
            );
        }
    }

    return(
        <div className="navbar">
            <Link style={buttonStyle} to="/">
                <div className="logo">The World Data Mapper</div>
            </Link>
            { navbarOptions }
        </div>
    );
}

export default Navbar;