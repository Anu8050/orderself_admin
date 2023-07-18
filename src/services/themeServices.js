import { query, where, collection, addDoc, documentId } from "firebase/firestore";
import { getDocs, doc, getDoc } from "firebase/firestore";
import { updateDoc, serverTimestamp, deleteDoc } from "firebase/firestore";

import config from '../services/firebaseConfig';
import * as constants from '../constants'
import { menuInfo } from "../models";
import {
    ref,
    uploadBytes,
    getDownloadURL, 
    } from "firebase/storage";

import { getRestaurantId } from "./authService";

import * as authService from '../services/authService';


export const getSavedThemes = async () => {
    try {
        const restaurantId = getRestaurantId()
        const q = query(collection(config.db, "configThemes"));
        const querySnapshot = await getDocs(q);

        let themes = []
        querySnapshot.forEach((themesDoc) => {
            themes = [...themes, {
                ...themesDoc.data(),
                id: themesDoc.id,
            }]
        });
        return Promise.resolve(themes);
    } catch (e) {
        console.error("Error occured", e);
        //This needs to be more elaborated.
        return e; //return an error object
    }
}

export const updateRestaurantThemeId = async (themeId) => {
    try {
    const restaurantId = getRestaurantId();
    const docRef = doc(config.db, constants.RESTAURANT_INFO, restaurantId);
      var rInfo = {};
      rInfo.themeId = themeId;      
      const updatedRestaurant = await updateDoc(docRef, rInfo);
      console.log("Updated successfully",docRef.id) ;
      return Promise.resolve(docRef.id);       
    } catch (e) {
      console.error("Error adding document: ", e);
      return Promise.resolve("error");
    }
  };

  export const getRestaurantThemeId = async () => {
    try {
       
        var restaurantId = getRestaurantId();
        const snap = await getDoc(doc(config.db, constants.RESTAURANT_INFO, restaurantId))
        if (snap.exists()) {
            return Promise.resolve(snap.data().themeId);
        }
        else {
            console.log("No such document")
            return [];
        }
    }
    catch (e) {
        console.log(e);
        //This needs to be more elaborated.
        return e; //return an error object
    }
}