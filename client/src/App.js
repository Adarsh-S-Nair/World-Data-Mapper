import React, { useState, useEffect }               from 'react';
import { BrowserRouter, Switch, Route, Redirect}    from 'react-router-dom';
import { useQuery } 	                            from '@apollo/client';
import * as queries 	                            from './cache/queries';

import { jsTPS }                                    from './utils/jsTPS';

import Navbar                                       from './components/navbar/Navbar';
import Homescreen                                   from './components/homescreen/Homescreen';
import SignUp                                       from './components/signup/SignUp';
import Login                                        from './components/login/Login';
import UpdateAccount                                from './components/update-account/UpdateAccount';
import Maps                                         from './components/maps/Maps';
import RegionSpreadsheet                            from './components/region-spreadsheet/RegionSpreadsheet';
import RegionViewer                                 from './components/region-viewer/RegionViewer';
 
const App = () => {
    let user = null;
    let tps = new jsTPS();

    const { loading, error, data, refetch } = useQuery(queries.GET_DB_USER);
    if(error) { console.log(error); }
    if(loading) { console.log(loading); }
    if(data) { user = data.getCurrentUser; }

    return (
        <BrowserRouter>
            <div id="root">
                <Navbar tps={tps} user={user} fetchUser={refetch}/>
                <Switch>
                    <Route path="/" exact render={() => {
                        if(user == null) { return <Homescreen />}
                        return <Maps user={user} />
                    }}/>
                    <Route path="/signup" render={() => <SignUp />} />
                    <Route path="/login" render={() => <Login fetchUser={refetch} />} />
                    <Route path="/update-account" render={() => <UpdateAccount user={user} fetchUser={refetch} />} />
                    <Route path="/spreadsheet/:id" render={() => <RegionSpreadsheet tps={tps} />} />
                    <Route path="/viewer/:id" render={() => <RegionViewer tps={tps} />} />
                </Switch>
            </div>
        </BrowserRouter>
    );
}

export default App;