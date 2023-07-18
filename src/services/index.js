// // import { initializeApp } from "firebase/app";
// // import { getFirestore } from "@firebase/firestore";
// // import { collection,addDoc} from "firebase/firestore";

// // import React from 'react';
// import { useState, useEffect } from "react";
// // import {
// //   ref,
// //   uploadBytesResumable,
// //   uploadBytes,
// //   getDownloadURL, getStorage
// //   } from "firebase/storage";
// import {
//   query,
//   onSnapshot,
//   doc, getDoc, updateDoc,
// } from "firebase/firestore";



// import {
//   ref,
//   uploadBytesResumable,
//   uploadBytes,
//   getDownloadURL, getStorage, 
//   } from "firebase/storage";

// // //vijet
// // const firebaseConfig = {
// //   apiKey: "AIzaSyA8FGZGJX4GXz_EyWOeANP8o-SpG8tX6-M",
// //   authDomain: "orderself-15a79.firebaseapp.com",
// //   projectId: "orderself-15a79",
// //   storageBucket: "orderself-15a79.appspot.com",
// //   messagingSenderId: "1095910323161",
// //   appId: "1:1095910323161:web:b2bd3885e0abc081861fc8",
// //   measurementId: "G-F3PL6KEMLD"
// // };

// // const app = initializeApp(firebaseConfig);
// // export const db = getFirestore(app);
// // export const storage = getStorage(app);



// // const restaurantDocRef = collection(db, "RestaurantInfotestdemo");
// // const addMenuDocRef = collection(db, "MenuItems");
// // const addPorterDocRef = collection(db,"Porters")
// // const batchAddDocRef = collection(db,"Users")



// // //This method is to add the restaurant details.
// //   export const addRestaurant = async (data) =>
// //   {    
// //     console.log(data);    
// //     return await addDoc(restaurantDocRef, data).then(restaurantDocRef => {
// //         console.log(restaurantDocRef);
// //         let documentId = restaurantDocRef.id
// //         let parentPath = restaurantDocRef.parent.path;
// //         sendActivationEmail(documentId, parentPath);        
// //     }).catch(err => {
// //         console.log(err);
// //         //error occurred message from toast.
// //     });    
// //   }

// //   //This method is to send the email activation. 
// //   export const sendActivationEmail = async(documentId, parentPath) => 
// //   {
// //     let activationURL = `http://localhost:3000?activate=${documentId}&path=${parentPath}`
    
// //     let htmlTemplate = `Welcome to OrderSelf <br/> Please click the below button to activate your registration.<br/>
// //                         <button onclick="${activationURL}" target="">Activate</button> <br/> <br/>
// //                         Thank you for Registering with us.
// //                         <strong>Team OrderSelf</strong>`;
    
// //     // admin.firestore().collection('mail').add({
// //     //   to: "reactdeveloper@phyelements.com",
// //     //   message: {
// //     //     subject: 'OrderSelf Restaurant Registration Activation',
// //     //     html: htmlTemplate,
// //     //   },
// //     // })

                
// //     //put your code here to send the email.
// //   }

// //   export const addMenuItem = async (data) =>
// //   {    
// //     console.log(data);    
// //     return await addDoc(addMenuDocRef, data).then(addMenuDocRef => {
// //         console.log(addMenuDocRef);
// //         let menuItemId = addMenuDocRef.id   
// //              var b = 0
// //         let a = 1/b;
// //         return menuItemId;
// //     }).catch(err => {
// //         console.log(err);
// //         return "error";
// //         //error occurred message from toast.
// //     });    
// //   }

// //   export const uploadMenuItemImage = async(fileObj) => {
// //     const storageRef = ref(storage, `/MenuImages/${fileObj.name}`);
// //     return await uploadBytes(storageRef, fileObj).then((storageRef) => {  
// //       console.log(storageRef);
// //       return "uploaded"
// //     }).catch(err => {
// //       console.log(err);
// //       return "error";
// //     });
// //   }

// //   //lets add the imageURL



// // export const uploadRestuarantLogo = async (fileObj) => {
// //   let restaurantId = "x6KgcobZpIrGnW4OkXAU";
  
// //   const storageRef = ref(storage, `/restaurant_logo/${restaurantId}/${fileObj.name}`);

// //   // const uploadTask = await uploadBytes(storageRef, fileObj);
// //   // return uploadTask;
// //   return await uploadBytes(storageRef, fileObj).then((snapshot) => {
// //     // console.log(snapshot);
// //     return 'success';
// //   }).catch(err => {
// //     console.log(err);
// //     return "error";
// //   });
// // }


// //   export const addPorter = async (data) =>{
// //     console.log(data);    
    
// //     //file to be added seperately

// //     return await addDoc(addPorterDocRef, data).then(addPorterDocRef => {
// //         console.log(addPorterDocRef);
// //         let porterId = addPorterDocRef.id        
        
// //     }).catch(err => {
// //         console.log(err);
// //         //error occurred message from toast.
// //     }); 
// //   }
// //   export const uploadPorterImage = async(fileObj) => {

// //     const storageRef = ref(storage, `/PorterImages/${fileObj.name}`);
// //     return await uploadBytes(storageRef, fileObj).then(() => {      
// //     });
// //   }
// //   //Uploding Csv file Method
// //   export const uploadCsv = async(fileObj) => {
// //     const storageRef = ref(storage, `/CsvFiles/${fileObj.name}`);
// //     return await uploadBytes(storageRef, fileObj).then(() => { 
// //       console.log("uploaded succesfully")     
// //     }).catch(err => {
// //       console.log(err);

// //     });
// //   }
// //   export const batchAdd = async (menuCollection) => {

//     // let menuCollection = [{ "menudetail1": 1 }, { "menudetail2": 2 }, { "menudetail": 3 }]; //csv
//     //  const batch = db.batch();
//     menuCollection.forEach((menuitem) => {
//       console.log(menuitem)
//       // var docRef = db.collection("users").doc(); //automatically generate unique id
//       addDoc(batchAddDocRef, menuitem)
//     });
//   }

//   export const FetchCollection = (coll) => {
//     const q = query(collection(db, coll));
//     return q ;
//     }
  
//   // get by id document
//   export const FetchDocument =async (coll,id1) => {
//     const docRef = doc(db,coll,id1);
//    return await getDoc(docRef)
// //   }

//   // Updating method for table status
//   export const updateTable = async(tabledId,tableStatus) =>{
//     const docref =doc(db,"RestaurantTables",tabledId);
//     try{
//       await updateDoc(docref,{status:tableStatus,} )
//     }
//     catch(err){
//       console.log(err)
//       alert(err)
//     }
//   }
  
