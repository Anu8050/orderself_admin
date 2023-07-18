import { createTheme } from "@mui/material";

const theme = createTheme({
  palette: {
    primary: {
      main: "#FC8019",
    },
    secondary: {
      main: "#FC8019",
    },
    border: "#E4E4E4",
    iconColor: "#4F535A",
  },
  typography: {
    fontSize: 12,
    fontFamily: ["Lato", "sans-serif"].join(","),
    color: "#767C87",
    h1: {
      fontSize: "2rem",
      fontWeight: 600,
      lineHeight: 1.25,
    },
    h2: {
      fontSize: "1.75rem",
      fontWeight: 600,
      lineHeight: 1.25,
    },
    h3: {
      fontSize: "1.5rem",
      fontWeight: 700,
      lineHeight: "19.2px",
    },
    h4: {
      fontSize: "16px",
      fontWeight: 700,
      lineHeight: 1.25,
      color: "#292D32",
    },
    h5: {
      fontSize: "14px",
      fontWeight: 500,
      lineHeight: 1.25,
      color: "#767C87",
    },
    label: {
      fontSize: "14px",
      fontWeight: "700",
      color: "#292d32",
    },
    span: {
      fontSize: "14px",
      fontWeight: 400,
      lineHeight: "20px",
    },
    h6: {
      fontSize: "1rem",
      fontWeight: 500,
      lineHeight: 1.25,
    },
    subtitle1: {
      fontSize: 13,
    },
    subtitle2: {
      fontSize: 13,
    },
    body2: {
      fontSize: 13,
      color: "#767C87",
    },
    error: {
      fontSize: "14px",
      fontWeight: "400",
      color: "#f44336",
    },
    button: {
      textTransform: "none",
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: "4px",
          fontSize: "14px",
          fontWeight: "400",
          color: "#FFFFFF",
          maxHeight: "34px",
          padding: "8px 20px",
          boxShadow: "none",
          "&:hover": {
            boxShadow: "none",
          },
          "&.Mui-disabled": {
            color: "#ffffff",
            backgroundColor: "#eaeaea",
          },

          "&.MuiButton-outlined.MuiButton-outlinedPrimary": {
            color: "#FC8019", //"#1C96F2",
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          //width: "100%",
          "& .MuiOutlinedInput-root": {
            padding: "0px",
          },
          "& fieldset": {
            // border: "none",
          },
          "& input": {
            fontSize: "12px",
            fontWeight: "500",
            color: "#141518",
            // padding: "10px 14px",
            // maxHeight: "34px",
            width: "100%",
            // height: "100%",
            // backgroundColor: "#f4f6f9",
            borderRadius: "4px",
            // border: '1px solid #FC8019'
          },
          "& textarea": {
            width: "100%",
            fontSize: "12px",
            fontWeight: "500",
            color: "#141518",
            padding: "10px 14px",
            backgroundColor: "#f4f6f9",
            borderRadius: "4px",
          },
          "& input::placeholder": {
            fontSize: "12px",
            fontWeight: "500",
            color: "#767c87",
          },
        },
      },
    },
    // MuiSelect: {
    //   styleOverrides: {
    //     root: {
    //       width: "100%",
    //       height: "100%",
    //       maxHeight: "34px",
    //       padding: "12px 14px",
    //       backgroundColor: "#f4f6f9",
    //       ".MuiInputBase-input": {
    //         padding: "0px",
    //       },
    //       ".MuiSelect-select": {
    //         img: {
    //           display: "none",
    //         },
    //       },
    //       "& fieldset": {
    //         border: "none",
    //       },
    //     },
    //   },
    // },
    MuiFormControlLabel: {
      styleOverrides: {
        root: {
          "& .MuiFormControlLabel-label": {
            fontSize: "16px",
            fontWeight: 600,
            lineHeight: 1.25,
            color: "#292D32",
          },
        },
      },
    },
    MuiMenuItem: {
      styleOverrides: {
        root: {
          "&.Mui-selected ": {
            color: "#1C96F2",
          },
        },
      },
    },
    MuiTabs: {
      styleOverrides: {
        root: {
          width: "100%",
          border: "1px solid #F4F6F9",
          borderRadius: "4px",
          minHeight: "auto",
          ".MuiTabs-indicator": {
            display: "none",
          },
        },
      },
    },
    MuiDialogContent: {
      styleOverrides: {
        root: {
          border: "none",
          borderTop: "1px solid #e4e4e4",
        },
      },
    },
    MuiAutocomplete: {
      styleOverrides: {
        root: {
          //minHeight: "40px",
          width: "100%",
        },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          width: "48%",
          fontSize: "12px",
          fontWeight: "400",
          color: "#767C87",
          margin: "4px",
          padding: "9px",
          minHeight: "auto",

          "&.Mui-selected": {
            fontSize: "12px",
            fontWeight: "700",
            color: "#1C96F2",
            backgroundColor: " rgba(28, 150, 242, 0.1)",
            borderRadius: "4px",
          },
        },
      },
    },
    MuiDataGrid: {
      styleOverrides: {
        root: {
          border: "none",
          minHeight: "300px",
          overflowY: "auto",
          margin: "0 0 0 8px",
          "&. MuiCheckbox-root": {
            backgroundColor: "#ff0000",
            "& .MuiSvgIcon-root": {
              color: "#E4E4E4",
            },
          },
        },
      },
    },
    // MuiToggleButton:{
    //   styleOverrides: {
    //     root: {
    //       color: "#FC8019",
    //       "&$selected": {
    //         color: "white",
    //         background: "#FC8019"
    //       },
    //       "&:hover": {
    //         borderColor: "#FFD580",
    //         background: "#FFD580"
    //       },
    //       "&:hover$selected": {
    //         borderColor: "#FC8019",
    //         background: "#FC8019"
    //       },
    //       minWidth: 25,
    //       maxWidth: 32,
    //       height: 25,
    //       textTransform: "unset",
    //       fontSize: "0.70rem"
    //     },
    //   }

    // },
    // MuiToggleButtonGroup: {
    //   styleOverrides: {
    //     grouped: {
    //       margin: "10px",
    //       padding: "10px",
    //       "&:not(:first-child)": {
    //         border: "1px solid",
    //         borderColor: "#FC8019",
    //         borderRadius: "50%"
    //       },
    //       "&:first-child": {
    //         border: "1px solid",
    //         borderColor: "#FC8019",
    //         borderRadius: "50%"
    //       }
    //     }
    //   }
    // }
  },
});

export default theme;
