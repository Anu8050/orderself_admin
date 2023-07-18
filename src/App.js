import './App.css';
import React from "react";
import { BrowserRouter} from "react-router-dom";
import { GlobalStyles, ThemeProvider } from "@mui/material";
import theme from "./theme";
import { NotificationContainer } from "react-notifications";
import AuthContextProvider from "./context/AuthContextProvider";

import Dashboard from './main';
function App() {
  return (
    <React.Fragment>      
      <BrowserRouter>
        <ThemeProvider theme={theme}>
        <NotificationContainer />
          <GlobalStyles
            styles={{
              fontFamily: "Lato",
            }}
          />
            <AuthContextProvider>
            <Dashboard />
            </AuthContextProvider>
        </ThemeProvider>
      </BrowserRouter>
    </React.Fragment>
  );
}

export default App;
