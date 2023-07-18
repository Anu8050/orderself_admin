import React, { useState } from 'react';
import {
  Button,
  Grid,
  Switch,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Box,
  Typography
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import AddIcon from '@mui/icons-material/Add';
import * as menuService from '../../services/menuService';
import ShowSnackbar from "../../utils/ShowSnackbar";
import BorderColorIcon from '@mui/icons-material/BorderColor';
import CancelRoundedIcon from "@mui/icons-material/CancelRounded";
import LinearProgress from '@mui/material/LinearProgress';
import * as constants from '../../constants/index'





const FoodCategory = () => {
  

  const [openSnackBar, setOpenSnackBar] = React.useState(false);
  const [propsMessage, setPropsMessage] = React.useState("");
  const [propsSeverityType, setPropsSeverityType] = React.useState("");

  
  const [foodCategoryList, setFoodCategoryList] = useState([]);
  const [active, setActive] = useState(true);
  const [foodCategoryName, setFoodCategoryName] = useState('');
  const [foodCategoryId, setFoodCategoryId] = useState();

  const [openDialog, setOpenDialog] = useState(false);
  const [dialogMode, setDialogMode] = useState('Add');

  const [loading, setLoadingIconState] = React.useState(true);

  const [pageSize, setPageSize] = React.useState(constants.GLOBAL_PAGE_SIZE);

  function CustomNoRowsOverlay(message) {
    return (
      <div xs={12} style={{ textAlign: "center", paddingTop: "50px" }}>
        <Typography variant="h6" gutterBottom>
          {message}
        </Typography>
      </div>
    );
  }

  React.useEffect(() => {
    const promise = menuService.getFoodCategoryNew();
    promise.then((docs) => {
        setFoodCategoryList(docs);
        setLoadingIconState(false);        
      });
  }, [openSnackBar]);
 

  const handleOpenDialog = (mode, data) => {
    setFoodCategoryName('');
    setActive(true);
    setEmpty(true);
    setErrorMessage("")

    setOpenDialog(true);
    setDialogMode(mode);
    if(mode == "Update"){
        setFoodCategoryName(data.foodCategory);
        setActive(data.active);
        setFoodCategoryId(data.id);
    }
  };

  const handleDialogClose = () => {
    setOpenDialog(false);
  };

  const handleCategoryChange = (e) => {
    // setFoodCategoryName(event.target.value);

    if (!e.target.value) {
      setErrorMessage("Required");
      setFoodCategoryName(e.target.value);
    } else {
      const regexExpr = new RegExp("^[a-zA-Z0-9äöüÄÖÜß._ ]*$");
      if (regexExpr.test(e.target.value)) {
        setFoodCategoryName(e.target.value);
        setErrorMessage(" ");
      } else {
        setErrorMessage("Invalid food category");
      }
    }
  };

  const handleSwitchChange = (event) => {
    setActive(event.target.checked);
  };

  const [errorMessage, setErrorMessage] = useState('');
  const [empty, setEmpty] = useState(true);

  const handleAddCategory = () => {
    setOpenSnackBar(false);
    let docId = dialogMode == "Update" ? foodCategoryId : null;
    const isExist = menuService.checkFoodCategoryNewUniqueness(foodCategoryName ,docId);
    isExist.then(data=>{
        if(data){
            setErrorMessage("food category already exist")
            
        } else{
            if (dialogMode == "Add") {
                const addResult = menuService.addFoodCategoryNew(foodCategoryName, active);
                addResult.then((res)=>{
                  if(res){
                    setOpenSnackBar(true);
                    setPropsMessage("Added Food category Successfully");            
                    setPropsSeverityType("success");
                  }
                  else{
                    setOpenSnackBar(true);
                    setPropsMessage("Error while adding Food category!!");            
                    setPropsSeverityType("error");
                  }
                })
                setOpenDialog(false);
                setErrorMessage("")
            }
            else {
                const updateResult = menuService.updateFoodCategoryNew(foodCategoryId, foodCategoryName, active);
                updateResult.then((res)=>{
                  if(res){
                    setOpenSnackBar(true);
                    setPropsMessage("Updated Food category Successfully");            
                    setPropsSeverityType("success");
                  }
                  else{
                    setOpenSnackBar(true);
                    setPropsMessage("Error while Updating Food category!!");            
                    setPropsSeverityType("error");
                  }
                })
                setOpenDialog(false);
                setErrorMessage("")
            }
    
        }
    })
  };


  const columns = [
      { field: 'foodCategory', headerName: 'Food Category', width: 200 },
      { field: 'active', headerName: 'Active', width: 200, },
      {
          field: 'actions', headerName: 'Actions', width: 120,
          renderCell: (params) => (
              <BorderColorIcon onClick={() => {
                  handleOpenDialog('Update',params.row)
              }} />
          ),
      },
  ];

  return (

    <Box className="ManageTables" sx={{
        pl: 9,
        pr: 1,
        pt: 1,
        width: '100%',
        overflow: 'auto',
        backgroundColor: '#EAEAEA'
      }}>
        {openSnackBar && (
        <ShowSnackbar message={propsMessage} severityType={propsSeverityType} />
      )}
          <Grid container padding={1} style={{ borderTopLeftRadius: '8px', borderTopRightRadius: '8px', backgroundColor: '#fff', alignContent: 'space-around' }} marginBottom={0.5}>
              <Grid item xs={4} className="breadcrumb">
                  <span>Food Category</span>
              </Grid>
              <Grid item xs={8} className="action-button">
                  <Button variant="contained" color="primary" onClick={()=> handleOpenDialog('Add')} style={{ float: 'right' }}><AddIcon />&nbsp;Add </Button>
              </Grid>
          </Grid>

          <Grid container padding={2} style={{ backgroundColor: '#fff' }}>
          <Grid item xs={12} className="">
                  <div style={{ height: 650, width: '100%' }}>
                      <div style={{ display: 'flex', height: '100%' }}>
                          <div style={{ flexGrow: 1 }}>
                              <DataGrid
                                  // autoHeight
                                  rows={foodCategoryList}
                                  columns={columns}
                                  pageSize={pageSize}
                                  onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
                                  rowsPerPageOptions={constants.GLOBAL_PAGE_SIZE_OPTIONS}
                                  disableSelectionOnClick
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

      {/* food category popup to add new food category */}
      <Dialog open={openDialog} onClose={handleDialogClose} 
      maxWidth={false}
      aria-labelledby="max-width-dialog-title"
      PaperProps={{ sx: { width: "25rem" } }}
      >
        <DialogTitle> {dialogMode} Food Category 
        <CancelRoundedIcon onClick={handleDialogClose} style={{ float: 'right' }} className="closeIcon"/>
        </DialogTitle>
        <DialogContent style={{ borderTop: "0.15em solid #FC8019" }}> 
          <TextField
            autoFocus
            margin="dense"
            label="Food Category"
            fullWidth
            value={foodCategoryName}
            onChange={handleCategoryChange}
          />
           {errorMessage && (
                    <span style={{ fontSize: "12px", color: "red" }}>
                      {errorMessage}
                    </span>
                  )}
          <br />
          <br />
          <Switch
            checked={active}
            onChange={handleSwitchChange}
            color="primary"
          />
          <span>Active</span>
        </DialogContent>
        <DialogActions>
        <Button  variant ="contained" onClick={handleAddCategory} color="primary" disabled = {!empty}>
          {dialogMode}
          </Button>
          <Button variant ="contained" onClick={handleDialogClose} color="primary">
            Cancel
          </Button>          
        </DialogActions>
      </Dialog>
    

    </Box>
    
  );
};

export default FoodCategory;
