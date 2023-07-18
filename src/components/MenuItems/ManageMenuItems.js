import React from 'react';
import { useState, useEffect } from "react";
import DeleteIcon from '@mui/icons-material/Delete';
import './ManageMenuItems.css';
import { DataGrid } from '@mui/x-data-grid';
import {
  Box,
  Button,
  Grid,
  Dialog, DialogTitle, DialogContentText, DialogContent, DialogActions, Typography
} from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import * as menuService from '../../services/menuService';
import AddMenuPopup from '../../components/MenuItems/AddMenuPopup';
import BorderColorIcon from '@mui/icons-material/BorderColor';
import ViewMenuPopUp from './ViewMenuPopUp';
import VisibilityIcon from '@mui/icons-material/Visibility';
import LinearProgress from '@mui/material/LinearProgress';
import { getRestaurantId } from '../../services/authService';
import DriveFolderUploadIcon from '@mui/icons-material/DriveFolderUpload';
import MenuUploadCsv from '../../components/MenuItems/MenuUploadCsv';
import ShowSnackbar from "../../utils/ShowSnackbar"
import * as constants from '../../constants/index'

const ManageMenuItems = () => {
  const [openSnackBar, setOpenSnackBar] = React.useState(false);
  const [propsMessage, setPropsMessage]= React.useState("");
  const [propsSeverityType, setPropsSeverityType] = React.useState(""); 
  const [isAddMenuPopupOpen, setIsAddMenuPopupOpen] = useState(false);
  const [isUploadCsvPopupOpen, setIsUploadCsvPopupOpen] = useState(false);
  const [isViewMenuPopupOpen, setIsViewMenuPopupOpen] = useState(false);
  const [menuItems, setMenuItems] = useState([]);
  const [editData, setEditData] = useState([]);
  const [modeOfOperation, setModeOfOperation] = useState("Add");
  const [id, setId] = useState();
  const [pageSize, setPageSize] = React.useState(constants.GLOBAL_PAGE_SIZE);
  const [open, setOpen] = React.useState(false);
  // const [foodCategory, setFoodCategory] = React.useState([]);
  const [foodCategory, setFoodCategory] = useState([]);

  const [loading, setLoadingIconState] = React.useState(true);

  function CustomNoRowsOverlay(message) {
    return (
      <div xs={12} style={{ textAlign: "center", paddingTop: "50px" }}>
        <Typography variant="h6" gutterBottom>
          {message}
        </Typography>
      </div>
    );
  }

  const handleAddMenuPopupOpen = (isEdit) => {
    if (isEdit) {
      setEditMenuPopup(true);
      setIsAddMenuPopupOpen(!isAddMenuPopupOpen);
    } else {
      setEditMenuPopup(false);
      setIsAddMenuPopupOpen(!isAddMenuPopupOpen);
    }

  };

  const handleUploadCsvPopupOpen = () => {
    setIsUploadCsvPopupOpen(!isUploadCsvPopupOpen);
  };
  const handleDeletePopUpOpen = () => {
    setOpen(true);
  };
  const handleDeletePopUpClose = () => {
    setOpen(false);
  };

  const setEditMenuPopup = (istrue) => {
    if (istrue) {
      setModeOfOperation("Update");
    }
    else {
      setEditData(null);
      setModeOfOperation("Add");
    }
  }

  useEffect(() => {    
    var restaurantId = getRestaurantId();
    var promise = menuService.getMenuItems(restaurantId);
    promise.then((docs) => {
      setMenuItems(docs);
      setLoadingIconState(false);
    });
    var promise1 = menuService.getFoodCategory(restaurantId);
    promise1.then((docs) => {
      setFoodCategory(docs);
      setLoadingIconState(false);
    });
  }, [open, isAddMenuPopupOpen, editData, openSnackBar,isUploadCsvPopupOpen]);

  menuItems.map((item) => {   
    var testFoodCategory = foodCategory.filter(doc => doc.id == item.foodCategory);
    if (testFoodCategory.length != 0) {
      item.foodCategoryName = testFoodCategory[0].foodCategory;      
    }
    else {
      item.foodCategoryName = "";
    }
  });
  
  const viewMenuItem = (e) => {
    setIsViewMenuPopupOpen(!isViewMenuPopupOpen);
  }

  const columns = [
    {
      field: 'foodName',
      headerName: <strong>Food</strong>,
      width: 300,
    },
    {
      field: 'foodCategoryName',
      headerName: <strong>Food Category</strong>,
      width: 150,
    },
    
    {
      field: 'foodDescription',
      headerName: <strong>Food Description</strong>,
      width: 500,
    },
    {
      field: 'foodPrice',
      headerName: <strong>Price</strong>,
      width: 100,
    },
    {
      field: 'actions',
      headerName: <strong>Actions</strong>,
      type: 'actions',
      // flex: 0.2,
      width:250,
      sortable: false,
      disableColumnMenu: true,
      getActions: (params) => [
        <DeleteOutlineIcon onClick={() => {
          handleDeletePopUpOpen();
          setEditData(params.row)
        }}>
        </DeleteOutlineIcon>,
        <BorderColorIcon 
        onClick={() => { handleAddMenuPopupOpen(true); setEditData(params.row)
        }}
        // onClick={() => handleAddMenuPopupOpen(true, params.row)}
        >
        </BorderColorIcon>,
        <VisibilityIcon onClick={() => {
          viewMenuItem();
          setEditData(params.row)
        }}>
        </VisibilityIcon>,
      ],
    },

  ];

  const deleteMenuItem = () => {
    setOpenSnackBar(false);
    let result = menuService.deleteMenuItems(editData.id);
    result.then((value) => {
      if (value) {
        setOpenSnackBar(true);
        setPropsMessage(` ${editData.foodName} Deleted successfully .`);
        setPropsSeverityType("success");
      }
    })
    setOpen(false);
  }

  return (
    <Box className="ManageTables" sx={{
      pl: 9,
      pr: 1,
      pt: 1,
      width: '100%',
      overflow: 'auto',
      backgroundColor: '#EAEAEA'
    }}>
      {openSnackBar &&
        <ShowSnackbar message={propsMessage} severityType={propsSeverityType} />
      }
      <Dialog
        open={open}
        onClose={handleDeletePopUpClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          <h2>Are you sure ?</h2>
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description"></DialogContentText>
          <p style={{ color: "gray" }}>Do you really want to delete <strong>{editData?.foodName}</strong> Menu item? </p>
          <p style={{ color: "gray" }}>This process cannot be undone</p>
        </DialogContent>
        <DialogActions>
          <Button variant="outlined" onClick={handleDeletePopUpClose}>
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={deleteMenuItem}
            autoFocus
            startIcon={<DeleteIcon />}
            sx={{ fontSize: "18px" }}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
      <Grid style={{}}>
        <Grid container padding={1} style={{ borderTopLeftRadius: '8px', borderTopRightRadius: '8px', backgroundColor: '#fff', alignContent: 'space-around' }} marginBottom={0.5}>
          <Grid item xs={4} className="breadcrumb">
            <span>Menu Items</span>
          </Grid>          
          <Grid item xs={8} className="action-button">
            <Button variant='contained' onClick={() => handleUploadCsvPopupOpen()} startIcon={<DriveFolderUploadIcon/>}>Bulk Upload</Button>
            &nbsp;&nbsp;<Button variant='contained' onClick={() => handleAddMenuPopupOpen()}><AddIcon />&nbsp;Add</Button>
          </Grid>
        </Grid>
        <Grid container padding={2} style={{ backgroundColor: '#fff' }}>
          <Grid item xs={12} className="">
            <div style={{ height: 500, width: '100%' }}>
              <div style={{ display: 'flex', height: '100%' }}>
                <div style={{ flexGrow: 1 }}>
                  <DataGrid
                    columns={columns}
                    rows={menuItems}
                    pageSize={pageSize}
                    onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
                    rowsPerPageOptions={constants.GLOBAL_PAGE_SIZE_OPTIONS}
                    pagination
                    components={{
                      NoRowsOverlay: () => CustomNoRowsOverlay("No Rows found."),
                      LoadingOverlay: LinearProgress,
                    }}
                    loading={loading}
                  />
                </div>
              </div>
            </div>
          </Grid>
        </Grid>
      </Grid>
      <AddMenuPopup modeOfOperation={modeOfOperation} editData={editData} isDialogOpened={isAddMenuPopupOpen} handleCloseDialog={() => setIsAddMenuPopupOpen(false)} />
      <ViewMenuPopUp menuId={id} viewData={editData} isDialogOpened={isViewMenuPopupOpen} handleCloseDialog={() => setIsViewMenuPopupOpen(false)} />
      <MenuUploadCsv isDialogOpened={isUploadCsvPopupOpen} handleCloseDialog={() =>  setIsUploadCsvPopupOpen(false)} />
    </Box>
  );

}

ManageMenuItems.propTypes = {};

ManageMenuItems.defaultProps = {};

export default ManageMenuItems;
