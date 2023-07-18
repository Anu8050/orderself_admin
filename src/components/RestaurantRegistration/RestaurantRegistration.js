import React, { useState,useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./RestaurantRegistration.css";
import "../../../src/common.scss";
import { TextField, Grid, Link } from "@mui/material";
import * as authService from "../../services/authService";
import { Stack } from "@mui/system";
import LoadingButton from '@mui/lab/LoadingButton';
import ShowSnackbar from "../../utils/ShowSnackbar"
import { Visibility, VisibilityOff } from '@mui/icons-material';
import {IconButton, InputAdornment} from '@mui/material'

const RestaurantRegistration = () => {
  const [showPassword, setShowPassword] = useState(false);  
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);
  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  }
  const handleMouseDownPassword = () => {
    setShowPassword(!showPassword);
  }
  const handleClickShowConfirmPassword = () => {
    setShowPasswordConfirm(!showPasswordConfirm);
  }
  const handleMouseDownConfirmPassword = () => {
    setShowPasswordConfirm(!showPasswordConfirm);
  }

  const [open, setOpen] = React.useState(false);
  const [propsMessage, setPropsMessage]= React.useState("");
  const [propsSeverityType, setPropsSeverityType] = React.useState(""); 

  const navigate = useNavigate();

  useEffect(() => {

  },[open] )

  const [emailId, setEmail] = useState("");
  const [emailErrorMessage, setEmailErrorMessage] = useState("");

  const handleEmail = (e) => {
    const emailId = e.target.value;
    if (!emailId) {
      setEmailErrorMessage("Required");
    } else {
      if (/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(emailId)) {
        setEmail(emailId);
        setEmailErrorMessage("");
      } else {
        setEmailErrorMessage("Invalid Email");
      }
    }
  };

  const [phone, setPhone] = useState("");
  const [phoneErrorMessage, setPhoneErrorMessage] = useState("");
  const phoneHandleChange = (event) => {
    const phoneData = event.target.value;
    if (!phoneData) {
      setPhoneErrorMessage("Required");
    } else {
      let regex = new RegExp(/^\+?\d{1,4}?[-.\s]?\(?\d{1,3}?\)?[-.\s]?\d{1,4}[-.\s]?\d{1,4}[-.\s]?\d{1,9}$/);
      if (regex.test(phoneData)) {
        setPhone(phoneData);
        setPhoneErrorMessage("");
      } else {
        setPhoneErrorMessage("Invalid Phone Number");
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
    } else {
      if (passwordData.length < 8) {
        setConfirmPasswordErrorMessage("Minimum password length is 8 characters");
      } else if (passwordData.length > 20) {
        setConfirmPasswordErrorMessage("Password is very Large");
      } else if (passwordData != testpassword) {
        setConfirmPasswordErrorMessage("Password & Confirm password did not match");
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
    } else {
      if (passwordData.length < 8) {
        setPasswordErrorMessage("Minimum password length is 8 characters");
      } else if (passwordData.length > 20) {
        setPasswordErrorMessage("Password is very Large");
      } else {
        setTestPassword(passwordData);
        setPasswordErrorMessage("");
      }
    }
  };

  const [restaurantName, setRestaurantName] = useState("");
  const [restaurantNameErrorMessage, setrestaurantNameErrorMessage] =
    useState("");
  const handlerRestaurantNameChange = (e) => {
    const restaurantNameData = e.target.value;
    if (!restaurantNameData) {
      setrestaurantNameErrorMessage("Required");
    } else {
      if (/^[a-zA-Z0-9äöüÄÖÜßáàâéèêíìîóòôúùûÁÀÂÉÈÊÍÌÎÓÒÔÚÙÛ.&$@(),!?/\\'":;<>#%^*+=_`|~ ]+$/.test(restaurantNameData)) {
        setRestaurantName(restaurantNameData);
        setrestaurantNameErrorMessage("");
      } else {}
    }
  };

  const [firstName, setFirstName] = useState("");
  const [firstNameErrorMessage, setfirstNameErrorMessage] = React.useState("");
  const handleFirstNameChange = (e) => {
    const firstNameData = e.target.value;
    if (!firstNameData) {
      setfirstNameErrorMessage("Required");
    } else {
      if (/^[a-zA-Z0-9äöüÄÖÜß._ ]+$/.test(firstNameData)) {
        setFirstName(firstNameData);
        setfirstNameErrorMessage("");
      } else {
        setfirstNameErrorMessage("Invalid Name");
      }
    }
  };

  const [lastName, setLastName] = useState("");
  const [lastNameErrorMessage, setLastNameErrorMessage] = React.useState("");
  const handleLastNameChange = (e) => {
    const lastNameData = e.target.value;
    if (!lastNameData) {
      setLastNameErrorMessage("Required");
    } else {
      if (/^[a-zA-Z0-9äöüÄÖÜß._ ]+$/.test(lastNameData)) {
        setLastName(lastNameData);
        setLastNameErrorMessage("");
      } else {
      }
    }
  };

  //calls the method to add the restaurant in firebase db
  const [loading, setLoading] = React.useState(false);
  const handleSubmit = async (e) => {
    setOpen(false)
    e.preventDefault();    
    
    if (
      !firstName.length ||
      !lastName.length ||
      !restaurantName.length ||
      !testpassword.length ||
      !password.length ||
      !phone.length ||
      !emailId.length
    ) {
      if (!firstName.length) {
        setfirstNameErrorMessage("Required");
      }
      if (!lastName.length) {
        setLastNameErrorMessage("Required");
      }
      if (!restaurantName.length) {
        setrestaurantNameErrorMessage("Required");
      }
      if (!testpassword.length) {
        setPasswordErrorMessage("Required");
      }
      if (!password.length) {
        setConfirmPasswordErrorMessage("Required");
      }
      if (!phone.length) {
        setPhoneErrorMessage("Required");
      }

      if(!emailId.length)
      {
        if(!emailId.length)
        {
          setEmailErrorMessage("Required")
        }
      }
      return;
    } else {
      setLoading(true);
      var userStatus =  authService.addNewUser(emailId, password, phone, restaurantName, firstName, lastName);
      
      userStatus.then((result) => {
        if(result === "auth/email-already-in-use"){
          setLoading(false);
          setOpen(true);
          setPropsMessage("A Restaurant with this email has already been registered. Please use a different email to register your restaurant");
          setPropsSeverityType("error");
         }
        else if(result.user.email === emailId){
          setLoading(true);
          setOpen(true);
          setPropsMessage("Registration registration is successful. Please check your email to activate the account");
          setPropsSeverityType("success");
          setTimeout(() => {
            setLoading(false);
            navigate("/registration-success");              
          }, 3000);          
        }
      });
    }       
  };

  return (
    <div style={{ margin: "0px" }}>
      <div>
        {open &&
          <ShowSnackbar message={propsMessage} severityType={propsSeverityType}/>
         }
       
        <div
          className="welcome-screen-bg"
          style={{
            paddingTop: "8vh",
            backgroundSize: "cover",
            backgroundRepeat: "no-repeat",
            height: "100%",
            width: "100vw",
            textAlign: "center",
          }}
        >
          <div className="welcome-screen-box">
            <div>OrderSelf Restaurant Registration</div>
            <hr />
            <Grid>
            <Stack className="form-txtbx-container">
              <TextField
                required
                id="restaurantName"
                placeholder="Restaurant Name"
                className="input registration-screen-txtbx"
                name="restaurantName"
                error={restaurantNameErrorMessage}
                onChange={(e) => handlerRestaurantNameChange(e)}
                onBlur={handlerRestaurantNameChange}
              />
              {restaurantNameErrorMessage && (
                <span className = "field-validation-text">
                  {restaurantNameErrorMessage}
                </span>
              )}
            </Stack>
            <Stack className="form-txtbx-container">
              <TextField
                type="email"
                required
                id="emailId"
                placeholder="Email Id"
                error={emailErrorMessage}
                className="input registration-screen-txtbx"
                name="emailId"
                onChange={(e) => handleEmail(e)}
                onBlur={handleEmail}
              />
              {emailErrorMessage && (
                <span className = "field-validation-text">
                  {emailErrorMessage}
                </span>
              )}
            </Stack>
            <Stack className="form-txtbx-container">
              <TextField
                id="phone"
                type="tel"
                required
                placeholder="Phone"
                error={phoneErrorMessage}
                onChange={(e) => phoneHandleChange(e)}
                onBlur={phoneHandleChange}
                className="input registration-screen-txtbx"
                name="phone"
              />             
              {phoneErrorMessage && (
                <span className = "field-validation-text">
                  {phoneErrorMessage}
                </span>
              )}
            </Stack>
            <Stack className="form-txtbx-container">
              <TextField
                required
                id="firstName"
                placeholder="First Name"
                error={firstNameErrorMessage}
                className="input registration-screen-txtbx"
                name="firstName"
                inputProps={{ maxLength: 50 }}
                onChange={(e) => handleFirstNameChange(e)}
                onBlur={handleFirstNameChange}
              />
              
              {firstNameErrorMessage && (
                <span className = "field-validation-text">
                  {firstNameErrorMessage}
                </span>
              )}
            </Stack>
            <Stack className="form-txtbx-container">
              <TextField
                required
                id="lastName"
                error={lastNameErrorMessage}
                placeholder="Last Name"
                className="input registration-screen-txtbx"
                name="lastName"
                inputProps={{ maxLength: 50 }}
                onChange={(e) => handleLastNameChange(e)}
                onBlur={handleLastNameChange}
              />
              {lastNameErrorMessage && (
                <span className = "field-validation-text">
                  {lastNameErrorMessage}
                </span>
              )}
            </Stack>
            <Stack className="form-txtbx-container">
              <TextField
                required
                id="passwordField"
                placeholder="Password"
                type={showPassword ? "text" : "password"}
                className="input registration-screen-txtbx"
                name="passwordField"
                onChange={(e) => handlePassword(e)}
                onBlur={handlePassword}
                InputProps={{
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
                  )
                }}
              />
              {passwordErrorMessage && (
                <span className = "field-validation-text">
                  {passwordErrorMessage}
                </span>
              )}
            </Stack>
            <Stack className="form-txtbx-container">
              <TextField
                required
                id="confirmPasswordField"
                placeholder="Confirm Password"
                className="input registration-screen-txtbx"
                name="confirmPasswordField"
                type={showPasswordConfirm ? "text" : "password"}
                onChange={(e) => handleConfirmPassword(e)}
                onBlur={handleConfirmPassword}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleClickShowConfirmPassword}
                        onMouseDown={handleMouseDownConfirmPassword}
                      >
                        {showPasswordConfirm ? <Visibility /> : <VisibilityOff />}
                      </IconButton>
                    </InputAdornment>
                  )
                }}
              />
              {confirmPasswordErrorMessage && (
                <span className = "field-validation-text">
                  {confirmPasswordErrorMessage}
                </span>
              )}
            </Stack>
            </Grid>          

            <div>
              <LoadingButton
                variant="contained"
                className="welcome-screen-btns"
                loading={loading}
                loadingPosition="start"
                onClick={handleSubmit}
                >
                Register your Restaurant
              </LoadingButton>
            </div>
            <div style={{fontSize:'0.8em'}}>          
                <label>Already registered?</label> <Link href="/login" style={{ textDecoration: 'none'}}>Login</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );  
};

RestaurantRegistration.propTypes = {};

RestaurantRegistration.defaultProps = {};

export default RestaurantRegistration;
