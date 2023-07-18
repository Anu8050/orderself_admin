import React from "react";
import {
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  Stack,
  Grid,
} from "@mui/material";
import CancelRoundedIcon from "@mui/icons-material/CancelRounded";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { tableInfo } from "../../models";
import * as tableService from "../../services/tableService";
import { getRestaurantId } from "../../services/authService";
import ShowSnackbar from "../../utils/ShowSnackbar";

const AddSpecialTable = (props) => {
  const [openSnackBar, setOpenSnackBar] = React.useState(false);
  const [propsMessage, setPropsMessage] = React.useState("");
  const [propsSeverityType, setPropsSeverityType] = React.useState("");
  const [tableNumber, setTableNumber] = React.useState("");
  const [tableDescription, setTableDescription] = React.useState("");
  const [tableNumberErrorMessage, setTableNumberErrorMessage] =
    React.useState();
  const [tableDescriptionErrorMessage, setTableDescriptionErrorMessage] =
    React.useState();
  const [tableExists, setTableExists] = React.useState("");

  const handleClose = () => {
    setTableDescriptionErrorMessage("");
    setTableNumberErrorMessage("");
    setTableNumber("");
    setTableDescription("");
    props.handleCloseDialog(false);
  };
  const handleTableNumber = (e) => {
    const tableNumber = e.target.value;
    if (tableNumber.length == 0) {
      setTableNumber("");
      setTableNumberErrorMessage("Required");
    } else {
      setTableNumber(tableNumber);
      setTableNumberErrorMessage("");
    }
  };
  const handleTableDescription = (e) => {
    const tableDescription = e.target.value;
    if (!tableDescription) {
      setTableDescription("");
      setTableDescriptionErrorMessage("Required");
    } else {
      setTableDescription(tableDescription);
      setTableDescriptionErrorMessage("");
    }
  };

  const AddTableMethod = () => {
    setOpenSnackBar(false);
    if (!tableNumber.length) {
      setTableNumberErrorMessage("Required");
      return false;
    } else if (!tableDescription.length) {
      setTableDescriptionErrorMessage("Required");
      return false;
    }
    const isTableUnique = tableService.checkTableNumberUniqueness(tableNumber);

    isTableUnique.then((tblExists) => {
      setTableExists(tblExists);
      if (tableExists) {
        setTableNumberErrorMessage("Table Number already exist");
        return false;
      } else {
        var specialTableinfo = new tableInfo();
        specialTableinfo.tableNumber = tableNumber;
        specialTableinfo.description = tableDescription;
        specialTableinfo.specialTable = true;
        specialTableinfo.restaurantId = getRestaurantId();
        specialTableinfo.status = "Available";
        const x = tableService.addTables(specialTableinfo);
        x.then((value) => {
          if (value) {
            setOpenSnackBar(true);
            setPropsMessage(`${tableNumber} Table added successfully.`);
            setPropsSeverityType("success");
            handleClose();
          } else {
            setOpenSnackBar(true);
            setPropsMessage("Error occured when adding table");
            setPropsSeverityType("error");
            handleClose();
          }
        });
      }
    });
  };

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
          maxWidth="false"
          PaperProps={{ sx: { height: "48%" } }}
        >
          <DialogTitle id="max-width-dialog-title">
            <Grid
              container
              rowSpacing={1}
              columnSpacing={{ xs: 1, sm: 2, md: 2 }}
            >
              <Grid item xs={11}>
                <strong>Add Special Table</strong>
              </Grid>
              <Grid item xs={1} style={{ alignContent: "flex-start" }}>
                <CancelRoundedIcon
                  onClick={handleClose}
                  className="closeIcon"
                />
              </Grid>
            </Grid>
          </DialogTitle>
          <DialogContent
            style={{ borderTop: "0.15em solid #FC8019"}}
          >
            <Stack spacing={2} padding={1}>
              <TextField
                required
                id="tableNumber"
                label="Table Number"
                onBlur={handleTableNumber}
                onChange={(e) => handleTableNumber(e)}
                autoComplete="off"
                style={{ width: "240px" }}
              />
               <div style={{height:"5px"}}>
              {tableNumberErrorMessage && (
                <div
                  className="field-validation-text"
                >
                  {tableNumberErrorMessage}
                </div>
              )}
            </div>

              <TextField
                style={{ width: "240px", backgroundColor: "#fff" }}
                required
                id="tableDescription"
                label="Description"
                multiline
                rows={3}
                onBlur={handleTableDescription}
                onChange={(e) => handleTableDescription(e)}
              />
              <div style={{height:"5px"}}>
              {tableDescriptionErrorMessage && (
                <div className="field-validation-text">
               {tableDescriptionErrorMessage}
              </div>
              )}
              </div>
              <div style={{display:"flex",justifyContent:"space-around"}}>
                <Button
                  variant="contained"
                  style={{ width: "100px", marginTop: "10px" }}
                  onClick={AddTableMethod}
                >
                  Add
                </Button>
                <Button
                  variant="outlined"
                  style={{ width: "100px", marginTop: "10px" }}
                  onClick={handleClose}
                >
                  Cancel
                </Button>
              </div> 
            </Stack>
          </DialogContent>
        </Dialog>
      </React.Fragment>
      <ToastContainer autoClose={3000} />
    </div>
  );
};

AddSpecialTable.propTypes = {};

AddSpecialTable.defaultProps = {};

export default AddSpecialTable;
