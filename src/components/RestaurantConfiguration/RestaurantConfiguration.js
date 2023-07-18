import './RestaurantConfiguration.css';
import { useNavigate } from "react-router-dom";
import React, { useState } from 'react'
import {
  Button
} from "@mui/material";
import RestaurantMenuIcon from '@mui/icons-material/RestaurantMenu';
import FollowTheSignsIcon from '@mui/icons-material/FollowTheSigns';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import StarRateIcon from '@mui/icons-material/StarRate';
import DeckIcon from '@mui/icons-material/Deck';
import PaymentsIcon from '@mui/icons-material/Payments';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import QrCode2Icon from '@mui/icons-material/QrCode2';
import PrintIcon from '@mui/icons-material/Print';
import UploadIcon from '@mui/icons-material/Upload';

import AddTable from "../ManageTables/AddTable";
import AddSpecialTable from '../ManageTables/AddSpecialTable';
import AddMenuPopup from '../MenuItems/AddMenuPopup';
import AddPortersPopup from '../ManagePorters/AddPortersPopup';
import RestaurantUploadLogo from '../RestaurantUploadLogo/RestaurantUploadLogo';
import PaymentMethodPopup from "../../components/Payments/PaymentMethodPopup"
import QrCodePopup from "../../components/PrintQr/QrCodePopup"

const RestaurantConfiguration = () => {

  const [isAddMenuPopupOpen, setIsAddMenuPopupOpen] = useState(false);
  const [isUploadIconPopupOpen, setIsUploadIconPopupOpen] = useState(false);
  const [isAddTablePopupOpen, setIsAddTablePopupOpen] = useState(false);
  const [isAddSpecialTablePopupOpen, setIsAddSpecialTablePopupOpen] = useState(false);
  const [isPaymentsPopupOpen, setIsPaymentsPopupOpen] = useState(false);
  const [isQrCodePopupOpen, setIsQrCodePopupOpen] = useState(false);

  const handleAddMenuPopupOpen = () => {
    setIsAddMenuPopupOpen(!isAddMenuPopupOpen);
  };
  const handleUploadIconPopupOpen = () => {
    setIsUploadIconPopupOpen(!isUploadIconPopupOpen);
  };

  const handleAddTablePopupOpen = () => {
    setIsAddTablePopupOpen(!isAddTablePopupOpen);
  };

  const handleAddSpecialTablePopupOpen = () => {
    setIsAddSpecialTablePopupOpen(!isAddSpecialTablePopupOpen);
  };
  const [isPortersPopupOpen, setIsPortersPopupOpen] = useState(false);
  const handlePortersPopupOpen = () => {
    navigate('/porters');
  };

  const navigate = useNavigate();
  const goToRestaurant = () => {
    navigate('/orders');
  }

  const handlePaymentsPopupOpen = () =>{
    setIsPaymentsPopupOpen(!isPaymentsPopupOpen);
  }

  const handleQrCodePopupOpen = () =>{
    setIsQrCodePopupOpen(!isQrCodePopupOpen);
  }

return (
<div style={{margin:'0px'}}>    
  <div>  
      <div className='welcome-screen-bg' style={{backgroundSize: 'cover', backgroundRepeat: 'no-repeat', height:'100%', textAlign:'center',}}>  
      <div className="restaurant-config-box" >      
        <div style={{width:'100%'}}>
          <strong>{localStorage.getItem("restaurant-name")}</strong> Configuration
          <hr />            
        </div>
        <div className='all-config-buttons'>
            <div className='config-buttons'>
                <div>
                  <Button variant="outlined" className="config-screen-btns" startIcon={<UploadIcon/>} onClick={() => handleUploadIconPopupOpen()}>Upload Restaurant Logo</Button>
                </div>
                <div>
                  <Button variant="outlined" className="config-screen-btns"  startIcon={<DeckIcon/>} onClick={() => handleAddTablePopupOpen()}>Table(s)</Button>
                </div>
                <div>
                  <Button variant="outlined" className="config-screen-btns"  startIcon={<DeckIcon />} endIcon={<StarRateIcon/>} onClick={() => handleAddSpecialTablePopupOpen()}>Special Table(s)</Button>
                </div>
                <div>
                  <Button variant="outlined" className="config-screen-btns" startIcon={<RestaurantMenuIcon/>} onClick={() => handleAddMenuPopupOpen()}>Menu Items</Button>
                </div>
            </div>
            <div className='config-buttons'>
                <div>
                  <Button variant="outlined" className="config-screen-btns" startIcon={<QrCode2Icon/>} onClick={() => handleQrCodePopupOpen()}>Print QR Code(s)</Button>
                </div>
                <div>
                  <Button variant="outlined" className="config-screen-btns" startIcon={<PrintIcon/>}>Print/Email Bills</Button>
                </div>
                <div>
                  <Button variant="outlined" className="config-screen-btns" startIcon={<FollowTheSignsIcon/>} onClick={() => handlePortersPopupOpen()}>Porters</Button>
                </div>
                <div>
                  <Button variant="outlined" className="config-screen-btns" startIcon={<AccountBalanceIcon />} onClick={() => handlePaymentsPopupOpen()} >Payment Configuration</Button>
                </div>
            </div>
        </div>
        <div>
          <Button variant="contained" className="welcome-screen-btns" startIcon={<RestaurantIcon/>} onClick={() => goToRestaurant()}>View Orders</Button>
      </div>     
      </div>
      </div>  
  </div>
  <AddMenuPopup isDialogOpened={isAddMenuPopupOpen} modeOfOperation="Add" handleCloseDialog={() => setIsAddMenuPopupOpen(false)} foodCategory = {null} editData={undefined} />
  <AddPortersPopup isDialogOpened={isPortersPopupOpen} modeOfOperation="Add" handleCloseDialog = {() => setIsPortersPopupOpen(false)} />
  <RestaurantUploadLogo isDialogOpened={isUploadIconPopupOpen} handleCloseDialog={() => setIsUploadIconPopupOpen(false)} />
  <AddTable isDialogOpened={isAddTablePopupOpen} handleCloseDialog={() => setIsAddTablePopupOpen(false)} />
  <AddSpecialTable isDialogOpened={isAddSpecialTablePopupOpen} handleCloseDialog={() => setIsAddSpecialTablePopupOpen(false)} />
  <PaymentMethodPopup isDialogOpened={isPaymentsPopupOpen} handleCloseDialog={() => setIsPaymentsPopupOpen(false)} />
  <QrCodePopup isDialogOpened={isQrCodePopupOpen} handleCloseDialog={() => setIsQrCodePopupOpen(false)} />
  </div>
)
};

RestaurantConfiguration.propTypes = {};

RestaurantConfiguration.defaultProps = {};

export default RestaurantConfiguration;
