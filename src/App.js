import React, { useState, useEffect } from 'react';
import './App.css';
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
  signInWithEmailAndPassword,
} from 'firebase/auth';
import { auth } from './config/firebase.config';

function App() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [user, setUser] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  const [isValidEmail, setIsValidEmail] = useState(true); // New state for email validity

  const signUpAction = async () => {
    try {
      const userCred = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCred.user;
      await sendEmailVerification(user);
      setSuccessMessage('Sign up successful! Please check your email for verification.');
      setErrorMessage(null);
      setEmail(''); // Clear email field
      setPassword(''); // Clear password field
      setIsValidEmail(true); // Reset email validity
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
        <button type="button" onClick={signUpAction} disabled={!isValidEmail}>
          Sign Up
        </button>
        <button type="button" onClick={loginAction} disabled={!isValidEmail}>
          Log In
        </button>
        {errorMessage && <p className="error-message">{errorMessage}</p>}
        {successMessage && <p className="success-message">{successMessage}</p>}
      </div>
      {user && (
        <div>
          <p>{user?.email}</p>
          <p>{user?.emailVerified ? 'True' : 'False'}</p>
        </div>
      )}
    </main>
  );  
}

function InputField({ placeholder, handleChange, setIsValidEmail }) {
  const [inputValue, setInputValue] = useState('');
  const [isValidEmail, setIsValid] = useState(true);

  const handleChangeEvent = (e) => {
    const value = e.target.value;
    setInputValue(value);

    // Basic email validation by checking for the presence of '@' and '.'
    const isValid = value.includes('@') && value.includes('.');
    setIsValid(isValid);
    setIsValidEmail(isValid); // Call the setIsValidEmail function passed from the parent component

    handleChange(value);
  };

  return (
    <div>
      <input
        value={inputValue}
        type="email" // Make sure the input type is set to 'email'
        placeholder={placeholder}
        onChange={handleChangeEvent}
        className={isValidEmail ? '' : 'invalid-input'}
      />

      {!isValidEmail && <p className="error-message">Invalid email format.</p>}
    </div>
  );
}

export default App;
