import React, { useState } from 'react';
import MapsList from './MapsList';
import { useMutation, useQuery } 		from '@apollo/client';
import * as mutations 					from '../../cache/mutations';
import { GET_DB_MAPS } 				from '../../cache/queries';

const Maps = (props) => {
    let maps = [];
    const [activeMap, setActiveMap] = useState({});

    const [AddMap] = useMutation(mutations.ADD_MAP);

    const { loading, error, data, refetch } = useQuery(GET_DB_MAPS);
    if(error) { console.log(error, 'error'); }
    if(data) { maps = data.getAllMaps; }

    const refetchMaps = async (refetch) => {
        const { loading, error, data } = await refetch();
        if (data) {
            maps = data.getAllMaps;
            if(activeMap._id) { 
                let tempId = activeMap._id;
                let map = maps.find(map => map._id === tempId);
                setActiveMap(map);
            }
        }
    }

    const createNewMap = async () => {
        let map = {
            _id: '',
            name: 'Untitled',
            owner: props.user._id,
            root: {_id: '', name: 'Untitled'},
        }
        const { data } = await AddMap({ variables: { map: map }, refetchQueries: [{ query: GET_DB_MAPS }]});
        await refetchMaps(refetch);
        if(data) {
            let _id = data.addTodolist;
            handleSetActive(_id);
        }
    }

    const handleSetActive = (_id) => {
        const map = maps.find(map => map._id === _id);
        setActiveMap(map);
    }
    
    return (
        <div className="card maps-card">
            <h1>Your Maps</h1>
            <div className="maps-contents">
                <MapsList />
                <input onClick={createNewMap} className="form-button submit-button create-new-map-button" type="submit" value="CREATE NEW MAP"></input>
            </div>
        </div>
    );
}

export default Maps;