import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent, Stack, Grid, Typography, CircularProgress
} from "@mui/material";
import CancelRoundedIcon from "@mui/icons-material/CancelRounded";
import { useEffect } from "react";
import * as tableService from '../../services/tableService';
import * as menuService from '../../services/menuService';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Box from "@mui/material/Box";


const ShowCurrentOrder = (props) => {
    const [orderedItem, setOrderedItem] = React.useState([]);
    const [myData, setMyData] = React.useState([]);
    const [loading, setLoading] = React.useState(false);
    

    useEffect(() => {
      if(props.isDialogOpened){
        setMyData([]);
        setLoading(false);
        const x = tableService.getCurrentOrders(props.tableNumber)

        x.then((data) => {
          if (data.length > 0) {
            setOrderedItem(data);
            var orderedItems = [];
            // if (orderedItem.length > 0) {
            data.forEach((info) => {
              info.menuItems.forEach((item) => {
                var promise = menuService.getMenuItem(item.menuInfoId);
                promise.then(data => {
                  var promise1 = tableService.getCustomerNameById(info.customerId);
                  promise1.then((name)=>{
                    orderedItems = [...orderedItems, { ...data, orderStatus: item.orderStatus, quantity: item.qty ,customerName: name}]
                  })
                })
              })
            })
            // }
            setTimeout(() => {
              setMyData(Object.values(orderedItems));
            }, 2000);
          } else {
            setMyData([]);
          }
          setTimeout(() => {
            setLoading(true);
          }, 2000);
        })
      } 
    }, [props.isDialogOpened]);
    
    const handleClose = () => {
      props.handleCloseDialog(false);
    };
  
  return (
    <div style={{ margin: "0px" }}>
      <React.Fragment>
        <Dialog 
        open={props.isDialogOpened}
          onClose={handleClose}
          aria-labelledby="max-width-dialog-title"
          PaperProps={{ sx: { width:"37rem" ,minHeight:"40%"} }}
        >
          <DialogTitle id="max-width-dialog-title">
            <Grid
              container
              rowSpacing={1}
              columnSpacing={{ xs: 1, sm: 2, md: 3 }}
            >
              <Grid item xs={10}>
                <strong> Current orders - Table {props.tableNumber}</strong>
              </Grid>
              <Grid item xs={2} style={{ alignContent: "flex-start" }}>
                <CancelRoundedIcon
                  onClick={handleClose}
                  className="closeIcon"
                />
              </Grid>
            </Grid>
          </DialogTitle>
          <DialogContent style={{ borderTop: "0.15em solid #FC8019"}}
          PaperProps={{ sx: { height: "72%" } }}>
            <Stack spacing={2} padding={1}> 
              {loading ?
                (
                  (myData.length > 0) ?
                    (
                      myData.map((item) => (
                        <div>
                          <Card sx={{ display: "flex", my: "6px" }} variant="outlined">
                            <Box
                              sx={{ display: "flex", flexDirection: "column", verticalAlign: "top", pl: 2 }}
                            >
                              <CardContent sx={{ flex: "1 0 auto", py: 0, px: 1 ,width:"30rem"}}>
                                <Typography
                                  component="div"
                                  variant="h4"
                                  sx={{textTransform: "capitalize", fontWeight: "400", pt: 1 }}
                                  gutterBottom
                                >
                                  <strong>{item.foodName}</strong> (Quantity : {item.quantity})
                                </Typography>
                                {item.foodPrice != undefined &&
                                  <Typography component="div" variant="h4">
                                    {item.foodPrice.replace('€', '')}€
                                  </Typography>
                                }
                                <Typography
                                  variant="body2"
                                  color="text.secondary"
                                  component="div"
                                >
                                  {item.foodDescription}
                                </Typography>
                                <Typography
                                variant="body2"
                                 style={{textAlign:"right"}}>
                                  Guest Name : <strong>{item.customerName}</strong>
                                </Typography>
                              </CardContent>
                            </Box>
                          </Card>
                        </div>
                      ))
                    ) :
                    (<Box
                      sx={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)"}}
                    >
                      <p> There are no Orders placed for Table {props.tableNumber}.</p>
                    </Box>
                    )
                ) :
                (
                  <center> <CircularProgress /></center>
                )
              }
             </Stack>
              </DialogContent>
        </Dialog>
      </React.Fragment>
    </div>
  );
};

ShowCurrentOrder.propTypes = {};

ShowCurrentOrder.defaultProps = {};

export default ShowCurrentOrder;