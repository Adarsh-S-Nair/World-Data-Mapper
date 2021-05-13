import React, { useState } from 'react';

const EditLandmarkModal = (props) => {
    const [input, setInput] = useState({
        name: props.landmark
    })

    const updateInput = (e) => {
        const { name, value } = e.target;
        const updated = { ...input, [name]: value };
        setInput(updated);
    }

    const handleEditLandmark = async (e) => {
        if(input.name == '') {
            alert("Please provide a name for the landmark");
            return;
        }
        if(input.name == props.landmark) {
            props.toggleShowEditLandmarkModal(false);
            return;
        }
        props.editLandmark(props.landmark, input.name);
        props.toggleShowEditLandmarkModal(false);
    }

    return (
        <div className="overlay">
            <div className="name-map-modal card modal">
                <h1>Rename Landmark</h1>
                <div className="form">
                    <div className="text-field">
                        <input defaultValue={props.landmark} name="name" type="text" onBlur={updateInput} required></input>
                        <label>Name</label>
                    </div>
                    <div className="form-buttons">
                        <input onClick={() => {props.toggleShowEditLandmarkModal(false)}} className="form-button cancel-button" type="submit" value="CANCEL"></input>
                        <input onClick={handleEditLandmark} className="form-button submit-button" type="submit" value="RENAME"></input>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default EditLandmarkModal;