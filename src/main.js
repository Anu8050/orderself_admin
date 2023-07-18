import React, { useContext, useState, useEffect } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import { ErrorBoundary } from "react-error-boundary";
import Box from "@mui/material/Box";
import ClickAwayListener from "@mui/base/ClickAwayListener";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import MenuIcon from "@mui/icons-material/Menu";
import { CircularProgress, Stack, Fade } from "@mui/material";
import MuiAppBar from "@mui/material/AppBar";
import MuiDrawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import { styled } from "@mui/material/styles";
import Toolbar from "@mui/material/Toolbar";
import { useNavigate  } from "react-router-dom";
import Header from "./components/Header/Header";
import RegistrationSuccess from "./components/RestaurantRegistration/RegistrationSuccess";
import RestaurantRegistration from "./components/RestaurantRegistration/RestaurantRegistration";
import DrawerSidebar from "./components/Sidenav/DrawerSidebar";
import WelcomeScreen from "./components/WelcomeScreen/WelcomeScreen";
import RestaurantConfiguration from "./components/RestaurantConfiguration/RestaurantConfiguration";
import "react-toastify/dist/ReactToastify.css";
import ManagePorters from "./components/ManagePorters/ManagePorters";
import AddTable from "./components/ManageTables/AddTable";
import ManageTables from "./components/ManageTables/ManageTables";
import ManageMenuItems from "./components/MenuItems/ManageMenuItems";
import PorterRegistration from "./components/PorterRegistration/PorterRegistration";
import RestaurantOrders from "./components/RestaurantOrders/RestaurantOrders";
import RestaurantUploadLogo from "./components/RestaurantUploadLogo/RestaurantUploadLogo";
import { AuthContext } from "./context/AuthContextProvider";
import FoodCategory from "./components/FoodCategory/FoodCategory";
import ConfigureThemes from "./components/ConfigureThemes/ConfigureThemes";

const drawerWidth = 180;

const openedMixin = (theme) => ({
  width: drawerWidth,
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: "hidden",
});

const closedMixin = (theme) => ({
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: "hidden",
  // width: `calc(${theme.spacing(7)} + 1px)`,
  width: `calc(${theme.spacing(7)} + 1px)`,
  
  [theme.breakpoints.up("sm")]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  padding: theme.spacing(0, 1),

  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}));

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(["width", "margin"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: "nowrap",
  boxSizing: "border-box",
  backgroundColor: "#FC8019",
  ...(open && {
    ...openedMixin(theme),
    "& .MuiDrawer-paper": openedMixin(theme),
  }),
  ...(!open && {
    ...closedMixin(theme),
    "& .MuiDrawer-paper": closedMixin(theme),
  }),
}));

