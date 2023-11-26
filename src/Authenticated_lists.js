import React from "react";

function Authenticated_lists() {
  return (
    <div className="pa3 tc">
      <h2 className="mb3">Create a new list</h2>
      
      <input
        type="text"
        id="list_name"
        placeholder="Enter the list name"
        className="pa2 mr2 ba b--black-20 w-15"
        required
      />
      
      <input
        type="text"
        id="list_description"
        placeholder="Enter a description"
        className="pa2 mr2 ba b--black-20 w-15"
      />
      
      <input
        type="text"
        id="list_values"
        placeholder="Enter the superhero names"
        className="pa2 mr2 ba b--black-20 w-15"
        required
      />
      
      <p className="mt3">Set Visibility of the list: </p>
      
      <form>
        <input
          type="radio"
          id="Public"
          name="Visibility"
          value="Public"
          className="mr2"
        />
        <label htmlFor="Public" className="mr3">Public</label>
        
        <input
          type="radio"
          id="Private"
          name="Visibility"
          value="Private"
          checked="checked"
          className="mr2"
        />
        <label htmlFor="Private">Private</label>
      </form>
      
      <button id="create_list" className="pa2 br2 bg-blue white b--blue pointer mt3">
        Create List!
      </button>
      
      <div className="mt3">
        <h2>Created List</h2>
      </div>
    </div>
  );
}

export default Authenticated_lists;
