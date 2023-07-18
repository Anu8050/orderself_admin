import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional  

//dev configuration
const firebaseConfig = {
    apiKey: "AIzaSyCkp0kAhmawcp9G90PP7D-M67Kj3HJzuwg",
    authDomain: "orderselfdb.firebaseapp.com",
    projectId: "orderselfdb",
    storageBucket: "orderselfdb.appspot.com",
    messagingSenderId: "587486512635",
    appId: "1:587486512635:web:7d455844fc03712a76f75e",
    measurementId: "G-4PPYBK2DCV"   
};

// const firebaseConfig = {
//     apiKey: "AIzaSyAkSbv1CveCQhoTnm1Ayyt6vmObEm0WHDc",
//     authDomain: "orderselfapp.firebaseapp.com",
//     projectId: "orderselfapp",
//     storageBucket: "orderselfapp.appspot.com",
//     messagingSenderId: "110482950758",
//     appId: "1:110482950758:web:fe8ffde766b28d1518fba7",
//     measurementId: "G-Q51FD0W702"
//   };

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// const analytics = getAnalytics(app);
// console.log("Getting the db object")
const db = getFirestore();

// Firebase storage reference
const storage = getStorage(app);

const auth = getAuth(app);

var config = { db, storage, auth };

export default config;
