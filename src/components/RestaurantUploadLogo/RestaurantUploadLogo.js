import "./RestaurantUploadLogo.css";
import { useDropzone } from "react-dropzone";
import FileUploadIcon from "../../assets/images/fileuploadicon.png";
import React from "react";
import * as restaurantService from "../../services/restaurantService";
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Link,
  Grid,
} from "@mui/material";
import CancelRoundedIcon from "@mui/icons-material/CancelRounded";
import { setRestaurantLogoUrl } from "../../services/authService";
import LinearProgress from "@mui/material/LinearProgress";
import ShowSnackbar from "../../utils/ShowSnackbar";

export default function RestaurantUploadLogo(props) {
  const [openSnackBar, setOpenSnackBar] = React.useState(false);
  const [propsMessage, setPropsMessage] = React.useState("");
  const [propsSeverityType, setPropsSeverityType] = React.useState("");
  const [errors, setErrors] = React.useState("");
  const [loading, setLoadingIconState] = React.useState(false);
  const [isDisabled, setIsDisabled] = React.useState(true);

  const handleClose = () => {
    acceptedFiles.length = 0;
    props.handleCloseDialog(false);
    setLoadingIconState(false);
    setErrors("");
    setIsDisabled(true);
  };
  
  const { acceptedFiles, getRootProps, getInputProps, onError, open } =
    useDropzone({
      maxFiles: 1,
      multiple: false,
      maxSize: 102400, //for max size 100kb
      accept: {
        "image/png": [".png"],
        "image/jpg": [".jpg"],
        "image/jpeg": [".jpeg"],
      },
      onDrop: (acceptedFiles, fileRejections) => {
        if (fileRejections.length > 0) {
          fileRejections.forEach((file) => {
            file.errors.forEach((err) => {
              if (err.code === "file-too-large") {
                setErrors("Please upload a logo lesser than 100 Kb");
                setIsDisabled(true);
              }
              if (err.code === "file-invalid-type") {
                setErrors("Invalid file type");
                setIsDisabled(true);
              }
            });
          });
        } else if (acceptedFiles.length > 0) {
          setErrors("");
          setIsDisabled(false);
        }
      },
    });
  const files = acceptedFiles.map((file) => (
    <li key={file.path}>{file.path}</li>
  ));
  const uploadRestaurantLogo = () => {
    setLoadingIconState(true);
    let promise = restaurantService.uploadRestuarantLogo(acceptedFiles[0]);
    promise.then((url) => {
      setLoadingIconState(false);
      setRestaurantLogoUrl(url);
      setOpenSnackBar(true);
      setPropsMessage("Restaurant Logo uploaded successfully. This screen will be reloaded now with a new logo");
      setPropsSeverityType("success");
      if(url){
        setTimeout(() => {
          window.location.reload();
        }, 3000);       
      }
      handleClose();
    });
  };

  return (
    <div style={{ margin: "0px" }}>
      {openSnackBar && (
        <ShowSnackbar message={propsMessage} severityType={propsSeverityType} />
      )}
      <Dialog
        open={props.isDialogOpened}
        onClose={handleClose}
        aria-labelledby="max-width-dialog-title"
      >
        <div className="upload-icon-dialog-box">
          <DialogTitle id="max-width-dialog-title">
            <Grid
              container
              rowSpacing={1}
              columnSpacing={{ xs: 1, sm: 2, md: 3 }}
              className="upload-icon-title"
            >
              <Grid item xs={10}>
                <strong>Upload Restaurant Logo</strong>
              </Grid>
              <Grid item xs={1} style={{ alignContent: "flex-end" }}>
                <CancelRoundedIcon
                  onClick={handleClose}
                  className="closeIcon"
                />
              </Grid>
            </Grid>
          </DialogTitle>
          <DialogContent className="upload-icon-content">
            <div>
              <section className="image-dropzone">
                <div
                  {...getRootProps({ className: "dropzone" })}
                  style={{
                    backgroundColor: "#f1f3f4",
                    border: "1px dotted #000",
                    padding: "0px 5px",
                    fontSize: ".8em",
                  }}
                >
                  <input {...getInputProps()} />
                  {loading && <LinearProgress />}

                  <p style={{ textAlign: "center" }}>
                    <label>
                      <img
                        src={FileUploadIcon}
                        alt="File Upload Icon"
                        style={{ width: "20%" }}
                      />{" "}
                      <br />
                      Drag and drop the logo here or{" "}
                      <Link href="#" underline="none">
                        Browse
                      </Link>
                    </label>
                  </p>
                  <div style={{ color: "#FF0000" }}>{errors}</div>
                  <aside>
                    <ul>{files}</ul>
                  </aside>
                </div>
              </section>
            </div>
          </DialogContent>
          <DialogActions className="action-btn">
            <Button
              variant="contained"
              className="upload-icon-save-btn"
              onClick={uploadRestaurantLogo}
              disabled={isDisabled}
            >
              Save
            </Button>
          </DialogActions>
        </div>
      </Dialog>
    </div>
  );
}
