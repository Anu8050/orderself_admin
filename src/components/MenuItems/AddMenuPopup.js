import "./AddMenuPopup.css";
import React, { useState, useEffect, useRef } from "react";
import { NumericFormat } from "react-number-format";
import { useDropzone } from 'react-dropzone';
import FileUploadIcon from '../../assets/images/fileuploadicon.png';
import {
  Button,
  TextField, Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Stack, 
  Link,
  Grid, Autocomplete
} from "@mui/material";
import dayjs from "dayjs";
import CancelRoundedIcon from "@mui/icons-material/CancelRounded";
import { DesktopTimePicker } from "@mui/x-date-pickers/DesktopTimePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import * as menuService from "../../services/menuService";
import * as authService from "../../services/authService";
import { menuInfo } from "../../models";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import PostAddIcon from "@mui/icons-material/PostAdd";
import LoadingButton from "@mui/lab/LoadingButton";
import LinearProgress from "@mui/material/LinearProgress";
import ShowSnackbar from "../../utils/ShowSnackbar";
import Popover from "@mui/material/Popover";

const DAYS = [
  {
    key: "sunday",
    label: "S",
  },
  {
    key: "monday",
    label: "M",
  },
  {
    key: "tuesday",
    label: "T",
  },
  {
    key: "wednesday",
    label: "W",
  },
  {
    key: "thursday",
    label: "T",
  },
  {
    key: "friday",
    label: "F",
  },
  {
    key: "saturday",
    label: "S",
  },
];

