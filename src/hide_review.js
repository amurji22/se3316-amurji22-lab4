import React, { useState, useEffect } from 'react';
import axios from 'axios';

function ReviewComponent() {
    const [listNames, setListNames] = useState([]);
    const [reviews, setReviews] = useState([]);
    const [selectedListName, setSelectedListName] = useState('');
    const [selectedReview, setSelectedReview] = useState('');
    const [successMessage, setSuccessMessage] = useState(null);
    const [errorMessage, setErrorMessage] = useState(null);
    const [fetchError, setFetchError] = useState(null);

    // Fetch list names when the component mounts
    useEffect(() => {
        const fetchListNames = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/superheros/lists`);
                setListNames(response.data.slice(0, 20)); // Assuming you want to limit to 20 lists
            } catch (error) {
                setFetchError(error.message);
            }
        };

        fetchListNames();
    }, []);

    // Fetch reviews when a list name is selected
    useEffect(() => {
        if (selectedListName) {
            const fetchReviews = async () => {
                try {
                    const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/reviews/all/${selectedListName}`);
                    setReviews(response.data);
                    console.log(reviews)
                } catch (error) {
                    setFetchError(error.message);
                }
            };

            fetchReviews();
        } else {
            setReviews([]); // Clear reviews if no list is selected
        }
    }, [selectedListName]); // This useEffect will run every time selectedListName changes

    const handleListSelection = (e) => {
        setSelectedListName(e.target.value);
        setSelectedReview(''); // Reset review selection when list changes
        setSuccessMessage(null);
        setErrorMessage(null);
    };

    const handleReviewSelection = (e) => {
        setSelectedReview(e.target.value);
        setSuccessMessage(null);
        setErrorMessage(null);
    };

    const handleSubmit = async () => {
        if (selectedListName && selectedReview) {
            try {
                const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/review/hidden`, {
                    name: selectedListName,
                    comment: selectedReview
                });
                setSuccessMessage('Review updated successfully!');
                setErrorMessage(null);
            } catch (error) {
                setErrorMessage('Error updating review: ' + error.message);
                setSuccessMessage(null);
            }
        } else {
            setErrorMessage('Please select a list and a review.');
            setSuccessMessage(null);
        }
    };

    return (
        <div className="pa3 tc">
            <h2>Select a list to view reviews for</h2>
            <select className="pa2 ba b--black-20 mb2" onChange={handleListSelection}>
                <option value="">Select a list</option>
                {listNames.map(list => (
                    <option key={list.listName} value={list.listName}>{list.listName}</option>
                ))}
            </select>

            {selectedListName && (
                <>
                    <h3>Select a Review to hide for {selectedListName}</h3>
                    <select className="pa2 ba b--black-20 mb2" onChange={handleReviewSelection}>
                        <option value="">Select a review</option>
                        {reviews.map((review, index) => (
                            <option key={index} value={review[1]}>{review[1]}</option>
                        ))}
                    </select>
                </>
            )}

            {selectedReview && (
                <button onClick={handleSubmit} className="pa2 br2 bg-blue white b--blue pointer">
                    Submit
                </button>
            )}

            {successMessage && <p className="success-message green fw-bold">{successMessage}</p>}
            {errorMessage && <p className="error-message red fw-bold">{errorMessage}</p>}
            {fetchError && <p className="fetch-error red fw-bold">{fetchError}</p>}
        </div>
    );
}

export default ReviewComponent;