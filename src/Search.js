import React, { useState } from "react";
import axios from "axios";

function Search() {
    const [field, setField] = useState("");
    const [pattern, setPattern] = useState("");
    const [n, setN] = useState(0);
    const [result, setResult] = useState([]);
    const [error, setError] = useState(null);

    const handleSearch = async () => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/superheros/all/${field}/${pattern}/${n}/`);
            const data = response.data;

            // Update the state with the fetched data
            setResult(data);
            setError(null);
        } catch (error) {
            console.error("Error fetching data:", error);
            // Update the state with the error
            setError(error.message);
            setResult([]);
        }
    };

    return (
        <div className="pa3 tc">
            <h2 className="mb3">Custom Search</h2>
            <input
                type="text"
                placeholder="Enter a Field"
                className="pa2 mr2 ba b--black-20"
                value={field}
                onChange={(e) => setField(e.target.value)}
            />
            <input
                type="text"
                placeholder="Enter a Pattern"
                className="pa2 mr2 ba b--black-20"
                value={pattern}
                onChange={(e) => setPattern(e.target.value)}
            />
            <input
                type="text"
                placeholder="Number of Results"
                className="pa2 mr2 ba b--black-20"
                style={{ width: "150px" }}
                value={n}
                onChange={(e) => setN(e.target.value)}
            />
            <button
                onClick={handleSearch}
                className="pa2 br2 bg-blue white b--blue pointer"
            >
                Find
            </button>
            <div id="result3" className="mt2 flex flex-wrap">
                {error ? (
                    <p className="red">{`An error occurred: ${error}`}</p>
                ) : (
                    result.map((item, index) => (
                        <div key={index} className="mb2 ma2 pa3 ba b--black-20 flex-grow-0">
                            {/* Display name and publisher at first glance */}
                            <p>
                                <strong>Name:</strong> {item.name} - <strong>Publisher:</strong> {item.Publisher}
                            </p>
                        </div>
                    ))
                )}
            </div>



        </div>
    );
}

export default Search;
