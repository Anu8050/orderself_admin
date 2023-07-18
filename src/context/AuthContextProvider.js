import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAccessToken, getUserLocal } from "../services/authService";

const AuthContext = React.createContext({});

export const AuthContextProvider = ({ children }) => {

  const [currentUser, setCurrentUser] = useState(null);
  const [token, setToken] = useState(getAccessToken());
  const navigate = useNavigate()
  const isLogIn = !!token;
  const [emailVerified, setEmailVerified] = useState();
  const isEmailVerified = emailVerified;
  const [restaurantName, setRestaurantName] = useState();

  const loginUser = (user) => {
    setEmailVerified(user.emailVerified);

    if(user.emailVerified){
      setCurrentUser(user);
    }    
    
  };

  const isLoggedIn = (token) => {
    setToken(token);
    
  };
  
  const logoutUser = () => {
    setCurrentUser(null);
    localStorage.clear();
    setToken(null);
    navigate('/login')
  };

  useEffect(() => {
    console.log("I am in authcontextprovider")
    const user = getUserLocal();
    if (user) {
      loginUser(user);
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{ loginUser, logoutUser, currentUser, isLogIn, isLoggedIn, isEmailVerified }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext };

export default AuthContextProvider;
