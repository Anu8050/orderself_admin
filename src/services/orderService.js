import {
    query,
    where,
    collection,
    addDoc,
    getDocs,
    updateDoc,
    doc,
    getDoc,
    deleteDoc,
    onSnapshot,
} from "firebase/firestore";
import config from '../services/firebaseConfig';
import * as constants from '../constants'
import { orderInfo } from "../models";
import { getRestaurantId } from "./authService";


/**
 * This method is to update the orderStatus ByOrderId  based on OrderId and OrderStatus
 */
export const updateOrderStatusByOrderId = async (OrderId, orderStatus) => {
    try {
        const docRef = doc(config.db, constants.INDIVIDUAL_ORDERS, OrderId);
        const updateStatus = await updateDoc(docRef, {
            status: orderStatus
        });

        return Promise.resolve(updateStatus);
        
    } catch (e) {
        console.error("Error adding document: ", e);
    }
}

export const getOrderInfo = async (restaurantId) => {
  var tableNumber = [];
 
    try {
      const q = query(
        collection(config.db, constants.INDIVIDUAL_ORDERS),
        where("restaurantId", "==", restaurantId)
      );
      const querySnapshot = await getDocs(q);  
      let orderdetails = [];
      let menuNames = []
      let menuIds = []
      querySnapshot.forEach((ordersDoc) => {
        orderdetails = [
          ...orderdetails,
          {
            ...ordersDoc.data(),
            id: ordersDoc.id,
          },
        ];
      });
      orderdetails.map((itm)=>{
        itm.menuItems.map((op)=>{
          menuIds.push(op.menuInfoId)
        })
        tableNumber.push(itm.tableId);
      })  

    tableNumber.map((tId)=>{
      const porter = getAssignedPorter(restaurantId,parseInt(tId));
      porter.then((pId)=>{ 
       orderdetails.forEach(ele=>{
        if(ele.tableId == tId)
        {
          ele.porterId = pId;
          if(pId == "")
          {
            ele.porterName = "";
          }
          else {
            let v = getPorterNameById(pId);
            v.then((d)=>{
              ele.porterName = d;         
            }) 
          }
          
          ele.menuItems.forEach(ele=>{
            var x = getMenuItemsById(ele.menuInfoId)
            x.then((x1)=>{
              menuNames.push(x1.foodName);
            })
           })
        }
       })      
      })
      })
      menuIds.map((mid)=>{
        const menuNames = getMenuItemsById(mid);
        menuNames.then((mname)=>{
          orderdetails.forEach(ele=>{
            ele.menuItems.map((obj)=>{
              if(obj.menuInfoId == mid){
                obj.foodName = mname.foodName 
              }
            })
          })
        })
      })
      return Promise.resolve(orderdetails);      
    } catch (e) {
      return e;
    }
  };

  export const getAssignedPorter = async (restaurantId,tableId) => {
    try {
      const q = query(
        collection(config.db, constants.TABLE_INFO),
        where("restaurantId", "==", restaurantId),where("tableNumber", "==", tableId)
      );
      const querySnapshot = await getDocs(q);
      let porterdetails = [];
      querySnapshot.forEach((porterDoc) => {
        porterdetails.push(porterDoc.data().porterId)
      });
      return Promise.resolve(porterdetails[0]);
    } catch (e) {
      return e;
    }
  };

  export const getMenuItemsById = async (id) => {
    try {
        const snap = await getDoc(doc(config.db, "menuInfo", id));

        if (snap.exists()) {
            return Promise.resolve(snap.data());
          } else {
            console.log("No such document");
            return [];
          }     
    } catch (e) {
        return e;
    }
}

export const getPorterNameById = async (id) => {
    try {
        const snap = await getDoc(doc(config.db, "porterInfo", id));
        if (snap.exists()) {
            return Promise.resolve(snap.data().firstName)
          } 
          else {
            console.log("No such document");
            return [];
          }     
    } catch (e) {
        return e;
    }
}

export const fetchMultipleDocsData = async (docArray) => {
    const q = query(
      collection(config.db, "menuInfo"),
      where("__name__", "in", docArray)
    );
    const querySnapshot = await getDocs(q);
  
    const docsArray = querySnapshot.docs.map((doc) => ({
      // id: doc.id,
      data: doc.data().foodName,
    }));
  
    return docsArray;
  };

  export const fetchMultiplePorterName = async (docIdsArray) => {
    const q = query(
      collection(config.db, "porterInfo"),
      where("__name__", "in", docIdsArray)
    );
    const querySnapshot = await getDocs(q);
  
    const docsArray = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      data: doc.data(),
    }));
  
    return docsArray;
  };

