import { query, where, collection, addDoc, documentId } from "firebase/firestore";
import { getDocs, doc, getDoc } from "firebase/firestore";
import {    
    setDoc,
    updateDoc, deleteDoc 
  } from "firebase/firestore";

import  Resizer from 'react-image-file-resizer';

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
/**
 * This function is to get all the menu items based on the restaurantId
 */
export const getMenuItems = async (restaurantId) => {
    try {
        const q = query(collection(config.db, constants.MENU_INFO), where("restaurantId", "==", restaurantId));
        const querySnapshot = await getDocs(q);

        let menuItems = []
        querySnapshot.forEach((menuItemDoc) => {
            menuItems = [...menuItems, {
                ...menuItemDoc.data(),
                id: menuItemDoc.id,
            }]
        });

        return Promise.resolve(menuItems);

    } catch (e) {
        //This needs to be more elaborated.
        return e; //return an error object
    }
}


/**
 * This method is to get the Menu item based on the restaurantId and menuId
 */
export const getMenuItem = async (menuId) => {
    try {
        const snap = await getDoc(doc(config.db, constants.MENU_INFO, menuId))

        if (snap.exists()) {
            return Promise.resolve(snap.data());
        }
        else {
            console.log("No such document")
            return [];
        }
    }
    catch (e) {
        console.error("Error Occurred", e);
        //This needs to be more elaborated.
        return e; //return an error object
    }
}

/**
 * This method is to delete a menu item based on the restaurantid and menuitemid(i.e. documentid)
 */
export const deleteMenuItems = async (menuItemId) => {
    try {
        await deleteDoc(doc(config.db, constants.MENU_INFO, menuItemId));
        return true;
    } catch (e) {
        console.error("Error adding document: ", e);
        return false;
    }
}

//
export const addMenuItem = async (data = new menuInfo(), profileImg) => {
    try {
        if (profileImg == undefined) {
            data.imageUrl = "";
            data.imageName = "";
        }
        else {
            var url = await uploadMenuItemImage(profileImg);
            data.imageUrl = url;
            data.imageName = profileImg.name;
        }

        const docRef = await addDoc(collection(config.db, constants.MENU_INFO), Object.assign({}, data));
        return docRef.id;
    } catch (e) {
        console.error("Error adding document: ", e);
        return "error";
    }
}

export const addMenuItemCsv = async (data = new menuInfo()) => {
    try {
        const docRef = await addDoc(collection(config.db, constants.MENU_INFO), Object.assign({}, data));
        return docRef.id;
    } catch (e) {
        console.error("Error adding document: ", e);
        return "error";
    }
}

export const checkFoodNameUniqueness = async (foodName, menuItemId = null) => {
    try {
        const restaurantId = getRestaurantId()
        let qry = null;
        if (menuItemId == null || menuItemId === undefined) {
            qry = query(collection(config.db, constants.MENU_INFO), where("restaurantId", "==", restaurantId));
        }
        else if (menuItemId != null && menuItemId !== undefined) {
            qry = query(collection(config.db, constants.MENU_INFO),
                where("restaurantId", "==", restaurantId),
                where(documentId(), "!=", menuItemId),
            );
        }

        const querySnapshot = await getDocs(qry);
        let menuItems = []
        querySnapshot.forEach((menuItemDoc) => {
            menuItems = [...menuItems, {
                ...menuItemDoc.data(),
                id: menuItemDoc.id,
            }]
        });
        menuItems = menuItems.filter(word => word.foodName.toLowerCase() === foodName.toLowerCase());
        return Promise.resolve((menuItems.length > 0) ? true : false);
    } catch (error) { }
}

