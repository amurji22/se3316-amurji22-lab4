import React, { useState } from "react";
import axios from "axios";
import './Search.css';

function DeleteLists() {
    const [listName, setListName] = useState('');
    const [errorMessage, setErrorMessage] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);

    const deleteList = async () => {
        try {
            await axios.delete(`${process.env.REACT_APP_BACKEND_URL}/api/superhero-list/${listName}`, {});

            setListName('');
            setSuccessMessage('List deleted successfully!');
            setErrorMessage(null);
        } catch (error) {
            setErrorMessage(error.message);
            setSuccessMessage(null);
        }
    };

    return (
        <div id="delete_list" className="pa3 tc">
            <h2>Delete a List</h2>
            <input
                type="text"
                id="list_delete"
                placeholder="Enter the list name"
                required
                onChange={(e) => setListName(e.target.value)}
                className="pa2 mr2 ba b--black-20"
            />
            <button
                id="delete_button"
                onClick={deleteList}
                className="pa2 br2 bg-red white b--red pointer"
            >
                Delete
            </button>
            {successMessage && <p className="success-message green fw-bold">{successMessage}</p>}
            {errorMessage && <p className="error-message red fw-bold">{errorMessage}</p>}
        </div>
    );
}

export default DeleteLists;
