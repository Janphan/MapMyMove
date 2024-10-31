// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import 'firebase/auth';
import { getFirestore } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyAAYXIJC0XpyxEqmBNl2XJboZ-P3tk8OK8",
    authDomain: "movemymap-90643.firebaseapp.com",
    projectId: "movemymap-90643",
    storageBucket: "movemymap-90643.appspot.com",
    messagingSenderId: "40732641916",
    appId: "1:40732641916:web:ece6da5d79ee271add97f9",
    measurementId: "G-3LY9PLMGV5"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const auth = getAuth(app);
export const db = getFirestore(app);
