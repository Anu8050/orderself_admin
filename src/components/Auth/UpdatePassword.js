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
  TextField,
} from "@mui/material";
import CancelRoundedIcon from "@mui/icons-material/CancelRounded";
import { useState } from "react";
import * as authService from "../../services/authService"
import ShowSnackbar from "../../utils/ShowSnackbar";
const UpdatePassword = (props) => {

  const [openSnackBar, setOpenSnackBar] = React.useState(false);
  const [propsMessage, setPropsMessage] = React.useState("");
  const [propsSeverityType, setPropsSeverityType] = React.useState("");

  const [passwordErrorMessage, setPasswordErrorMessage] = useState("")
  const [password, setPassword] = useState("")
  const handleClose = () => {
    setPassword("");
    setPasswordErrorMessage("");
    props.handleCloseDialog(false);
  };
  const handlePassword = (e) => {
    const passwordData = e.target.value.trim();
    if (!passwordData) {
      setPasswordErrorMessage("Required");
    } else {
      if (passwordData.length < 8) {
        setPasswordErrorMessage("Required 8 Character");
      } else if (passwordData.length > 20) {
        setPasswordErrorMessage("Password Is very Large");
      } else {
        setPassword(passwordData);
        setPasswordErrorMessage("");
      }
    }
  }
  const sendLinkToResetPassword = () => {
    setOpenSnackBar(false);
    const res = authService.updateUserPassword(password);
    res.then((result) => {
      if (result) {
        props.handleCloseDialog(false);
        setOpenSnackBar(true);
        setPropsMessage(
          "Password Updated Successfully."
        );

        setPropsSeverityType("success");

      }
      else {
        setPasswordErrorMessage("Error while Updating password")
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
            PaperProps={{ sx: { width:"28rem"} }}
        >
          <DialogTitle id="max-width-dialog-title">
            <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
              <Grid item xs={11}>
                <strong>Update Password</strong>
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
            style={{ borderTop: "0.15em solid #FC8019", padding:"10px"  }}
            PaperProps={{ sx: { height: "72%"  } }}
          >
            <Box fullWidth>
              <FormControl sx={{width:"100%",marginTop:"20px"}} variant="outlined">
                <TextField
                  error={passwordErrorMessage}
                  id="outlined-adornment-password"
                  type={"password"}
                  label="Enter new password"
                  onChange={(e) => handlePassword(e)}
                />
                {passwordErrorMessage && <span style={{fontSize: "12px", color: "red"}}>{passwordErrorMessage}</span>}
              </FormControl>
            </Box>
          </DialogContent>
          <DialogActions>
              <Button variant="contained" onClick={sendLinkToResetPassword} disabled={!password}>Update</Button>
          </DialogActions>
        </Dialog>
      </React.Fragment>
    </div>
  );
};

UpdatePassword.propTypes = {};

UpdatePassword.defaultProps = {};

export default UpdatePassword;
