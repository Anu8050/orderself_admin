import "./AddPortersPopup.css";
import React, { useState, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import FileUploadIcon from "../../assets/images/fileuploadicon.png";
import {
  Button,
  TextField,
  FormControl,
  InputLabel,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  MenuItem,
  Link,
  Grid,
  Select,
} from "@mui/material";
import CancelRounded from "@mui/icons-material/CancelRounded";

import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import { porterInfo } from "../../models";
import * as porterService from "../../services/porterService";
import * as authService from "../../services/authService";
import ShowSnackbar from "../../utils/ShowSnackbar";

const AddPortersPopup = ({ porterDetail, ...props }) => {
  const [openSnackBar, setOpenSnackBar] = React.useState(false);
  const [propsMessage, setPropsMessage] = React.useState("");
  const [propsSeverityType, setPropsSeverityType] = React.useState("");


  const handleClose = () => {
    props.handleCloseDialog(false);
    acceptedFiles.length = 0;
    if (props.modeOfOperation == "Add") setDateOfBirth(dayjs(null));
    else setDateOfBirth(dayjs(porterDetail?.dob));

    setDobErrorMessage("");
    // setAddressErrorMessage("");
    setPhoneErrorMessage("");
    setLastNameErrorMessage("");
    setfirstNameErrorMessage("");
  };

  const { acceptedFiles, getRootProps, getInputProps, open } = useDropzone({
    maxFiles: 1,
    multiple: false,
    accept: {
      "image/*": [".jpeg", ".jpg", ".png"],
    },
  });

  const files = acceptedFiles.map((file) => (
    <li key={file.path}>{file.path}</li>
  ));
  var profileImageName = "";
  if (acceptedFiles.length != 0) {
    profileImageName = "";
  } else {
    profileImageName = porterDetail?.profileImageName;
  }
  const [firstName, setFirstName] = React.useState(porterDetail?.firstName);
  const [firstNameErrorMessage, setfirstNameErrorMessage] = React.useState("");
  const firstNameHandleChange = (event) => {
    const firstNameData = event.target.value;
    if (!firstNameData) {
      setfirstNameErrorMessage("Required");
      setFirstName(firstNameData);
    } else {
      if (/^[A-Za-z0-9_. ]+$/.test(firstNameData)) {
        setFirstName(firstNameData);
        setfirstNameErrorMessage("");
      }
    }
  };

  const [lastName, setLastName] = React.useState(porterDetail?.lastName);
  const [lastNameErrorMessage, setLastNameErrorMessage] = React.useState("");
  const lastNameHandleChange = (event) => {
    const lastNameData = event.target.value;
    if (!lastNameData) {
      setLastNameErrorMessage("Required");
      setLastName(lastNameData);
    } else {
      if (/^[A-Za-z0-9_. ]+$/.test(lastNameData)) {
        setLastName(lastNameData);
        setLastNameErrorMessage("");
      }
    }
  };

  const [emailId, setEmailId] = React.useState(porterDetail?.emailId);
  const [emailErrorMessage, setEmailErrorMessage] = useState("");
  const emailIdHandleChange = (event) => {
    const emailData = event.target.value;
    if (!emailData) {
      setEmailErrorMessage("Required");
    } else {
      if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(emailData)) {
        setEmailId(emailData);
        setEmailErrorMessage("");
      } else {
        setEmailErrorMessage("Invalid Email");
      }
    }
  };

  const [phone, setPhone] = React.useState(porterDetail?.phone);
  const [phoneErrorMessage, setPhoneErrorMessage] = useState("");
  const phoneHandleChange = (event) => {
    const phoneData = event.target.value;
    if (!phoneData) {
      setPhoneErrorMessage("Required");
      setPhone(phoneData);
    } else {
      if (/^[0-9]+$/.test(phoneData)) {
        setPhone(phoneData);
        setPhoneErrorMessage("");
      } else {
        setPhoneErrorMessage("Invalid PhoneNumber");
      }
    }
  };

  const [porterGender, setPorterGender] = useState(porterDetail?.gender);
  const [genderErrorMessage, setGenderErrorMessage] = useState("");
  const handlePorterGenderChange = (event) => {
    const genderData = event.target.value;
    if (!genderData) {
      setGenderErrorMessage("Required");
    } else {
      setPorterGender(genderData);
      setGenderErrorMessage("");
    }
  };

  // const [porterAddress, setPorterAddress] = React.useState(
  //   porterDetail?.address
  // );
  // const [addressErrorMessage, setAddressErrorMessage] = useState("");
  // const handleSetPorterAddressChange = (event) => {
  //   const addressData = event.target.value;
  //   if (!addressData) {
  //     setAddressErrorMessage("Required");
  //     setPorterAddress(addressData);
  //   } else {
  //     if (/^[A-Za-z0-9_. ]+$/.test(addressData)) {
  //       setPorterAddress(addressData);
  //       setAddressErrorMessage("");
  //     }
  //   }
  // };

  const [dateOfBirth, setDateOfBirth] = React.useState(dayjs(null));
  const [dobErrorMessage, setDobErrorMessage] = React.useState("");
  useEffect(() => {
    // setPorterAddress(porterDetail?.address);
    setPorterGender(porterDetail?.gender);
    setPhone(porterDetail?.phone);
    setEmailId(porterDetail?.emailId);
    setLastName(porterDetail?.lastName);
    setFirstName(porterDetail?.firstName);
    if (props.modeOfOperation == "Update") {
      setDateOfBirth(dayjs(porterDetail?.dob)); //for edit
    } else {
      setDateOfBirth(dayjs(null)); //for add
    }
  }, [porterDetail,openSnackBar]);

  const addPorterDetail = async () => {
    setOpenSnackBar(false);

    if (props.modeOfOperation === "Update") {
      if (!firstName.length) {
        setfirstNameErrorMessage("Required");
        return false;
      }
      if (!lastName.length) {
        setLastNameErrorMessage("Required");
        return false;
      }
      if (!phone.length) {
        setPhoneErrorMessage("Required");
        return false;
      }
      // if (!porterAddress.length) {
      //   setAddressErrorMessage("Required");
      //   return false;
      // }
      if (dateOfBirth == null) {
        setDobErrorMessage("Required");
        return false;
      }

      var porter = new porterInfo();
      porter.firstName = firstName;
      porter.lastName = lastName;
      porter.emailId = emailId;
      porter.phone = phone;
      porter.dob = dateOfBirth.$d.toLocaleDateString("en-US");
      porter.gender = porterGender;
      // porter.address = porterAddress;
      porter.restaurantId = authService.getRestaurantId(); //Hardcoded intentionally;
      porter.password = "password";
      porter.profileUrl = "urlhere";
      let result = porterService.updatePorter(
        porter,
        acceptedFiles[0],
        porterDetail.id
      );
      result.then((value) => {
        if (value) {
          setOpenSnackBar(true);
          setPropsMessage("Porter details saved successfully.");
          setPropsSeverityType("success");
        }
      });
    }
    props.handleCloseDialog(false);
    acceptedFiles.length = 0;
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
        >
          <DialogTitle id="max-width-dialog-title">
            <Grid
              container
              rowSpacing={1}
              columnSpacing={{ xs: 1, sm: 2, md: 3 }}
            >
              <Grid item xs={11}>
                <strong>{props.modeOfOperation} Porters</strong>
              </Grid>
              <Grid item xs={1} style={{ alignContent: "flex-start" }}>
                <CancelRounded onClick={handleClose} className="closeIcon" />
              </Grid>
            </Grid>
          </DialogTitle>
          <DialogContent
            className=""
            style={{ borderTop: "0.15em solid #FC8019", paddingTop: "5px" }}
          >
            <FormControl>
              <div className="row-col-layout">
                <div>
                  <TextField
                    required
                    name="firstName"
                    label="First Name"
                    error={firstNameErrorMessage}
                    defaultValue={porterDetail?.firstName}
                    onChange={(e) => firstNameHandleChange(e)}
                    onBlur={firstNameHandleChange}
                    style={{ width: "240px" }}
                  />
                  {firstNameErrorMessage && (
                    <span style={{ fontSize: "12px", color: "red" }}>
                      {firstNameErrorMessage}
                    </span>
                  )}
                </div>
                <div>
                  <TextField
                    required
                    id="lastName"
                    label="Last Name"
                    error={lastNameErrorMessage}
                    defaultValue={porterDetail?.lastName}
                    onChange={(e) => lastNameHandleChange(e)}
                    onBlur={lastNameHandleChange}
                    style={{ width: "240px" }}
                  />
                  {lastNameErrorMessage && (
                    <span style={{ fontSize: "12px", color: "red" }}>
                      {lastNameErrorMessage}
                    </span>
                  )}
                </div>
              </div>
              <div className="row-col-layout">
                <div>
                  <TextField
                    required
                    error={emailErrorMessage}
                    id="porterEmail"
                    label="Email"
                    defaultValue={porterDetail?.emailId}
                    onChange={(e) => emailIdHandleChange(e)}
                    onBlur={emailIdHandleChange}
                    style={{ width: "240px" }}
                    inputProps={{ readOnly: true }}
                  />
                  {emailErrorMessage && (
                    <span style={{ fontSize: "12px", color: "red" }}>
                      {emailErrorMessage}
                    </span>
                  )}
                </div>
                <div>
                  <TextField
                    required
                    id="porterPhone"
                    label="Phone"
                    error={phoneErrorMessage}
                    defaultValue={porterDetail?.phone}
                    onChange={(e) => phoneHandleChange(e)}
                    onBlur={phoneHandleChange}
                    style={{ width: "240px" }}
                  />
                  {phoneErrorMessage && (
                    <span style={{ fontSize: "12px", color: "red" }}>
                      {phoneErrorMessage}
                    </span>
                  )}
                </div>
              </div>
              <div className="row-col-layout">
                <div>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                      style={{ width: "240px" }}
                      label="Date of Birth"
                      value={dateOfBirth}
                      defaultValue={porterDetail?.dob}
                      onChange={(newDateOfBirth) => {
                        setDateOfBirth(newDateOfBirth);
                      }}
                      sx={{ width: "100%" }}
                      renderInput={(params) => (
                        <TextField {...params} error={false} />
                      )}
                    />
                  </LocalizationProvider>
                  {dobErrorMessage && (
                      <span style={{ fontSize: "12px", color: "red" }}>
                        {dobErrorMessage}
                      </span>
                    )}
                </div>
                <div>
                  <FormControl>
                    <InputLabel id="porterGenderLabel">Gender</InputLabel>
                    <Select
                      style={{ width: "240px" }}
                      labelId="porterGenderLabel"
                      id="porterGender"
                      error={phoneErrorMessage}
                      defaultValue={porterDetail?.gender}
                      label="Gender"
                      onChange={(e) => handlePorterGenderChange(e)}
                      onBlur={handlePorterGenderChange}
                    >
                      <MenuItem value={"Male"}>Male</MenuItem>
                      <MenuItem value={"Female"}>Female</MenuItem>
                    </Select>
                    {genderErrorMessage && (
                      <span style={{ fontSize: "12px", color: "red" }}>
                        {genderErrorMessage}
                      </span>
                    )}
                  </FormControl>
                </div>
              </div>
            </FormControl>

            {/* <div className="single-col-layout">
              <div>
                <TextField
                  style={{ width: "100%", backgroundColor: "#fff" }}
                  required
                  id="porterAddress"
                  label="Address"
                  error={addressErrorMessage}
                  defaultValue={porterDetail?.address}
                  multiline
                  rows={3}
                  onChange={(e) => handleSetPorterAddressChange(e)}
                  onBlur={handleSetPorterAddressChange}
                />
                {addressErrorMessage && (
                  <span style={{ fontSize: "12px", color: "red" }}>
                    {addressErrorMessage}
                  </span>
                )}
              </div>
            </div> */}
            <div className="single-col-layout">
              <div>
                <section className="">
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
                    <p style={{ textAlign: "center" }}>
                      <label>
                        <img
                          src={FileUploadIcon}
                          alt="File Upload Icon"
                          style={{ width: "10%" }}
                        />{" "}
                        <br />
                        Drag and drop profile image here, or{" "}
                        <Link href="#" underline="none">
                          Browse
                        </Link>
                      </label>
                    </p>
                    <aside>
                      {files}
                      {profileImageName}
                    </aside>
                  </div>
                </section>
              </div>
            </div>
          </DialogContent>
          <DialogActions>
            <Button variant="contained" onClick={addPorterDetail}>
              {props.modeOfOperation}
            </Button>
            <Button variant="outlined" onClick={handleClose}>
              Cancel
            </Button>
          </DialogActions>
        </Dialog>
      </React.Fragment>
    </div>
  );
};

AddPortersPopup.propTypes = {};

AddPortersPopup.defaultProps = {};

export default AddPortersPopup;
