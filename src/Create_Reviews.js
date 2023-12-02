import React, { useState } from "react";
import axios from 'axios';

function Create_Reviews() {
    const [listName, setListName] = useState('');
    const [rating, setRating] = useState('');
    const [comment, setComment] = useState('');
    const [errorMessage, setErrorMessage] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null); 

    const CreateReview = async () => {
        try {

          await axios.put(`${process.env.REACT_APP_BACKEND_URL}/api/superheros/list/review`, {
            listName: listName,
            rating: rating,
            comment: comment,
          });
    
          setListName('');
          setRating('');
          setComment('');
          setSuccessMessage('List Edited successfully!');
          setErrorMessage(null);
    
        } catch (error) {
          setErrorMessage(error.message);
          setSuccessMessage(null);
        }
      };


    return (
        <div className="pa3 tc">
        <h2 className="mb3">Write a review for a list</h2>
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
              id="list_Rating"
              placeholder="Rating (1-5)"
              className="pa2 mr2 ba b--black-20 w-15 h2"
              required
              onChange={(e) => setRating(e.target.value)}
              />
  
              <input
              type="text"
              id="list_values"
              placeholder="Comment"
              className="pa2 mr2 ba b--black-20 w-15 h2"
              required
              onChange={(e) => setComment(e.target.value)}
              />
  
              <button
              id="create_list"
              className="pa2 br2 bg-blue white b--blue pointer mt3"
              onClick={CreateReview}
              >
              Post Review!
              </button>
              {successMessage && <p className="success-message green fw-bold">{successMessage}</p>}
              {errorMessage && <p className="error-message red fw-bold">{errorMessage}</p>}
      </div>
    );
}

export default Create_Reviews;