import React, { useState, useEffect } from 'react';
import { LOGOUT } from '../../cache/mutations';
import { useQuery, useMutation, useApolloClient } from '@apollo/client';
import { Link, useLocation, useHistory } from 'react-router-dom';
import { GET_DB_MAPS } 				from '../../cache/queries';


const Navbar = (props) => {
    const client = useApolloClient();
    const [Logout] = useMutation(LOGOUT);

    let maps = [];

    const [path, setPath] = useState([]);
    const [map, setMap] = useState({});
    const [regions, setRegions] = useState([]);
    const [region, setRegion] = useState({});
    const [parentName, setParentName] = useState('');
    const [regionCapital, setRegionCapital] = useState('');
    const [regionLeader, setRegionLeader] = useState('');
    const [subRegionsLength, setSubregionsLength] = useState('');
    const [parentId, setParentId] = useState('');
    const [landmarks, setLandmarks] = useState([]);

    const { loading, error, data, refetch } = useQuery(GET_DB_MAPS);
	if(data) { maps = data.getAllMaps; }

    useEffect(() => {
        refetchMaps(refetch);
    }, [maps]);

    const refetchMaps = async (refetch) => {
        const { loading, error, data } = await refetch();
        if (data) {
            let url = window.location.href;
            const regionId = url.substring(url.lastIndexOf('/') + 1);
            url = url.substr(0, url.lastIndexOf("/"));
            const mapId = url.substring(url.lastIndexOf('/') + 1);
            maps = data.getAllMaps;
            let regions = maps.find((map) => map._id == mapId).subregions;
            setMap(maps.find((map) => map._id == mapId));
            setRegion(regions.find((region) => region._id == regionId));
            setRegions(regions.filter(region => region.parent == regionId));
            setRegions(regions);

            let tempPath = []
            let current = regions.find((region) => region._id == regionId);
            while(current.parent != '') {
                tempPath.push([current.name, current._id]);
                current = regions.find((region) => region._id == current.parent);
            }
            tempPath.push([current.name, current._id]);
            tempPath.reverse();
            setPath(tempPath);

            let region = regions.find((region => region._id == regionId));
            let subregions = regions.filter((r) => r.parent == regionId);
            let parent = regions.find((r) => r._id == region.parent);
            setParentName(parent.name);
            setRegionCapital(region.capital);
            setRegionLeader(region.leader);
            setSubregionsLength(subregions.length);
            setParentId(parent._id);
            setLandmarks(region.landmarks);
        }
    }

    const loggedIn = props.user === null ? false : true;
    const history = useHistory();

    const handleLogout = async (e) => {
        Logout();
        const { data } = await props.fetchUser();
        if (data) {
            window.location.reload();
            //await client.resetStore();
            props.tps.clearAllTransactions();
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
                        <div onClick={() => {props.tps.clearAllTransactions()}}className="nav-button username">{props.user.name}</div>
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
                <div onClick={() => {props.tps.clearAllTransactions()}}className="logo">The World Data Mapper</div>
            </Link>
            { navbarOptions }
        </div>
    );
}

export default Navbar;