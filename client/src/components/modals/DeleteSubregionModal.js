import React, { useState } from 'react';

const DeleteSubregionModal = (props) => {

    const handleDeleteSubregion = async (e) => {
        props.deleteSubregion(props.regionToDelete);
        props.setShowDeleteSubregion();
    }

    return (
        <div className="overlay">
            <div className="delete-map-modal card modal">
                <h1>Delete Subregion</h1>
                <div className="form">
                    <div className="form-message">
                    Deleting this subregion will also delete all of its descendant subregions. Are you sure you want to do this?
                    </div>
                    <div className="form-buttons">
                        <input onClick={props.setShowDeleteSubregion} className="form-button cancel-button" type="submit" value="CANCEL"></input>
                        <input onClick={handleDeleteSubregion} className="form-button delete-button" type="submit" value="DELETE"></input>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default DeleteSubregionModal;