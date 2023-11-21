// Import the functions you need from the SDKs you need
import { initializeApp, getApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";


// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBq72T2vDRIznk8bmqCk8MKLqmeNDee0rA",
  authDomain: "amurji22-7b454.firebaseapp.com",
  projectId: "amurji22-7b454",
  storageBucket: "amurji22-7b454.appspot.com",
  messagingSenderId: "235556417116",
  appId: "1:235556417116:web:a606e76ed296a0765ec099",
  measurementId: "G-M21NM0D94F"
};


const app = getApps.length > 0 ? getApp() : initializeApp(firebaseConfig)
const auth = getAuth(app)

export { auth };
