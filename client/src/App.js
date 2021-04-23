import React, { Component } from 'react';
//import Homescreen 		from './components/homescreen/Homescreen';
import { useQuery } 	from '@apollo/client';
//import * as queries 	from './cache/queries';
import { jsTPS } 		from './utils/jsTPS';
import Navbar          from './components/navbar/Navbar'
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom';
 
class App extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div id="root">
                <Navbar />
            </div>
        );
    }
}

export default App;