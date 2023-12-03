import React, { useState } from 'react';
import axios from 'axios';
import './Search.css'; // Assuming you want to use the same CSS file as the second component

function Admin() {
    const [email, setEmail] = useState('');
    const [errorMessage, setErrorMessage] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);

    const grantAdmin = async () => {
        try {
            await axios.put(`${process.env.REACT_APP_BACKEND_URL}/api/add_admin`, {
                email: email,
            });
            setSuccessMessage('Admin privilege granted!');
            setErrorMessage(null);
            setEmail('');
        } catch (error) {
            setErrorMessage(error.message);
            setSuccessMessage(null);
        }
    };

    return (
        <div id="admin_access" className="pa3 tc">
            <h2>Grant Admin Access</h2>
            <input
                type="email"
                id="email_input"
                placeholder="Enter user's Email"
                required
                onChange={(e) => setEmail(e.target.value)}
                className="pa2 mr2 ba b--black-20"
            />
            <button
                id="grant_button"
                onClick={grantAdmin}
                className="pa2 br2 bg-blue white b--blue pointer"
            >
                Grant Access
            </button>
            {successMessage && <p className="success-message green fw-bold">{successMessage}</p>}
            {errorMessage && <p className="error-message red fw-bold">{errorMessage}</p>}
        </div>
    );
}

export default Admin;
