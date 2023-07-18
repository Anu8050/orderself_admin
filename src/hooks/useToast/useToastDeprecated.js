import { Alert, Portal, Snackbar } from "@mui/material";
import React, { useEffect, useState } from "react";
// DON'T USE THIS HOOK WILL REMOVE THIS SOON */
const useToastDeprecated = () => {
  console.error("PLEASE DO NOT USE THIS HOOK. USE THE LATEST ONE INSTEAD");

  const [toast, setToast] = useState({
    show: false,
    message: "",
    severity: "info",
  });

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setToast({
      show: false,
      message: "",
      severity: "",
    });
  };

  useEffect(() => {
    if (toast.show) {
      setTimeout(() => {
        handleClose();
      }, 2000);
    }
  }, [toast]);

  const SnackbarContainer = React.memo(() => {
    return (
      <Portal>
        <Snackbar
          open={toast.show}
          autoHideDuration={2000}
          onClose={handleClose}
        >
          <Alert
            onClose={handleClose}
            severity={toast.severity}
            sx={{
              width: "max-content",
              zIndex: "99999",
              position: "fixed",
              right: "50px",
              top: "60px",
            }}
          >
            {toast.message}
          </Alert>
        </Snackbar>
      </Portal>
    );
  });

  return { setToast, SnackbarContainer };
};

export default useToastDeprecated;
