import "./PorterRegistration.css";
import React, { useState, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import FileUploadIcon from "../../assets/images/fileuploadicon.png";
import {
  Button,
  TextField,
  FormControl,
  InputLabel,
  DialogTitle,
  DialogContent,
  DialogActions,
  MenuItem,
  Link,
  Grid,
  Select,
} from "@mui/material";
import CancelRounded from "@mui/icons-material/CancelRounded";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import { porterInfo } from "../../models";
import * as porterService from "../../services/porterService";
import { showToast } from "../../utils/common";
import * as authService from "../../services/authService";
import ErrorIcon from "@mui/icons-material/Error";

import LinearProgress from "@mui/material/LinearProgress";
import ShowSnackbar from "../../utils/ShowSnackbar";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { IconButton, InputAdornment } from "@mui/material";

export default function PorterRegistration(props) {
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);
  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };
  const handleMouseDownPassword = () => {
    setShowPassword(!showPassword);
  };
  const handleClickShowConfirmPassword = () => {
    setShowPasswordConfirm(!showPasswordConfirm);
  };
  const handleMouseDownConfirmPassword = () => {
    setShowPasswordConfirm(!showPasswordConfirm);
  };

  const [openSnackBar, setOpenSnackBar] = React.useState(false);
  const [propsMessage, setPropsMessage] = React.useState("");
  const [propsSeverityType, setPropsSeverityType] = React.useState("");
  // useEffect(() => {}, [openSnackBar]);

  const navigate = useNavigate();
  const params = useParams();
  console.log(atob(params.rname));
  const [errors, setErrors] = React.useState("");
  const [loading, setLoadingIconState] = React.useState(false);

  const [firstName, setFirstName] = React.useState("");
  const [firstNameErrorMessage, setfirstNameErrorMessage] = React.useState("");
  const firstNameHandleChange = (event) => {
    const firstNameData = event.target.value;
    if (!firstNameData) {
      setfirstNameErrorMessage("Required");
      setFirstName(event.target.value);
    } else {
      if (/^[a-zA-Z0-9äöüÄÖÜß._]+$/.test(firstNameData)) {
        setFirstName(firstNameData);
        setfirstNameErrorMessage("");
      } else {
        // setfirstNameErrorMessage("Invalid Name")
      }
    }
  };
  const [lastName, setLastName] = React.useState("");
  const [lastNameErrorMessage, setLastNameErrorMessage] = React.useState("");
  const lastNameHandleChange = (event) => {
    const lastNameData = event.target.value;
    if (!lastNameData) {
      setLastNameErrorMessage("Required");
      setLastName("");
    } else {
      if (/^[a-zA-Z0-9äöüÄÖÜß._]+$/.test(lastNameData)) {
        setLastName(lastNameData);
        setLastNameErrorMessage("");
      } else {
        // setfirstNameErrorMessage("Invalid Name")
      }
    }
  };
  // const [emailId, setEmailId] = React.useState("");
  const [emailErrorMessage, setEmailErrorMessage] = useState("");
  const emailIdHandleChange = (event) => {
  };
  const [phone, setPhone] = React.useState("");
  const [phoneErrorMessage, setPhoneErrorMessage] = useState("");
  const phoneHandleChange = (event) => {
    const phoneData = event.target.value;
    if (!phoneData) {
      setPhoneErrorMessage("Required");
      setPhone(event.target.value);
    } else {
      let regex = new RegExp(
        /^\+?\d{1,4}?[-.\s]?\(?\d{1,3}?\)?[-.\s]?\d{1,4}[-.\s]?\d{1,4}[-.\s]?\d{1,9}$/
      );
      if (regex.test(phoneData)) {
        setPhone(phoneData);
        setPhoneErrorMessage("");
      } else {
        setPhoneErrorMessage("Invalid PhoneNumber");
      }
    }
  };

  const [testpassword, setTestPassword] = useState("");
  const [password, setPassword] = useState("");
  const [passwordErrorMessage, setPasswordErrorMessage] = useState("");
  const [confirmPasswordErrorMessage, setConfirmPasswordErrorMessage] =
    useState("");
  const handleConfirmPassword = (e) => {
    const passwordData = e.target.value;
    if (!passwordData) {
      setConfirmPasswordErrorMessage("Required");
      setPassword(e.target.value);
    } else {
      if (passwordData.length < 8) {
        setConfirmPasswordErrorMessage("Required 8 Character");
      } else if (passwordData.length > 20) {
        setConfirmPasswordErrorMessage("Password is very Large");
      } else if (passwordData != testpassword) {
        setConfirmPasswordErrorMessage("Passwords not match");
      } else if (passwordData == testpassword) {
        setPassword(passwordData);
        setConfirmPasswordErrorMessage("");
      }
    }
  };
  const handlePassword = (e) => {
    const passwordData = e.target.value;
    if (!passwordData) {
      setPasswordErrorMessage("Required");
      setTestPassword(e.target.value);
    } else {
      if (passwordData.length < 8) {
        setPasswordErrorMessage("Required 8 Character");
      } else if (passwordData.length > 20) {
        setPasswordErrorMessage("Password is very Large");
      } else {
        setTestPassword(passwordData);
        setPasswordErrorMessage("");
      }
    }
  };
  const [dateOfBirth, setDateOfBirth] = React.useState(dayjs(null));
  const [dobErrorMessage, setDobErrorMessage] = React.useState("");

  const [porterGender, setPorterGender] = useState("");
  const [genderErrorMessage, setGenderErrorMessage] = useState("");
  const handlePorterGenderChange = (event) => {
    const genderData = event.target.value;
    if (!genderData) {
      setGenderErrorMessage("Required");
      setPorterGender(event.target.value);
    } else {
      setPorterGender(genderData);
      setGenderErrorMessage("");
    }
  };

  // const [porterAddress, setPorterAddress] = React.useState("");
  // const [addressErrorMessage, setAddressErrorMessage] = useState("");
  // const handleSetPorterAddressChange = (event) => {
  //   const addressData = event.target.value;
  //   if (!addressData) {
  //     setAddressErrorMessage("Required");
  //     setPorterAddress(event.target.value);
  //   } else {
  //     if (/^[a-zA-Z0-9äöüÄÖÜß._]+$/.test(addressData)) {
  //       setPorterAddress(addressData);
  //       setAddressErrorMessage("");
  //     } else {
  //       // setAddressErrorMessage("Invalid Address")
  //     }
  //   }
  // };
  const { acceptedFiles, getRootProps, getInputProps, open } = useDropzone({
    maxFiles: 1,
    multiple: false,
    maxSize: 102400, //for max size 100kb,
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
            }
            if (err.code === "file-invalid-type") {
              setErrors("Invalid file type");
            }
          });
        });
      } else if (acceptedFiles.length > 0) {
        setErrors("");
      }
    },
  });

  const files = acceptedFiles.map((file) => (
    <li key={file.path}>{file.path}</li>
  )); //- {file.size} bytes
  const empty =
    firstName.length &&
    lastName.length &&
    phone.length &&
    testpassword.length &&
    password.length &&
    porterGender.length &&
    dateOfBirth != null 
    // porterAddress.length 

  const registerPorter = () => {
    setOpenSnackBar(false);
    setLoadingIconState(true);
    var porter = new porterInfo();
    porter.firstName = firstName;
    porter.lastName = lastName;
    porter.emailId = atob(params.email);
    porter.phone = phone;
    porter.dob = dateOfBirth.$d.toLocaleDateString("en-US");
    porter.gender = porterGender;
    // porter.address = porterAddress;
    porter.restaurantId = atob(params.restaurantId);
    porter.password = password;

      let userStatus = authService.registerNewPorter(porter, acceptedFiles[0]);
      userStatus.then((result) => {
        console.log("result hello", result);
        if (result === "auth/email-already-in-use") {
          setLoadingIconState(false);
          // showToast("Please Contact the administrator. A porter with this email has already been registered. Please use a different email to register your restaurant. ", "error");
          setOpenSnackBar(true);
          setPropsMessage(
            "Please Contact the administrator. A porter with this email has already been registered. Please use a different email to register your restaurant. "
          );
          setPropsSeverityType("error");
        } else if (result.user.email === atob(params.email)) {
          setLoadingIconState(false);
          setOpenSnackBar(true);
          setPropsMessage(
            "Porter registration is successful. Please check your email to activate the account"
          );
          setPropsSeverityType("success");
          // showToast( "Porter registration is successful. Please check your email to activate the account","success");
          setTimeout(() => {
            navigate("/registration-success");
          }, 3000);
        }
        //auth/phone-number-already-exists
      });
  
  };
  return (
    <div style={{ margin: "0 auto" }}>
      {openSnackBar && (
        <ShowSnackbar message={propsMessage} severityType={propsSeverityType} />
      )}
      <React.Fragment>
        <div style={{ maxWidth: "655px", margin: "auto" }}>
          <DialogTitle id="max-width-dialog-title">
            <Grid
              container
              rowSpacing={1}
              columnSpacing={{ xs: 1, sm: 2, md: 3 }}
            >
              <Grid item xs={12} sx={{ textAlign: "center" }}>
                <h2>OrderSelf</h2>
              </Grid>
              <Grid item xs={12} sx={{ textAlign: "center" }}>
                Porter Registration for <strong>{atob(params.rname)}</strong>{" "}
                (enter below details)
              </Grid>
              {/* <Grid item xs={1} style={{ alignContent: "flex-start" }}>
                <CancelRounded onClick={handleClose} className="closeIcon" />
              </Grid> */}
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
                    onChange={(e) => firstNameHandleChange(e)}
                    onBlur={firstNameHandleChange}
                    className="input registration-screen-txtbx"
                  />
                  <br />
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
                    onChange={(e) => lastNameHandleChange(e)}
                    onBlur={lastNameHandleChange}
                    className="input registration-screen-txtbx"
                  />
                  <br />
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
                    editable="false"
                    error={emailErrorMessage}
                    id="porterEmail"
                    label="Email"
                    onChange={(e) => emailIdHandleChange(e)}
                    onBlur={emailIdHandleChange}
                    className="input registration-screen-txtbx"
                    inputProps={{ readOnly: true }}
                    value={atob(params.email)}
                  />
                  <br />
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
                    onChange={(e) => phoneHandleChange(e)}
                    onBlur={phoneHandleChange}
                    className="input registration-screen-txtbx"
                  />
                  <br />
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
                      label="Date of Birth"
                      value={dateOfBirth}
                      onChange={(newDateOfBirth) => {
                        setDateOfBirth(newDateOfBirth);
                      }}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          error={false}
                          className="input registration-screen-txtbx"
                        />
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
                      className="input registration-screen-txtbx"
                      labelId="porterGenderLabel"
                      id="porterGender"
                      error={phoneErrorMessage}
                      label="Gender"
                      onChange={(e) => handlePorterGenderChange(e)}
                      onBlur={handlePorterGenderChange}
                    >
                      <MenuItem value={"Male"}>Male</MenuItem>
                      <MenuItem value={"Female"}>Female</MenuItem>
                    </Select>
                    <br />
                    {genderErrorMessage && (
                      <span style={{ fontSize: "12px", color: "red" }}>
                        {genderErrorMessage}
                      </span>
                    )}
                  </FormControl>
                </div>
              </div>
              <div className="row-col-layout">
                <div>
                  <TextField
                    required
                    id="passwordField"
                    label="Password"
                    name="passwordField"
                    type={showPassword ? "text" : "password"}
                    onChange={(e) => handlePassword(e)}
                    onBlur={handlePassword}
                    className="input registration-screen-txtbx"
                    InputProps={{
                      // <-- This is where the toggle button is added.
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            aria-label="toggle password visibility"
                            onClick={handleClickShowPassword}
                            onMouseDown={handleMouseDownPassword}
                          >
                            {showPassword ? <Visibility /> : <VisibilityOff />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                  <br />
                  {passwordErrorMessage && (
                    <span style={{ fontSize: "12px", color: "red" }}>
                      {passwordErrorMessage}
                    </span>
                  )}
                </div>
                <div>
                  <TextField
                    required
                    id="confirmPasswordField"
                    label="Confirm Password"
                    name="confirmPasswordField"
                    type={showPasswordConfirm ? "text" : "password"}
                    onChange={(e) => handleConfirmPassword(e)}
                    onBlur={handleConfirmPassword}
                    className="input registration-screen-txtbx"
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            aria-label="toggle password visibility"
                            onClick={handleClickShowConfirmPassword}
                            onMouseDown={handleMouseDownConfirmPassword}
                          >
                            {showPasswordConfirm ? (
                              <Visibility />
                            ) : (
                              <VisibilityOff />
                            )}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                  <br />
                  {confirmPasswordErrorMessage && (
                    <span style={{ fontSize: "12px", color: "red" }}>
                      {confirmPasswordErrorMessage}
                    </span>
                  )}
                </div>
              </div>
            </FormControl>

            <div className="single-col-layout">
              {/* <div>
                <TextField
                  required
                  id="porterAddress"
                  label="Address"
                  error={addressErrorMessage}
                  multiline
                  rows={2}
                  onChange={(e) => handleSetPorterAddressChange(e)}
                  onBlur={handleSetPorterAddressChange}
                  className="input"
                  sx={{ width: "100%" }}
                />
                <br />
                {addressErrorMessage && (
                  <span style={{ fontSize: "12px", color: "red" }}>
                    <ErrorIcon className="app-error-icon" />
                    {addressErrorMessage}
                  </span>
                )}
              </div> */}
            </div>
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
                    <input {...getInputProps()} />
                    {loading && <LinearProgress />}
                    <p style={{ textAlign: "center" }}>
                      <label>
                        <img
                          src={FileUploadIcon}
                          alt="File Upload Icon"
                          style={{ width: "10%" }}
                        />
                        <br />
                        Drag and drop profile image here, or{" "}
                        <Link href="#" underline="none">
                          Browse
                        </Link>
                      </label>
                    </p>
                    <div style={{ color: "#FF0000" }}>{errors}</div>
                    <aside>{files}</aside>
                  </div>
                </section>
              </div>
            </div>
          </DialogContent>
          <DialogActions sx={{ paddingRight: "60px" }}>
            <Button
              variant="contained"
              onClick={registerPorter}
              disabled={!empty}
            >
              Register Porter
            </Button>
          </DialogActions>
        </div>
      </React.Fragment>
    </div>
  );
}
