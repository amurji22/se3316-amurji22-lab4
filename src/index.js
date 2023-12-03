import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom/client';
import axios from 'axios';
import './index.css';
import Title from './Title';
import Login from './login';
import About from './About';
import Search from './Search';
import LimitedViewLists from './limited_view_lists';
import Create_lists from './Create_lists';
import View_lists from './view_lists';
import Edit_list from './Edit_list';
import Delete_lists from './Delete_lists';
import Create_Reviews from './Create_Reviews.js';
import Add_Admin from './addAdmin.js';
import reportWebVitals from './reportWebVitals';
import 'tachyons';

const App = () => {
  const [hasValidToken, setHasValidToken] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const checkToken = async () => {
      // Retrieve the current user's information from local storage
      const currentUserData = localStorage.getItem('current_user');

      if (currentUserData) {
        // Split the string at the comma
        const dataArray = JSON.parse(currentUserData);

        // Extract email and token
        const email = dataArray[0];
        const accessToken = dataArray[1];
        const access = dataArray[2];

        try {
          // Use the accessToken to make a GET request to a protected endpoint
          fetch(
            `${process.env.REACT_APP_BACKEND_URL}/posts/${email}`,
            {
              method: 'GET',
              headers: {
                Authorization: `Bearer ${accessToken}`,
              },
            }
          );

          // The GET request was successful, handle the response as needed
          console.log('GET Request Successful:');

          // Set the state to indicate a valid token
          setHasValidToken(true);
          if (access === "Admin"){
            setIsAdmin(true);
          }
        } catch (error) {
          // The GET request failed, handle the error
          console.error('GET Request Error:', error);

          // If the error is due to an invalid or expired token, handle it accordingly
          if (error.response && error.response.status === 403) {
            console.log('Invalid or expired token');
            // Set the state to indicate an invalid token
            setHasValidToken(false);
          }
        }
      } else {
        // No current user information found in local storage
        console.log('No current user data found');
        // Set the state to indicate an invalid token
        setHasValidToken(false);
      }
    };

    checkToken();
  }, []); // The empty dependency array ensures this effect runs once on component mount

  return (
    <React.StrictMode>
      <Title />
      <Login />
      <About />
      <Search />
      <LimitedViewLists />
      
      {/* Conditionally render components based on the token */}
      {hasValidToken && (
        <>
          <Create_lists />
          <View_lists />
          <Edit_list />
          <Delete_lists />
          <Create_Reviews />
        </>
      )}
      {/* Conditonally render Admin components */}
      {isAdmin && (
          <Add_Admin />
      )}
    </React.StrictMode>
  );
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);

reportWebVitals();
