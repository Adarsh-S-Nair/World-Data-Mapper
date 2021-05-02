import React, { useState } from 'react';

const DeleteMapModal = (props) => {

    const handleDeleteMap = async (e) => {
        props.deleteMap(props.map._id);
        props.setShowDeleteMap();
    }

    return (
        <div className="overlay">
            <div className="delete-map-modal card modal">
                <h1>Delete Map</h1>
                <div className="form">
                    <div className="form-buttons">
                        <input onClick={props.setShowDeleteMap} className="form-button cancel-button" type="submit" value="CANCEL"></input>
                        <input onClick={handleDeleteMap} className="form-button delete-button" type="submit" value="DELETE"></input>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default DeleteMapModal;