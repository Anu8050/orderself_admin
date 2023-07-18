
///Class representing the restaurant info details.
export class restaurantInfo 
 {
    id;    
    restaurantName;
    activated = false;
    createdOn = Date.now();
    createdBy = "";
    emailId;
    firstName;
    lastName;
    phone;
    numberOfTables = 0;
    restaurantLogoUrl = "";
}



export class menuInfo {
    id;
    foodName;
    foodPrice;
    foodDescription;
    available = true;
    availableFrom;
    availableUpto;
    createdBy;
    createdOn = Date.now();
    customizable = false; 
    imageName;
    imageUrl;
    restaurantId;
    foodCategory;
    ingredients=[];
    availableDays = [];
    vatPercent;
}

export class porterInfo {
    id;
    firstName = "";
    lastName= "";
    emailId = "";
    dob = "";
    restaurantId;
    address = "";
    createdOn = Date.now();
    gender ;
    password;
    phone;
    porterType;
    profileUrl;
    profileImageName;
}

export class tableInfo {
    id;
    tableNumber;    
    status = "Available";
    description = "";
    porterId = ""; 
    restaurantId;
    specialTable = false;
    active = true;
}

export class orderInfo {
    id;
    customerId;
    orderDate;
    restaurantId;
    porterId;
    status;
    tableId;
}

export class orderDetails {
    id;
    menuId;
    orderId;
    quantity;
}

export class foodCategory{    
    categoryName;
    active = true;
}