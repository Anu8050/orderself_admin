import React from "react";
import { DataGrid } from "@mui/x-data-grid";
import { useState, useEffect } from "react";
import Grid from "@mui/material/Grid";
import { Button } from "@mui/material";
import AddPortersPopup from "../ManagePorters/AddPortersPopup";
import TriggerPorterEmailRegistration from "../ManagePorters/TriggerPorterEmailRegistration";
import "./ManagePorters.css";
import * as porterService from "../../services/porterService";
import { Box, Typography } from "@mui/material";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import BorderColorOutlinedIcon from "@mui/icons-material/BorderColorOutlined";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Tooltip, { tooltipClasses } from "@mui/material/Tooltip";
import { styled } from "@mui/material/styles";
import LinearProgress from '@mui/material/LinearProgress';
import AppRegistrationIcon from '@mui/icons-material/AppRegistration';
import { getRestaurantId } from "../../services/authService";
import ShowSnackbar from "../../utils/ShowSnackbar"
import * as constants from '../../constants/index'
import DeleteIcon from '@mui/icons-material/Delete';

const LightTooltip = styled(({ className, ...props }) => (
  <Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: theme.palette.common.white,
    color: "rgba(0, 0, 0, 0.87)",
    boxShadow: theme.shadows[1],
    fontSize: 11,
  },
}));


