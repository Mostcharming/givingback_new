// Import the functions you need from the SDKs you need

import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";


const firebaseConfig = {
    apiKey: "AIzaSyDeWU2kL6lRrG3_6eOquh09EeC80u8Pk7I",
    authDomain: "givingbackng-1c6c0.firebaseapp.com",
    projectId: "givingbackng-1c6c0",
    storageBucket: "givingbackng-1c6c0.appspot.com",
    messagingSenderId: "228716598951",
    appId: "1:228716598951:web:2af3fa1d78fdba311d6d82",
    measurementId: "G-XQPRDWTY46"
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);

export default app;