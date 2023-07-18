/* eslint-disable */


// import {
//   addDoc,
//   collection,
//   getDocs,
//   query,  
//   where  
// } from "firebase/firestore";
// import { query, where, collection, addDoc, documentId } from "firebase/firestore";
const { getFirestore, Timestamp, FieldValue, Filter } = require('firebase-admin/firestore');
const functions = require("firebase-functions");
// const admin = require("firebase-admin")
const nodemailer = require("nodemailer");

// admin.initializeApp()
const admin = require('firebase-admin');
const { getAuth } = require("firebase-admin/auth");
admin.initializeApp();
const db = getFirestore();



// // Create and deploy your first functions
// // https://firebase.google.com/docs/functions/get-started
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });

const baseUrl = "https://orderselfdb.web.app";
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: "rajeshbottest@gmail.com", 
    pass: "ntkyklxufpfxmlor",
  },
});

// verify connection configuration
transporter.verify((error, success) => {
  if (error) {
    console.log(error);
  } else {
    console.log("Server is ready to take our messages");
  }
});


exports.sendEmail = functions.firestore
    .document("porterRegistration/{id}")
    .onCreate((snap, context) => {
      const email = snap.data().email;
      const restaurantName = snap.data().restaurantName;
      const restaurantId = snap.data().restaurantId;
      console.log(btoa(restaurantName), btoa(restaurantId), btoa(email));
      const mailOptions = {
        from: `noreply-orderself@gmail.com`,
        to: snap.data().email,
        subject: "Porter Registration - Registration link",
        /* eslint-disable */
        html: `Dear Porter, <br/>
            Please click below link to Register as a porter.
            <h3><a target='_blank' 
            href="${baseUrl}/porter-registration/${btoa(restaurantName)}/${btoa(restaurantId)}/${btoa(email)}">
            Click here to Register complete the registration</a></h3>
            <br/>
            <br/>
            
            Thanks,
            restaurantName <strong>(Admin)</strong>`,
      };
     console.log(btoa(restaurantName), btoa(restaurantId), btoa(email));

      return transporter.sendMail(mailOptions, (error, data) => {
        if (error) {
          console.log(error);
          return;
        }
        console.log("Sent!");
      });
    });


exports.menuItemCsvUpload = functions.https.onCall((emailId, context) => {

  return admin.auth()
    .getUserByEmail(emailId)
    .then((userRecord) => {
      // See the UserRecord reference doc for the contents of userRecord.
      console.log(`Successfully fetched user data:`, userRecord.toJSON());
      return userRecord.email;
    })
    .catch((error) => {
      console.log('Error fetching user data:', error);
      return error.code;
    });

});


exports.deletePorterById = functions.https.onCall((email) => {
  return getAuth()
    .getUserByEmail(email)
    .then((userRecord) => {
      getAuth().deleteUser(userRecord.uid);
      return "Delete Successful!";
    })
    .catch((error) => {
      console.log('Error fetching user data:', error);
      return "Error occurred " + error;
    });
});


exports.fnGetMenuItems = functions.https.onCall(async (param) => {
  try {
    // return param.restaurantId + "rajesh" + param.searchText + "nagendra";
    // restaurantId = "FQqksX7Qgd7pYaDBaZt1";
    // searchText = ""
    /*-------------------------------------------------------------------------------------------- */
    // const q = query(
    //   collection(config.db, "menuInfo"),
    //   where("restaurantId", "==", restaurantId)
    // );
    // const querySnapshot = await firebaseConfig.firestore().getDocs(q);

    const menuRef = db.collection('menuInfo');
    const snapshot = await menuRef.where('restaurantId', '==', param.restaurantId).get();
    if (snapshot.empty) {
      console.log('No matching documents.');
      return [];
    }  

    let menuItems = [];
    snapshot.forEach((menuItemDoc) => {
      menuItems = [
        ...menuItems,
        {
          ...menuItemDoc.data(),
          id: menuItemDoc.id,
        },
      ];
    });
    /*-------------------------------------------------------------------------------------------- */

    // const q1 = query(
    //   collection(config.db, "foodCategory"),
    //   where("restaurantId", "==", restaurantId)
    // );
    // const querySnapshot1 = await firebaseConfig.firestore().getDocs(q1);

    const menuCatRef = db.collection('foodCategory');
    const snapshotCat = await menuCatRef.where('restaurantId', '==', param.restaurantId).get();
    if (snapshotCat.empty) {
      console.log('No matching documents.');      
    }  

    let menuCategory = [];
    snapshotCat.forEach((menuCategoryDoc) => {
      menuCategory = [
        ...menuCategory,
        {
          ...menuCategoryDoc.data(),
          id: menuCategoryDoc.id,
        },
      ];
    });

    menuItems.forEach((itm) => {
      itm.foodCategoryName = menuCategory.find(
        (x) => x.id === itm.foodCategory
      )?.foodCategory;
      itm.foodPrice = itm.foodPrice.replace(" ", "").replace("€", "");
    });

    if (param.searchText.toString().trim() !== "") {
      menuItems = menuItems.filter(
        (word) =>
          word.foodName.toString().toLowerCase().indexOf(param.searchText.toString().toLowerCase()) > -1
      );
    }

    var groupedFoodItems = menuItems.reduce((groups, item) => {
      const group = groups[item.foodCategoryName] || [];
      group.push(item);
      groups[item.foodCategoryName] = group;
      return groups;
    }, {});
    // return "success"
    return groupedFoodItems; // Promise.resolve(finalData);
  } catch (e) {    
    //This needs to be more elaborated.
    return "error:" + e.message; //return an error object
  }
});



//*******************Paypal Implementation***************************************/
const createPaypalOrder = require("./paypal/createOrder");
const capturePaypalPayment = require("./paypal/capturePayment");
const sellerVerification = require("./paypal/sellerVerification");
const sellerOnboardingStatus = require("./paypal/sellerOnboardingStatus");
const createPartnerReferral = require("./paypal/createPartnerReferral");

//exports.getSellerStatus = paypal;
exports.createPaypalOrder = createPaypalOrder.createOrder;
exports.capturePaypalPayment = capturePaypalPayment.capturePayment;
exports.sellerVerification = sellerVerification.sellerVerification;
exports.sellerOnboardingStatus = sellerOnboardingStatus.sellerOnboardingStatus;
exports.createPartnerReferral = createPartnerReferral.createPartnerReferral;
//*******************Paypal Implementation***************************************/