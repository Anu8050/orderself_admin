import "./AddTable.css";
import React, { useEffect } from "react";
import { NumericFormat } from "react-number-format";
import {
  Button, Dialog,
  DialogTitle,
  DialogContent, DialogActions, Stack, Grid
} from "@mui/material";
import CancelRoundedIcon from "@mui/icons-material/CancelRounded";
import "react-toastify/dist/ReactToastify.css";
import TableImage from "../../assets/images/table.png";
import * as restaurantService from "../../services/restaurantService";
import ShowSnackbar from "../../utils/ShowSnackbar";

const AddTable = (props) => {
  const [openSnackBar, setOpenSnackBar] = React.useState(false);
  const [propsMessage, setPropsMessage] = React.useState("");
  const [propsSeverityType, setPropsSeverityType] = React.useState("");

  const [totalNumberOfTables, settotalNumberOfTables] = React.useState();
  const [tableNumberErrorMessage, setTableNumberErrorMessage] = React.useState("");
  const handleClose = () => {
    setTableNumberErrorMessage("")
    props.handleCloseDialog(false);
  };
  const handleIncrement = () => {
    if (totalNumberOfTables <= 100)
      settotalNumberOfTables(totalNumberOfTables + 1);
  };
  const handleDecrement = () => {
    if (totalNumberOfTables != 0) {
      settotalNumberOfTables(totalNumberOfTables - 1);
    }
  };
  const handleTableNumberChange = (e) => {
      settotalNumberOfTables(parseInt(e.target.value));
  };
  useEffect(() => {
    if(props.isDialogOpened){
      getTableCount();
    }    
  }, [props.isDialogOpened]);

  const getTableCount = () => {
    const tableCount = restaurantService.getRestaurantTableCount();
    tableCount.then((tables) => {
      settotalNumberOfTables(tables);
    });
  }

  const updateNumberOfTables = () => {
    setOpenSnackBar(false);
    if(totalNumberOfTables >=100)
    {
      setTableNumberErrorMessage("Please enter table size <= 100 .")
      return;
    }
    else{    
    const result = restaurantService.updateNumberOfTables(totalNumberOfTables);
    if (result !== "error") {
      setOpenSnackBar(true);
      setPropsMessage("Number of tables has been updated");
      setPropsSeverityType("success");
      props.handleCloseDialog(false);
    } else {
      setOpenSnackBar(true);
      setPropsMessage("Error occurred while updating number of tables.");
      setPropsSeverityType("error");
    }
  }
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
              columnSpacing={{ xs: 1, sm: 2, md: 2 }}
            >
              <Grid item xs={11}>
                <strong>Configure Tables</strong>
              </Grid>
              <Grid item xs={1} style={{ alignContent: "flex-start" }}>
                <CancelRoundedIcon
                  onClick={handleClose}
                  className="closeIcon"
                />
              </Grid>
            </Grid>
          </DialogTitle>
          <DialogContent style={{ borderTop: "0.15em solid #FC8019" }}>
            <Stack spacing={2} padding={1}>
              <Grid
                container
                rowSpacing={1}
                columnSpacing={{ xs: 0, sm: 2, md: 3 }}
                className="upload-icon-title"
              >
                <Grid item xs={12} style={{ textAlign: "center" }}>
                  <img src={TableImage} className="addtbl-img" />
                </Grid>
              </Grid>

              <div className="grp-btn">
                <button className="btn" onClick={handleDecrement}>
                  -
                </button>
                <NumericFormat
                  value={totalNumberOfTables}
                  decimalScale={0}
                  onChange={(e) => handleTableNumberChange(e)}
                  onBlur={handleTableNumberChange}
                  style={{
                  width: "80px",
                  fontSize: 40,
                  textAlign: "center",
                  backgroundColor: "#000000",
                  color: "#FFFFFF",
                  height:"80px"
                }}
                />
                <button className="btn" onClick={handleIncrement}>
                  +
                </button>
              </div>
              <div>
              {tableNumberErrorMessage && (
                      <span style={{ fontSize: "12px", color: "red" }}>
                      {tableNumberErrorMessage}
                      </span>
                  )}
              </div>
              <Grid item xs={12}>
                <DialogActions>
                  <Button variant="contained" onClick={updateNumberOfTables}>
                    Save
                  </Button>
                  <Button variant="outlined" onClick={handleClose}>
                    Cancel
                  </Button>
                </DialogActions>
              </Grid>
            </Stack>
          </DialogContent>
        </Dialog>
      </React.Fragment>
    </div>
  );
};

AddTable.propTypes = {};

AddTable.defaultProps = {};

export default AddTable;
