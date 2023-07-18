import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, IconButton, InputAdornment, InputLabel, OutlinedInput, TextField } from '@mui/material'
import React, { useState,useEffect, useRef,Component  } from 'react'
import { Visibility, VisibilityOff } from '@mui/icons-material';
import ForgotPassword from './ForgotPassword';
import { 
    Link
  } from "@mui/material";
import CancelRoundedIcon from "@mui/icons-material/CancelRounded";
const EmailLogin = ({ open, close, loginHandlerEmail }) => {
    const [email, setEmail] = useState("")
    const [emailErrorMessage, setEmailErrorMessage] = useState("")
    const [password, setPassword] = useState("")
    const [passwordErrorMessage, setPasswordErrorMessage] = useState("")

    const [forgotPasswordPopup, setForgotPasswordPopup] = useState(false); 

    const [showPassword, setShowPassword] = React.useState(false);
    
    const handleClickShowPassword = () => setShowPassword((show) => !show);
    
    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };

    const handleEmail = (e) => {        
        const emailData = e.target.value.trim();
        setEmail(emailData)
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
    const handlePassword = (e) => {
        const passwordData = e.target.value.trim();
        setPassword(passwordData);
        if (!passwordData) {
            setPasswordErrorMessage("Required");
        }else{
            if (passwordData.length < 8) {
                setPasswordErrorMessage("Required 8 Character");
            }else if(passwordData.length > 20){
                setPasswordErrorMessage("Password Is very Large");
            }else{
                setPassword(passwordData);
                setPasswordErrorMessage("");
            }
        }
    }
    
    const handleLogin = () => {
        
        if (!email.length || !password.length) {
            if (!email.length) {
                setEmailErrorMessage("Required");
            }
            if (!password.length) {
                setPasswordErrorMessage("Required");
            }
            return false;
        } else {
            var result = loginHandlerEmail({ email, password })            
            result.then((status) => {
                if (status === "auth/invalid-email") {
                    alert("Invalid email or password. Please enter valid credentials to login");
                    
                }
                else if (status === "auth/wrong-password"){
                    setPasswordErrorMessage("Password is incorrect. Please enter a correct password");
                    setTimeout(() => {
                        setPasswordErrorMessage("");
                    }, 3000);
                }
                else if (status === "auth/user-not-found"){
                    setEmailErrorMessage("User details not found. Please enter a valid email");
                    setTimeout(() => {
                        setEmailErrorMessage("");
                    }, 3000);
                }
                else if (status === "auth/user-disabled"){
                    setEmailErrorMessage("This user has been disabled. Please contact administrator.");
                    setTimeout(() => {
                        setEmailErrorMessage("");
                    }, 3000);
                }
            });            
        }
    }
    const handleLoginPress = (event) => {
        if (event.key === 'Enter') {
          event.preventDefault(); 
          handleLogin()
        }
      };
    
    const inputRef = useRef(null);


  

    // const inputRef = useRef(null);
    // React.useEffect(() => {
    //     if (setEmail) {
    //       setTimeout(() => {
    //         inputRef.current?.focus();
    //         console.log("focused");
    //       }, 300);
    //     }
    //   }, [setEmail]);

    return (
        <div>
        
            <ForgotPassword
            isDialogOpened={forgotPasswordPopup}
            handleCloseDialog={() => setForgotPasswordPopup(false)}
            />

            <Dialog
                open={open}
                onClose={() => close(false)}
            >
                <div className="" style={{  }}>
                    <DialogTitle
                        id="scroll-dialog-title"
                        sx={{ padding: "0px 24px 18px" }}
                    >
                        <Box
                            className="dialogue-header"
                            sx={{
                                display: "flex",
                                alignItems: "center",
                                flexDirection: "row",
                            }}
                        >
                            <h4 className="dialogue-heading">Login With Email</h4>


                            <Box sx={{ flex: "1 1 auto" }} />
                            <div className="dialogue-close">
                                <IconButton sx={{ padding: "0px" }} onClick={() => close(false)}>
                                    <CancelRoundedIcon sx={{ color:"black"}} className="closeIcon" />
                                </IconButton>
                            </div>
                        </Box>
                    </DialogTitle>
                    <DialogContent sx={{ padding: "0px" ,height: "290px"}}>
                        <div className="dialogue-content">
                            <div className="search-action-conatiner">
                                <Box
                                    sx={{
                                        width: 500,
                                        maxWidth: '100%',
                                    }}
                                >
                                    <Box fullWidth>
                                        <p>Email</p>   
                                        <FormControl sx={{ width: '100%' }} variant="outlined">
                                            <InputLabel htmlFor="outlined-adornment-email">Email</InputLabel>
                                            
                                            <OutlinedInput
                                                sx={{ cursor: 'pointer' }}
                                                error={emailErrorMessage}
                                                id="outlined-adornment-email"
                                                type={"email"}
                                                label="Email"
                                                onChange={(e) => handleEmail(e)}
                                                helperText="Incorrect Email"
                                                autoFocus="on"
                                               
                                            />
                                            
                                        </FormControl>
                                        {emailErrorMessage && <span style={{fontSize: "12px", color: "red"}}>{emailErrorMessage}</span>}
                                    </Box>
                                    <Box>
                                        <p>Password</p>
                                        <FormControl sx={{ width: '100%' }} variant="outlined">
                                            <InputLabel htmlFor="outlined-adornment-password">Password</InputLabel>
                                            <OutlinedInput
                                                id="outlined-adornment-password"
                                                type={showPassword ? 'text' : 'password'}
                                                endAdornment={
                                                    <InputAdornment position="end">
                                                        <IconButton
                                                            aria-label="toggle password visibility"
                                                            onClick={handleClickShowPassword}
                                                            onMouseDown={handleMouseDownPassword}
                                                            edge="end"
                                                        >
                                                            {showPassword ? <VisibilityOff /> : <Visibility />}
                                                        </IconButton>
                                                    </InputAdornment>
                                                }
                                                onChange={(e) => handlePassword(e)}
                                                label="Password"
                                                error={passwordErrorMessage}
                                                helperText="Incorrect Email"
                                                onKeyDown={handleLoginPress}
                                            />
                                        </FormControl>
                                        {passwordErrorMessage && <span style={{fontSize: "12px", color: "red"}}>{passwordErrorMessage}</span>}
                                    </Box>
                                </Box>
                           <Link href="#" style={{ display:"grid", textAlign:"right", textDecoration: 'none'}} onClick={()=>{setForgotPasswordPopup(!forgotPasswordPopup)}}>Forgot password</Link>
                            </div>
                        </div>
                    </DialogContent>
                    <DialogActions>                        
                            <div className="action-btns">
                            <Button className="delete-btn" variant="outlined" onClick={() => close(false)} fullWidth >
                                Cancel
                            </Button>
                            <Button className="delete-btn" variant="contained" onClick={() => handleLogin()} fullWidth style={{marginLeft:'10px'}}>
                                Login
                            </Button>                        
                            </div>                            
                    </DialogActions>
                </div>
            </Dialog>
        </div >
    )
}

export default EmailLogin