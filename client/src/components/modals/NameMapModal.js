import React, { useState } from 'react';

const NameMapModal = (props) => {
    const [input, setInput] = useState({
        name: ''
    })

    const updateInput = (e) => {
        const { name, value } = e.target;
        const updated = { ...input, [name]: value };
        setInput(updated);
    }

    const handleCreateNewMap = async (e) => {
        if(input.name == '') {
            alert("Please provide a name for the map");
            return;
        }
        props.createNewMap(input.name);
        props.setShowNameMap();
    }

    return (
        <div className="overlay">
            <div className="name-map-modal card modal">
                <h1>Name Map</h1>
                <div className="form">
                    <div className="text-field">
                        <input name="name" type="text" onBlur={updateInput} required></input>
                        <label>Name</label>
                    </div>
                    <div className="form-buttons">
                        <input onClick={props.setShowNameMap} className="form-button cancel-button" type="submit" value="CANCEL"></input>
                        <input onClick={handleCreateNewMap} className="form-button submit-button" type="submit" value="CREATE MAP"></input>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default NameMapModal;