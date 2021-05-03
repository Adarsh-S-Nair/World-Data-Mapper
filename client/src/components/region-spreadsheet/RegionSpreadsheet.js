import React, { useEffect, useState } from 'react';
import { useMutation, useQuery } 		from '@apollo/client';
import * as mutations 					from '../../cache/mutations';
import { GET_DB_MAPS } 				from '../../cache/queries';
import { useHistory, withRouter } from 'react-router-dom';

const RegionSpreadsheet = (props) => {

    let maps = [];

    const [path, setPath] = useState([]);
    const [map, setMap] = useState({});
    const [regions, setRegions] = useState([]);
    const [region, setRegion] = useState({});

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
        }
    }

    const addSubregion = async () => {
        const { data } = await AddSubregion({ variables: { mapID: map._id, regionID: region._id }, refetchQueries: [{ query: GET_DB_MAPS }]});
        await refetchMaps(refetch);
    }
    
    const history = useHistory();

    return (
        <div className="region-spreadsheet">
            <div className="region-spreadsheet-header">
                <div className="region-path">
                    {
                        path.map((region, index) => (
                            <div className="path-section">
                                <div onClick={() => {
                                    history.push(`/spreadsheet/${map._id}/${region[1]}`);
                                    refetchMaps(refetch);
                                }}className="path-name">{region[0]}</div>
                                {index != (path.length - 1) ? <span class="right-arrow material-icons">navigate_next</span> : ''}
                            </div>
                        ))
                    }
                </div>
                <div onClick={addSubregion} className="add-region material-icons">add</div>
            </div>
            <div className="spreadsheet-table">
                <div className="spreadsheet-header">
                    <h1 className="name-col">Name</h1>
                    <h1 className="capital-col">Capital</h1>
                    <h1 className="leader-col">Leader</h1>
                    <h1 className="flag-col">Flag</h1>
                    <h1 className="landmarks-col">Landmarks</h1>
                    <h1 className="control-col"> </h1>
                </div>
                <div className="spreadsheet-data">
                    {
                        regions.map((region) => (
                            <div className="region-entry">
                                <div className="name-col">{region.name}</div>
                                <div className="capital-col">{region.capital}</div>
                                <div className="leader-col">{region.leader}</div>
                                <div className="flag-col">{region.flag}</div>
                                <div className="landmarks-col">{region.landmarks}</div>
                                <div className="control-col ">
                                    <div className="region-entry-control view-entry material-icons" onClick={() => {
                                        history.push(`/viewer/${map._id}/${region._id}`);
                                    }}>visibility</div>
                                    <div className="region-entry-control view-subregion material-icons" onClick={() => {
                                        history.push(`/spreadsheet/${map._id}/${region._id}`);
                                        refetchMaps(refetch);
                                    }}>reorder</div>
                                    <div className="region-entry-control delete-entry material-icons">close</div>
                                </div>
                            </div>
                        ))
                    }
                </div>
            </div>
        </div>
    )
}

export default withRouter(RegionSpreadsheet);