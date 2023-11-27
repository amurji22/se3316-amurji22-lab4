import React, { useState, useEffect } from "react";
import axios from 'axios';

function ViewLists() {
  const [lists, setLists] = useState([]);
  const [fetchError, setFetchError] = useState(null);
  const [detailedInfo, setDetailedInfo] = useState([]);
  const [selectedList, setSelectedList] = useState(null);
  const [isInfoVisible, setIsInfoVisible] = useState(false);

  const handleMoreInfo = async (list) => {
    setSelectedList(list);

    try {
      const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/superheros/moreInfo/${list.listName}`);
      setDetailedInfo(response.data);
    } catch (error) {
      console.error("Error fetching detailed information:", error);
      setDetailedInfo([]);
    }

    // Toggle the visibility state
    setIsInfoVisible(!isInfoVisible);
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
    <div className="mt3 tc">
      <h2>Created List</h2>
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
                onClick={() => handleMoreInfo(list)}
              >
                {isInfoVisible ? "Less Info" : "More Info"}
              </button>
              {isInfoVisible && selectedList && selectedList.listName === list.listName && (
                <div>
                  {detailedInfo.map(({ superheroName, publisher }, heroIndex) => (
                    <p key={heroIndex}>
                      <strong>Superhero Name:</strong> {superheroName}, <strong>Publisher:</strong> {publisher}
                    </p>
                  ))}
                </div>
              )}
            </p>
          </div>
        ))
      )}
    </div>
  );
}

export default ViewLists;
