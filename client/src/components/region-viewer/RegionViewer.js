import React, { useEffect, useState } from 'react';
import { useMutation, useQuery } 		from '@apollo/client';
import * as mutations 					from '../../cache/mutations';
import { GET_DB_MAPS } 				from '../../cache/queries';
import { useHistory, withRouter } from 'react-router-dom';
import DeleteLandmarkModal from '../modals/DeleteLandmarkModal';

import { 
	ChangeParentRegion_Transaction,
    UpdateMapRegions_Transaction,
    UpdateRegionLandmarks_Transaction} 				from '../../utils/jsTPS';

const RegionViewer = (props) => {

    let maps = [];

    const [showDeleteLandmarkModal, toggleShowDeleteLandmarkModal] = useState(false);

    const [changeParentRegion, toggleChangeParentRegion] = useState(false);
    const [landmarkInput, setLandmarkInput] = useState("");
    const [landmarkDelete, setLandmarkDelete] = useState("");

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

    const [ChangeParentRegion] = useMutation(mutations.CHANGE_PARENT_REGION);
    const [AddLandmark] = useMutation(mutations.ADD_LANDMARK);
    const [DeleteLandmark] = useMutation(mutations.DELETE_LANDMARK);

    const { loading, error, data, refetch } = useQuery(GET_DB_MAPS);
	if(loading) { console.log(loading, 'loading'); }
	if(error) { console.log(error, 'error'); }
	if(data) { maps = data.getAllMaps; }

    useEffect(() => {
        refetchMaps(refetch);
    }, [maps]);

    const updateInput = (e) => {
        const { value } = e.target;
        setLandmarkInput(value);
    }

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

    const handleChangeParent = async (e) => {
        toggleChangeParentRegion(false);
        const newParent = e.target.value ? e.target.value : false;
        let transaction = new ChangeParentRegion_Transaction(map._id, region._id, region.parent, newParent, ChangeParentRegion);
        props.tps.addTransaction(transaction);
        redo();
        await refetchMaps(refetch);
    }

    const handleAddLandmark = () => {
        if(landmarks.includes(landmarkInput)) { 
            alert("Can not add duplicate landmarks")
            return; 
        };
        let transaction = new UpdateRegionLandmarks_Transaction(map._id, region._id, landmarkInput, 1, AddLandmark, DeleteLandmark);
        props.tps.addTransaction(transaction);
        redo();
    }

    const handleDeleteLandmark = (landmark) => {
        let transaction = new UpdateRegionLandmarks_Transaction(map._id, region._id, landmark, 0, AddLandmark, DeleteLandmark);
        props.tps.addTransaction(transaction);
        redo();
    }

    const undo = async () => {
        const retVal = await props.tps.undoTransaction();
        await refetchMaps(refetch);
        console.log(regions);
        return retVal;
    }

    const redo = async () => {
        const retVal = await props.tps.doTransaction();
        await refetchMaps(refetch);
        console.log(regions);
        return retVal;
    }

    let options = regions
    options.forEach((r) => {
        let current = r;
        while(current.parent != '') {
            if(options.findIndex((reg) => reg._id == current.parent) == -1) {
                options = options.filter((reg) => reg._id != current._id);
                break;
            }
            current = options.find((reg) => reg._id == current.parent);
        }
    })
    options = options.filter((r) => r._id != region._id)
    
    console.log(landmarks);


    const undoStyle = props.tps.hasTransactionToUndo() ? "view-control material-icons" : "view-control-disabled material-icons";
    const redoStyle = props.tps.hasTransactionToRedo() ? "view-control material-icons" : "view-control-disabled material-icons";

    const history = useHistory();

    return (
        <>
            <div className="region-viewer">
                <div className="landmarks-card">
                    <h1>Landmarks</h1>
                    <div className="landmarks-form">
                        {
                            landmarks.map((landmark) => (
                                <div className="landmark-entry">
                                    <div className="landmark-name">
                                        {landmark}
                                    </div>
                                    <div className="landmark-controls">
                                        <div className="material-icons">edit</div>
                                        <div onClick={() => {
                                            setLandmarkDelete(landmark);
                                            toggleShowDeleteLandmarkModal(true);
                                        }} className="delete-landmark material-icons">close</div>
                                    </div>
                                </div>
                            ))
                        }
                    </div>
                    <div className="add-landmark">
                        <div className="landmarks-text-field">
                            <input onBlur={updateInput} name="landmark" type="text" required></input>
                        </div>
                        <div onClick={handleAddLandmark} className="add-landmark-button material-icons">add</div>
                    </div>
                </div>
                <div className="details-card">
                    <div className="details-header">
                        <h1>{region.name}</h1>
                        <div className="details-controls">
                            <div onClick={props.tps.hasTransactionToUndo() ? undo : null} className={undoStyle}>undo</div>
                            <div onClick={props.tps.hasTransactionToRedo() ? redo : null} className={redoStyle}>redo</div>
                        </div>
                    </div>
                    <div className="region-details">
                        <div className="region-viewer-image">[Image Here]</div>
                        <div className="viewer-details">
                            <div className="viewer-detail parent-region">
                                <div>Parent Region: </div>
                                {
                                    changeParentRegion ?
                                    <select autoFocus options={options} onBlur={handleChangeParent} className="select-parent-region">
                                        {
                                            options.map(option => (
                                                <option className={"select-option"} value={option._id}>{option.name}</option>
                                            ))
                                        }
                                    </select>
                                    : <div className={"parent-name"}onClick={() => {
                                        props.tps.clearAllTransactions();
                                        history.push(`/spreadsheet/${map._id}/${parentId}`)
                                    }}>{parentName}</div>
                                }
                                {
                                    changeParentRegion ? null
                                    : <div onClick={() => {toggleChangeParentRegion(!changeParentRegion)}} className="change-parent material-icons">edit</div>
                                }
                            </div>
                            <div className="viewer-detail">Region Capital: {regionCapital}</div>
                            <div className="viewer-detail">Region Leader: {regionLeader}</div>
                            <div className="viewer-detail">Number of Subregions: {subRegionsLength}</div>
                        </div>
                    </div>
                </div>
            </div>
            {showDeleteLandmarkModal && <DeleteLandmarkModal landmark={landmarkDelete} deleteLandmark={handleDeleteLandmark} toggleShowDeleteLandmarkModal={toggleShowDeleteLandmarkModal}/>}
        </>
    )
}

export default RegionViewer