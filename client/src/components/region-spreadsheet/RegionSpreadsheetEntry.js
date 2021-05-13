import React, { useState } from 'react';
import { useHistory } from 'react-router';

const RegionSpreadsheetEntry = (props) => {

    let region = props.region;
    let map = props.map;
    let refetchMaps = props.refetchMaps;
    let refetch = props.refetch;

    const [nameEditable, setNameEditable] = useState(false);
    const [capitalEditable, setCapitalEditable] = useState(false);
    const [leaderEditable, setLeaderEditable] = useState(false);

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

    return (
        <div key={region._id} className="region-entry">
            {
                nameEditable ? <div className="region-text-field name-col">
                                    <input autoFocus defaultValue={input.name} name="name" onBlur={updateInput} type="text"></input>
                                </div>
                : <div onClick={() => {setNameEditable(true)}} className="name-col">{region.name}</div>
            }
            {
                capitalEditable ? <div className="region-text-field capital-col">
                                    <input autoFocus defaultValue={input.capital} name="capital" onBlur={updateInput} type="text"></input>
                                </div>
                : <div onClick={() => {setCapitalEditable(true)}} className="capital-col">{region.capital}</div>
            }
            {
                leaderEditable ? <div className="region-text-field-leader leader-col">
                                    <input autoFocus defaultValue={input.leader} name="leader" onBlur={updateInput} type="text"></input>
                                </div>
                : <div onClick={() => {setLeaderEditable(true)}} className="leader-col">{region.leader}</div>
            }
            <div className="flag-col">{region.flag}</div>
            <div className="landmarks-col" onClick={() => {
                props.tps.clearAllTransactions();
                history.push(`/viewer/${map._id}/${region._id}`);
            }}><span className={"spreadsheet-button"}>{region.landmarks}</span></div>
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