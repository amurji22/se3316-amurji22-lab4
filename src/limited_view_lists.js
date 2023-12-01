import React, { useState, useEffect } from "react";
import axios from 'axios';

function LimitedViewLists() {
  const [lists, setLists] = useState([]);
  const [fetchError, setFetchError] = useState(null);
  const [detailedInfo, setDetailedInfo] = useState([]);
  const [listPowers, setListPowers] = useState([]);
  const [selectedList, setSelectedList] = useState(null);
  const [isInfoVisible, setIsInfoVisible] = useState({});
  const [listMoreInfo, setlistMoreInfo] = useState([]);
  const [expandedSuperheroId, setExpandedSuperheroId] = useState(null);

  const handleMoreInfo = async (list) => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/superheros/moreInfo/${list.listName}`);
      setDetailedInfo(response.data);
    } catch (error) {
      console.error("Error fetching detailed information:", error);
      setDetailedInfo([]);
    }
    try {
      const powersResponse = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/superhero-list/all_powers/${list.listName}`);
      setListPowers(powersResponse.data.result);
    } catch (error) {
      console.error("Error fetching Powers:", error);
      setListPowers([]);
    }
    try {
      const additionalInfo = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/superhero-list/all/${list.listName}`);
      setlistMoreInfo(additionalInfo.data.result);
    } catch (error) {
      console.error("Error fetching additional info:", error);
      setlistMoreInfo([]);
    }
    // Toggle the visibility state for the selected list
    setIsInfoVisible(prevState => ({
      ...prevState,
      [list.listName]: !prevState[list.listName] || false
    }));

    setSelectedList(list);
  };

  const toggleSuperheroDetails = (superheroName) => {
    setExpandedSuperheroId(prevName => prevName === superheroName ? null : superheroName);
  };
  

  useEffect(() => {
    const fetchLists = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/superheros/lists`);
        setLists(response.data.slice(0, 20)); // Limiting to 20 lists
        setFetchError(null);
        // Initialize visibility state for each list
        setIsInfoVisible(Object.fromEntries(response.data.map(list => [list.listName, false])));
      } catch (error) {
        console.error("Error fetching lists:", error);
        setFetchError(error.message);
        setLists([]);
      }
    };

    fetchLists();
  }, []);

  return (
    <div className="mt3 tc flex flex-wrap pa4">
      <h2>Created List</h2>
      {fetchError ? (
        <p className="red">{`An error occurred while fetching lists: ${fetchError}`}</p>
      ) : (
        lists.map((list, index) => (
          <div key={index} className="mb2 ma2 pa3 ba b--black flex-wrap">
            <p className="white" style={{ fontFamily: 'Comic Sans MS' }}>
              <strong>List Name:</strong> {list.listName}
              <br />
              <br />
              <button
                type="button"
                className="collapsible"
                onClick={() => handleMoreInfo(list)}
              >
                {isInfoVisible[list.listName] ? "Less Info" : "More Info"}
              </button>
              {isInfoVisible[list.listName] && selectedList && selectedList.listName === list.listName && (
                <div>
                  <p><strong>Description:</strong> {selectedList.description}</p>
                  {detailedInfo.map(({ superheroName, publisher }) => (
                <div key={superheroName}>
                  <p><strong>Superhero Name:</strong> {superheroName}</p>
                  <p><strong>Publisher:</strong> {publisher}</p>
                  <button
                    type="button"
                    onClick={() => toggleSuperheroDetails(superheroName)}
                  >
                    {expandedSuperheroId === superheroName ? "Hide Details" : "Show Details"}
                  </button>
                      {listPowers.map((hero) => {
                        if (hero.name === superheroName) {
                          return (
                            <div key={superheroName}>
                              <p><strong>Powers:</strong></p>
                              <ul>
                                {Object.keys(hero.powers).map((power, powerIndex) => (
                                  <li key={powerIndex}>{power}</li>
                                ))}
                              </ul>
                              {expandedSuperheroId === superheroName && (
                                  <div>
                                    {listMoreInfo.map((info) => {
                                      if (info.name === superheroName) {
                                        return (
                                          <div key={info.name}>
                                            <p><strong>Additional Information:</strong></p>
                                            <ul>
                                              {Object.entries(info).map(([key, value], index) => {
                                                if (key !== 'name' && key !== 'publisher') {
                                                  return <li key={index}>{`${key}: ${value}`}</li>;
                                                }
                                                return null;
                                              })}
                                            </ul>
                                          </div>
                                        );
                                      }
                                      return null;
                                    })}
                                  </div>
                                )}
                            </div>
                          );
                        }
                        return null;
                      })}
                    </div>
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

export default LimitedViewLists;