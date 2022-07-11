// Import the functions you need from the SDKs you need
import { initializeApp, getApp, getApps } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDgNLec9iAS8SvY-8haXqVB_UYWxhisCSA",
  authDomain: "instagram2-93b9b.firebaseapp.com",
  projectId: "instagram2-93b9b",
  storageBucket: "instagram2-93b9b.appspot.com",
  messagingSenderId: "90208430612",
  appId: "1:90208430612:web:e2dd2f50c4edcaaf3e9501",
  measurementId: "G-VD34GWWRY4",
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const analytics = getAnalytics(app);

const db = getFirestore();
const storage = getStorage();

export { app, analytics, db, storage };
