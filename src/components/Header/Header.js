import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import './Header.css';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import AdbIcon from '@mui/icons-material/Adb';
import Person2Icon from '@mui/icons-material/Person2';
import Divider from '@mui/material/Divider';
// import {profileImage as component} from "../../assets/icons"
import { logOut, clearLocalStorage, getUserLocal } from '../../services/authService';
import * as restaurantService from "../../services/restaurantService";
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import Stack from '@mui/material/Stack';
import Paper from '@mui/material/Paper';
import UpdatePassword from '../Auth/UpdatePassword';
import UpdateIcon from '@mui/icons-material/Update';
import {
  Link, Grid
} from "@mui/material";
import { useNavigate } from "react-router-dom";

const Header = () => {
  const navigate = useNavigate();
  const goToHome =() => {
    navigate('/');
  }

  const goLogout  =() => {
   
    var status = logOut();
    if(status)
    navigate('/');
    else{
      console.error("error occurred while logout")
    }
  }
  const [updatePasswordPopup, setUpdatePasswordPopup] = React.useState(false);
  // const UpdatePassword= () =>{
  //   console.log("hi i am in update password")
  // //  setUpdatePasswordPopup(!UpdatePasswordPopup)
  // }
  const settings = ['Profile', 'Account', 'Dashboard', 'Logout'];
  const [anchorElUser, setAnchorElUser] = React.useState(null);

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  // const [restaurantInfo, setRestaurantInfo] = React.useState([]);
  // useEffect(() => {
  //   console.log("I am here")
  //   var promise = restaurantService.getRestaurantInfo();
  //   promise.then((docs) => {
  //     setRestaurantInfo(docs);
    
  //     localStorage.setItem("restaurant-name", docs.restaurantName);
  //   });    
  // },[]);
  
  const profileUrl = getUserLocal().photoURL;
  // console.log(localStorage.getItem("restaurant-logo-url"))
  return (
    <div className="Header" style={{ width: "100%" }}>
      <UpdatePassword
            isDialogOpened={updatePasswordPopup}
            handleCloseDialog={() => setUpdatePasswordPopup(false)}
      />
      <Grid container>
      {
        localStorage.getItem("restaurant-logo-url") != "undefined" &&
        <Grid item xs={1} md={1} style={{width:"90px" ,height:"50px"}}>        
         <Link  title='OrderSelf'> 
          <img alt="OrderSelf" href="#" src={
            localStorage.getItem("restaurant-logo-url")} style={{width:"100%", height: "100%"}}/>
         </Link>        
        </Grid>
      } 
        <Grid item xs={10} md={10} style={{margin:"auto"}}>
        <Link  title='OrderSelf'> 
        <div>&nbsp;<strong style={{margin:"auto"}}>{localStorage.getItem("restaurant-name")}</strong></div> 
        </Link>
        </Grid>
        
        <Grid item xs={1} md={1} style={{margin:"auto", textAlign:"center"}}>
          <Tooltip title="Profile">
            <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
             {profileUrl == undefined && (
              <Avatar alt="Remy Sharp"><Person2Icon fontSize='large'/></Avatar> 
             )}
             {
             profileUrl != undefined && ( 
              <Avatar alt="Remy Sharp" src={getUserLocal().photoURL} />
             )
             } 
            </IconButton>
          </Tooltip>
          <Menu
            sx={{ mt: '45px' }}
            id="menu-appbar"
            anchorEl={anchorElUser}
            anchorOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            keepMounted
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            open={Boolean(anchorElUser)}
            onClose={handleCloseUserMenu}
          >
            <MenuItem onClick={handleCloseUserMenu} style={{color:"#767C87"}}> 
            <Stack
                direction="column"
                divider={<Divider orientation="vertical" flexItem />}
                spacing={0}
            >
              <div className='small-font'>Signed in as</div>
              <div> <strong>{getUserLocal().displayName}</strong></div>
              <div className='small-font'>{getUserLocal().email}</div>      
            </Stack>
                     
            </MenuItem>
            <Divider />
            <Link  title='Update password' onClick={() =>  setUpdatePasswordPopup(!updatePasswordPopup)}>
              <MenuItem onClick={handleCloseUserMenu}> <UpdateIcon></UpdateIcon>&nbsp;&nbsp;Update Password</MenuItem>
            </Link>
            <Link href='/' title='Logout' onClick={() => { goLogout() }}>
              <MenuItem onClick={handleCloseUserMenu}> <ExitToAppIcon></ExitToAppIcon>&nbsp;&nbsp;Logout</MenuItem>
            </Link>           
          </Menu>
        </Grid>
      </Grid>
      
    </div>
  );

}


Header.propTypes = {};

Header.defaultProps = {};

export default Header;
