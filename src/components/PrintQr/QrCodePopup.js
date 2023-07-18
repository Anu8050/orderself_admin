import React from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  Stack,
} from "@mui/material";
import { useRef } from 'react';
import {useReactToPrint} from 'react-to-print'
import CancelRoundedIcon from "@mui/icons-material/CancelRounded";
import QRCode from "qrcode.react";
import { getRestaurantId } from "../../services/authService";
import * as tableService from "../../services/tableService";
export default function QrCodePopup(props) {

  const [tables, setTables] = React.useState([]);

  const printTablesQr = useReactToPrint({
    content: () => componentRef.current,
  });
  const componentRef = useRef();

  React.useEffect(() => {
    if(props.isDialogOpened){
        getTables();
    }
  }, [props.isDialogOpened]);

  const getTables = () => {    
    var restaurantId = getRestaurantId();    
    var porterId = localStorage.getItem("porter-id") ?? "";
    var promise = tableService.getTableDetails(restaurantId, porterId);
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
    });
  }
  
  const handleClose = () => {
    props.handleCloseDialog(false);
  };
  
  return (
    <Dialog
      open={props.isDialogOpened}
      onClose={handleClose}
      maxWidth={false}
      aria-labelledby="max-width-dialog-title"
      PaperProps={{ sx: { height: "80vh",width:"50vw" } }}
    >
      <DialogTitle id="max-width-dialog-title">
        <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 2 }}>
          <Grid item xs={11}>
            <strong>QrCodes Of All Tables</strong>
          </Grid>
          <Grid item xs={1} style={{ textAlign: "end" }}>
            <CancelRoundedIcon onClick={handleClose} className="closeIcon" />
          </Grid>
        </Grid>
      </DialogTitle>
      <DialogContent
        style={{ borderTop: "0.15em solid #FC8019", height: "400px" }}
      >
        <Stack spacing={1} padding={1}>
          <Grid
            container
            rowSpacing={1}
            columnSpacing={{ xs: 1, sm: 2, md: 2 }}
          >
            <div ref={componentRef}>
            <div style={{display:"flex",flexWrap:"wrap",justifyContent:"space-around"}}>

                {
                    tables.map((table)=>{
                        // console.log(table)
                        const baseUrl = "https://orderself-guest.web.app/check-in/";
                        const qrCodeText = (baseUrl +getRestaurantId() + "/" + table.tableNumber);
                        return(
                            <div style={{width:"30%",height:"380px"}}>
                              <center>
                              <h3 style={{marginBottom:"0px"}}>Orderself</h3>
                            <QRCode id="qrCodeEl" 
                            size={180} 
                            value={qrCodeText}  
                            fgColor="#F8A23F"
                            includeMargin
                            imageSettings=
                            {{src:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTi-IR9pxYGCSJEq8Wna7vgBozctvUCvLpl_A&usqp=CAU", 
                            width:30,height:30,excavate:true}}
                            />
                            <div>
                                <strong>Table {table.tableNumber}</strong>
                            </div>
                               </center>
                            
                            </div>            
                        )         
                    })
                }               
            </div>
            </div>
          </Grid>
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button variant="contained" sx={{width:"100px"}} onClick={printTablesQr}>
          Print
        </Button>
      </DialogActions>
    </Dialog>
  );
}
