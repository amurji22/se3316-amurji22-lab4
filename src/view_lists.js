import React, { useState, useEffect } from "react";
import axios from 'axios';

function ViewLists() {
  const [lists, setLists] = useState([]);
  const [fetchError, setFetchError] = useState(null);
  const [detailedInfo, setDetailedInfo] = useState([]);
  const [selectedList, setSelectedList] = useState(null);

  const handleMoreInfo = async (list) => {
    setSelectedList(list);

    try {
      const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/superheros/moreInfo/${list.listName}`);
      setDetailedInfo(response.data);
    } catch (error) {
      console.error("Error fetching detailed information:", error);
      setDetailedInfo([]);
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
                More Info
              </button>
            </p>
            {selectedList && selectedList.listName === list.listName && (
              <div>
                <p><strong>Description:</strong> {selectedList.description}</p>
                {detailedInfo.length > 0 && (
                  <div>
                    <p><strong>Detailed Information:</strong></p>
                    <ul>
                      {detailedInfo.map((hero, heroIndex) => (
                        <li key={heroIndex}>{`Name: ${hero.superheroName}, Publisher: ${hero.publisher}`}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
}

export default ViewLists;
