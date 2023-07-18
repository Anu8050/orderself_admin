import React from 'react';
import {
  Checkbox, Button, Dialog,
  DialogTitle,
  DialogContent, Stack, Grid, DialogActions,
  Switch,
} from "@mui/material";
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import CancelRoundedIcon from "@mui/icons-material/CancelRounded";
import * as porterService from '../../services/porterService';
import { useState, useEffect } from "react";
import * as tableService from '../../services/tableService';
import { getRestaurantId } from '../../services/authService';
import Avatar from '@mui/material/Avatar';
import { getUserLocal } from '../../services/authService';
import ShowSnackbar from "../../utils/ShowSnackbar";

const AssignPorter = (props) => {
    const [open, setOpen] = React.useState(true);
    const [porter, setPorter] = React.useState([]);
    const [porterId, setPorterId] = React.useState();
    const [idFromDb, setIdFromDb] = useState(false);
    const [selectedSwitch, setSelectedSwitch] = useState(null);
    const [openSnackBar, setOpenSnackBar] = React.useState(false);
    const [propsMessage, setPropsMessage] = React.useState("");
    const [propsSeverityType, setPropsSeverityType] = React.useState("");
    const handleOpen = () => setOpen(true);  

    useEffect(() => {     
      if (props.isDialogOpened){
        bindPorters();        
      }      
    }, [props.isDialogOpened, openSnackBar]);


    const bindPorters = () => {
      var restaurantId = getRestaurantId();
      var promise = porterService.getPorters(restaurantId);
      promise.then((doc) => {
        setPorter(doc);
        setIdFromDb(true);
        const result = porterService.getPorterIdByTableNum(props.tableId)
        result.then((res)=> {
          setPorterId(res);
        });
      });
    }

    const handleClose = () => {
    props.handleCloseDialog(false);
    setIdFromDb(true);
    setPorterId("");
    };

    const handleSwitchToggle = (id) => {
      setIdFromDb(false)
      if(selectedSwitch === id)
      {
        setSelectedSwitch("")
        setPorterId("");
      }
      else{
        setPorterId(id)
        setSelectedSwitch(id);
      }            
    };
   const assignPorterMethod = () => {
    setOpenSnackBar(false);
    const result = tableService.updatePorterForTable(props.tableId, porterId);
    if(result){
      setOpenSnackBar(true);
      setPorterId("");
      setPropsMessage(
        "Porter assigned successfully"
      );
      setPropsSeverityType("success");
    }
    handleClose();
   }
 
  return (
    <div style={{ margin: "0px" }}>
      {openSnackBar && (
        <ShowSnackbar message={propsMessage} severityType={propsSeverityType} />
      )}
      <React.Fragment>
        <Dialog
        open={props.isDialogOpened}
          onClose={handleClose}
          aria-labelledby="max-width-dialog-title"
          PaperProps={{ sx: { height: "72%" } }}
          maxWidth={false}
        >
          <DialogTitle id="max-width-dialog-title">
            <Grid
              container
              rowSpacing={1}
              columnSpacing={{ xs: 1, sm: 2, md: 3 }}
            >
              <Grid item xs={10}>
                <strong>Assign Porters</strong>
              </Grid>
              <Grid item xs={2} style={{ alignContent: "flex-start" }}>
                <CancelRoundedIcon
                  onClick={handleClose}
                  className="closeIcon"
                />
              </Grid>
            </Grid>
          </DialogTitle>
          <DialogContent style={{ borderTop: "0.15em solid #FC8019"}}
          PaperProps={{ sx: { height: "72%" } }}>
            <Stack spacing={2} padding={1}>
             {porter.map((doc)=>{
                return(
                    <div key={doc.id} style={{display:'flex', alignItems:"center"}}>                    
                     {idFromDb ? (
                      <Checkbox
                     type="checkbox"
                     checked={porterId === doc.id}
                     onChange={() => handleSwitchToggle(doc.id)} /> 
                    ) : (
                    <Checkbox
                     type="checkbox"
                     checked={selectedSwitch === doc.id}   
                     onChange={() => handleSwitchToggle(doc.id)}
                      />
                    )}
                     <Avatar sx={{ height: '30px', width: '30px' }} alt="Remy Sharp" src={doc.profileUrl} /> 
                     <span>&nbsp; {doc.firstName}  {doc.lastName}</span>  
                    </div>
                );
             })}
             </Stack>
              </DialogContent>

              <DialogActions>
              <Grid
              container
              rowSpacing={1}
              columnSpacing={{ xs: 1, sm: 2, md: 3 }}
            >
              <Grid item xs={12} textAlign="center">
                <Button variant="contained" sx={{width:"30%"}} onClick={assignPorterMethod}>Save</Button>              
                </Grid>
                </Grid>
              </DialogActions>
                
            
        </Dialog>
      </React.Fragment>
    </div>
  );
};

AssignPorter.propTypes = {};

AssignPorter.defaultProps = {};

export default AssignPorter;
