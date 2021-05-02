import React, { useState, useEffect } from 'react';
import MapsList from './MapsList';
import { useMutation, useQuery } 		from '@apollo/client';
import * as mutations 					from '../../cache/mutations';
import { GET_DB_MAPS } 				from '../../cache/queries';
import NameMapModal from '../modals/NameMapModal';
import RenameMapModal from '../modals/RenameMapModal';
import DeleteMapModal from '../modals/DeleteMapModal';

const Maps = (props) => {
    let maps = [];
    
    const [map, setMap] = useState({});
    const [showNameMap, toggleShowNameMap] = useState(false);
    const [showRenameMap, toggleShowRenameMap] = useState(false);
    const [showDeleteMap, toggleShowDeleteMap] = useState(false);

    const [AddMap] = useMutation(mutations.ADD_MAP);
    const [RenameMap] = useMutation(mutations.RENAME_MAP);
    const [DeleteMap] = useMutation(mutations.DELETE_MAP);
    const [MoveMapToTop] = useMutation(mutations.MOVE_MAP_TO_TOP);

    const { loading, error, data, refetch } = useQuery(GET_DB_MAPS);
	if(loading) { console.log(loading, 'loading'); }
	if(error) { console.log(error, 'error'); }
	if(data) { maps = data.getAllMaps; }

    useEffect(() => {
        refetchMaps(refetch);
    }, [maps])

    const refetchMaps = async (refetch) => {
        const { loading, error, data } = await refetch();
        if (data) {
            maps = data.getAllMaps;
        }
    }

    const createNewMap = async (name) => {
        let map = {
            _id: '',
            name: name,
            owner: props.user._id,
            subregions: []
        }
        const { data }= await AddMap({ variables: { map: map }, refetchQueries: [{ query: GET_DB_MAPS }]});
        moveMapToTop(data.addMap, props.user._id);
        await refetchMaps(refetch);
    }

    const renameMap = async (_id, name) => {
        await RenameMap({ variables: { _id: _id, name: name }, refetchQueries: [{ query: GET_DB_MAPS }]});
        await refetchMaps(refetch);
    }

    const deleteMap = async (_id) => {
        await DeleteMap({ variables: { _id: _id }, refetchQueries: [{ query: GET_DB_MAPS }]});
        await refetchMaps(refetch);
    }

    const moveMapToTop = async (_id, owner) => {
        await MoveMapToTop({ variables: { _id: _id, owner: owner}, refetchQueries: [{ query: GET_DB_MAPS}]});
    }

    const setShowNameMap = () => {
        toggleShowNameMap(!showNameMap);
        toggleShowRenameMap(false);
        toggleShowDeleteMap(false);
    }
    const setShowRenameMap = (map) => {
        setMap(map);
        toggleShowRenameMap(!showRenameMap);
        toggleShowDeleteMap(false);
        toggleShowNameMap(false);
    }

    const setShowDeleteMap = (map) => {
        setMap(map);
        toggleShowDeleteMap(!showDeleteMap);
        toggleShowRenameMap(false);
        toggleShowNameMap(false);
    }

    return (
        <>
            <div className="card maps-card">
                <h1>Your Maps</h1>
                <div className="maps-contents">
                    <MapsList maps={maps} setShowRenameMap={setShowRenameMap} setShowDeleteMap={setShowDeleteMap} setRegion={props.setRegion}
                    moveMapToTop={moveMapToTop} />
                    <input onClick={setShowNameMap} className="form-button submit-button create-new-map-button" type="submit" value="CREATE NEW MAP"></input>
                </div>
            </div>
            { showNameMap && (<NameMapModal setShowNameMap={setShowNameMap} createNewMap={createNewMap} />)}
            { showRenameMap && (<RenameMapModal setShowRenameMap={setShowRenameMap} renameMap={renameMap} map={map}/>)}
            { showDeleteMap && (<DeleteMapModal setShowDeleteMap={setShowDeleteMap} deleteMap={deleteMap} map={map}/>)}
        </>
    );
}

export default Maps;