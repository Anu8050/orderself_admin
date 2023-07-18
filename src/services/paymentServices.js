import { query, where, collection, addDoc ,getDocs, doc, updateDoc} from "firebase/firestore";
import config from '../services/firebaseConfig';
import * as constants from '../constants'
import { getRestaurantId ,getUserLocal } from "./authService";


export const paymentDetails= async (
  payByCashEnabled,
  paypalEnabled,
  gPayApplePayEnabled,
  paymentInAdvanceEnabled  
  ) => {
    try {       
      let date = new Date().toLocaleDateString("en-IN");
         const restaurantId = getRestaurantId()
         const userId = getUserLocal()
        const docRef = await addDoc(collection(config.db,constants.ACCOUNT_DETAILS),
        {
          payByCashEnabled:payByCashEnabled,
          paypalEnabled:paypalEnabled,
          gPayApplePayEnabled:gPayApplePayEnabled,
          paymentInAdvanceEnabled:paymentInAdvanceEnabled,
          restaurantId:restaurantId,
          createdDate:date,
          createdBy:userId.uid

        }
        );
        console.log("Document written with ID: ", docRef.id);
        return docRef.id,true;
    } catch (e) {
        console.error("Error adding document: ", e);
        return "error";
    }
}


export const checkpaymentDetailsUniqueness = async (accnum) => {
    try {   
        const q = query(collection(config.db, constants.ACCOUNT_DETAILS), where("accountNumber", "==", accnum));       
        const querySnapshot = await getDocs(q);        
        return Promise.resolve((querySnapshot.size > 0) ? true: false);
    }catch(error){}
  }

  
  export const checkpaymentDetailsIsExists = async () => {
    try {  
        const restaurantId = getRestaurantId()      
        const q = query(collection(config.db, constants.ACCOUNT_DETAILS), where("restaurantId", "==", restaurantId));       
        const querySnapshot = await getDocs(q);        
        return Promise.resolve((querySnapshot.size > 0) ? true: false);
    }catch(error){}
  }

  export const getPaymentDetails = async () => {
    try {
        const restaurantId = getRestaurantId()
        const q = query(
        collection(config.db, constants.ACCOUNT_DETAILS),
        where("restaurantId", "==", restaurantId)
      );
      const querySnapshot = await getDocs(q);
  
      let payments = [];
      querySnapshot.forEach((paymentDoc) => {
        payments = [
          ...payments,
          {
            ...paymentDoc.data(),
            id: paymentDoc.id,
          },
        ];
      });
  
      return Promise.resolve(payments[0]);
    } catch (e) {
      return e;
    }
  };

  export const updatePaymentDetails = async(
    payByCashEnabled,
    paypalEnabled,
    gPayApplePayEnabled,
    paymentInAdvanceEnabled,
    docid
    
    ) =>{
    try{
      let date = new Date().toLocaleDateString("en-IN");
         const restaurantId = getRestaurantId()
         const userId = getUserLocal()
         const docRef =doc(config.db, constants.ACCOUNT_DETAILS,docid); 

         await updateDoc(docRef,{
          payByCashEnabled:payByCashEnabled,
          paypalEnabled:paypalEnabled,
          gPayApplePayEnabled:gPayApplePayEnabled,
          paymentInAdvanceEnabled:paymentInAdvanceEnabled,
          restaurantId:restaurantId,
          createdDate:date,
          createdBy:userId.uid
         });
         console.log("updated successfully", docRef.id);
         return true;
     }
     catch(err){
       console.log(err)
       alert(err)
     }
   }

