import React, { useEffect, useState } from 'react';
import { useMutation, useQuery } 		from '@apollo/client';
import * as mutations 					from '../../cache/mutations';
import { GET_DB_MAPS } 				from '../../cache/queries';
import { useHistory, withRouter } from 'react-router-dom';

const RegionViewer = (props) => {

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
    const [mapId, setMapId] = useState('');

    const [AddSubregion] = useMutation(mutations.ADD_SUBREGION);

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
            url = url.substr(0, url.lastIndexOf("/"));
            const mapId = url.substring(url.lastIndexOf('/') + 1);
            maps = data.getAllMaps;
            let regions = maps.find((map) => map._id == mapId).subregions;
            setMap(maps.find((map) => map._id == mapId));
            setRegion(regions.find((region) => region._id == regionId));
            setRegions(regions.filter(region => region.parent == regionId));

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
        }
    }

    const history = useHistory();

    return (
        <div className="region-viewer">
            <div className="landmarks-card">
                <h1>Landmarks</h1>
                <div className="landmarks-form">
                </div>
                <div className="add-landmark">
                    <div className="landmarks-text-field">
                        <input name="landmark" type="text" required></input>
                    </div>
                    <div className="add-landmark-button material-icons">add</div>
                </div>
            </div>
            <div className="details-card">
                <h1>{region.name}</h1>
                <div className="region-details">
                    <div className="region-viewer-image">[Image Here]</div>
                    <div className="viewer-details">
                        <div className="viewer-detail parent-region">
                            <div>Parent Region: </div>
                            <div className={"parent-name"}onClick={() => {
                                history.push(`/spreadsheet/${map._id}/${parentId}`)
                            }}>{" " + parentName}</div>
                        </div>
                        <div className="viewer-detail">Region Capital: {regionCapital}</div>
                        <div className="viewer-detail">Region Leader: {regionLeader}</div>
                        <div className="viewer-detail">Number of Subregions: {subRegionsLength}</div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default RegionViewer