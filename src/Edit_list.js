import React, { useState, useEffect } from "react";
import axios from 'axios';

function Edit_list() {
  const [listName, setListName] = useState('');
  const [description, setDescription] = useState('');
  const [listValues, setListValues] = useState('');
  const [visibility, setVisibility] = useState('Private'); 
  const [errorMessage, setErrorMessage] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null); 
  const [isInfoVisible, setIsInfoVisible] = useState(false); 

  const handleCreateList = async () => {
    try {
      const time = new Date();
      let superheroesArray = listValues.split(',').map(value => value.trim());

      if (superheroesArray[0] == ""){
        superheroesArray = null
      }

      await axios.put(`${process.env.REACT_APP_BACKEND_URL}/api/superheros`, {
        name: listName,
        description: description,
        superheros: superheroesArray,
        visibility: visibility,
        time: time.toISOString(), 
      });

      setListName('');
      setDescription('');
      setListValues('');
      setVisibility('Private');
      setSuccessMessage('List Edited successfully!');
      setErrorMessage(null);

    } catch (error) {
      setErrorMessage(error.message);
      setSuccessMessage(null);
    }
  };

  return (
    <div className="pa3 tc">
      <h2 className="mb3">Edit an exisitng list</h2>
            <input
            type="text"
            id="list_name"
            placeholder="Existing list name"
            className="pa2 mr2 ba b--black-20 w-15 h2"
            required
            onChange={(e) => setListName(e.target.value)}
            />

            <input
            type="text"
            id="list_description"
            placeholder="New description"
            className="pa2 mr2 ba b--black-20 w-15 h2"
            onChange={(e) => setDescription(e.target.value)}
            />

            <input
            type="text"
            id="list_values"
            placeholder="New superhero names"
            className="pa2 mr2 ba b--black-20 w-15 h2"
            required
            onChange={(e) => setListValues(e.target.value)}
            />

            <p className="mt3">Set Visibility of the list: </p>

            <form>
            <input
                type="radio"
                id="Public"
                name="Visibility"
                value="Public"
                className="mr2"
                onChange={() => setVisibility('Public')} 
                checked={visibility === 'Public'} 
            />
            <label htmlFor="Public" className="mr3">Public</label>

            <input
                type="radio"
                id="Private"
                name="Visibility"
                value="Private"
                className="mr2"
                onChange={() => setVisibility('Private')}
                checked={visibility === 'Private'} 
            />
            <label htmlFor="Private">Private</label>
            </form>

            <button
            id="create_list"
            className="pa2 br2 bg-blue white b--blue pointer mt3"
            onClick={handleCreateList}
            >
            Edit List!
            </button>
            {successMessage && <p className="success-message green fw-bold">{successMessage}</p>}
            {errorMessage && <p className="error-message red fw-bold">{errorMessage}</p>}
    </div>
  );
}

export default Edit_list;
