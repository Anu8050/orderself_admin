import React, { useState, useEffect } from "react";
import { useParams } from "react-router";
import { useNavigate, useLocation } from "react-router-dom";
import {
    Button,
    TextField,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Stack,
    Grid,
    Switch,
} from "@mui/material";
import CancelRoundedIcon from "@mui/icons-material/CancelRounded";
import ShowSnackbar from "../../utils/ShowSnackbar";
import * as paymentService from "../../services/paymentServices";
import {updatePaymentInfo, updateRestaurantInfo, getRestaurantInfo}  from "../../services/menuService";
import * as payPalService from "../../services/paypalPaymentService";
import { LoadingButton } from "@mui/lab";
import ClearIcon from '@mui/icons-material/Clear';
import IconButton from '@mui/material/IconButton';



const PaymentMethodPopup = (props) => {
    const location = useLocation();
    const params = useParams();
    const queryParams = new URLSearchParams(location.search);   
    const [allPayments,setAllPayments] =useState();
    const [openSnackBar, setOpenSnackBar] = React.useState(false);
    const [propsMessage, setPropsMessage] = React.useState("");
    const [propsSeverityType, setPropsSeverityType] = React.useState("");
    const [loading, setLoading] = React.useState(false);
    const [isPayByCash, setIsPayByCash] = React.useState(allPayments?.payByCashEnabled || false); 
    const [isPaypal, setIsPaypal] = useState(allPayments?.paypalEnabled || false);
    const [isGooglePay, setIsGooglePay] = React.useState(allPayments?.gPayApplePayEnabled || false); 
    const [isPaymentAdvance, setIsPaymentAdvance] = React.useState(allPayments?.paymentInAdvanceEnabled || false);  

    

    const label = { inputprops: { "aria-label": "Size switch demo" } };
    const handleClose = () => {
        props.handleCloseDialog(false);
    };

    const handlePayCash = (event) => {
        setIsPayByCash(event.target.checked);
    };

    const handlePaypal = (event) => {         
        setIsPaypal(event.target.checked);
    };

    const handleGooglePay = (event) => {
        setIsGooglePay(event.target.checked);
    };

    const handlePaymentAdvance = (event) => {
        setIsPaymentAdvance(event.target.checked);
    };

    const [paypalUrl , setPaypalUrl] = React.useState();

    useEffect(() => {  
        if(props.isDialogOpened){            
            const result = paymentService.getPaymentDetails()
            result.then((payment)=>{                
                setAllPayments(payment);
                // setIsPayByCash(payment?.payByCashEnabled ?? false);
                setIsPayByCash(payment?.payByCashEnabled ?? false);
                setIsPaypal(payment?.paypalEnabled ?? false);
                setIsGooglePay(payment?.gPayApplePayEnabled ?? false);
                setIsPaymentAdvance(payment?.paymentInAdvanceEnabled ?? false);
            });
        }        
    }, [props.isDialogOpened]);
    
    
//********************PayPal related changes.******************************************/

const [restaurantInfo, setRestaurantInfo] = React.useState([]);
useEffect(() => {
  localStorage.setItem("restaurantId", params.restaurantId);
  const result = getRestaurantInfo(params.restaurantId);
  result.then((restInfo) => {
    setRestaurantInfo(restInfo);    
  });
}, []);

useEffect(() => {
  const queryParams = new URLSearchParams(location.search);
  const hasQueryParams = queryParams.has("merchantId");
  if (hasQueryParams) {
    verifySellerOnboarding();
  }
}, [location.search]);

const verifySellerOnboarding = async () => {
  const merchantData = {
    merchantId: queryParams.get("merchantId"), // firebase restaurant info doc id or tracking id
    merchantIdInPayPal: queryParams.get("merchantIdInPayPal"), // merchant id from paypal end
    permissionsGranted: queryParams.get("permissionsGranted"),
    consentStatus: queryParams.get("consentStatus"),
    productIntentId: queryParams.get("productIntentId"),
    productIntentID: queryParams.get("productIntentID"),
    isEmailConfirmed: queryParams.get("isEmailConfirmed"),
    accountStatus: queryParams.get("accountStatus"),
    riskStatus: queryParams.get("riskStatus"),
  };

  if (merchantData && merchantData.permissionsGranted === "false") {
    alert("Permission denied. Please contact PayPal support");
  } else {
    const newObj = {
      merchantIdInPayPal: queryParams.get("merchantIdInPayPal"),
    };
    await updateRestaurantInfo(params.restaurantId, newObj);
    await payPalService
      .verifySellerOnboardStatus(merchantData)
      .then((response) => {
        const paymentReceivable = {
          paypalEnabled: response.payments_receivable,
        };
        updatePaymentInfo(params.restaurantId, paymentReceivable);
        const paypalEmailConfirmed = {
          paypalEmailConfirmed: response.primary_email_confirmed,
        };
        updateRestaurantInfo(
          params.restaurantId,
          paypalEmailConfirmed
        );
      });
  }
};

function extractParamsFromURL(url) {
  const searchParams = new URLSearchParams(url.split("?")[1]);
  const params = {};

  for (let param of searchParams.entries()) {
    params[param[0]] = param[1];
  }

  return params.referralToken;
}

const extractActionUrl = async (jsonObject) => {
  let actionUrl = null;
  let partnerReferralId = null;

  jsonObject.links.forEach((link) => {
    if (link.rel === "action_url") {
      actionUrl = link.href;
      partnerReferralId = extractParamsFromURL(link.href);
    }
  });

  return { actionUrl, partnerReferralId };
};

const handleMerchantSignUp = async () => {

  const trackingId = localStorage.getItem("restaurant-id");
  const tableNumber = params.tableNumber;
  const response = await payPalService.createReferral(
    trackingId,
    restaurantInfo,
    tableNumber
  );
  const jsonObject = response;
  const { actionUrl, partnerReferralId } = await extractActionUrl(jsonObject);

  if (partnerReferralId) {
    const newObj = { partnerReferralId: partnerReferralId.toString() };
    await updateRestaurantInfo(localStorage.getItem("restaurant-id"), newObj);
  }
  if (actionUrl) {
    window.location.href = actionUrl;
  }
};

//**************************************************************/



    const AddPaymentMethod = () => {    
        setLoading(true)   
        if(allPayments !== undefined)
                {              
                const updateStatus = paymentService.updatePaymentDetails(isPayByCash,isPaypal,isGooglePay,isPaymentAdvance,allPayments.id);
                updateStatus.then((update)=>{
                   if(update)
                   {
                     setLoading(false) 
                     setOpenSnackBar(true);
                     setPropsMessage(`Payment details Updated successfully.`);
                     setPropsSeverityType("success");
                     handleClose();
                   }
                })  
                }
                else{
                    const accountNumUniqueness =paymentService.checkpaymentDetailsIsExists();
                    accountNumUniqueness.then((unique) => {
                        if (!unique) {
                                const result = paymentService.paymentDetails(isPayByCash,isPaypal,isGooglePay,isPaymentAdvance);
                                result.then((success)=>{
                                    if(success)
                                    {
                                        setLoading(false) 
                                        setOpenSnackBar(true);
                                        setPropsMessage(`Payment details added successfully.`);
                                        setPropsSeverityType("success");
                                        handleClose();
                                    } 
                                    else{
                                        setOpenSnackBar(true);
                                        setPropsMessage(`Error occured while adding Payment details.`);
                                        setPropsSeverityType("error");
                                    }                                       
                                })                 
                                                          
                        }
                        else{
                            setLoading(false) 
                        }
                    });
                }        
        setOpenSnackBar(false);        
    };
    const [paypalAccountDetail, setPaypalAccountDetail] = useState("PayPal account details");

    const [showConfirmationMsg, setShowConfirmationMsg] = useState(false);
    const [showPaypalAccountDetail, setShowPaypalAccountDetail] = useState(true);

    const handleClearClick = () => {
        setShowConfirmationMsg(true);
      };
      
    const handleConfirmationResponse = (confirmed) => {
        if (confirmed) {
            setShowPaypalAccountDetail(false);
        }
        setShowConfirmationMsg(false);
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
                    maxWidth="false"
                    PaperProps={{ sx: {minHeight: "22rem" } }}
                >
                    <DialogTitle id="max-width-dialog-title">
                        <Grid
                            container
                            rowSpacing={1}
                            columnSpacing={{ xs: 1, sm: 2, md: 2 }}
                        >
                            <Grid item xs={11}>
                                <strong>Payment Configuration</strong>
                            </Grid>
                            <Grid item xs={1} style={{ alignContent: "flex-start" }}>
                                <CancelRoundedIcon
                                    onClick={handleClose}
                                    className="closeIcon"
                                    {...label}
                                />                            
                            </Grid>
                        </Grid>
                    </DialogTitle>
                    <DialogContent style={{ borderTop: "0.15em solid #FC8019" }}>
                        <Stack spacing={2} padding={1}>
                            <Grid item xs={6}>
                                <Switch
                                    checked={isPayByCash}
                                    onChange={handlePayCash}
                                    disabled={true}
                                />
                                    <label>Enable Pay By Cash</label>
                            </Grid>
                            <Grid item xs={6}>
                                <Switch
                                    checked={isPaypal}
                                    onChange={handlePaypal}
                                />
                                 <label>Enable PayPal</label>
                            </Grid>
                            {isPaypal && (
                                <>
                                    <a href={paypalUrl}>
                                        {/* <Button variant="outlined">Sign up PayPal Merchant account</Button> */}
                                        <Button variant="outlined" onClick={handleMerchantSignUp}>
                                            Link PayPal Account
                                        </Button>
                                    </a>
                                    {showPaypalAccountDetail && (
                                        <TextField
                                            readonly
                                            value={paypalAccountDetail}
                                            {...props}
                                            InputProps={{
                                                endAdornment: (
                                                    <>
                                                        <IconButton onClick={handleClearClick} edge="end" sx={{ margin: ".2rem", color: "red" }}>
                                                            <ClearIcon />
                                                        </IconButton>
                                                        {props.InputProps?.endAdornment}
                                                    </>
                                                ),
                                            }}
                                        />
                                    )
                                    }
                                </>
                            )}
                            <Grid item xs={6}> 
                                <Switch
                                    checked={isGooglePay}
                                    onChange={handleGooglePay}
                                />
                                <label>Enable Google Pay / Apple Pay</label>
                            </Grid>
                            <Grid item xs={6}>
                                <Switch
                                    checked={isPaymentAdvance}
                                    onChange={handlePaymentAdvance}
                                />
                                  <label>Payment should be made in Advance</label>
                            </Grid>

                            <div style={{ display: "flex", justifyContent:"space-evenly"}}>
                                <LoadingButton
                                    variant="contained"
                                    loading={loading}
                                    style={{ width: "100px", marginTop: "10px" }}
                                    onClick={AddPaymentMethod}
                                    // disabled={!empty}
                                >
                                   Save
                                </LoadingButton>
                                <Button
                                    variant="outlined"
                                    style={{ width: "100px", marginTop: "10px" }}
                                    onClick={handleClose}
                                >
                                    Cancel
                                </Button>
                            </div>
                        </Stack>
                    </DialogContent>
                </Dialog>
                <Dialog
                    open={showConfirmationMsg}
                    onClose={() => handleConfirmationResponse(false)}
                >
                    <DialogTitle>Confirmation</DialogTitle>
                    <DialogContent>
                        Are you sure you want to remove PayPal account?
                    </DialogContent>
                    <DialogActions>
                        <Button  variant="contained" onClick={() => handleConfirmationResponse(true)}>Yes</Button>
                        <Button  variant="contained" onClick={() => handleConfirmationResponse(false)}>No</Button>
                    </DialogActions>
                </Dialog>
            </React.Fragment>
        </div>
    );
};

PaymentMethodPopup.propTypes = {};

PaymentMethodPopup.defaultProps = {};

export default PaymentMethodPopup;