const ManagePorters = () => {
  const [openSnackBar, setOpenSnackBar] = React.useState(false);
  const [propsMessage, setPropsMessage]= React.useState("");
  const [propsSeverityType, setPropsSeverityType] = React.useState("");

  const [pageSize, setPageSize] = React.useState(constants.GLOBAL_PAGE_SIZE);
  const [porters, setPorters] = useState([]);
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = (params) => {
    setOpen(true);
    const porterEmail = porters.find(element => element.id == params).emailId
    setPorterEmail(porterEmail)
  };

  const handleClose = () => {
    setOpen(false);
    setPorterEmail("")
  };
  const [getId, setGetId] = React.useState();
  const [forEditPorters, setForEditPorters] = React.useState();
  const [modeOfOperation, setModeOfOperation] = React.useState("Add");
  const [loading, setLoadingIconState] = React.useState(true);
  const [porterEmailId,setPorterEmail] = React.useState();

  const porterDelete = () => {
    porterService.deletePorterById(porterEmailId);
    var restaurantId = getRestaurantId();
    let result = porterService.deletePorter(restaurantId, getId.id);
    result.then((value) => {
      if (value) {
        setOpenSnackBar(true);
        const porter = porters.find(element => element.id == getId.id);
        setPropsMessage(`${porter.firstName} ${porter.lastName} deleted successfully.`);
        setPropsSeverityType("success");
      }
  })   
    setOpen(false);
  };

  const setEditPorterPopup = (e) => {
    if (e) {
      setModeOfOperation("Update");
    } else {
      setModeOfOperation("Add");
      setForEditPorters(null);
    }
  };

  useEffect(() => {
    var restaurantId = getRestaurantId();
    var promise = porterService.getPorters(restaurantId);
    promise.then((allPorters) => {
      setPorters(allPorters);
      setLoadingIconState(false);
    });
  }, [porters]);


  const columns = [
    {
      field: "firstName",
      headerName: <strong>First Name</strong>,      
      flex: .2,
    },
    { field: "lastName", 
    headerName: <strong>Last Name</strong>, 
    flex: .2 },
    {
      field: "gender",
      headerName: <strong>Gender</strong>,
      width: 150,
    },
    {
      field: "emailId",
      headerName: <strong>Email</strong>,
      width: 150,
      flex: .5,
    },
    {
      field: "phone",
      headerName: <strong>Phone</strong>,
      width: 150,
    },
    {
      field: "actions",
      type: "actions",
      headerName: <strong>Actions</strong>,
      flex: 0.2,
      getActions: (params) => [
        <LightTooltip
          title="edit"
          onClick={() => {handlePortersPopupOpen(true, params.row)}}
        >
          <BorderColorOutlinedIcon fontSize="medium" sx={{ width: "50px" }} />
        </LightTooltip>,
        <LightTooltip title="Delete">
        <DeleteOutlineIcon
          fontSize="medium"
          sx={{ width: "50px" }}
          onClick={() => {handleClickOpen(params.row.id);setGetId(params.row);setOpenSnackBar(false);}}
        />
      </LightTooltip>,
      ],
      
    },
  ];

  const [isPortersPopupOpen, setIsPortersPopupOpen] = useState(false);
  const handlePortersPopupOpen = (isEdit, row) => {
    if (isEdit) {
      setEditPorterPopup(isEdit);
      setForEditPorters(row);
      setIsPortersPopupOpen(!isPortersPopupOpen);
    } else {
      setEditPorterPopup(isEdit);
      setIsPortersPopupOpen(!isPortersPopupOpen);
      setForEditPorters(null);
    }
  };

  const [isPorterRegistrationPopupOpen, setIsPorterRegistrationPopupOpen] = useState(false);
  const handlePorterRegistrationPopupOpen = () => {      
    setIsPorterRegistrationPopupOpen(!isPorterRegistrationPopupOpen); 
  };

  
function CustomNoRowsOverlay(message) {
  return (
    <div xs={12} style={{ textAlign: "center", paddingTop: "50px" }}>
      <Typography variant="h6" gutterBottom>
        {message}
      </Typography>
    </div>
  );
}

  return (
    <>
    {openSnackBar &&
    <ShowSnackbar message={propsMessage} severityType={propsSeverityType}/>
    }
      <Box
        className=""
        sx={{
          pl: 9,
          pr: 1,
          pt: 1,
          width: '100%',
          overflow: 'auto',
          backgroundColor: '#EAEAEA'
        }}
      >
          <Grid style={{}}>
            <Grid container padding={1} style={{ borderTopLeftRadius: '8px', borderTopRightRadius: '8px', backgroundColor: '#fff', alignContent: 'space-around' }} marginBottom={0.5}>
            <Grid item xs={8} className="breadcrumb">
              <span>Porters</span>
            </Grid>
            <Grid item xs className="action-button">
            <span><Button variant='contained' onClick={() => handlePorterRegistrationPopupOpen()}><AppRegistrationIcon />&nbsp;&nbsp;Send Registration Link</Button></span>
            </Grid>
          </Grid>

          <Grid container padding={2} style={{ backgroundColor: '#fff' }}>
          <Grid item xs={12} className="">
            <div style={{ height: 500, width: '100%' }}>
              <div style={{ display: 'flex', height: '100%' }}>
                <div style={{ flexGrow: 1 }}>
                <DataGrid 
                  columns={columns}
                  rows={porters}                  
                  pageSize={pageSize}
                  onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
                  rowsPerPageOptions={constants.GLOBAL_PAGE_SIZE_OPTIONS}
                  pagination        
                  components={{
                    NoRowsOverlay: () => CustomNoRowsOverlay("No Rows found."),
                    LoadingOverlay: LinearProgress,
                  }}
                  loading = {loading}    
                />
                </div>
              </div>
            </div>
          </Grid>
        </Grid>
        </Grid>
      </Box>
      <AddPortersPopup
        porterDetail={forEditPorters}
        isDialogOpened={isPortersPopupOpen}
        modeOfOperation={modeOfOperation}
        handleCloseDialog={() => setIsPortersPopupOpen(false)}
      />
      <TriggerPorterEmailRegistration      
      isDialogOpened={isPorterRegistrationPopupOpen}      
      handleCloseDialog={() => setIsPorterRegistrationPopupOpen(false)}
      />
       <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          <h2>Are you sure ?</h2>
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description"></DialogContentText>
          <p style={{ color: "gray" }}>Are you sure, you want to delete this porter <strong>{porterEmailId}</strong> ?</p>
          <p style={{ color: "gray" }}>This process cannot be undone</p>
        </DialogContent>
        <DialogActions>
          <Button variant="outlined" onClick={handleClose}>
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={porterDelete}
            autoFocus
            startIcon={<DeleteIcon />}
            sx={{ fontSize: "18px" }}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

ManagePorters.propTypes = {};

ManagePorters.defaultProps = {};

export default ManagePorters;
