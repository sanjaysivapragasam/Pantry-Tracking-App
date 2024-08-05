// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import axios from "axios";
import {getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth'
//import { getAnalytics } from "firebase/analytics";
import { getFirestore } from 'firebase/firestore';
require('dotenv').config()

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: "inventory-management-c68a4.firebaseapp.com",
  projectId: "inventory-management-c68a4",
  storageBucket: "inventory-management-c68a4.appspot.com",
  messagingSenderId: "64219355164",
  appId: "1:64219355164:web:22721e2973c7fd0844a7d9",
  measurementId: "G-42E0TYW6C0"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
//const analytics = getAnalytics(app);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
const firestore = getFirestore(app);

// export to access firestone files
export { app, auth, provider, firestore }