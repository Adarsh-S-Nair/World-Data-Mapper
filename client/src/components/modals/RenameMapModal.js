import React, { useState } from 'react';

const RenameMapModal = (props) => {
    const [input, setInput] = useState({
        name: props.map.name
    })

    const updateInput = (e) => {
        const { name, value } = e.target;
        const updated = { ...input, [name]: value };
        setInput(updated);
    }

    const handleRenameMap = async (e) => {
        if(input.name == '') {
            alert("Please provide a name for the map");
            return;
        }
        props.renameMap(props.map._id, input.name);
        props.setShowRenameMap();
    }

    return (
        <div className="overlay">
            <div className="name-map-modal card modal">
                <h1>Rename Map</h1>
                <div className="form">
                    <div className="text-field">
                        <input defaultValue={props.map.name} name="name" type="text" onBlur={updateInput} required></input>
                        <label>Name</label>
                    </div>
                    <div className="form-buttons">
                        <input onClick={props.setShowRenameMap} className="form-button cancel-button" type="submit" value="CANCEL"></input>
                        <input onClick={handleRenameMap} className="form-button submit-button" type="submit" value="RENAME"></input>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default RenameMapModal;