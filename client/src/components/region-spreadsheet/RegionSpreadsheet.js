import React, { useEffect, useState } from 'react';
import { useMutation, useQuery } 		from '@apollo/client';
import * as mutations 					from '../../cache/mutations';
import { GET_DB_MAPS } 				from '../../cache/queries';
import { useHistory, withRouter } from 'react-router-dom';
import RegionSpreadsheetEntry from './RegionSpreadsheetEntry';
import DeleteSubregionModal from '../modals/DeleteSubregionModal';

import { 
	UpdateMapRegions_Transaction,
    EditSubregion_Transaction,
    SortByField_Transaction} 				from '../../utils/jsTPS';

const RegionSpreadsheet = (props) => {

    let maps = [];

    const [nameSorted, toggleNameSorted] = useState(false);
    const [capitalSorted, toggleCapitalSorted] = useState(false);
    const [leaderSorted, toggleLeaderSorted] = useState(false);

    const [path, setPath] = useState([]);
    const [map, setMap] = useState({});
    const [regions, setRegions] = useState([]);
    const [region, setRegion] = useState({});
    const [regionID, setRegionID] = useState("");

    const [showDeleteSubregion, toggleDeleteSubregion] = useState(false);
    const [regionToDelete, setRegionToDelete] = useState({});

    const [AddSubregion] = useMutation(mutations.ADD_SUBREGION);
    const [DeleteSubregion] = useMutation(mutations.DELETE_SUBREGION);
    const [UpdateRegionField] = useMutation(mutations.UPDATE_REGION_FIELD);
    const [SortByField] = useMutation(mutations.SORT_BY_FIELD);
    const [SetRegions] = useMutation(mutations.SET_REGIONS);

    const { loading, error, data, refetch } = useQuery(GET_DB_MAPS);
	if(loading) { console.log(loading, 'loading'); }
	if(error) { console.log(error, 'error'); }
	if(data) { maps = data.getAllMaps; }

    useEffect(() => {
        refetchMaps(refetch);
    }, [maps]);

    const refetchMaps = async (refetch) => {
        const { loading, error, data } = await refetch();
        if (data) {
            let url = window.location.href;
            const regionId = url.substring(url.lastIndexOf('/') + 1);
            setRegionID(regionId);
            url = url.substr(0, url.lastIndexOf("/"));
            const mapId = url.substring(url.lastIndexOf('/') + 1);
            maps = data.getAllMaps;
            let regions = maps.find((map) => map._id == mapId).subregions;
            setMap(maps.find((map) => map._id == mapId));
            setRegion(regions.find((region) => region._id == regionId));
            setRegions(regions.filter(region => region.parent == regionId));
            console.log(regions);

            let tempPath = []
            let current = regions.find((region) => region._id == regionId);
            while(current.parent != '') {
                tempPath.push([current.name, current._id]);
                current = regions.find((region) => region._id == current.parent);
            }
            tempPath.push([current.name, current._id]);
            tempPath.reverse();
            setPath(tempPath);
        }
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

    const addSubregion = async () => {
        let region = {
            _id: '',
            name: 'Untitled',
            capital: "N/A",
            leader: "N/A",
            flag: "N/A",
            landmarks: [],
            parent: regionID
        }
        let transaction = new UpdateMapRegions_Transaction(map._id, region._id, region, 1, AddSubregion, DeleteSubregion);
        props.tps.addTransaction(transaction);
        redo();
        await refetchMaps(refetch);
    }

    const deleteSubregion = async (region) => {
        const { __typename, ...trimmedRegion } = region;
        console.log(trimmedRegion);
        let transaction = new UpdateMapRegions_Transaction(map._id, region._id, trimmedRegion, 0, AddSubregion, DeleteSubregion);
        props.tps.addTransaction(transaction);
        redo();
        await refetchMaps(refetch);
    }

    const editSubregion = async (regionID, field, prev, value) => {
        let transaction = new EditSubregion_Transaction(map._id, regionID, field, prev, value, UpdateRegionField);
        props.tps.addTransaction(transaction);
        redo();
        await refetchMaps(refetch);

    }

    const sortByField = (field) => {
        if(field == "name") { toggleNameSorted(!nameSorted) }
        else if(field == "capital") { toggleCapitalSorted(!capitalSorted) }
        else { toggleLeaderSorted(!leaderSorted) }

        let subregions = [];
        map.subregions.forEach((r) => {
            let { __typename, ...trimmed } = r;
            subregions.push(trimmed);
        })

        let transaction = new SortByField_Transaction(map._id, subregions, field, SortByField, SetRegions);
        props.tps.addTransaction(transaction);
        redo();
    }

    const setShowDeleteSubregion = (region) => {
        setRegionToDelete(region);
        toggleDeleteSubregion(!showDeleteSubregion);
    }


    
    const history = useHistory();

    const undoStyle = props.tps.hasTransactionToUndo() ? "region-control material-icons" : "region-control-disabled material-icons";
    const redoStyle = props.tps.hasTransactionToRedo() ? "region-control material-icons" : "region-control-disabled material-icons";

    return (
        <>
            <div className="region-spreadsheet">
                <div className="region-spreadsheet-header">
                    <div className="region-path">
                        {
                            path.map((region, index) => (
                                <div className="path-section">
                                    <div onClick={() => {
                                        props.tps.clearAllTransactions();
                                        history.push(`/spreadsheet/${map._id}/${region[1]}`);
                                        refetchMaps(refetch);
                                    }}className="path-name">{region[0]}</div>
                                    {index != (path.length - 1) ? <span class="right-arrow material-icons">navigate_next</span> : ''}
                                </div>
                            ))
                        }
                    </div>
                    <div className="region-controls">
                        <div onClick={addSubregion} className="region-control material-icons">add</div>
                        <div onClick={props.tps.hasTransactionToUndo() ? undo : null} className={undoStyle}>undo</div>
                        <div onClick={props.tps.hasTransactionToRedo() ? redo : null} className={redoStyle}>redo</div>
                    </div>
                </div>
                <div className="spreadsheet-table">
                    <div className="spreadsheet-header">
                        <div className="header-col name-col">
                            <div className="header-center">
                                <h1 name="name" onClick={() => {sortByField("name")}}>Name</h1>
                                {nameSorted ? <div className="sorting-arrow material-icons">expand_more</div>
                                : <div className="sorting-arrow material-icons">expand_less</div>}
                            </div>
                        </div>
                        <div className="header-col capital-col">
                            <div className="header-center">
                                <h1 name="capital" onClick={() => {sortByField("capital")}}>Capital</h1>
                                {capitalSorted ? <div className="sorting-arrow material-icons">expand_more</div>
                                : <div className="sorting-arrow material-icons">expand_less</div>}
                            </div>
                        </div>
                        <div className="header-col leader-col">
                            <div className="header-center">
                                <h1 name="leader" onClick={() => {sortByField("leader")}}>Leader</h1>
                                {leaderSorted ? <div className="sorting-arrow material-icons">expand_more</div>
                                : <div className="sorting-arrow material-icons">expand_less</div>}
                            </div>
                        </div>
                        <h1 className="flag-col">Flag</h1>
                        <h1 className="landmarks-col">Landmarks</h1>
                        <h1 className="control-col"> </h1>
                    </div>
                    <div className="spreadsheet-data">
                        {
                            regions.map((region) => (
                                <RegionSpreadsheetEntry editSubregion={editSubregion} setShowDeleteSubregion={setShowDeleteSubregion} 
                                tps={props.tps} region={region} map={map} refetchMaps={refetchMaps} refetch={refetch} />
                            ))
                        }
                    </div>
                </div>
            </div>
            { showDeleteSubregion && <DeleteSubregionModal setShowDeleteSubregion={setShowDeleteSubregion} deleteSubregion={deleteSubregion} regionToDelete={regionToDelete}/>}
        </>
    )
}

export default withRouter(RegionSpreadsheet);