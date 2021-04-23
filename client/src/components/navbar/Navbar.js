import React, { Component } from 'react';

export default class Navbar extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return(
            <div class="navbar">
                <div className="logo">The World Data Mapper</div>
                <div className="navbar-options">
                    <div class="nav-button">Sign Up</div>
                    <div class="nav-button">Login</div>
                </div>
            </div>
        );
    }
}