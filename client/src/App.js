import React, { Component } from 'react';
import { useQuery } 	from '@apollo/client';
import * as queries 	from './cache/queries';
import { jsTPS } 		from './utils/jsTPS';
import Navbar          from './components/navbar/Navbar';
import Homescreen       from './components/homescreen/Homescreen';
import SignUp from './components/signup/SignUp';
import Login from './components/login/Login';
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom';
import UpdateAccount from './components/update-account/UpdateAccount';
 
const App = () => {
    let user = null;

    const { loading, error, data, refetch } = useQuery(queries.GET_DB_USER);
    if(error) { console.log(error); }
    if(loading) { console.log(loading); }
    if(data) {
        let { getCurrentUser } = data;
        if(getCurrentUser !== null) { 
            user = getCurrentUser;
            console.log(user);
        }
    }

    return (
        <BrowserRouter>
            <div id="root">
                <Navbar user={user} fetchUser={refetch}/>
                <Switch>
                    <Route path="/" exact component={Homescreen} />
                    <Route path="/signup" render={() => <SignUp />} />
                    <Route path="/login" render={() => <Login fetchUser={refetch} />} />
                    <Route path="/update-account" render={() => <UpdateAccount user={user} fetchUser={refetch} />} />
                </Switch>
            </div>
        </BrowserRouter>
    );
}

export default App;