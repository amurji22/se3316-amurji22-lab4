import React, { useState, useEffect } from 'react'; 
import './App.css';
import { createUserWithEmailAndPassword, sendEmailVerification } from 'firebase/auth';
import { auth } from "./config/firebase.config";

function App() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState(null);

  const signUpAction = async () => {
    await createUserWithEmailAndPassword(auth, email, password).then(async (userCred) => {
      const user = userCred.user;
      await sendEmailVerification(user);
      console.log("Success");
    });
  };

  useEffect(() => { 
    auth.onAuthStateChanged((userCred) => {
      const { email, emailVerified } = userCred;
      setUser({ email, emailVerified });
    });
  }, []);

  return (
    <main>
      <div className="container">
        <InputField type={"email"} placeholder={"Enter your Email"} handleChange={(data) => setEmail(data)} />
        <InputField type={"password"} placeholder={"Enter your Password"} handleChange={(data) => setPassword(data)} />
        <button type="button" onClick={signUpAction}>Sign Up</button>
      </div>
      {user && (
        <div>
          <p>{user?.email}</p>
          <p>{user?.emailVerified ? "True" : "False"}</p>
        </div>
      )}
    </main>
  );
}

function InputField({ placeholder, handleChange, type }) {
  const [inputValue, setInputValue] = useState("");
  const handleChangeEvent = (e) => {
    setInputValue(e.target.value);
    handleChange(e.target.value);
  };
  return (
    <input value={inputValue} type={type} placeholder={placeholder} onChange={handleChangeEvent} />
  );
}

export default App;
