import { query, where, collection, addDoc, orderBy, desc, limit, setDoc} from "firebase/firestore";
import { getDocs, doc, getDoc } from "firebase/firestore";
import { documentId, updateDoc, serverTimestamp, deleteDoc } from "firebase/firestore";

import config from '../services/firebaseConfig';
import * as constants from '../constants'
import { tableInfo } from "../models";
import { EventAvailable } from "@mui/icons-material";
import { getRestaurantId } from "./authService";


/**
 * This function is to get all the table details based on the restaurantId and to fetch the maximum value in the tableNumber
 */
export const getTableDetails = async (restaurantId, porterId = "") => {
    try {
        var q = undefined;
        if (porterId === ""){
            q = query(collection(config.db, constants.TABLE_INFO), where("restaurantId", "==", restaurantId));
       }
       else if (porterId !== ""){
            q = query(collection(config.db, constants.TABLE_INFO), 
                        where("restaurantId", "==", restaurantId)
                        , where("porterId", "==", porterId));
       }
        // const q = query(collection(config.db, constants.TABLE_INFO), where("restaurantId", "==", restaurantId),orderBy("tableNumber", "desc"));
        
        const querySnapshot = await getDocs(q);
        
        let tables = []
     
        querySnapshot.forEach((tableDoc) => {
            tables = [...tables, {
                ...tableDoc.data(),
                id: tableDoc.id,
            }]
        });
        return Promise.resolve(tables);

    } catch (e) {
        //This needs to be more elaborated.
        console.log("error", e)
        return e; //return an error object
    }
}

/**
 * This method is to updateTableAvailability  based on tableId
 */
export const updateTableAvailability = async (tableId, tableStatus) => {
    try {
        console.log(tableId, tableStatus)
        const docRef = doc(config.db, constants.TABLE_INFO, tableId);
        await updateDoc(docRef, {
            status: tableStatus
        });
        return tableStatus;
        console.log("updateTableAvailability - updated successfully");
    }
    catch (err) {
        console.log(err);
        return "error"
    }
}

/**
 * This method is to updatePorterForTable based on tableId
 */
export const updatePorterForTable = async(tableId, porterId) =>{
    try{
        const docRef =doc(config.db,constants.TABLE_INFO,tableId);
        await updateDoc(docRef,{
            porterId:porterId
        });
        return true;
        console.log("updatePortersByTableNumber - updated successfully");
    }
    catch(err){
      console.log(err)
      alert(err)
    }
  }

export const addTables = async (data = new tableInfo()) => {
    try {    
        var exists = checkTableNumberUniqueness(data.tableNumber)

        return exists.then(async (isTableExist) => {
            if (!isTableExist){
                const docRef = await addDoc(collection(config.db, constants.TABLE_INFO), Object.assign({}, data));
                console.log("Document written with ID: ", docRef.id);
                return true;
            }        
        })
       
    } catch (e) {
        console.error("Error adding document: ", e);
        return false;
    }
}


export const checkTableNumberUniqueness = async (tableNumber) => {
    try {   
        const restaurantId = getRestaurantId()     
        const q = query(collection(config.db, constants.TABLE_INFO), where("tableNumber", "==", tableNumber),where("restaurantId", "==", restaurantId));       
        const querySnapshot = await getDocs(q);        
        return Promise.resolve((querySnapshot.size > 0) ? true: false);
    }catch(error){}
}

export const getCurrentOrders = async (tableNumber) => {
    try {
       
        const restaurantId = getRestaurantId() 
        // const q = query(collection(config.db, constants.TABLE_INFO), where("restaurantId", "==", restaurantId),orderBy("tableNumber", "desc"));
        const q = query(collection(config.db, constants.INDIVIDUAL_ORDERS),where("restaurantId", "==", restaurantId), where("tableId", "==", tableNumber.toString()));
       
        const querySnapshot = await getDocs(q);
        const orders = [];
     
        querySnapshot.forEach((doc) => {
            const order = doc.data();
            if (order.status !== "Completed") {
              orders.push({ id: doc.id, ...order });
            }
        });
        console.log(orders);
        return Promise.resolve(orders);


    } catch (e) {
        //This needs to be more elaborated.
        console.log("error", e)
        return e; //return an error object
    }
}


export const updatePayByCash = async (tableNumber, payByCashStatus) => {
    try {
        const restaurantId = getRestaurantId()
        const tableNo = parseInt(tableNumber);
        const q = query(collection(config.db, constants.TABLE_INFO), where("tableNumber", "==", tableNo), where("restaurantId", "==", restaurantId));
        const querySnapshot = await getDocs(q);

        querySnapshot.forEach(async (docs) => {
            const docRef = doc(config.db, constants.TABLE_INFO, docs.id);
            await updateDoc(docRef, {
                isPayByCash: payByCashStatus,
            });
        });

        console.log(
            "updatePayByCash - updated successfully , updated table info id",
            querySnapshot.docs[0].id
        );
    } catch (err) {
        console.log(err);
    }
};

export const getCustomerNameById = async (id) => {
    try {
      const snap = await getDoc(doc(config.db, constants.GUEST_INFO, id));
  
      if (snap.exists()) {
        return Promise.resolve(snap.data().name);
      } else {
        console.log("No such document");
        return [];
      }
    } catch (e) {
      return e;
    }
  };