export const uploadMenuItemImage = async (fileObj) => {
    try {
        const storageRef = ref(config.storage, `/MenuImages/${fileObj.name}`);
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
export const updateMenuItem = async (data = new menuInfo(), menuImg) => {
    try {
        let menuUpdatedData = Object.assign({}, data);
        const docRef = doc(config.db, constants.MENU_INFO, data.id);

        if (menuImg !== null) {
            var url = await uploadMenuItemImage(menuImg);
            menuUpdatedData.imageUrl = url;
            menuUpdatedData.imageName = menuImg.name;
        }
        const updateCreatedOn = await updateDoc(docRef, menuUpdatedData);
    } catch (e) {
        console.error("Error adding document: ", e);
    }
}

export const getMenuCategory = async () => {
    try {

        const q = query(collection(config.db, constants.MENUCATEGORY_INFO), where("active", "==", true));
        const querySnapshot = await getDocs(q);

        let menuCategory = []
        querySnapshot.forEach((menuCategoryDoc) => {
            menuCategory = [...menuCategory, {
                ...menuCategoryDoc.data(),
                id: menuCategoryDoc.id,
            }]
        });

        return Promise.resolve(menuCategory);

    } catch (e) {
        console.error("Error occurred", e);
        //This needs to be more elaborated.
        return e; //return an error object
    }
}

export const addFoodCategory = async (foodCategory) => {
    try {
        const restaurantId = getRestaurantId()

        const docRef = await addDoc(collection(config.db, constants.MENUCATEGORY_INFO),
            {
                active: true,
                foodCategory: foodCategory,
                restaurantId: restaurantId,
            }
        );
        return docRef.id;
    } catch (e) {
        console.error("Error adding document: ", e);
        return "error";
    }
}


export const checkFoodCategoryUniqueness = async (categoryName) => {
    try {
        const restaurantId = getRestaurantId()
        const q = query(collection(config.db, constants.MENUCATEGORY_INFO), where("restaurantId", "==", restaurantId));
        const querySnapshot = await getDocs(q);
        let foodCat = []
        querySnapshot.forEach((fcDoc) => {
            foodCat = [...foodCat, {
                ...fcDoc.data(),
                id: fcDoc.id,
            }];
        });

        foodCat = foodCat.filter(word => word.foodCategory.toLowerCase().indexOf(categoryName.toLowerCase()) > -1);
        return Promise.resolve((foodCat.length > 0) ? true : false);
    } catch (error) {
        console.error("Error adding document: ", error);
        return "error";
    }
}



//   getFoodCategory based on restaurantId
export const getFoodCategory = async () => {
    try {
        const restaurantId = getRestaurantId()
        const q = query(collection(config.db, constants.MENUCATEGORY_INFO), where("restaurantId", "==", restaurantId));
        const querySnapshot = await getDocs(q);

        let menuCategory = []
        querySnapshot.forEach((menuCategoryDoc) => {
            menuCategory = [...menuCategory, {
                ...menuCategoryDoc.data(),
                id: menuCategoryDoc.id,
            }]
        });

        return Promise.resolve(menuCategory);

    } catch (e) {
        console.error("Error occurrec", e);
        //This needs to be more elaborated.
        return e; //return an error object
    }
}


//   getFoodCategory based on restaurantId
export const getFoodCategoryByName = async (foodCategory) => {
    try {
        const restaurantId = getRestaurantId()
        const q = query(collection(config.db, constants.MENUCATEGORY_INFO), where("restaurantId", "==", restaurantId));
        const querySnapshot = await getDocs(q);

        let menuCategory = []
        querySnapshot.forEach((menuCategoryDoc) => {
            menuCategory = [...menuCategory, {
                ...menuCategoryDoc.data(),
                id: menuCategoryDoc.id,
            }]
        });

        menuCategory = menuCategory.filter(word => word.foodCategory.toLowerCase().indexOf(foodCategory.toLowerCase()) > -1);

        return Promise.resolve(menuCategory.length > 0 ? menuCategory[0].id : undefined);

    } catch (e) {
        console.error("Error Occurred", e);
        //This needs to be more elaborated.
        return e; //return an error object
    }
}

//only for testing
export const deleteMenuItemsByRestaurant = async (restaurantId) => {
    try {
        // let menuItemId = "iY2prsovi4aAq6yzAtAg";
        var result = getMenuItems(restaurantId);
        result.then(menuItems => {
            menuItems.forEach(m => {
                deleteDoc(doc(config.db, constants.MENU_INFO, m.id));
            });
        })

        return true;
    } catch (e) {
        console.error("Error adding document: ", e);
        return false;
    }
}

//only for testing
export const deleteFoodCategoryByRestaurant = async (restaurantId) => {
    try {
        var result = getFoodCategory(restaurantId);

        result.then(catItems => {
            catItems.forEach(c => {
                deleteDoc(doc(config.db, constants.MENUCATEGORY_INFO, c.id));
            });
        })

        return true;
    } catch (e) {
        console.error("Error adding document: ", e);
        return false;
    }
}

export const updateFoodCategory = async (restaurantId) => {
    console.log(restaurantId)
    try {
        var mI = getMenuItems(restaurantId);
        mI.then(m => {
            m.forEach(async (a) => {
                var fCatId = a.foodCategoryId;
                const docRef = doc(config.db, constants.MENU_INFO, a.id);
                const updateStatus = updateDoc(docRef, {
                    foodCategory: fCatId
                });
            });
        });
        return true;
    } catch (e) {
        console.error("Error updating document: ", e);
        return false;
    }
}


export const updateMenuItemRestaurantId = async (restaurantId) => {
    try {
        var mI = getMenuItems(restaurantId);
        mI.then(m => {
            m.forEach(async (a) => {
                var fCatName = a.foodCategory;

                const q = query(collection(config.db, constants.MENUCATEGORY_INFO), where("restaurantId", "==", restaurantId), where("foodCategory", "==", fCatName));
                const querySnapshot = await getDocs(q);

                var fCatId = ""
                querySnapshot.forEach((menuCategoryDoc) => {
                    fCatId = menuCategoryDoc.id
                });

                const docRef = doc(config.db, constants.MENU_INFO, a.id);
                const updateStatus = updateDoc(docRef, {
                    restaurantId: "",
                });
            });
        });
        return true;
    } catch (e) {
        console.error("Error updating document: ", e);
        return false;
    }
}


export const newPerformBulkCSVUploadOperation = async (menuData) => {
    try {
        var distinctFoodCat = Array.from(new Set(menuData.map((item) => item.foodCategory.trim())))

        var promises = distinctFoodCat.map(function (foodCat) {
            return checkFoodCategoryUniqueness(foodCat.trim())
                .then((foodCatExists) => {
                    console.log(foodCatExists);
                    if (!foodCatExists) {
                        return addFoodCategory(foodCat.trim()).then((foodCategoryId) => {
                            return foodCategoryId;      
                        });
                    }
                })
                .then((response) => {
                    return getFoodCategory().then((data) => {
                        return Promise.resolve(data);
                    })
                })
                .catch((error) => {
                    console.error('Error occurred while bulk upload operation: ', error);
                });
        });
        return Promise.all(promises).then(async (foodCats) => {
            var addedFoodNames = []; // Array to store added food names

            await Promise.all(menuData.map(async (csvRow) => {
                const foodName = csvRow.foodName.trim();
                const foodCategory = csvRow.foodCategory.trim();

                if (!addedFoodNames.includes(foodName)) {
                    addedFoodNames.push(foodName); // Add food name to the addedFoodNames array

                    return await checkFoodNameUniqueness(foodName).then(async (foodNameExists) => {
                        if (!foodNameExists) {
                            var foodCategoryId = foodCats[0].find(c => c.foodCategory === foodCategory).id;
                            return await addMenuItemFromCSV(csvRow, foodCategoryId);
                        }
                    });
                }
            }));
        });
    } catch (error) {
        console.error("error while bulk upload", error);
        return "error"
    }
}


export const oldperformBulkCSVUploadOperation = async (menuData) => {
    try {
        var totalAdditions = 0;
        return menuData.map(
            (csvRow) => {

                const exists = checkFoodNameUniqueness(csvRow.foodName.trim());
                return exists.then(foodNameExist => {
                    if (!foodNameExist) {
                        const catExists = checkFoodCategoryUniqueness(csvRow.foodCategory.trim())
                        return catExists.then(foodCatExist => {
                            var foodCategoryId = "";
                            if (!foodCatExist) {
                                foodCategoryId = addFoodCategory(csvRow.foodCategory.trim());
                                totalAdditions = totalAdditions + 1;
                                return addMenuItemFromCSV(csvRow, foodCategoryId);
                            }
                            else if (foodCatExist) {
                                var res = getFoodCategoryByName(csvRow.foodCategory.trim());
                                res.then(id => {
                                    foodCategoryId = id;
                                    totalAdditions = totalAdditions + 1;
                                    return addMenuItemFromCSV(csvRow, foodCategoryId);
                                });
                            }
                        });
                    }
                    else {
                        return "all menuitems already exists"
                    }
                });
            });
    } catch (error) {
        console.error("Error while performing Bulk CSV upload operation.", error);
    }
}

export const addMenuItemFromCSV = async (csvRow, foodCategoryId) => {


    var menuItm = new menuInfo();
    var createdBy = authService.getUserLocal();
    menuItm.foodName = csvRow.foodName;
    menuItm.foodCategoryId = foodCategoryId;
    menuItm.foodCategory = foodCategoryId;
    menuItm.foodDescription = csvRow.foodDescription;
    menuItm.foodPrice = csvRow.foodPrice;
    menuItm.ingredients = csvRow.ingredients.split(',');
    menuItm.vatPercent = csvRow.VAT;
    menuItm.customizable = "";
    menuItm.availableFrom = "";
    menuItm.availableUpto = "";
    menuItm.restaurantId = authService.getRestaurantId();
    menuItm.createdOn = Date.now();
    menuItm.createdBy = createdBy.uid;
    const docRef = await addDoc(collection(config.db, constants.MENU_INFO), Object.assign({}, menuItm));
    return docRef.id;

}

export const deleteDocumentsByRestaurantId = async () => {
    const q = query(collection(config.db, "menuInfo"), where('restaurantId', '==', "FQqksX7Qgd7pYaDBaZt1"));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
        deleteDoc(doc.ref)
            .then(() => {
                console.log('Document successfully deleted!');
            })
            .catch((error) => {
                console.error('Error deleting document:', error);
            });
    });

}


