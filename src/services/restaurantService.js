import { query, where, collection, addDoc } from "firebase/firestore";
import { getDocs, doc, getDoc } from "firebase/firestore";
import { documentId, updateDoc, serverTimestamp, deleteDoc } from "firebase/firestore";

import config from '../services/firebaseConfig';
import * as constants from '../constants'
import { foodCategory, restaurantInfo, tableInfo } from "../models";
import {addTables} from '../services/tableService'

import {
  ref,
  uploadBytes,
  getDownloadURL
  } from "firebase/storage";
import { getRestaurantId } from "./authService";


export const getRestaurantTableCount = async () => {
    try {
        var restaurantId = getRestaurantId();
        const snap = await getDoc(doc(config.db, constants.RESTAURANT_INFO, restaurantId))

        if (snap.exists()) {
            return Promise.resolve(snap.data().numberOfTables);
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


/**
 * This method is to add the restaurant details 
 * @type {id} returns documentId/porterId of newly added porter
 * @param {restaurantInfo}  porter detail
 */
export const addRestaurant = async (data = new restaurantInfo()) => {

    try {
        const restaurantInfoRef = await addDoc(collection(config.db, constants.RESTAURANT_INFO), Object.assign({}, data));
        return Promise.resolve(restaurantInfoRef.id);
    } catch (e) {
        console.error("Error while adding restaurant: ", e);
        return "error";
    }
}


/**
 * This method is to check the Uniqueness of the restaurant name and the emailid.
 * @param {*} emailId 
 * @param {*} restaurantName 
 * @returns 
 */
export const checkRestaurantUniqueness = async (emailId, restaurantName) => {

    try {
        const q = query(collection(config.db, constants.RESTAURANT_INFO),
            where("emailId", "==", emailId),
            where("restaurantName", "==", restaurantName)
        );
        const querySnapshot = await getDocs(q);
        console.log('count: ', querySnapshot.size);

        if (querySnapshot.size > 0) {
            return true;
        } else {
            return false;
        }
    }
    catch (err) {
        console.log(err)
        alert(err)
    }
}


export const uploadRestuarantLogo = async (fileObj) => {
    try{
        let restaurantId = getRestaurantId();
        var url = await downloadRestuarantLogoUrl(fileObj);
        const docRef = doc(config.db, constants.RESTAURANT_INFO, restaurantId)  ;
       
        const updatedResult = await updateDoc(docRef, {
            restaurantLogoUrl : url
        });
        return url;
    }
    catch (e){
        console.log("error",e);
    }
  

}
export const downloadRestuarantLogoUrl = async (fileObj) => {
    try {
        let restaurantId = getRestaurantId();
        const storageRef = ref(config.storage, `/restaurant_logo/${restaurantId}/${fileObj.name}`);
        return await uploadBytes(storageRef, fileObj).then((res) => {
            return getDownloadURL(storageRef)
                .then((url) => {
                    return Promise.resolve(url);
                });
        });
    } catch (error) {
        console.error(error);
    }
}


// export const addFoodCategory = async (data = new foodCategory()) => {
//     try {
//          // var allCat  = "Soups|Startes|Salad|Startes|Salad|Antipaste|Soups|Startes|Soups|Salad|Startes|Cold Starters|Warm Starters|Cheese Starters|Starters|Main course|Main dish|Pizza|Noodles|Scalloped|Meet|Fish|Meet|Fish|Cheese|Sausages|Swabian classics|bavarian classics|Lamp|Beef|Pork|Casserole|Kids Menu|Bread|Main DIsh|Side dishes|seasonal recommendations|Specials|Dessert|Ice cream|Dessert|Selfmade dessert|Dessert|Soft Drinks|Alcoholic beverages|Beverages|Cocktails|Long Drinks|Shots|Bottle Beer|Draft Beer|Aperitive|Wine|White wine|Red wine|Wine|Brandy|Liqueur";
//         // var foodCategoryArr = allCat.split("|");
//         // foodCategoryArr.forEach((category) => {
//         //   console.log(category);      
//         //   var data = new foodCategory()
//         //   data.categoryName = category
//         //   const status = restaurantService.addFoodCategory(data);
        
//         // })
//         // console.log('restaurant in service', data)
//         const fcRef = await addDoc(collection(config.db, "foodCategory"), Object.assign({}, data));
//         console.log("Document written with ID: ", fcRef);  
//         console.log(fcRef.id);
//         return "success";
        
//     } catch (e) {
//         console.log("Error adding document: ", e);
//         return "error";
//     }
// }


export const getRestaurantIdByUserId = async (createdBy) => {
   console.log("createdBy", createdBy)

        try {
            const q = query(collection(config.db, constants.RESTAURANT_INFO),
                where("createdBy", "==", createdBy),
                
            );
            const querySnapshot = await getDocs(q);
            console.log('count: ', querySnapshot);
            var restaurant = []
            querySnapshot.forEach((rDoc) => {
                restaurant = [...restaurant, {
                    ...rDoc.data(),
                    id: rDoc.id,
                }]
            });
            return Promise.resolve(restaurant);
           
        }
        catch (err) {
            console.log(err)
            alert(err)
        }
    
}

export const getRestaurantInfo = async () => {
    try {
       
        var restaurantId = getRestaurantId();
        const snap = await getDoc(doc(config.db, constants.RESTAURANT_INFO, restaurantId))
        if (snap.exists()) {
            return Promise.resolve(snap.data());
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




export const getRestaurantIdByPorterUserId = async (createdBy) => {
    console.log("createdBy", createdBy)
 
         try {
             const q = query(collection(config.db, constants.PORTER_INFO),
                 where("createdBy", "==", createdBy),
                 
             );
             const querySnapshot = await getDocs(q);
             console.log('count: ', querySnapshot);
             var restaurant = []
             querySnapshot.forEach((rDoc) => {
                 restaurant = [...restaurant, {
                     ...rDoc.data(),
                     id: rDoc.id,
                 }]
             });
             return Promise.resolve(restaurant);
            
         }
         catch (err) {
             console.log(err)
             alert(err)
         }
     
 }

export const updateNumberOfTables = async (numberOfTables) => {
    try {

    const restaurantId = getRestaurantId();
       console.log(restaurantId)
    const docRef = doc(config.db, constants.RESTAURANT_INFO, restaurantId);
      var rInfo = {};
      rInfo.numberOfTables = numberOfTables
      
      const updatedRestaurant = await updateDoc(docRef, rInfo);
      for(var i = 1; i <= numberOfTables; i++){
        var tblInfo = new tableInfo();
        tblInfo.restaurantId = getRestaurantId();
        tblInfo.specialTable = false;        
        tblInfo.tableNumber = parseInt(i); //i.toString();
        addTables(tblInfo)
      }

      console.log("Updated successfully",docRef.id) ;
      return Promise.resolve(docRef.id); 
      
    } catch (e) {
      console.error("Error adding document: ", e);
      return Promise.resolve("error");
    }
  };
