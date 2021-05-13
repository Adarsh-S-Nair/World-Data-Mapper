import React, { useState } from 'react';

const DeleteLandmarkModal = (props) => {

    const handleDeleteLandmark = async () => {
        props.deleteLandmark(props.landmark);
        props.toggleShowDeleteLandmarkModal(false);
    }

    return (
        <div className="overlay">
            <div className="delete-map-modal card modal">
                <h1>Delete Landmark</h1>
                <div className="form">
                    <div className="form-buttons">
                        <input onClick={() => {props.toggleShowDeleteLandmarkModal(false)}} className="form-button cancel-button" type="submit" value="CANCEL"></input>
                        <input onClick={handleDeleteLandmark} className="form-button delete-button" type="submit" value="DELETE"></input>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default DeleteLandmarkModal;