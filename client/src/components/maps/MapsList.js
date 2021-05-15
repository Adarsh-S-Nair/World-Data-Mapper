import React from 'react';
import { useHistory } from 'react-router-dom';

const MapsList = (props) => {

    const history = useHistory();

    const mostRecentMaps = [...props.maps];
    mostRecentMaps.sort((a, b) => {
        if (a.index < b.index) return 1;
        if (a.index > b.index) return -1;
        return 0;
    });
    
    return (
        <div className="maps-list">
            {
                props.maps && mostRecentMaps.map(map => (
                    <div key={map._id} className="map-entry">
                        <div onClick={() => {
                            props.moveMapToTop(map._id, map.owner);
                            const regionID = map.subregions.find((r) => r.parent == '')._id
                            history.push(`/spreadsheet/${map._id}/${regionID}`);
                        }} className="map-name">{map.name}</div>
                        <div className="map-controls">
                            <div onClick={() => {props.setShowRenameMap(map)}} className="edit-map-name material-icons">edit</div>
                            <div onClick={() => {props.setShowDeleteMap(map)}} className="delete-map material-icons">delete</div>
                        </div>
                    </div>
                ))
            }
        </div>
    );
}

export default MapsList;