// For testing temporary methods

export const addFoodCategoryNew = async (foodCategory, isActive) => {
    try {
        const restaurantId = getRestaurantId()

        const docRef = await addDoc(collection(config.db, constants.MENUCATEGORY_INFO),
            {
                active: isActive,
                foodCategory: foodCategory,
                restaurantId: restaurantId,
            }
        );
        console.log("Added succesfully", docRef.id)
        return docRef.id;
    } catch (e) {
        console.error("Error adding document: ", e);
        return "error";
    }
}

export const getFoodCategoryNew = async () => {
    try {
        const restaurantId = getRestaurantId()
        const q = query(collection(config.db, constants.MENUCATEGORY_INFO), where("restaurantId", "==", restaurantId));
        const querySnapshot = await getDocs(q);

        let menuCategory = []
        querySnapshot.forEach((menuCategoryDoc) => {
            menuCategory = [...menuCategory, {
                ...menuCategoryDoc.data(),
                id: menuCategoryDoc.id,
            }]
        });

        return Promise.resolve(menuCategory);

    } catch (e) {
        console.error("Error occurrec", e);
        //This needs to be more elaborated.
        return e; //return an error object
    }
}

export const updateFoodCategoryNew = async (docId, foodCategory, isActive) => {
    try {

        const docRef = doc(config.db, constants.MENUCATEGORY_INFO, docId);
        const updateData = {
            foodCategory: foodCategory,
            active: isActive,
        };

        await updateDoc(docRef, updateData);
        console.log('Document updated successfully', docRef);
        return docRef.id;
    } catch (e) {
        console.error('Error updating document: ', e);
    }
};