const AddMenuPopup = ({ editData, ...props }) => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [openSnackBar, setOpenSnackBar] = React.useState(false);
  const [propsMessage, setPropsMessage] = React.useState("");
  const [propsSeverityType, setPropsSeverityType] = React.useState("");
  const [errors, setErrors] = React.useState("");
  const [loadingProgress, SetLoadingProgress] = React.useState(false);
  const ingredientRef = useRef(null);
  const [loading, setLoading] = React.useState(false);  

  const openPopover = Boolean(anchorEl);
  const id = openPopover ? "simple-popover" : undefined;
  const [fCategory,setFCategory] =React.useState("");
  const[foodCategoryErrorMessage,setFoodCategoryErrorMessage] =React.useState("")
  
  const [foodCategoryInfo, setFoodCategoryInfo] = useState([]);
  const [foodCategoryId, setFoodCategoryId] = useState(editData?.foodCategoryName);

  const handleClick = (event) => {
    setFoodCategoryErrorMessage("");
    setAnchorEl(event.currentTarget);
  };
  const handleClosePopover = () => {
    setAnchorEl(null);
  };

  const getFC = () => {
    var promise = menuService.getFoodCategory();
    promise.then((docs) => {
      setFoodCategoryInfo(docs);
    });
  }
  
  useEffect(() => { 
    if(props.isDialogOpened){ 
      if (props.modeOfOperation == "Add") {
        setCheckedState(new Array(DAYS.length).fill(false)); 
        setIngredientsList([]);
      } 
      if(props.foodCategory == null) { 
        getFC();
      }
      else{
        setFoodCategoryInfo(props.foodCategory);
      }
    }
    if(editData !== undefined){
      setFoodName(editData?.foodName);
      setFoodDescription(editData?.foodDescription);
      setFoodCategoryId(editData?.foodCategory);
      setFCategory(editData?.foodCategoryName)
      setFoodPrice(editData?.foodPrice);
      setAvailableFrom(dayjs(editData?.availableFrom));
      setAvailableUpto(dayjs(editData?.availableUpto));
      if (props.modeOfOperation == "Update") {
        setIngredientsList([]);
        if(editData?.ingredients[0] == "")
        {
          setIngredientsList([]);
        }
        else{
          for (const item in editData?.ingredients) {
            setIngredientsList((prev) => [
              ...prev,
              {
                id: item,
                item: editData?.ingredients[item],
              },
            ]);
          }
        }
        
      } 
      if (props.modeOfOperation == "Update"){
      setCheckedState(editData?.availableDays);
      }
    }  
  }, [editData, openSnackBar, props.isDialogOpened]);

  //---------- ----------------------------------------------------------------------------
  const [foodName, setFoodName] = React.useState(editData?.foodName);
  const [foodNameErrorMessage, setFoodNameErrorMessage] = useState("");
  const handleFoodName = (e) => {
    if (!e.target.value) {
      setFoodNameErrorMessage("Required");
      setFoodName(e.target.value);
    } else {
      const regexExpr = new RegExp("^[a-zA-Z0-9äöüÄÖÜß._ ]*$");
      if (regexExpr.test(e.target.value)) {
        setFoodName(e.target.value);
        setFoodNameErrorMessage("");
      } else {
        setFoodNameErrorMessage("Invalid food name");
      }
    }
  };

  const foodCategoryList = [];
  {
    foodCategoryInfo.map((doc) => {
      foodCategoryList.push({ label: doc.foodCategory, id: doc.id });
    });
  }

  const [value, setValue] = React.useState(foodCategoryList[0])
 
  const addFoodCategory = ()=> { 
   const result = menuService.checkFoodCategoryUniqueness(fCategory.toLowerCase())
   result.then((foodCategory)=>{
    if(!foodCategory)
    {
        const documentId = menuService.addFoodCategory(fCategory);
        documentId.then((id)=>{
            setAnchorEl(null);
              setValue(fCategory); 
              setFoodCategoryId(id);
              setFCategory(fCategory);
              getFC();
        })             
    }
    else{
        setFoodCategoryErrorMessage("Already exists");
        return
    }

   });
  }
   
  const [foodPrice, setFoodPrice] = useState(editData?.foodPrice);
  const [priceErrorMessage, setPriceErrorMessage] = useState("");
  const handleFoodPriceChange = (e) => {
    const Price = e.target.value;
    if (!Price) {
      setPriceErrorMessage("Required");
      setFoodPrice(Price);
    } else {
      setFoodPrice(Price);
      setPriceErrorMessage("");
    }
  };


  const [foodTax, setFoodTax] = useState(editData?.vatPercent);
  const foodTaxList = [
    { label:"7%", id:7 },
    { label:"19%", id:19 } 
  ];

  const [foodDescription, setFoodDescription] = React.useState(editData?.foodDescription);
  const [descriptionErrorMessage, setDescriptionErrorMessage] = useState("");
  const foodDescriptionHandleChange = (e) => {
    const foodDescription = e.target.value;
    if (!foodDescription) {
      setDescriptionErrorMessage("Required");
      setFoodDescription(foodDescription);
    } else {
      setFoodDescription(foodDescription);
      setDescriptionErrorMessage("");
    }
  };

  const [ingredients, setIngredients] = React.useState();
  const [ingredientsList, setIngredientsList] = useState([]);
  const [ingredientErrorMessage, setIngredientErrorMessage] = useState("");
  const ingredientsHandleChange = (e) => {
    setIngredients(e.target.value);
    setIngredientErrorMessage("");
    const regexExpr = new RegExp("^[a-zA-Z0-9äöüÄÖÜß._ ]*$");
    if (regexExpr.test(e.target.value)) {
      setIngredients(e.target.value);
      setIngredientErrorMessage("");
    } else {
      setIngredientErrorMessage("Invalid ingredient name");
    }
  };
  const [itemId, setItemId] = useState(0);
  const AddIngredient = (e) => {
    const id = itemId + 1;
    if (!ingredients) {
      setIngredientErrorMessage("Required");
    } else {
      var exist = ingredientsList.find((doc) => doc.item == ingredients);
      console.log(exist);
      if (exist) {
        setIngredientErrorMessage(`${exist.item} already exist`);
      } else {
        setIngredientErrorMessage("");
        setItemId(id);
        setIngredientsList((prev) => [
          ...prev,
          {
            id: id,
            item: ingredients,
          },
        ]);
        setIngredients("");
        ingredientRef.current.focus();
      }
    }
  };

  const ingredientDelete = (id) => {
    setIngredientsList((current) => current.filter((item) => item.id !== id));
  };

  const [customizable, setCustomizable] = React.useState(false);
  const customizableChange = (event) => {
    setCustomizable(event.target.checked);
  };

  const [availableFrom, setAvailableFrom] = React.useState(dayjs(editData?.availableFrom));
  const [availableUpto, setAvailableUpto] = React.useState(dayjs(editData?.availableUpto));
  const [checkedState, setCheckedState] = useState([false, false, false, false, false, false, false]);

 const weekDaysHandleChange = (days) =>{
  const updatedCheckedState = checkedState.map((item, index) =>
      index === days ? !item : item
  );
  setCheckedState(updatedCheckedState);
 }

 const [imageDimensions, setImageDimensions] = React.useState({width: 0, height: 0});
  const { acceptedFiles, getRootProps, getInputProps, open } = useDropzone({
    multiple: false,
    maxSize: 102400, //for max size 100kb
    accept: {
      "image/png": [".png"],
      "image/jpg": [".jpg"],
      "image/jpeg": [".jpeg"],
    },
    onDrop: (acceptedFiles, fileRejections) => {
      if (fileRejections.length > 0) {
        fileRejections.forEach((file) => {
          file.errors.forEach((err) => {
            if (err.code === "file-too-large") {
              setErrors("Please upload a food image lesser than 100 Kb");
            }
            if (err.code === "file-invalid-type") {
              setErrors("Invalid file type");
            }
          });
        });
      } else if (acceptedFiles.length > 0) {
        const file = acceptedFiles[0];
      const reader = new FileReader();
      reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        setImageDimensions({ width: img.width, height: img.height });
      };
      img.src = event.target.result;
    };

    reader.readAsDataURL(file);
        setErrors("");
      }
    },
  });

  const files = acceptedFiles.map((file) => (
    <li key={file.path}>{file.path}</li>
  )); //- {file.size} bytes

  var menuImageName = "";
  if (acceptedFiles.length != 0) {
    menuImageName = "";
  } else {
    menuImageName = editData?.imageName;
  }

  const isEmpty =foodName?.length && foodPrice?.length && foodDescription ;
