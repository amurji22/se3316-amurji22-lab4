import React, { useState, useEffect } from 'react';
import './login.css';
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  updateProfile
} from 'firebase/auth';
import { auth } from './config/firebase.config';
import axios from 'axios';

function App() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [nickname, setNickname] = useState('');
  const [user, setUser] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  const [isValidEmail, setIsValidEmail] = useState(true); 

  const signUpAction = async () => {
    try {
      const userCred = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCred.user;

      // Update the user profile with the nickname
      await updateProfile(user, { displayName: nickname });
      await sendEmailVerification(user);
      setSuccessMessage('Sign up successful! Please check your email for verification.');
      setErrorMessage(null);
      setEmail(''); 
      setPassword(''); 
      setNickname('');
      setIsValidEmail(true); 
    } catch (error) {
      console.error(error.message);
      setErrorMessage(error.message);
    }
  };

  const loginAction = async () => {  
    try {
      const userCred = await signInWithEmailAndPassword(auth, email, password);
      const user = userCred.user;
      if (!user.emailVerified) {
        setErrorMessage('Please verify your email before continuing to log in.');
      } else {
        setErrorMessage(null);
        setSuccessMessage('Login successful!');
        // Make a PUT request to the backend
        await axios.put(`${process.env.REACT_APP_BACKEND_URL}/api/users`, {
          username: email, // Using email as username
          password: password,
          nickname: nickname,
        });
      }
    } catch (error) {
      console.error(error.message);
  
      switch (error.code) {
        case 'auth/invalid-login-credentials':
          setErrorMessage('Invalid email or password entered or no account found with that email');
          break;
        case 'auth/user-disabled':
          setErrorMessage('Please contact the site administrator your account is disabled');
          break;
        default:
          setErrorMessage('An error occurred. Please try again.');
      }
    }
  };

  const ResetEmail = async (auth, email) => {
      try {
        await sendPasswordResetEmail(auth, email);
        setSuccessMessage('Success, please check your email for the reset link.');
        setErrorMessage(null);
    } catch (error) {
        console.error(error.message);
        setSuccessMessage('An error occurred. Please try again.');
        setErrorMessage(null);
    }
  };

  const nickname_popup = () => {
    alert("Nickname is not stored until email is verified!! Recommended to leave blank until log in");
  }


  useEffect(() => {
    auth.onAuthStateChanged((userCred) => {
      if (userCred) {
        const { email, emailVerified } = userCred;
        setUser({ email, emailVerified });
      } else {
        setUser(null);
      }
    });
  }, []);

  return (
    <main>
      <div className="container">
        <InputField
          type={'email'}
          placeholder={'Enter your Email'}
          handleChange={(data) => setEmail(data)}
          setIsValidEmail={setIsValidEmail}
        />
        <input
          value={password}
          type={'password'}
          placeholder={'Enter your Password'}
          onChange={(data) => setPassword(data.target.value)}
        />
        <input
          value={nickname}
          type="text"
          placeholder="Enter your Nickname"
          onChange={(e) => setNickname(e.target.value)}
          onClick={nickname_popup}
        />
        <button type="button" onClick={signUpAction} disabled={!isValidEmail}>
          Sign Up
        </button>
        <button type="button" onClick={loginAction} disabled={!isValidEmail}>
          Log In
        </button>
        <button type="button" onClick={() => ResetEmail(auth, email)} disabled={!isValidEmail}>
          Reset Password
        </button>
        {errorMessage && <p className="error-message">{errorMessage}</p>}
        {successMessage && <p className="success-message">{successMessage}</p>}
      </div>
    </main>
  );  
}

function InputField({ placeholder, handleChange, setIsValidEmail }) {
  const [inputValue, setInputValue] = useState('');
  const [isValidEmail, setIsValid] = useState(true);

  const handleChangeEvent = (e) => {
    const value = e.target.value;
    setInputValue(value);
    const isValid = value.includes('@') && value.includes('.');
    setIsValid(isValid);
    setIsValidEmail(isValid); 
    handleChange(value);
  };

  return (
    <div>
      <input
        value={inputValue}
        type="email" 
        placeholder={placeholder}
        onChange={handleChangeEvent}
        className={isValidEmail ? '' : 'invalid-input'}
      />

      {!isValidEmail && <p className="error-message">Invalid email format.</p>}
    </div>
  );
}

export default App;
