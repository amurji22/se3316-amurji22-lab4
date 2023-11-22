import React from "react";

function Search() {
    return (
        <div className="pa3 tc">
            <h2 className="mb3">Custom Search</h2>
            <input
                type="text"
                id="field"
                placeholder="Enter a Field"
                className="pa2 mr2 ba b--black-20"
            ></input>
            <input
                type="text"
                id="pattern"
                placeholder="Enter a Pattern"
                className="pa2 mr2 ba b--black-20"
            ></input>
            <input
                type="text"
                id="num"
                placeholder="Number of Results"
                className="pa2 mr2 ba b--black-20"
                style={{ width: "150px" }}
            ></input>
            <button
                id="find_custom"
                className="pa2 br2 bg-blue white b--blue pointer"
            >
                Find
            </button>
            <div id="result3" className="mt2"></div>
        </div>
    );
}

export default Search;
