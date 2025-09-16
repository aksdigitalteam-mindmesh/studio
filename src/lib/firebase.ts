// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyArEt98FlADZ9bdoRG6skivsPO_UQAixkI",
  authDomain: "fitboost-ktlnv.firebaseapp.com",
  projectId: "fitboost-ktlnv",
  storageBucket: "fitboost-ktlnv.appspot.com",
  messagingSenderId: "899041749945",
  appId: "1:899041749945:web:e60788b5beaaa568206468"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export { app };
