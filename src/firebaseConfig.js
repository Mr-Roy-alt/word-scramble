// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from 'firebase/firestore';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyCg5gPwRkZ9dtx7LTaZxjnyUpJeEfi-lY0",
    authDomain: "word-scramble-app-bd935.firebaseapp.com",
    projectId: "word-scramble-app-bd935",
    storageBucket: "word-scramble-app-bd935.appspot.com",
    messagingSenderId: "336969435221",
    appId: "1:336969435221:web:46db8fb49a9ae709182cdc"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app)
export const auth = getAuth(app);