// console.log("foodname" , foodName?.length ,"category" , foodCategoryId?.length , "price", foodPrice?.length , "ingredient List" , ingredientsList.length , "Description", foodDescription, "Available Days" ,checkedState.includes(true))
  
const createMenuItem = () => {
  const imagePromise = acceptedFiles.length ? menuService.resizeImage(acceptedFiles[0], imageDimensions.width, imageDimensions.height) : null;
    setOpenSnackBar(false); //SnackBar
    if (acceptedFiles.length) SetLoadingProgress(true);
    setLoading(true);
    let menuItemId = editData == undefined ? null : editData.id;
    var exists = menuService.checkFoodNameUniqueness(
      foodName.trim(),
      menuItemId
    );
    exists.then(async (isExist) => {
      if (isExist) {
        SetLoadingProgress(false);
        setLoading(false);
        setFoodNameErrorMessage("Food Name already exists");
        return false;
      } else {
        setLoading(true);
        let ingredient = [];
        if (ingredientsList.length != 0) {
          ingredientsList.map((doc) => {
            ingredient.push(doc.item);
          });
        }
        var createdBy = authService.getUserLocal();
        var menuItm = new menuInfo();
        menuItm.foodName = foodName;
        menuItm.foodDescription = foodDescription;
        menuItm.foodPrice = foodPrice;
        if(foodTax == undefined){
          menuItm.vatPercent = "19%";
        }
        else{
          menuItm.vatPercent = foodTax;
        }
      //  console.log(customizable, availableFrom.toString() ,availableUpto.toString(), authService.getRestaurantId(), Date.now(),createdBy.uid,foodCategoryId,ingredient,checkedState, acceptedFiles[0]);
        menuItm.customizable = customizable;
        menuItm.availableFrom = availableFrom.toString();
        menuItm.availableUpto = availableUpto.toString();
        menuItm.restaurantId = authService.getRestaurantId();
        menuItm.createdOn = Date.now();
        menuItm.createdBy = createdBy.uid;
        menuItm.foodCategory = foodCategoryId !== undefined ? foodCategoryId : '';
        menuItm.ingredients = ingredient;
        menuItm.availableDays = checkedState;

        let result = null;
        if (props.modeOfOperation == "Add") {
          const resizedImage = await imagePromise;
          result = menuService.addMenuItem(menuItm, resizedImage);
        } else if (props.modeOfOperation == "Update") {
          const resizedImage = await imagePromise;
          menuItm.id = editData.id;
          result = menuService.updateMenuItem(menuItm, resizedImage);
        }

        result.then((status) => {
          console.log(editData?.id,status, "printing status");
          if (status == "error") {
            setOpenSnackBar(true); //SnackBar
            setPropsMessage(
              "Error Occurred! Please contact administrator.",
              "error"
            );
            setPropsSeverityType("error");
          } else {
            setOpenSnackBar(true); //SnackBar
            if (props.modeOfOperation == "Add") {
              setPropsMessage(`${foodName} Added successfully.`);
            } else {
              setPropsMessage(`${foodName} Updated successfully.`);
            }
            setPropsSeverityType("success");
            handleClose();
            setIngredientsList([]);
          }
        });
      }
    });
  };

  const errorMessageClear = () => {
    setFoodNameErrorMessage("");
    setPriceErrorMessage("");
    setDescriptionErrorMessage("");
    setIngredientErrorMessage("");
  };

  const handleClose = () => {
    props.handleCloseDialog(false);
    acceptedFiles.length = 0;
    setIngredientsList([]);
    errorMessageClear();
    setLoading(false);
    SetLoadingProgress(false);
    setErrors("");
    setFoodTax("19%")
    setValue(undefined);
    setFoodCategoryId('')   
  };

  return (
    <div style={{ margin: "0px" }}>
      {openSnackBar && (
        <ShowSnackbar message={propsMessage} severityType={propsSeverityType} />
      )}
      <div>
        <Popover
          id={id}
          open={openPopover}
          anchorEl={anchorEl}
          onClose={handleClosePopover}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "left",
          }}
        >
            <div style={{display:"flex",flexDirection:"column",width:"220px",height:"120px",justifyContent:"space-between",alignItems:"center",padding:"10px"}}>
                <div>
                <TextField
                    required
                    id="Food Category"
                    label="Food Category"
                    placeholder="Enter Food Category Name"
                    value= {value}  
                    onChange={(e)=>setFCategory(e.target.value)}
                    style={{ width: "200px" }}
                />
                <br/>
                {foodCategoryErrorMessage && (
                  <span style={{ fontSize: "12px", color: "red" }}>
                    {foodCategoryErrorMessage}
                  </span>
                )}
                </div>
                <div>
                <Button variant="contained" onClick={addFoodCategory}>
                    Add
                </Button>
                </div>            
            </div>
        </Popover>
      </div>
      <React.Fragment>
        <Dialog
          open={props.isDialogOpened}
          onClose={handleClose}
          aria-labelledby="max-width-dialog-title"
        >
          <DialogTitle id="max-width-dialog-title">
            <Grid
              container
              rowSpacing={1}
              columnSpacing={{ xs: 1, sm: 2, md: 3 }}
            >
              <Grid item xs={11}>
                <strong>{props.modeOfOperation} Menu Item</strong>
              </Grid>
              <Grid item xs={1} style={{ alignContent: "flex-start" }}>
                <CancelRoundedIcon
                  onClick={handleClose}
                  className="closeIcon"
                />
              </Grid>
            </Grid>
          </DialogTitle>
          <DialogContent style={{ borderTop: "0.15em solid #FC8019" }}>
            <Stack spacing={2} padding={1}>
              <div>
                <TextField
                  required
                  id="foodName"
                  label="Food Name"
                  defaultValue={editData?.foodName}
                  onBlur={handleFoodName}
                  onChange={(e) => handleFoodName(e)}
                  style={{ width: "240px" }}
                />
                <br />
                {foodNameErrorMessage && (
                  <span style={{ fontSize: "12px", color: "red" }}>
                    {foodNameErrorMessage}
                  </span>
                )}
              </div>
              <div style={{ display: "flex" }}>
                <div>
                  <Autocomplete
                    disablePortal
                    ListboxProps={{ style: { color: "#767C87" } }}
                    id="food-category"
                    options={foodCategoryList}
                    value= {(value==undefined)? editData?.foodCategoryName :value}  
                    defaultValue={editData?.foodCategoryName}
                    sx={{ width: "240px" }}
                    renderInput={(params) => (
                      <TextField {...params} label="Food Category" />
                    )}
                    onChange={(e, v) => {
                      setValue(v?.label)
                      setFoodCategoryId(v?.id);
                    }}
                  />
                </div>
                <div style={{ marginTop: "8px" }}>
                  <AddIcon
                    aria-describedby={id}
                    onClick={handleClick}
                    fontSize="large"
                  />
                </div>
              </div>
              <div style={{display:"flex"}}>
                <NumericFormat
                  suffix=" €"
                  customInput={TextField}
                  style={{ width: "120px" }}
                  required
                  id="foodPrice"
                  defaultValue={editData?.foodPrice}
                  label="Price"
                  onBlur={handleFoodPriceChange}
                  onChange={handleFoodPriceChange}
                />
                &nbsp;
                <Autocomplete
                    disablePortal
                    ListboxProps={{ style: { color: "#767C87" } }}
                    id="food-tax"
                    options={foodTaxList}
                    value = {foodTax}
                    defaultValue={(editData?.vatPercent == undefined )? "19%" : editData?.vatPercent}
                    sx={{ width: "118px" }}
                    renderInput={(params) => (
                      <TextField {...params} label="VAT" />
                    )}
                    onChange={(e, v) => { setFoodTax(v?.label)}}
                  />
                </div>
                {priceErrorMessage && (
                  <span style={{ fontSize: "12px", color: "red" }}>
                    {priceErrorMessage}
                  </span>
                )}
              
              <div>
                <TextField
                  style={{ width: "240px", backgroundColor: "#fff" }}
                  required
                  id="foodDescription"
                  label="Description"
                  multiline
                  rows={3}
                  defaultValue={editData?.foodDescription}
                  onBlur={foodDescriptionHandleChange}
                  onChange={(e) => foodDescriptionHandleChange(e)}
                />
                <br />
                {descriptionErrorMessage && (
                  <span style={{ fontSize: "12px", color: "red" }}>
                    {descriptionErrorMessage}
                  </span>
                )}
              </div>

              <div style={{ verticalAlign: "center" }}>
                <TextField
                  required
                  id="ingredients"
                  label="Ingredients"
                  inputRef={ingredientRef}
                  value={ingredients}
                  onBlur={ingredientsHandleChange}
                  onChange={ingredientsHandleChange}
                  style={{ width: "210px" }}
                />
                &nbsp;
                <PostAddIcon
                  style={{ fontSize: "40px", cursor: "pointer" }}
                  onClick={() => AddIngredient()}
                />
                <br />
                {ingredientErrorMessage && (
                  <span
                    className="app-error-icon"
                    style={{ fontSize: "12px", color: "red" }}
                  >
                    {ingredientErrorMessage}
                  </span>
                )}
              </div>
              
              <div style={{ display: "flex", flexWrap: "wrap", width: "17rem" }}>
                <Grid container>
                  {ingredientsList != undefined &&
                    ingredientsList.map((ingredient) => {
                      return (
                        <Button
                          variant="outlined"
                          sx={{
                            marginRight: "3px",
                            padding: "2px !important",
                            color: "rgba(0, 0, 0, 0.6) !important",
                          }}
                          endIcon={
                            <CloseIcon
                              className="ingredients-close-icon"
                              onClick={() => ingredientDelete(ingredient.id)}
                            />
                          }
                        >
                          {ingredient.item}
                        </Button>
                      );
                    })}
                </Grid>
              </div>
              <div>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <fieldset style={{ borderRadius: "5px", width: "100%" }}>
                    <legend>
                      <label>Choose Available Time</label>
                    </legend>
                    <div
                      className="addMenuTimePicker"
                      style={{ display: "flex" }}
                    >
                      <div style={{ width: "120px" }}>
                        <DesktopTimePicker
                          label="From"
                          value={availableFrom}
                          defaultValue={dayjs(editData?.availableFrom)}
                          onChange={(newValue) => {
                            setAvailableFrom(newValue);
                          }}
                          renderInput={(params) => <TextField {...params} />}
                        />
                      </div>
                      <div style={{ width: "120px" }}>
                        <DesktopTimePicker
                          label="To"
                          value={availableUpto}
                          defaultValue={dayjs(editData?.availableUpto)}
                          onChange={(newValue) => {
                            setAvailableUpto(newValue);
                          }}
                          renderInput={(params) => <TextField {...params} />}
                        />
                      </div>
                    </div>
                    <div className="week-day-container">
                      {DAYS.map((day, index) => {
                        return (
                          <div className="roundchk">
                            <input name={day.key} type="checkbox" id={day.key} value={index}
                              checked={checkedState[index]}
                              onChange={() => weekDaysHandleChange(index)}
                            />
                            <label for={day.key}>{day.label}</label>
                          </div>);
                      })}
                    </div>
                  </fieldset>
                </LocalizationProvider>
              </div>
              <div>
                <div>
                  <section className="">
                    <div
                      {...getRootProps({ className: "dropzone" })}
                      style={{
                        backgroundColor: "#f1f3f4",
                        border: "1px dotted #000",
                        padding: "0px 5px",
                        fontSize: ".8em",
                      }}
                    >
                      <input {...getInputProps()} />
                      {loadingProgress && <LinearProgress />}
                      <p style={{ textAlign: "center" }}>
                        <label>
                          <img
                            src={FileUploadIcon}
                            alt="File Upload Icon"
                            style={{ width: "20%" }}
                          />{" "}
                          <br />
                          Drag and drop food image here, or{" "}
                          <Link href="#" underline="none">
                            Browse
                          </Link>
                        </label>
                      </p>
                      <div style={{ color: "#FF0000" }}>{errors}</div>
                      <aside>
                        {files}
                        {menuImageName}
                      </aside>
                    </div>
                  </section>
                </div>
              </div>
            </Stack>
          </DialogContent>
          <DialogActions>
            <LoadingButton
              variant="contained"
              loading={loading}
              loadingPosition="start"
              onClick={createMenuItem}
              disabled={!isEmpty}
            >
              {props.modeOfOperation}
            </LoadingButton>
            <Button variant="outlined" onClick={handleClose}>
              Cancel
            </Button>
          </DialogActions>
        </Dialog>
      </React.Fragment>
    </div>
  );
};

AddMenuPopup.propTypes = {};

AddMenuPopup.defaultProps = {};

export default AddMenuPopup;