//   export const updateOrderStatus = async (id,status) => {
//     try {

//         const docRef = doc(config.db, constants.ORDER_INFO, id);        

//         if (menuImg !== undefined) {            
//             var url = await uploadMenuItemImage(menuImg);
//             menuUpdatedData.imageUrl = url;
//             menuUpdatedData.imageName = menuImg.name;
//         }        
//         const updateCreatedOn = await updateDoc(docRef, "status":status);        
//     } catch (e) {
//         console.error("Error adding document: ", e);
//     }
// }

export const updateOrderStatus = async (orderInfoId,status) => {
  try {
    const docRef = doc(config.db, constants.INDIVIDUAL_ORDERS, orderInfoId);

    const updateStatus = await updateDoc(docRef, {
      status: status,
    });
    console.log("update order successful");
  } catch (e) {
    console.error("Error adding document: ", e);
  }
};

// export const getPlacedOrders = async () => {
//   try {
//     const q = query(
//       collection(config.db, "placedOrders")
//     );
//     const querySnapshot = await getDocs(q);

//     let PlacedOrders = [];
//     querySnapshot.forEach((PlacedOrdersDoc) => {
//       PlacedOrders = [
//         ...PlacedOrders,
//         {
//           ...PlacedOrdersDoc.data(),
//           id: PlacedOrdersDoc.id,
//         },
//       ];
//     });

//     return Promise.resolve(PlacedOrders);
//   } catch (e) {
//     //This needs to be more elaborated.
//     return e; //return an error object
//   }
// };

export const startListeningToCollection = async (
  setOrders,
  handleNewOrder,
  setIsLoading
) => {
  const restaurantId = localStorage.getItem('restaurant-id');
  const collectionRef = collection(config.db, constants.INDIVIDUAL_ORDERS);
  const querySnapshot = onSnapshot(
    query(collectionRef, where("restaurantId", "==", restaurantId)),
    async (snapshot) => {
      try {
        const orderDetails = await getOrderDetails(snapshot, handleNewOrder);
        await updateOrderDetailsWithMenuNames(orderDetails);
        await updateOrderDetailsWithPorterDetails(restaurantId, orderDetails);
        setIsLoading(false);
        setOrders(orderDetails);
      } catch (error) {
        console.log("Error retrieving order details:", error);
      }
    },
    (error) => {
      console.log("Error retrieving documents:", error);
    }
  );
  return () => querySnapshot();
};

const getOrderDetails = async (snapshot, handleNewOrder) => {
  const orderDetails = [];
  snapshot.forEach((doc) => {
    const newOrder = {
      ...doc.data(),
      id: doc.id,
    };
    if (!orderDetails.some((order) => order.id !== newOrder.id)) {
      handleNewOrder(newOrder);
    }
    orderDetails.push(newOrder);
  });
  return orderDetails;
};

const updateOrderDetailsWithMenuNames = async (orderDetails) => {
  const menuIds = orderDetails.flatMap((item) =>
    item.menuItems.map((op) => op.menuInfoId)
  );
  menuIds.map((mid) => {
    const menuNames = getMenuItemsById(mid);
    menuNames.then((mname) => {
      orderDetails.forEach((ele) => {
        ele.menuItems.map((obj) => {
          if (obj.menuInfoId === mid) {
            obj.foodName = mname.foodName;
          }
        });
      });
    });
  });
};

const updateOrderDetailsWithPorterDetails = async (
  restaurantId,
  orderDetails
) => {
  const tableNumbers = orderDetails.flatMap((item) => item.tableId);
  const porterIds = await Promise.all(
    tableNumbers.map(
      async (tId) => await getAssignedPorter(restaurantId, parseInt(tId))
    )
  );
  const porterNames = await Promise.all(porterIds.map(getPorterNameById));
  orderDetails.forEach((order) => {
    const porterId = porterIds.find(
      (p, i) => tableNumbers[i] === order.tableId
    );
    order.porterId = porterId || "";
    order.porterName =
      porterNames.find((n, i) => porterIds[i] === porterId) || "";
  });
};

export const updateOrderInfoStatus = async (tableNumber, status ) => {
  try {
    const restaurantId = getRestaurantId()    
    const q = query(collection(config.db, constants.INDIVIDUAL_ORDERS), where("tableId", "==", tableNumber.toString()), where("restaurantId", "==", restaurantId), where("status", "==", "Pending") );
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach(async (docs) => {
      const docRef = doc(config.db, constants.INDIVIDUAL_ORDERS, docs.id);
      await updateDoc(docRef, {
        status: status,
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