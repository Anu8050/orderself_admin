import React, { useState } from 'react';
import {
  Grid,
  Switch,
  Box,
  Typography
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import * as themeService from '../../services/themeServices';
import ShowSnackbar from "../../utils/ShowSnackbar";
import LinearProgress from '@mui/material/LinearProgress';
const ConfigureThemes = () => {
  const [loading, setLoadingIconState] = React.useState(true);
  const [openSnackBar, setOpenSnackBar] = React.useState(false);
  const [propsMessage, setPropsMessage] = React.useState("");
  const [propsSeverityType, setPropsSeverityType] = React.useState("");
  const [themes, setThemes] = useState([])
  const [themeId, setThemeId] = useState('')
  const [selectedSwitch, setSelectedSwitch] = useState(null);
  const [idFromDb, setIdFromDb] = useState(false)
  function CustomNoRowsOverlay(message) {
    return (
      <div xs={12} style={{ textAlign: "center", paddingTop: "50px" }}>
        <Typography variant="h6" gutterBottom>
          {message}
        </Typography>
      </div>
    );
  }
  const handleSwitchToggle = (id) => {
    setIdFromDb(false)
    setOpenSnackBar(false);
    const result = themeService.updateRestaurantThemeId(id);
    result.then((res)=>{
      if(res){
        setOpenSnackBar(true);
        setPropsSeverityType("success");
        setPropsMessage("Default theme is updated successfully")
      }
    })
    setSelectedSwitch(id);
  };
  
  React.useEffect(() => {
    const promise = themeService.getSavedThemes();
    promise.then((docs) => {
      setLoadingIconState(false);
      setThemes(docs);
    });
    const restaurantThemeId = themeService.getRestaurantThemeId()
    restaurantThemeId.then((themeId)=>{
      setThemeId(themeId)
      setIdFromDb(true)
    })
  }, [openSnackBar]);


  const columns = [
    {
      field: 'primaryColor',
      headerName: 'Primary color',
      width: 150,
      renderCell: (params) => (
        <div style={{ display: 'flex', alignItems: 'center',justifyContent:"space-between" }}>
          <div
            style={{
              marginRight: 5,
              width: 20,
              height: 20,
              borderRadius:5,
              backgroundColor: params.row.primaryColor,
            }}
          />
          <span>{params.row.primaryColor}</span>          
        </div>
      ),
    },
    {
      field: 'secondaryColor',
      headerName: 'Secondary color',
      width: 150,
      renderCell: (params) => (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <div
            style={{
              marginRight: 5,
              width: 20,
              height: 20,
              borderRadius:5,
              backgroundColor: params.row.secondaryColor,
            }}
          />
          <span>{params.row.secondaryColor}</span>          
        </div>
      ),
    },
    { 
      headerName: 'Set Default Theme',
      width: 150,
      renderCell: (params) => {
        return(
          <div>
            {idFromDb ? (
        <Switch
        checked={themeId === params.row.id}       
        onChange={() => handleSwitchToggle(params.row.id)}
        color="primary"
      />
      ) : (
        <Switch       
        checked={selectedSwitch === params.row.id}
        onChange={() => handleSwitchToggle(params.row.id)}
        color="primary"
      />
      )}
      </div>
       )        
      },
    },
];


  return (
    <Box className="Configure Themes" sx={{
      pl: 9,
      pr: 1,
      pt: 1,
      width: '100%',
      overflow: 'auto',
      backgroundColor: '#EAEAEA'
    }}>
      {openSnackBar && (
      <ShowSnackbar message={propsMessage} severityType={propsSeverityType} />
    )}
        <Grid container padding={1} style={{ borderTopLeftRadius: '8px', borderTopRightRadius: '8px', backgroundColor: '#fff', alignContent: 'space-around' }} marginBottom={0.5}>
            <Grid item xs={4} className="breadcrumb">
                <span>Configure Themes</span>
            </Grid>
        </Grid>

        <Grid container padding={2} style={{ backgroundColor: '#fff' }}>
        <Grid item xs={12} className="">
                <div style={{ height: 500, width: 'auto' }}>
                    <div style={{ display: 'flex', height: '100%' }}>
                        <div style={{ flexGrow: 1 }}>
                            <DataGrid
                                autoHeight
                                rows={themes}
                                columns={columns}
                                pageSize={5}
                                disableSelectionOnClick
                                hideFooterPagination={true}
                                disableColumnMenu={true}
                                disableColumnSelector={true}
                                components={{
                                  NoRowsOverlay: () => CustomNoRowsOverlay("No Rows found."),
                                  LoadingOverlay: LinearProgress,
                                }}
                                loading={loading}
                            />
                        </div>
                    </div>
                </div>
        </Grid>
      </Grid>   
  </Box>

  )
}
export default ConfigureThemes;
