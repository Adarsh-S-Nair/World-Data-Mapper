import React, { Component } from 'react';

export default class Homescreen extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return(
            <div className="homescreen">
                <div className="welcome-message">The World Data Mapper</div>
                <img className="map" src="/imgs/globe.png"/>
            </div>
        )
    }
}