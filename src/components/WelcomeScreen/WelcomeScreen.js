/* eslint-disable react-hooks/rules-of-hooks */

import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import './WelcomeScreen.css';
import {setAccessToken, saveUserLocal, setRestaurantId, setRestaurantLogoUrl } from '../../services/authService'
import { AuthContext } from '../../context/AuthContextProvider'
import * as restaurantService from "../../services/restaurantService";
import {
  Button, 
  Link
} from "@mui/material";
import EmailLogin from "../Auth/EmailLogin";
import {signIn} from '../../services/authService';
import {getRestaurantIdByUserId,getRestaurantIdByPorterUserId} from '../../services/restaurantService';
import { useParams } from 'react-router';
const WelcomeScreen = () => { 
  const params = useParams();  
  const navigate = useNavigate();  
  const gotoRestaurantRegistration = () => {
    navigate('/register');
  }

  const [emailLoginPopup, setEmailLoginPopup] = useState(false);  
  const { isLoggedIn, loginUser, AssignEmailVerified} = useContext(AuthContext);
  
  const loginHandlerEmail = async (res) => {          
    var promise = signIn(res); //from authentication
   
    return promise.then((loggedInUser) => {
            loginUser(loggedInUser.user);
            isLoggedIn(loggedInUser.user.accessToken);
            if (loggedInUser.user.emailVerified) {
              setAccessToken(loggedInUser.user.accessToken);
              saveUserLocal(loggedInUser.user);            
              var restaurantData = getRestaurantIdByUserId(loggedInUser.user.uid);          
              restaurantData.then((data) => {
                if (data == null || data == undefined || data.length == 0) {
                  restaurantData = getRestaurantIdByPorterUserId(loggedInUser.user.uid)
                                 
                  restaurantData.then((data) => {                    
                    setRestaurantId(data[0].restaurantId);
                    localStorage.setItem("porter-id", data[0].id);   
                    var promise = restaurantService.getRestaurantInfo();
                    promise.then((docs) => {                                            
                      localStorage.setItem("restaurant-name", docs.restaurantName);                      
                      setRestaurantLogoUrl((docs.restaurantLogoUrl.trim() === "")? undefined: docs.restaurantLogoUrl);
                      navigate("/configure");
                    });
                  });
                }
                else {
                  setRestaurantId(data[0].id)
                  localStorage.setItem("restaurant-name", data[0].restaurantName);
                  setRestaurantLogoUrl((data[0].restaurantLogoUrl.trim() === "")? undefined: data[0].restaurantLogoUrl);
                  navigate("/configure");
                }
              });
            }
          }).catch((error) => {
            console.error(error.code);                 
            return error.code;
          }).finally(() => {
            
          });   
  };
  
  const handleLoginEmail = () => {
    setEmailLoginPopup(true)
  }
  useEffect(() => {
    if(params.login === 'login')
    {
      setEmailLoginPopup(true)
    }
  }, [])
  
  return (
  <div style={{margin:'0px'}}>
  <div className="welcome-screen-bg" style={{backgroundSize: 'cover', backgroundRepeat: 'no-repeat', height:'100%', width: '100vw', textAlign:'center',}}>
      <div className="welcome-msg">
      <div style={{          
          alignItems: 'center',
          justifyContent: 'center',  
          fontSize:'1.5rem'
        }}>Welcome to</div>
        <div style={{
          color: '#FC8019',
          alignItems: 'center',
          justifyContent: 'center',  
          fontSize:'2.5rem'
        }}>OrderSelf</div>
        <div style={{fontSize:'0.8em'}}>
          <br/>
          We help guests place contactless food orders!          
      </div>
      <br />
      <div>
        <Button variant="contained" className="welcome-screen-btns" onClick={gotoRestaurantRegistration}>Register Your Restaurant</Button>
      </div>
      <div>
      </div>
      <div style={{fontSize:'0.8em'}}>          
          <label>Already have an account?</label> <Link href="#" style={{ textDecoration: 'none'}} onClick={handleLoginEmail}>Login</Link>
      </div>
      </div>
      { emailLoginPopup &&
        <EmailLogin 
          open={emailLoginPopup}
          close={setEmailLoginPopup}
          loginHandlerEmail={loginHandlerEmail}
        />
      }      
  </div>
  </div>
)};
  

WelcomeScreen.propTypes = {};

WelcomeScreen.defaultProps = {};

export default WelcomeScreen;