const Dashboard = ({ history }) => {  
  const [loading, setLoading] = React.useState(true);
  const navigate = useNavigate();
  const { isLogIn, isEmailVerified } = useContext(AuthContext);
  const [isPorter, setIsPorter] = React.useState(false);

  // const { isLogIn } = useContext();
  const [open, setOpen] = useState(false);
  const location = useLocation();

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const handleDrawerToggle = () => {
    setOpen((prev) => !prev);
  };  

  useEffect(() => {  
    setIsPorter((localStorage.getItem("porter-id"))?true:false); 

    if(location.pathname !== "/"){
      console.log('route has been changed', location.pathname);  
      setLoading((prevLoading) => false);      
    }
},[location.pathname]);
  return (
    <div>
      {isEmailVerified && isLogIn && (
        <Box sx={{ display: "flex" }}>
          <AppBar
            position="fixed"
            open={open}
            sx={{
              zIndex: 1000,
              backgroundColor: "#fff",
              boxShadow: "none",
              borderBottom: "1px solid #e4e4e4",
            }}
          >
            <Toolbar style={{ padding: 0 }}>
              <Stack
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "flex-start",
                  width: "100%",
                }}
              >
                <IconButton
                  color="inherit"
                  aria-label="open drawer"
                  onClick={handleDrawerOpen}
                  edge="start"
                  sx={{
                    marginRight: 5,
                    ...(open && { display: "none" }),
                  }}
                >
                  <MenuIcon />
                </IconButton>
                <Header handleSideNavShow={handleDrawerOpen} />
              </Stack>
            </Toolbar>
          </AppBar>

          <ClickAwayListener onClickAway={handleDrawerClose}>
            <Drawer
              variant="permanent"
              open={open}
              sx={{ zIndex: 1001, backgroundColor: "#FC8019" }}
            >
              <DrawerHeader
                sx={{
                  zIndex: 1001,
                  backgroundColor: "#FC8019",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "flex-start",
                }}
              >
                <IconButton
                  aria-label="open drawer"
                  onClick={handleDrawerToggle}
                >
                  {open ? (
                    <ArrowBackIcon sx={{ color: "#fff", ml: 1 }} />
                  ) : (
                    <MenuIcon sx={{ color: "#fff", ml: 1 }} />
                  )}
                </IconButton>
              </DrawerHeader>
              <DrawerSidebar
                open={open}
                handleDrawerClose={handleDrawerClose}
              />
            </Drawer>
          </ClickAwayListener>
          <Box
            component="main"
            sx={{
              flexGrow: 1,
              // p: 3,
              mt: 8,
              // pl: 11,
              position: "fixed",
              width: "100%",
              //   height: "100vh",
              //   overflowY: "auto",
            }}            
          >   
          <Box
            sx={{ display: "flex", flexDirection: "column", alignItems: "center",}}
          >
            <Box>
              <Fade
                in={loading}
                style={{
                  transitionDelay: loading ? "0ms" : "1000ms",                  
                }}
                unmountOnExit
              >
                <CircularProgress />
              </Fade>
            </Box>
          </Box>    
          
            {/* Routes for logged in users */}
            <Routes>
              {!isPorter && (
              <Route
                path="/configure"
                element={
                  <ErrorBoundary
                    fallbackRender={() => <>Something went wrong</>}
                  >
                    <RestaurantConfiguration />
                  </ErrorBoundary>
                }
              /> )}
              <Route
                path="/uploadlogo"
                element={
                  <ErrorBoundary
                    fallbackRender={() => <>Something went wrong</>}
                  >
                    <RestaurantUploadLogo />
                  </ErrorBoundary>
                }
              />
              <Route
                path="/tables"
                element={
                  <ErrorBoundary
                    fallbackRender={() => <>Something went wrong</>}
                  >
                    <ManageTables />
                  </ErrorBoundary>
                }
              />
              <Route
                path="/menuitems"
                element={
                  <ErrorBoundary
                    fallbackRender={() => <>Something went wrong</>}
                  >
                    <ManageMenuItems />
                  </ErrorBoundary>
                }
              />
              {!isPorter && (
              <Route
                path="/porters"
                element={
                  <ErrorBoundary
                    fallbackRender={() => <>Something went wrong</>}
                  >
                    <ManagePorters />
                  </ErrorBoundary>
                }
              />
              )}
              <Route
                path="/orders"
                element={
                  <ErrorBoundary
                    fallbackRender={() => <>Something went wrong</>}
                  >
                    <RestaurantOrders />
                  </ErrorBoundary>
                }
              />
              <Route
                path="/addtable"
                element={
                  <ErrorBoundary
                    fallbackRender={() => <>Something went wrong</>}
                  >
                    <AddTable />
                  </ErrorBoundary>
                }
              />
              <Route
                path="/register"
                element={
                  <ErrorBoundary
                    fallbackRender={() => <>Something went wrong</>}
                  >
                    <RestaurantRegistration />
                  </ErrorBoundary>
                }
              />
              {/* <Route
                path="/RestaurantOrders1"
                element={
                  <ErrorBoundary
                    fallbackRender={() => <>Something went wrong</>}
                  >
                    <RestaurantOrders1 />
                  </ErrorBoundary>
                }
              /> */}
              <Route
                path="/foodCategory"
                element={
                  <ErrorBoundary
                    fallbackRender={() => <>Something went wrong</>}
                  >
                    <FoodCategory />
                  </ErrorBoundary>
                }
              />
                    {!isPorter && (
                      <Route
                      path="/configureThemes"
                      element={
                        <ErrorBoundary
                          fallbackRender={() => <>Something went wrong</>}
                        >
                          <ConfigureThemes />
                        </ErrorBoundary>
                      }
                    />
                    )}
              
            </Routes>
          </Box>
        </Box>
      )}

      {!isEmailVerified && isLogIn && (        
        <div>          
        <p>Email verification is incomplete. Please click on the link sent to your registered email.</p>          
        <h3><a href="/" alt="Login">Goto HomePage</a></h3>
        </div>
      )}

      {!isLogIn && (
        <Routes>
          <Route
            path="/"
            element={
              <ErrorBoundary fallbackRender={() => <>Something went wrong</>}>
                <WelcomeScreen />
              </ErrorBoundary>
            }
          />
          <Route
            path="/:login"
            element={
              <ErrorBoundary fallbackRender={() => <>Something went wrong</>}>
                <WelcomeScreen />
              </ErrorBoundary>
            }
          />
          <Route     
            path="/register"
            element={
              <ErrorBoundary fallbackRender={() => <>Something went wrong</>}>
                <RestaurantRegistration />
              </ErrorBoundary>
            }
          />
          <Route
            path="/registration-success"
            element={
              <ErrorBoundary fallbackRender={() => <>Something went wrong</>}>
                <RegistrationSuccess />
              </ErrorBoundary>
            }
          />
          <Route
            path="/porter-registration/:rname/:restaurantId/:email"
            element={
              <ErrorBoundary fallbackRender={() => <>Something went wrong</>}>
                <PorterRegistration />
              </ErrorBoundary>
            }
          />       
        </Routes>
      )}
      
    </div>
  );
};

export default Dashboard;
