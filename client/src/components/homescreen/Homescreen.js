import React, { Component } from 'react';
import { BrowserRouter, Switch, Route, Redirect}    from 'react-router-dom';

const Homescreen = (props) => {

    return(
        <div className="homescreen">
            <div className="welcome-message">The World Data Mapper</div>
            <img className="map" src="/imgs/globe.png"/>
        </div>
    )
}

export default Homescreen;