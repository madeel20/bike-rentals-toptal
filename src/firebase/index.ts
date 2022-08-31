import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import "firebase/storage";
import "firebase/database"

const firebaseConfig = {
    apiKey: "AIzaSyCd8g2Umw3pkjR90YER4BZ0A6vmnwNrwYw",
  authDomain: "bike-rentals-toptal-11607.firebaseapp.com",
  projectId: "bike-rentals-toptal-11607",
  storageBucket: "bike-rentals-toptal-11607.appspot.com",
  messagingSenderId: "196042668761",
  appId: "1:196042668761:web:517eb23bc0bfe5f7f59cc8"
};

firebase.initializeApp(firebaseConfig);
export const auth = firebase.auth();
export const firestore = firebase.firestore();
export const storage = firebase.storage();
export const database = firebase.database();
export const googleProvider = new firebase.auth.GoogleAuthProvider();
