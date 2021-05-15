import React, { useState } from 'react';
import { useHistory } from 'react-router';

const RegionSpreadsheetEntry = (props) => {

    let region = props.region;
    let map = props.map;
    let refetchMaps = props.refetchMaps;
    let refetch = props.refetch;

    let editingLeader = props.editingRegionAndField._id == region._id && props.editingRegionAndField.field == "leader";
    //console.log(editingLeader);
    const [nameEditable, setNameEditable] = useState(false);
    const [capitalEditable, setCapitalEditable] = useState(false);
    const [leaderEditable, setLeaderEditable] = useState(editingLeader);

    const [input, setInput] = useState({
        name: region.name,
        capital: region.capital,
        leader: region.leader
    });

    const updateInput = (e) => {
        setNameEditable(false);
        setCapitalEditable(false);
        setLeaderEditable(false);

        const { name, value } = e.target;
        if(/\S/.test(value) == '' || value == input[name]) return;
        const updated = { ...input, [name]: value };
        const prev = input[name];
        setInput(updated);
        props.editSubregion(region._id, name, prev, value);
    }

    const history = useHistory();

    //console.log(props.editingRegionAndField);
    console.log(leaderEditable);

    let flagPath = "/images/";
    props.path.forEach((r) => {
        flagPath += (r[0] + "/");
    })
    flagPath += (region.name + " Flag.png");
    var image = new Image();
    image.src = flagPath;

    let sublandmarks = [];
    let sublandmarksWithoutRegion = [];
    props.regions.forEach((r) => {
        let current = r;
        while(current.parent != '') {
            if(current.parent == region._id) {
                let landmarksWithRegion= [...r.landmarks];
                for(var i = 0; i < landmarksWithRegion.length; i++) {
                    landmarksWithRegion[i] += (" - " + r.name);
                }
                sublandmarksWithoutRegion = [...r.landmarks, ...sublandmarksWithoutRegion];
                sublandmarks = [...landmarksWithRegion, ...sublandmarks];
                break;
            }
            current = props.regions.find((reg) => reg._id == current.parent);
        }
    })

    let totalLandmarks = [...region.landmarks, ...sublandmarks];

    let landmarksText = totalLandmarks.length == 0 ? "No Landmarks" : totalLandmarks[0];
    if(totalLandmarks.length > 1) { landmarksText += ", ..."; }

    return (
        <div key={region._id} className="region-entry">
            {
                nameEditable ? <div className="region-text-field name-col">
                                    <input autoFocus defaultValue={region.name} name="name" onBlur={updateInput} type="text"></input>
                                </div>
                : <div onClick={() => {setNameEditable(true)}} className="name-col">{region.name}</div>
            }
            {
                capitalEditable ? <div className="region-text-field capital-col">
                                    <input autoFocus defaultValue={region.capital} name="capital" onBlur={updateInput} type="text"></input>
                                </div>
                : <div onClick={() => {setCapitalEditable(true)}} className="capital-col">{region.capital}</div>
            }
            {
                leaderEditable ? <div className="region-text-field-leader leader-col">
                                    <input autoFocus defaultValue={region.leader} name="leader" onBlur={updateInput} type="text"></input>
                                </div>
                : <div onClick={() => {
                    setLeaderEditable(true);
                    props.setFieldEditable(region._id, "leader");
                }} className="leader-col">{region.leader}</div>
            }
            {
                image.width == 0 ? <div className="flag-col">N/A</div>
                : <img src={flagPath} className="flag flag-col" />
            }
            <div className="landmarks-col" onClick={() => {
                props.tps.clearAllTransactions();
                history.push(`/viewer/${map._id}/${region._id}`);
            }}><span className={"landmarks-text spreadsheet-button"}>{landmarksText}</span></div>
            <div className="control-col ">
                <div className="region-entry-control spreadsheet-button material-icons" onClick={() => {
                    props.tps.clearAllTransactions();
                    history.push(`/viewer/${map._id}/${region._id}`);
                }}>visibility</div>
                <div className="region-entry-control spreadsheet-button material-icons" onClick={() => {
                    props.tps.clearAllTransactions();
                    history.push(`/spreadsheet/${map._id}/${region._id}`);
                    refetchMaps(refetch);
                }}>reorder</div>
                <div onClick={() => {props.setShowDeleteSubregion(region)}} className="region-entry-control delete-entry material-icons">close</div>
            </div>
        </div>
    );
}

export default RegionSpreadsheetEntry;