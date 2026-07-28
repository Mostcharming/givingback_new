// Import the functions you need from the SDKs you need

import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyBCb3hryfiKl2EH9gwVLiZGMAP_eo-UmWg",
  authDomain: "giving-back-auth.firebaseapp.com",
  projectId: "giving-back-auth",
  storageBucket: "giving-back-auth.firebasestorage.app",
  messagingSenderId: "699019689209",
  appId: "1:699019689209:web:688ab9570cd66c69cb7628",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);

export default app;
