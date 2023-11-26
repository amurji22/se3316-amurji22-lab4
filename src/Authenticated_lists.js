import React, { useState, useEffect } from "react";
import axios from 'axios';

function Authenticated_lists() {
  const [listName, setListName] = useState('');
  const [description, setDescription] = useState('');
  const [listValues, setListValues] = useState('');
  const [visibility, setVisibility] = useState('Private'); 
  const [errorMessage, setErrorMessage] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null); 
  const [lists, setLists] = useState([]);
  const [fetchError, setFetchError] = useState(null);


  const handleCreateList = async () => {
    try {
      const time = new Date();
      const superheroesArray = listValues.split(',').map(value => value.trim());

      await axios.put(`${process.env.REACT_APP_BACKEND_URL}/api/superheros/create`, {
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
      setSuccessMessage('List created successfully!');
      setErrorMessage(null);

    } catch (error) {
      setErrorMessage(error.message);
      setSuccessMessage(null);
    }
  };

  useEffect(() => {
    const fetchLists = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/superheros/lists`);
        setLists(response.data.slice(0, 20)); // Limiting to 20 lists
        setFetchError(null);
      } catch (error) {
        console.error("Error fetching lists:", error);
        setFetchError(error.message);
        setLists([]);
      }
    };

    fetchLists();
  }, []);
  

  return (
    <div className="pa3 tc">
      <h2 className="mb3">Create a new list</h2>

      <input
        type="text"
        id="list_name"
        placeholder="Enter the list name"
        className="pa2 mr2 ba b--black-20 w-15 h2"
        required
        onChange={(e) => setListName(e.target.value)}
      />

      <input
        type="text"
        id="list_description"
        placeholder="Enter a description"
        className="pa2 mr2 ba b--black-20 w-15 h2"
        onChange={(e) => setDescription(e.target.value)}
      />

      <input
        type="text"
        id="list_values"
        placeholder="Enter the superhero names"
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
        Create List!
      </button>
      {successMessage && <p className="success-message green fw-bold">{successMessage}</p>}
      {errorMessage && <p className="error-message red fw-bold">{errorMessage}</p>}
      <div className="mt3">
        <h2 >Created List</h2>
        {fetchError ? (
            <p className="red">{`An error occurred while fetching lists: ${fetchError}`}</p>
        ) : (
            lists.map((list, index) => (
            <div key={index} className="mb2 ma2 pa3 ba b--black flex-grow-0">
                <p className="white" style={{ fontFamily: 'Comic Sans MS' }}>
                <strong>List Name:</strong> {list.listName}
                <br />
                <br />
                <button
                type="button"
                className="collapsible"
                onClick={() => {
                    // Placeholder for more info button functionality
                }}
                >
                More Info
                </button>
                </p>
            </div>
            ))
        )}
      </div>
    </div>
  );
}

export default Authenticated_lists;
