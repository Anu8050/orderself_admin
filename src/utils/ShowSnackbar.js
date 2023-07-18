import React, { useState } from "react";
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
  });
export default function ShowSnackbar(props) {
  const [state, setState] = React.useState({
    open:true,
    vertical: "bottom",
    horizontal: "right"
  });
  const { vertical, horizontal,open} = state;
    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
          return;
        }
        setState({ ...state, open: false });
    };
  return (
    <div>
         <div>
          <Snackbar anchorOrigin={{ vertical, horizontal }} open={open} onClose={handleClose} autoHideDuration={3000} key={vertical + horizontal}>
          <Alert  onClose={handleClose} severity={props.severityType} sx={{ width: '100%' }}>
          {props.message}
          </Alert>
        </Snackbar>
     </div>   
    </div>
  )
}
