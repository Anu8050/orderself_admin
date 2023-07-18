import "./TriggerPorterEmailRegistration.css";
import React, { useState } from "react";
import * as porterService from "../../services/porterService";
import {
  Button,
  TextField,
  FormControl,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
} from "@mui/material";
import CancelRounded from "@mui/icons-material/CancelRounded";
import { getRestaurantId } from "../../services/authService";
import LoadingButton from "@mui/lab/LoadingButton";
import * as porterServices from "../../services/porterService";
import Alert from "@mui/material/Alert";
import ShowSnackbar from "../../utils/ShowSnackbar";

const TriggerPorterEmailRegistration = (props) => {
  const [openSnackBar, setOpenSnackBar] = React.useState(false);
  const [propsMessage, setPropsMessage] = React.useState("");
  const [propsSeverityType, setPropsSeverityType] = React.useState("");

  const [open, setOpen] = React.useState(false);
  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClickClose = () => {
    setOpen(false);
    setLoading(false);
  };
  const [loading, setLoading] = React.useState(false);
  const [emailId, setEmailId] = React.useState("");
  const [isValidEmail, setIsValidEmail] = React.useState("");
  const [emailErrorMessage, setEmailErrorMessage] = useState("");
  const emailIdHandleChange = (event) => {
    setEmailId(event.target.value);
    if (!event.target.value.length) {
      setEmailErrorMessage("Required");
    } else {
      if (/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(emailId)) {
        setEmailErrorMessage("");
        setIsValidEmail(true);
      } else {
        setIsValidEmail(false);
        setEmailErrorMessage("Invalid Email");
      }
    }
  };

  const handleClose = () => {
    props.handleCloseDialog(false);
    setEmailId("");
    setEmailErrorMessage("");
    setLoading(false);
  };
  const agreeCreateMail = () => {
    const result = porterService.TriggerPorterRegistration(
      emailId,
      localStorage.getItem("restaurant-name"),
      getRestaurantId()
    );
    result.then((data) => {
      if (data !== "error") {
        setLoading(false);
        setOpenSnackBar(true);
        setPropsMessage("Registration link to porter is sent successfully.");
        setPropsSeverityType("success");
        handleClose();
      } else {
        setLoading(false);
        setOpenSnackBar(true);
        setPropsMessage("Error occurred while sending the registration link.");
        setPropsSeverityType("error");
      }
    });
    handleClickClose();
  };

  const sendPorterRegistrationLink = () => {
    setOpenSnackBar(false);
    setLoading(true);
    if (!emailId.length) {
      setEmailErrorMessage("Required");
      setLoading(false);
      return false;
    } else if (!isValidEmail) {
      setEmailErrorMessage("Invalid Email");
      setLoading(false);
      return false;
    } else {
      
      var authUserExists = porterService.menuItemCsvUpload(emailId);
      authUserExists.then((result)=> {
        if(result.data == "auth/user-not-found"){
          const uniqueEmail = porterServices.checkPorterEmailUniqueness(emailId);
          uniqueEmail.then((email) => {
            if (email) {
              handleClickOpen();
            } else {
              agreeCreateMail();
            }
          });
        }
        else {
          setLoading(false);
          setOpenSnackBar(true);
          setPropsMessage("You cannot register with this email as someone has been already registered. Please contact the administrator for assistance.");
          setPropsSeverityType("warning");          
        }
      });    
      
    }
  };
  return (
    <div style={{ margin: "0px" }}>
      {openSnackBar && (
        <ShowSnackbar message={propsMessage} severityType={propsSeverityType} />
      )}
      <React.Fragment>
        <Dialog
          open={open}
          onClose={handleClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <div style={{ height: "250px", width: "400px" }}>
            <DialogTitle id="alert-dialog-title">
              <strong>Confirmation</strong>
            </DialogTitle>
            <DialogContent
              className=""
              style={{
                borderTop: "0.15em solid #FC8019",
                paddingTop: "5px",
                height: "110px",
              }}
            >
              <Alert severity="warning">
                The registration email was already sent to this porter.Do you
                still want to resend it?
              </Alert>
            </DialogContent>
            <DialogActions>
              <Button variant="outlined" onClick={handleClickClose}>
                No
              </Button>
              <Button variant="contained" onClick={agreeCreateMail} autoFocus>
                Yes
              </Button>
            </DialogActions>
          </div>
        </Dialog>
        <Dialog
          open={props.isDialogOpened}
          onClose={handleClose}
          aria-labelledby="max-width-dialog-title"
        >
          <div style={{ width: "400px" }}>
            <DialogTitle id="max-width-dialog-title">
              <Grid
                container
                rowSpacing={1}
                columnSpacing={{ xs: 1, sm: 2, md: 3 }}
              >
                <Grid item xs={11}>
                  <strong>Send Registration Link to Porter</strong>
                </Grid>
                <Grid item xs={1} style={{ alignContent: "flex-start" }}>
                  <CancelRounded onClick={handleClose} className="closeIcon" />
                </Grid>
              </Grid>
            </DialogTitle>
            <DialogContent
              className=""
              style={{
                borderTop: "0.15em solid #FC8019",
                paddingTop: "5px",
                height: "110px",
              }}
            >
              <FormControl>
                <div className="row-col-layout">
                  <div>
                    <TextField
                      required
                      error={emailErrorMessage}
                      id="porterEmail"
                      label="Email"
                      autoComplete="off"
                      onChange={(e) => emailIdHandleChange(e)}
                      onBlur={emailIdHandleChange}
                      style={{ width: "270px" }}
                    />
                    {emailErrorMessage && (
                      <span style={{ fontSize: "12px", color: "red" }}>
                        {emailErrorMessage}
                      </span>
                    )}
                  </div>
                </div>
              </FormControl>
            </DialogContent>
            <DialogActions>
              <LoadingButton
                variant="contained"
                loading={loading}
                loadingPosition="start"
                onClick={sendPorterRegistrationLink}
              >
                Send Link
              </LoadingButton>
              <Button variant="outlined" onClick={handleClose}>
                Cancel
              </Button>
            </DialogActions>
          </div>
        </Dialog>
      </React.Fragment>
    </div>
  );
};

TriggerPorterEmailRegistration.propTypes = {};

TriggerPorterEmailRegistration.defaultProps = {};

export default TriggerPorterEmailRegistration;
