import React                            from 'react';
import { BrowserRouter, Switch, Route}  from 'react-router-dom';
import { useQuery } 	                from '@apollo/client';
import * as queries 	                from './cache/queries';
import Navbar                           from './components/navbar/Navbar';
import Homescreen                       from './components/homescreen/Homescreen';
import SignUp                           from './components/signup/SignUp';
import Login                            from './components/login/Login';
import UpdateAccount                    from './components/update-account/UpdateAccount';
import Maps                             from './components/maps/Maps';
 
const App = () => {
    let user = null;

    const { loading, error, data, refetch } = useQuery(queries.GET_DB_USER);
    if(error) { console.log(error); }
    if(loading) { console.log(loading); }
    if(data) { user = data.getCurrentUser; }

    return (
        <BrowserRouter>
            <div id="root">
                <Navbar user={user} fetchUser={refetch}/>
                <Switch>
                    <Route path="/" exact component={() => {
                        if(user == null) { return <Homescreen />}
                        return <Maps user={user} refetch={refetch}/>
                    }}/>
                    <Route path="/signup" render={() => <SignUp />} />
                    <Route path="/login" render={() => <Login fetchUser={refetch} />} />
                    <Route path="/update-account" render={() => <UpdateAccount user={user} fetchUser={refetch} />} />
                </Switch>
            </div>
        </BrowserRouter>
    );
}

export default App;