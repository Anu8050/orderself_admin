import React from "react";
import "./ManageTables.css";
import { useState, useEffect } from "react";
import TableImage from "../../assets/images/table.png";
import { Grid } from "@mui/material";
import Star from "../../assets/icons/star-icon.png";
import StarIcon from "@mui/icons-material/Star";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import AssignPorter from "./AssignPorter";
import ShowCurrentOrder from "./ShowCurrentOrder";
import * as tableService from "../../services/tableService";
import * as orderService from "../../services/orderService"
import { Box, LinearProgress} from "@mui/material";
import { getRestaurantId } from "../../services/authService";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import ShowSnackbar from "../../utils/ShowSnackbar";
import { useNavigate } from "react-router-dom";
import {
  Button,
  Dialog,
  DialogContent,
  Stack,
} from "@mui/material";

import { useRef } from 'react';
import {useReactToPrint} from 'react-to-print'
import { jsPDF } from 'jspdf'
import html2canvas from 'html2canvas';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import PrintIcon from '@mui/icons-material/Print';
import QRCode from "qrcode.react";
const ManageTables = () => {
  var viewportHeight = window.innerHeight;
  var headerBreadcrumbHeight = 125;
  const [isAssignPorterPopupOpen, setIsAssignPorterPopupOpen] = useState(false);
  const [tables, setTables] = useState([]);
  const [status, setStatus] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const [tableId, setTableId] = useState();
  const [tableNumber, setTableNumber] = useState();
  const [allTblCnt, setAllTblCnt] = useState(0);
  const [availableCnt, setAvailableCnt] = useState(0);
  const [occupiedCnt, setOccupiedCnt] = useState(0);
  const [reservedCnt, setReservedCnt] = useState(0);
  const [specialCnt, setSpecialCnt] = useState(0);
  const [payByCashCount, setPayByCashCount] = useState(0);

  const [printQr, setPrintQr] = useState(false);
  const [qrCodeText, setQRCodeText] = useState(undefined);

  const open = Boolean(anchorEl);

  const [openSnackBar, setOpenSnackBar] = React.useState(false);
  const [propsMessage, setPropsMessage] = React.useState("");
  const [propsSeverityType, setPropsSeverityType] = React.useState("");


  useEffect(() => {    
      var restaurantId = getRestaurantId();
      var loggedInPorterId = localStorage.getItem("porter-id") ?? "";
      var promise = tableService.getTableDetails(restaurantId, loggedInPorterId);

      promise.then((doc) => {
        var nonSpecialTables = doc
          .filter((tbl) => tbl.specialTable === false)
          .sort((a, b) =>
            a.tableNumber < b.tableNumber
              ? -1
              : a.tableNumber > b.tableNumber
              ? 1
              : 0
          );
        var specialTables = doc.filter((tbl) => tbl.specialTable === true);
        setTables(nonSpecialTables.concat(specialTables));
        setTableStats(doc);
        setLoadingPercentage(false);
      });
  }, [tables]); 

  const setTableStats = (tbls) => {
    setAllTblCnt(tbls.length);
    var splCnt = tbls.filter((tbl) => tbl.specialTable === true).length;
    setSpecialCnt(splCnt);
    var payBycashcnt = tbls.filter((tbl) => tbl.isPayByCash === "initiated").length;
    setPayByCashCount(payBycashcnt);
    var tblStatuses = ["available", "occupied", "reserved", "special"];
    tblStatuses.forEach((status) => {
      var cnt = tbls.filter(
        (tbl) => tbl.status.toLowerCase() === status.toLowerCase()
      ).length;
      switch (status.toLowerCase()) {
        case "available":
          setAvailableCnt(cnt);
          break;
        case "occupied":
          setOccupiedCnt(cnt);
          break;
        case "reserved":
          setReservedCnt(cnt);
          break;
        default:
          break;
      }
    });
  };

  const OpenPopupAssignPorter = () => {
    setIsAssignPorterPopupOpen(!isAssignPorterPopupOpen);
    setAnchorEl(null);  
  };
  
  const [isCurrentOrderPopupOpen, setIsCurrentOrderPopupOpen] = useState(false);
  const OpenPopupShowCurrentOrder = () => {
    setIsCurrentOrderPopupOpen(!isCurrentOrderPopupOpen);
    setAnchorEl(null);
  };

  const handleClick = (e, tblId, tblNo) => {
    setTableId(tblId);
    setTableNumber(tblNo);
    setAnchorEl(e.currentTarget);
  };
  

  const setBackGroundColor = (updatedStatus) =>{ 
    if(updatedStatus === "available"){
      anchorEl.classList.remove("table-bg-occupied");
      anchorEl.classList.remove("table-bg-reserved");
      anchorEl.classList.add("table-bg-available");
    }
    else if(updatedStatus === "occupied"){      
      anchorEl.classList.remove("table-bg-reserved");
      anchorEl.classList.remove("table-bg-available");
      anchorEl.classList.add("table-bg-occupied");
    }
    else if(updatedStatus === "reserved"){
      anchorEl.classList.remove("table-bg-available");
      anchorEl.classList.remove("table-bg-occupied");      
      anchorEl.classList.add("table-bg-reserved");
    }
    else{
      console.error("Error occurred. The updateTableAvailability method returned a status 'Error'. Please contact administrator.")
    }
  }

  const handleClose = (e) => {    

    if (e.currentTarget.innerText.toLowerCase() == "available") {
      tableService.updateTableAvailability(tableId, "available").then((result => {
        setBackGroundColor(result); 
      }));      
      setStatus(e.currentTarget.innerText.toLowerCase());
      setOpenSnackBar(true);
      setPropsMessage(`table ${tableNumber} is Available.`);
      setPropsSeverityType("success");
      
    } else if (e.currentTarget.innerText.toLowerCase() == "occupied") {
      tableService.updateTableAvailability(tableId, "occupied").then((result => {
        setBackGroundColor(result); 
      }));      
      setStatus(e.currentTarget.innerText.toLowerCase());
      setOpenSnackBar(true);
      setPropsMessage(`table ${tableNumber} is Occupied.`);
      setPropsSeverityType("success");
    } else if (e.currentTarget.innerText.toLowerCase() == "reserved") {
      tableService.updateTableAvailability(tableId, "reserved").then((result => {
        setBackGroundColor(result); 
      }));      
      setStatus(e.currentTarget.innerText.toLowerCase());
      setOpenSnackBar(true);
      setPropsMessage(`table ${tableNumber} is Reserved.`);
      setPropsSeverityType("success");
    }
    setAnchorEl(null);
  };

  const printQRCode = (e) => {
    setPrintQr(true);
    const baseUrl = "https://orderself-guest.web.app/check-in/";
    setQRCodeText(
      baseUrl +
        getRestaurantId() +
        "/" +
        tableNumber 
    );
    setAnchorEl(null);
  };

  const handleCloseQr = () => {
    setPrintQr(false);
  };

  const printTableQr = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: `Qr_code ${tableNumber}`,
  });

  const componentRef = useRef();
  const generatePDF = () => { 
    const restaurantName = localStorage.getItem('restaurant-name')
    const input = document.getElementById('divToPrint');
    html2canvas(input)
      .then((canvas) => {
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF();
        pdf.addImage(imgData, 'PNG', 0, 0);        
        pdf.save(`${restaurantName}_${tableNumber}_QRCode.pdf`);
      }) 
}

  const [loadingPercentage, setLoadingPercentage] = React.useState(true);
  const [tableStatus, setTableStatus] = React.useState("all");

  const handleChange = (event, newTableStatus) => {
    if(newTableStatus === null)
    {
      setTableStatus(tableStatus)
    }
    else{
      setTableStatus(newTableStatus);
    }    
  };
 
  const filteredTables = tableStatus === 'all' ? tables : tables.filter(table => table.status.toLowerCase() === tableStatus.toLowerCase());

  const handlePaymentAccepted = () =>{
    tableService.updatePayByCash(tableNumber,"Completed");
    setAnchorEl(null);
    orderService.updateOrderInfoStatus(tableNumber, "Completed")
    setTimeout(()=>{
      tableService.updateTableAvailability(tableId, "available");
    },[1000])
    
  }

  return (
    <Box sx={{ pl: 9, pr: 1, pt: 1, width: "100%", overflow: "auto", backgroundColor: "#EAEAEA", }} >
      {openSnackBar && (
        <ShowSnackbar message={propsMessage} severityType={propsSeverityType} />
      )}
      <Dialog
        open={printQr}
        onClose={handleCloseQr}
        aria-labelledby="max-width-dialog-title"
        maxWidth="false"
        PaperProps={{ sx: { width:"270px" ,borderRadius:"20px"} }}
      >
        <DialogContent sx={{borderColor:"2px solid red"}}>
          <Stack spacing={1} padding={1}>
            <div id="divToPrint">
            <div ref={componentRef}>
              <center>
              <h3 style={{marginTop:"0px"}}>OrderSelf</h3>
                <div style={{marginBottom:"10px"}}>
                    <QRCode id="qrCodeEl" size={200} value={qrCodeText} />
                </div>           
              <div>
                 <strong>Table {tableNumber}</strong>
              </div>
              </center>              
            </div>
            </div>
            <div style={{ display: "flex", flexDirection:"column",alignItems:"center" }}>
              <Button variant="contained" style={{ width: "200px", marginTop: "10px", }} onClick={printTableQr} startIcon={<PrintIcon />}>
                Print
              </Button>
              <Button variant="contained" style={{ width: "200px", marginTop: "10px" }} onClick={generatePDF} startIcon={<FileDownloadIcon />} >
                Download pdf
              </Button>
            </div>
          </Stack>
        </DialogContent>
      </Dialog>

      <Grid 
        container 
        padding={1}
        style={{ borderTopLeftRadius: "8px", borderTopRightRadius: "8px", backgroundColor: "#fff", alignContent: "space-around"}}
        marginBottom={0.5}
      >
        <Grid item xs={8} className="breadcrumb">
          <span>Manage Tables</span>
        </Grid>
      </Grid>

      <Box
        style={{ backgroundColor: "#fff", height: "" + viewportHeight - headerBreadcrumbHeight + "px", overflow: "auto"}}
      >
        {loadingPercentage && (
          <LinearProgress variant="indeterminate"></LinearProgress>
        )}
        <div style={{ padding: "5px 0px 0px 5px" }}>
          <ToggleButtonGroup
            color="primary"
            value={tableStatus}
            exclusive
            onChange={handleChange}
            aria-label="Status"
          >
            <ToggleButton value="all">
              <strong>All ({allTblCnt})</strong>
            </ToggleButton>
            <ToggleButton value="available">
              <strong>Available ({availableCnt})</strong>
            </ToggleButton>
            <ToggleButton value="occupied">
              <strong>Occupied ({occupiedCnt})</strong>
            </ToggleButton>
            <ToggleButton value="reserved">
              <strong>Reserved ({reservedCnt})</strong>
            </ToggleButton>
            <ToggleButton value="special">
              <strong>Special ({specialCnt})</strong>
            </ToggleButton>
            <ToggleButton value="paymentAccepted">
              <strong>Approve PayByCash({payByCashCount})</strong>
            </ToggleButton>
          </ToggleButtonGroup>
        </div>

        {/* displaying tables on condition of toggle button */}
        <Grid container padding={2}>
          <Grid item xs={12}>
            <div className="tablepage-container" style={{}}>
              <Grid
                container
                rowSpacing={1}
                columnSpacing={1}
                style={{ textAlign: "center" }}
              >
                {filteredTables.map((doc) => {
                  var bgClass = "";
                  var specialTable = "";
                  if (doc.status.toLowerCase() == "available") {
                    bgClass = "table-bg-available";
                  } else if (doc.status.toLowerCase() == "occupied") {
                    bgClass = "table-bg-occupied";
                  } else if (doc.status.toLowerCase() == "reserved") {
                    bgClass = "table-bg-reserved";
                  }
                  if (doc.specialTable == true) {
                    specialTable = "isSpecial-table";
                  } else {
                    specialTable = "";
                  }
                  return (
                    <Grid
                      item sm="2" lg="1" key={doc.id} className="table-widgets"
                    >
                      <div
                        className={"table-icon " + bgClass}
                        aria-controls={open ? "table-status-menu" : undefined}
                        aria-haspopup="true"
                        aria-expanded={open ? "true" : undefined}
                        onClick={(event) => {
                          handleClick(event, doc.id, doc.tableNumber);
                        }}
                      >
                        <img
                          src={Star}
                          className={"special-table" + specialTable}
                          style={{ width: "30px", marginTop: "-18px" }}
                          alt={doc.tableNumber}
                        />
                        <p className="tbl-number">{doc.tableNumber}</p>
                        <img
                          src={TableImage}
                          className="tbl-img"
                          alt={doc.tableNumber}
                        />
                      </div>
                    </Grid>
                  );
                })}
              </Grid>
            </div>
          </Grid>
        </Grid>


        {/*  Displaying special tables */}
        {tableStatus == "special" &&
          <Grid container padding={2}>
            <Grid item xs={12}>
              <div className="tablepage-container" style={{}}>
                <Grid
                  container
                  rowSpacing={1}
                  columnSpacing={1}
                  style={{ textAlign: "center" }}
                >
                  {tables.map((doc) => {
                    var bgClass = "";
                    var specialTable = "";
                    if (doc.status.toLowerCase() == "available") {
                      bgClass = "table-bg-available";
                    } else if (doc.status.toLowerCase() == "occupied") {
                      bgClass = "table-bg-occupied";
                    } else if (doc.status.toLowerCase() == "reserved") {
                      bgClass = "table-bg-reserved";
                    }
                    if (doc.specialTable == true) {
                      specialTable = "isSpecial-table";
                      return (
                        <Grid
                          item
                          sm="2"
                          lg="1"
                          key={doc.id}
                          className="table-widgets"
                        >
                          <div
                            className={"table-icon " + bgClass}
                            aria-controls={open ? "table-status-menu" : undefined}
                            aria-haspopup="true"
                            aria-expanded={open ? "true" : undefined}
                            onClick={(event) => {
                              handleClick(event, doc.id, doc.tableNumber);
                            }}
                          >
                            <img
                              src={Star}
                              className={"special-table" + specialTable}
                              style={{ width: "30px", marginTop: "-18px" }}
                              alt={doc.tableNumber}
                            />
                            <p className="tbl-number">{doc.tableNumber}</p>
                            <img
                              src={TableImage}
                              className="tbl-img"
                              alt={doc.tableNumber}
                            />
                          </div>
                        </Grid>
                      );
                    }
                  })}
                </Grid>
              </div>
            </Grid>
          </Grid>
        }

        {/* Displaying payment Accepted tables */}
        {tableStatus == "paymentAccepted" &&
          <Grid container padding={2}>
            <Grid item xs={12}>
              <div className="tablepage-container">
                <Grid
                  container
                  rowSpacing={1}
                  columnSpacing={1}
                  style={{ textAlign: "center" }}
                >
                  {tables.map((doc) => {
                    var bgClass = "";
                    var specialTable = "";
                    if (doc.status.toLowerCase() == "available") {
                      bgClass = "table-bg-available";
                    } else if (doc.status.toLowerCase() == "occupied") {
                      bgClass = "table-bg-occupied";
                    } else if (doc.status.toLowerCase() == "reserved") {
                      bgClass = "table-bg-reserved";
                    }
                    if (doc.isPayByCash == "initiated") {
                      // specialTable = "isSpecial-table";
                      return (
                        <Grid
                          item
                          sm="2"
                          lg="1"
                          key={doc.id}
                          className="table-widgets"
                        >
                          <div
                            className={"table-icon " + bgClass}
                            aria-controls={open ? "table-status-menu" : undefined}
                            aria-haspopup="true"
                            aria-expanded={open ? "true" : undefined}
                            onClick={(event) => {
                              handleClick(event, doc.id, doc.tableNumber);
                            }}
                          >
                            <img
                              src={Star}
                              className={"special-table" + specialTable}
                              style={{ width: "30px", marginTop: "-18px" }}
                              alt={doc.tableNumber}
                            />
                            <p className="tbl-number">{doc.tableNumber}</p>
                            <img
                              src={TableImage}
                              className="tbl-img"
                              alt={doc.tableNumber}
                            />
                          </div>
                        </Grid>
                      );
                    }
                  })}
                </Grid>
              </div>
            </Grid>
          </Grid>
        }
<div>
    
      </div>
      </Box>
      <AssignPorter
        tableId={tableId}        
        isDialogOpened={isAssignPorterPopupOpen}
        handleCloseDialog={() => setIsAssignPorterPopupOpen(false)}
      />
      <ShowCurrentOrder
      tableNumber={tableNumber}
      isDialogOpened={isCurrentOrderPopupOpen}
      handleCloseDialog={() => setIsCurrentOrderPopupOpen(false)}
      />
      <Menu        
        id="table-status-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          "aria-labelledby": "basic-button",
        }}
      >
        {(tableStatus == "all" || tableStatus == "available" || tableStatus == "occupied" || tableStatus == "reserved" || tableStatus == "special") &&
          (
            <>
              <MenuItem onClick={handleClose}>Occupied</MenuItem>
              <MenuItem onClick={handleClose}>Available</MenuItem>
              <MenuItem onClick={handleClose}>Reserved</MenuItem>
              <MenuItem onClick={printQRCode}>Print QR Code</MenuItem>
              <MenuItem onClick={() => OpenPopupAssignPorter()}> 
                Assign Porters
              </MenuItem>
              <MenuItem onClick={() => OpenPopupShowCurrentOrder()}>
                Show current orders
              </MenuItem>
            </>
          )
        }
        {tableStatus === "paymentAccepted" &&
          <MenuItem onClick={handlePaymentAccepted}>
            Payment Accepted
          </MenuItem>
        }
      </Menu>
    </Box>
  );
};

ManageTables.propTypes = {};

ManageTables.defaultProps = {};

export default ManageTables;
