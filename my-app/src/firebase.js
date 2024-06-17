// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyARWheHK_miEax3bIhf_7IsdjKbL007xqk",
    authDomain: "acquired-backup-362501.firebaseapp.com",
    projectId: "acquired-backup-362501",
    storageBucket: "acquired-backup-362501.appspot.com",
    messagingSenderId: "1067869484562",
    appId: "1:1067869484562:web:9169daaae9f4b1e25fcacb",
    measurementId: "G-RFH523KT3P"
  };

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
