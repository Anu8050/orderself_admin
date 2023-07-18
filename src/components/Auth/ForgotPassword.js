import React from "react";
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  Grid,
  DialogActions,
  Box,
  FormControl,
  InputLabel,
  OutlinedInput,
} from "@mui/material";
import CancelRoundedIcon from "@mui/icons-material/CancelRounded";
import { useState } from "react";
import ShowSnackbar from "../../utils/ShowSnackbar";
import * as authService from "../../services/authService"
const ForgotPassword = (props) => {
  
const [openSnackBar, setOpenSnackBar] = React.useState(false);
const [propsMessage, setPropsMessage] = React.useState("");
const [propsSeverityType, setPropsSeverityType] = React.useState("");
  const [emailErrorMessage, setEmailErrorMessage] = useState("")
  const [email, setEmail] = useState("")
  const handleClose = () => {
    setEmail("");
    setEmailErrorMessage("");
    props.handleCloseDialog(false);
  };
  const handleEmail = (e) => {       
    const emailData = e.target.value.trim();
    if (!emailData) {
        setEmailErrorMessage("Required")
    }else{
        if(/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(emailData)){
            setEmail(emailData)
            setEmailErrorMessage('')
        }else{                
            setEmailErrorMessage("Invalid Email")
        }
    }
}
const sendLinkToResetPassword=()=>{
  setOpenSnackBar(false);
  const res = authService.resetPassword(email);
  res.then((result)=>{
if(result){
  setOpenSnackBar(true);
  setPropsMessage(
    "Please check your email. A password reset link is sent to your registered email to reset the password."
  );

setPropsSeverityType("success");
  handleClose();
}
else{
  setEmailErrorMessage("user not found!!!")
}
  })
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
            PaperProps={{ sx: { width:"30%" } }}
          maxWidth={false}
        >
          <DialogTitle id="max-width-dialog-title">
            <Grid
              container
              rowSpacing={1}
              columnSpacing={{ xs: 1, sm: 2, md: 3 }}
            >
              <Grid item xs={11}>
                <strong>Forgot Password</strong>
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
            style={{ borderTop: "0.15em solid #FC8019" }}
            PaperProps={{ sx: { height: "72%" } }}
          >
            <Box fullWidth>
              <FormControl sx={{width:"80%",marginTop:"20px"}} variant="outlined">
                <InputLabel htmlFor="outlined-adornment-email">
                 Email
                </InputLabel>
                <OutlinedInput
                  error={emailErrorMessage}
                  id="outlined-adornment-email"
                  type={"email"}
                  label="Email"
                  onChange={(e) => handleEmail(e)}
                  helperText="Incorrect Email"
                />
                {emailErrorMessage && <span style={{fontSize: "12px", color: "red"}}>{emailErrorMessage}</span>}
              </FormControl>
            </Box>
          </DialogContent>
          <DialogActions>
            <div>
              <Button variant="contained" onClick={sendLinkToResetPassword} disabled={!email}>Send link</Button>
            </div>
          </DialogActions>
        </Dialog>
      </React.Fragment>
    </div>
  );
};

ForgotPassword.propTypes = {};

ForgotPassword.defaultProps = {};

export default ForgotPassword;
