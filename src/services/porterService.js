import {
  query,
  where,
  collection,
  addDoc,
  getDocs,
  doc,
  getDoc,
  deleteDoc,
  documentId,
  updateDoc,
  serverTimestamp,
} from "firebase/firestore";

// const functions = require('firebase-functions');
// const nodemailer = require('nodemailer');
// import nodemailer from 'nodemailer'
// import functions from 'firebase-functions'

import config from "../services/firebaseConfig";
import * as constants from "../constants";
import { porterInfo } from "../models";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { getFunctions, httpsCallable } from "firebase/functions";
import { getRestaurantId } from "./authService";
const functions = getFunctions();


/**
 * This function is to get all the porter details based on the restaurantId
 */
export const getPorters = async (restaurantId) => {
  try {
    
    const q = query(
      collection(config.db, constants.PORTER_INFO),
      where("restaurantId", "==", restaurantId)
    );
    const querySnapshot = await getDocs(q);

    let porters = [];
    querySnapshot.forEach((porterDoc) => {
      porters = [
        ...porters,
        {
          ...porterDoc.data(),
          id: porterDoc.id,
        },
      ];
    });

    return Promise.resolve(porters);
  } catch (e) {
    //This needs to be more elaborated.
    return e; //return an error object
  }
};

/**
 * This method is to get a porter details based on the restaurantId and porterId
 */
export const getPorter = async (restaurantId, porterId) => {
  try {
    const snap = await getDoc(doc(config.db, constants.PORTER_INFO, porterId));

    if (snap.exists()) {
      return Promise.resolve(snap.data());
    } else {
      console.log("No such document");
      return [];
    }
  } catch (e) {
    console.log(e);
    //This needs to be more elaborated.
    return e; //return an error object
  }
};

/**
 * This method is to add the porter details to a restaurant.
 * @type {id} returns documentId/porterId of newly added porter
 * @param {porterInfo}  porter detail
 */
export const addPorter = async (data = new porterInfo(), profileImg) => {
  try {
    var url  = "";
    if (profileImg != null) {
        var url = await uploadPorterProfilePicture(profileImg);
        data.profileUrl = url;
        data.profileImageName = profileImg.path
    }

    const docRef = await addDoc(
      collection(config.db, constants.PORTER_INFO),
      Object.assign({}, data)
    );
    // console.log("Document written with ID: ", docRef.id);
    return docRef.id,true;
  } catch (e) {
    console.error("Error adding document: ", e);
    return false;
  }
};

export const TriggerPorterRegistration = async (email, restaurantName, restaurantId) => {
  try {        
    var data = {
      email: email,
      restaurantName: restaurantName,
      restaurantId: restaurantId
    }
    const docRef = await addDoc(
      collection(config.db, constants.PORTER_REGISTRATION),
      Object.assign({}, data)
    );
    console.log("Document written with ID: ", docRef.id);
    return Promise.resolve(docRef.id);
  } catch (e) {
    console.error("Error adding document: ", e);
    return Promise.resolve("error");
  }
};

export const uploadPorterProfilePicture = async (fileObj) => {
  try {
    
      const storageRef = ref(config.storage, `/PorterImages/${fileObj.name}`);
      return await uploadBytes(storageRef, fileObj).then((res) => {
        return getDownloadURL(storageRef).then((url) => {
          return Promise.resolve(url);
        });
      });
   
  } catch (error) {
    console.error(error);
  }
};

/**
 * This method is to update the porter details based on the restaurantId and porterId
 */
export const updatePorter = async (data = new porterInfo(), profileImg, porterId) => {
  try {
    const docRef = doc(config.db, constants.PORTER_INFO,porterId);
    var url  = "";
    
    var porter = {};
    if (profileImg != null) {
        var url = await uploadPorterProfilePicture(profileImg);
        porter.profileUrl = url;
        porter.profileImageName = profileImg.path
    }    
    porter.firstName = data.firstName;
    porter.lastName = data.lastName;
    porter.dob = data.dob;
    porter.gender = data.gender;
    porter.address = data.address;
    porter.phone = data.phone;

    
    const updateprofileUrl = await updateDoc(docRef, porter);
    console.log("Updated successfully",docRef.id)  ; 
    return true; 
    
  } catch (e) {
    console.error("Error adding document: ", e);
    return false;
  }
};

/**
 * This method is to delete the porter from a restaurant.
 */
export const deletePorter = async (restaurantId, porterId) => {
  try {
    await deleteDoc(doc(config.db, constants.PORTER_INFO, porterId));
    return true;
  } catch (e) {
    console.error("Error adding document: ", e);
    return false;
  }
};

export const deletePorterById = httpsCallable(functions, 'deletePorterById');

export const updatePorterStatus = async (porterId, newStatus) => {
  try {
    let porterId = "";
    const docRef = doc(config.db, "PorterInfo", porterId);

    const updateStatus = await updateDoc(docRef, {
      status: newStatus,
    });
    console.log("update status successful");
  } catch (e) {
    console.error("Error adding document: ", e);
  }
};

export const checkPorterEmailUniqueness = async (emailId) => {
  try {   
      const restaurantId = getRestaurantId()     
      const q = query(collection(config.db, constants.PORTER_REGISTRATION), where("email", "==", emailId),where("restaurantId", "==", restaurantId));       
      const querySnapshot = await getDocs(q);        
      return Promise.resolve((querySnapshot.size > 0) ? true: false);
  }catch(error){}
}

// export const checkPorterEmailUniqueness = async (emailId) => {
//   try {   
//       const restaurantId = getRestaurantId()     
//       const q = query(collection(config.db, constants.PORTER_REGISTRATION), where("email", "==", emailId),where("restaurantId", "==", restaurantId));       
//       const querySnapshot = await getDocs(q);        
//       return Promise.resolve((querySnapshot.size > 0) ? true: false);
//   }catch(error){}
// }


export const menuItemCsvUpload = httpsCallable(functions, 'menuItemCsvUpload');


  export const getPorterIdByTableNum = async (tableId) => {
    try {
        const snap = await getDoc(doc(config.db, constants.TABLE_INFO, tableId))
        if (snap.exists()) {
            return Promise.resolve(snap.data().porterId);
        }
        else {
            console.log("No such document")
            return "";
        }
    }
    catch (e) {
        console.error("Error Occurred", e);
        return e; 
    }
}