export const checkFoodCategoryNewUniqueness = async (categoryName, docId) => {
    try {
        const restaurantId = getRestaurantId()
        let q = null;

        if (docId == null || docId === undefined) {
            q = query(collection(config.db, constants.MENUCATEGORY_INFO), where("restaurantId", "==", restaurantId));
        }
        else if (docId != null && docId !== undefined) {
            q = query(collection(config.db, constants.MENUCATEGORY_INFO), where("restaurantId", "==", restaurantId), where(documentId(), "!=", docId),);

        }

        const querySnapshot = await getDocs(q);
        let foodCat = []
        querySnapshot.forEach((fcDoc) => {
            foodCat = [...foodCat, {
                ...fcDoc.data(),
                id: fcDoc.id,
            }];
        });

        foodCat = foodCat.filter(word => word.foodCategory.toLowerCase().indexOf(categoryName.toLowerCase()) > -1);
        return Promise.resolve((foodCat.length > 0) ? true : false);
    } catch (error) {
        console.error("Error adding document: ", error);
        return "error";
    }
}


export const resizeImage = async(imageFile, width, height) =>{
    const resizeHeight =  (height/width)*200;
    return new Promise((resolve, reject) => {
        Resizer.imageFileResizer(
          imageFile,
          width, // maximum width
          resizeHeight, // maximum height
          'JPEG', // output format (JPEG, PNG, or WEBP)
          100, // quality (0-100)
          0, // rotation (0, 90, 180, or 270)
          (uri) => {
            try {
              const resizedFile = dataURLtoFile(uri, imageFile.name);
              console.log(resizedFile,"resizedFileresizedFile")
              resolve(resizedFile);
            } catch (error) {
              reject(error);
            }
          },
          'base64' // output type ('file', 'base64', or 'blob')
        );
      });
}

export const dataURLtoFile = async (dataUrl, filename) => {
    const response = await fetch(dataUrl);
    const blob = await response.blob();
    return new File([blob], filename);
  };



export const updateRestaurantInfo = async (
    restaurantId,
    newObj
  ) => {
    try {
       
      const docRef = doc(config.db, "restaurantInfo", getRestaurantId());
      const snap = await getDoc(docRef);
      if (snap.exists()) {
        const updatedData = { ...snap.data(), ...newObj };
        await setDoc(docRef, updatedData);
        console.log("Document updated successfully.");
      } else {
        console.log("Document does not exist.");
      }
    } catch (error) {
      console.error("Error updating document:", error);
    }
  };
   
  export const updatePaymentInfo = async (restaurantId, newObj) => {
    try {
      const docRef = query(
        collection(config.db, constants.ACCOUNT_DETAILS),
        where("restaurantId", "==", getRestaurantId())
      );
      const snap = await getDocs(docRef);
      if (snap.exists()) {
        const updatedData = { ...snap.data(), ...newObj };
        await setDoc(docRef, updatedData);
        console.log("Document updated successfully.");
      } else {
        console.log("Document does not exist.");
      }
    } catch (e) {
      return e;
    }
  };

  
export const getRestaurantInfo = async (restaurantId) => {
    try {
      const snap = await getDoc(doc(config.db, "restaurantInfo", restaurantId));
  
      if (snap.exists()) {
        return Promise.resolve(snap.data());
      } else {
        console.log("No such document");
        return [];
      }
    } catch (e) {
      return e;
    }
  };