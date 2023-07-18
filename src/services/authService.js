import { getAuth, sendPasswordResetEmail, createUserWithEmailAndPassword, updateProfile, Error, updatePassword } from "firebase/auth";
import { signInWithEmailAndPassword, signOut, sendEmailVerification } from "firebase/auth";
import { porterInfo, restaurantInfo } from "../models";
import config from './firebaseConfig';
import { addRestaurant } from './restaurantService';
import { addPorter } from './porterService';
import * as porterService from "../services/porterService"

export function signIn(credentials) {  
  return Promise.resolve(signInWithEmailAndPassword(config.auth, credentials.email, credentials.password, credentials.displayName="raju")
    .then((userCredential) => {
      // Signed in 
      console.log(userCredential)
      console.log(userCredential.user.emailVerified, "emailVerified flag")
      if (userCredential) {
        return Promise.resolve(userCredential);
      }
    })
    .catch((error) => {
      console.log("error occurred. Please contact Administrator", error);
      const errorCode = error.code;
      const errorMessage = error.message;
      return Promise.reject(error)
    }));
}


export function addNewUser(emailId, password, phone, restaurantName, firstName, lastName) {
  return createUserWithEmailAndPassword(config.auth, emailId, password)
    .then((auth) => {
      const userName = firstName + " " + lastName;
      sendEmailVerification(config.auth.currentUser)
      updateProfile(config.auth.currentUser, {
        displayName: userName,
      })
        .then(() => {
          console.log("email verification sent");
          var data = new restaurantInfo();
          data.activated = false;
          data.createdOn = Date.now();
          data.restaurantName = restaurantName;
          data.firstName = firstName;
          data.lastName = lastName;
          data.phone = phone;
          data.emailId = emailId;
          data.createdBy = config.auth.currentUser.uid; 
          data.themeId = "ppW7qCgM0u9V4ryqM6GA"
          const newRestaurant = addRestaurant(data);
          console.log("Restaurant Info added");
        });
        return auth;
    })
    .catch((error) => {
      console.log(error.code);
      return error.code;
    });
}
export function registerNewPorter(porter = new porterInfo(), profileImg) {
  return createUserWithEmailAndPassword(config.auth, porter.emailId, porter.password)
    .then( (auth) => {
      sendEmailVerification(config.auth.currentUser)
        .then(async () => {        
            
          console.log("email verification sent");  
          porter.createdBy = config.auth.currentUser.uid;
          const newPorter = addPorter(porter, profileImg);
          console.log("Porter details added");
          var url = "";
            if(profileImg != undefined){
             url = await porterService.uploadPorterProfilePicture(profileImg);            
          } 
          updateProfile(config.auth.currentUser, {
            displayName: porter.lastName +" "+ porter.firstName, 
            photoURL: url
          }).then(() => {
            console.log("Profile updated!");      
          }).catch((error) => {
            console.log("error occured!",error);      
          });          
         
        });
      return auth;
    })
    .catch((error) => {
      console.log(error.code);
      return error.code;
    });
}

export function logOut() {
  var status = "";
  signOut(config.auth).then(() => {
    clearLocalStorage();
    status = "Success";
    // Sign-out successful.
  }).catch((error) => {
    // An error happened.
    status = "error";
  });
  return status;
}

export const  resetPassword = (email) =>{
   const result =sendPasswordResetEmail(config.auth, email)
    .then( () => {
       return true
    })
    .catch((error) => {
      console.error("Error occurred while resetting the password", error);
      return false
    });
    return result 
  
}
export const  updateUserPassword = (newPassword) =>{
  const result = updatePassword(config.auth.currentUser, newPassword)
  .then(() => {
    return true
  }).catch((error) => {
    console.error("Error occurred while updating the password", error);
    return false
  });
  return result    
  
}


export function getAccessToken() {
  // return constants.TOKEN;
  return localStorage.getItem("access-token");
}

export function setAccessToken(token) {
  return localStorage.setItem("access-token", token);
}

export function saveUserLocal(user) {

  return localStorage.setItem("current-user", JSON.stringify(user));
}

export function getUserLocal() {
  const user = localStorage.getItem("current-user");
  return user ? JSON.parse(user) : null;
}

export function clearLocalStorage() {
  return localStorage.clear();
}

export function getRestaurantId() {
  return localStorage.getItem("restaurant-id");
}

export function setRestaurantId(restaurantId) {
  return localStorage.setItem("restaurant-id", restaurantId);
}

export function setRestaurantLogoUrl(logoUrl) {
  return localStorage.setItem("restaurant-logo-url", logoUrl);
}

export function getRestaurantLogoUrl() {
  return localStorage.getItem("restaurant-logo-url");
}

