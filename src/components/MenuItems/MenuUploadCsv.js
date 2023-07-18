import React from "react";
import ArrowForwardIosSharpIcon from '@mui/icons-material/ArrowForwardIosSharp';
import CancelRoundedIcon from "@mui/icons-material/CancelRounded";
import UploadIcon from '@mui/icons-material/Upload';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { Alert, Button, Dialog, DialogContent, DialogTitle, Grid, Link, Stack } from "@mui/material";
import MuiAccordion from '@mui/material/Accordion';
import MuiAccordionDetails from '@mui/material/AccordionDetails';
import MuiAccordionSummary from '@mui/material/AccordionSummary';
import { styled } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import { DataGrid } from '@mui/x-data-grid';
import Papa from "papaparse";
import { useDropzone } from 'react-dropzone';
import Csv from "../../assets/images/csv-file-format-extension.png";
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import * as menuService from '../../services/menuService';
import * as authService from '../../services/authService';
import { foodCategory, menuInfo } from '../../models';
import ShowSnackbar from "../../utils/ShowSnackbar"  //SnackBar
import LoadingButton from '@mui/lab/LoadingButton';
import * as constants from '../../constants/index'

const MenuUploadCsv = (props) => {
  const [openSnackBar, setOpenSnackBar] = React.useState(false);
  const [propsMessage, setPropsMessage]= React.useState("");
  const [propsSeverityType, setPropsSeverityType] = React.useState(""); 
  const [pageSize, setPageSize] = React.useState(constants.GLOBAL_PAGE_SIZE);
  const [error, setError] = React.useState("");
  const [menuData, setMenuData] = React.useState([]);
  const [menuColumns, setMenuColumns] = React.useState([]);
  

  const Accordion = styled((props) => (

    <MuiAccordion disableGutters elevation={0} square {...props} />
  ))(({ theme }) => ({
    border: `1px solid ${theme.palette.divider}`,
    '&:not(:last-child)': {
      borderBottom: 0,
    },
    '&:before': {
      display: 'none',
    },
  }));

  const AccordionSummary = styled((props) => (
    <MuiAccordionSummary
      expandIcon={<ArrowForwardIosSharpIcon sx={{ fontSize: '0.9rem' }} />}
      {...props}
    />
  ))(({ theme }) => ({
    backgroundColor:
      theme.palette.mode === 'dark'
        ? 'rgba(255, 255, 255, .05)'
        : 'rgba(0, 0, 0, .03)',
    flexDirection: 'row-reverse',
    '& .MuiAccordionSummary-expandIconWrapper.Mui-expanded': {
      transform: 'rotate(90deg)',
    },
    '& .MuiAccordionSummary-content': {
      marginLeft: theme.spacing(1),
    },
  }));

  const AccordionDetails = styled(MuiAccordionDetails)(({ theme }) => ({
    padding: theme.spacing(2),
    borderTop: '1px solid rgba(0, 0, 0, .125)',
  }));
  const [expanded, setExpanded] = React.useState(false);

  const handleChange = (panel) => (event, newExpanded) => {
    setExpanded(newExpanded ? panel : false);
  };
  // ..........
 
  // const handleOpen = () => setOpen(true);  
  const handleClose = () => {
    props.handleCloseDialog(false);
    resetData();
  };
  const { acceptedFiles, getRootProps, getInputProps, open } = useDropzone({
    maxFiles: 1,
    multiple: false,
    accept: "text/csv",
    onDrop: ()=> {
      resetData();
    }

  });
  const files = acceptedFiles.map(file => (
    <li key={file.path}>
      {file.path}
    </li>
  ));
  
  const columns = [];
  menuColumns.map((menuColumn, index) => {
    columns.push(
      {
        field: menuColumn,
        headerName: menuColumn,
        width:200,
      }
    )
  })
    
  const displayData = () => { 
    if (!acceptedFiles[0]) return setError("Select a valid file.");
    Papa.parse(acceptedFiles[0], {
      header: true,
      skipEmptyLines: true,
      complete: function (results) {
        const rowsArray = [];
        const valuesArray = [];
        var rowId = 1;
        results.data.map((d) => {
          rowsArray.push(Object.keys(d));
          valuesArray.push(d);
          rowId = rowId + 1;
        });
        setMenuData(valuesArray);
        setMenuColumns(rowsArray[0]);
        setExpanded(true);
      },
    });
  }

  const resetData = () => {
    setMenuColumns([]);
    setMenuData([]);
    acceptedFiles.length= 0;
    setError("");
    setLoading(false);
  }

  const [loading, setLoading] = React.useState(false);

  const UploadCsv = () => { 
    setOpenSnackBar(false);
    setLoading(true);
    var result = menuService.newPerformBulkCSVUploadOperation(menuData);    
    result.then((status) => {
      console.log(status)
      if (status == "error") {
        setOpenSnackBar(true); //SnackBar
        setPropsMessage("Error Occurred! Please contact administrator.", "error");
        setPropsSeverityType("error");
        setLoading(false)
      }
      else {
        resetData();
        setLoading(false)
        setTimeout(()=>{
        setOpenSnackBar(true); //SnackBar
        setPropsMessage(" CSV Uploaded successfully ");
        setPropsSeverityType("success");
          handleClose();
        },[2000] )
                
      }
      setLoading(false);
    });
  }
 
  return (
      <React.Fragment>
        {openSnackBar &&
        <ShowSnackbar message={propsMessage} severityType={propsSeverityType} />
      }
        <Dialog
          open={props.isDialogOpened}
          onClose={handleClose}
          maxWidth={false}
          aria-labelledby="max-width-dialog-title"
          PaperProps={{ sx: { height: "80%" } }}
        >
          <DialogTitle id="max-width-dialog-title">
            <Grid
              container
              rowSpacing={1}
              columnSpacing={{ xs: 1, sm: 2, md: 2 }}
            >
              <Grid item xs={11}>
                <strong>Bulk Menu Item Upload</strong>
              </Grid>
              <Grid item xs={1} style={{ textAlign: "end" }}>
                <CancelRoundedIcon
                  onClick={handleClose}
                  className="closeIcon"
                />
              </Grid>
            </Grid>
          </DialogTitle>
          <DialogContent style={{ borderTop: "0.15em solid #FC8019", height: "400px" }}>
            <Stack spacing={1} padding={1}>
              <Grid
                container
                rowSpacing={1}
                columnSpacing={{ xs: 1, sm: 2, md: 2 }}
              >
                <Grid item xs={12} >
                  <Alert severity="info" >Please <Link href={constants.CSV_TEMPLATE_DOWNLOAD_LINK} underline="none">download</Link>  the template file, fill the menu details and upload the csv file.</Alert>
                </Grid>
                <Grid item xs={12} sm={12} md={8} lg={8} >
                  <div
                    {...getRootProps({ className: "dropzone" })}
                    style={{
                      backgroundColor: "#f1f3f4",
                      border: "1px dotted #000",
                      padding: "0px 5px",
                      fontSize: ".8em",
                      height: "90px"

                    }}
                  >
                    <input {...getInputProps()} />
                    <p style={{ textAlign: "center" }}>
                      <label>
                        <img src={Csv} style={{ width: "2.5rem" }} />
                        <br />
                        Drag and drop the csv file here or{" "}
                        <Link href="#" underline="none">
                          Browse
                        </Link>
                      </label>
                    </p>
                    <aside>
                    {error && <Alert severity="error" style={{ fontSize: "12px", color: "red", backgroundColor:"transparent",marginTop:"-30px"}}>{error}</Alert>}
                      <ul style={{marginTop:"-15px"}}>{files}</ul>
                    </aside>
                  </div>
                </Grid>
                <Grid item xs={12} sm={12} md={4} lg={4} >
                  <Stack>
                      <Button variant="contained"  endIcon={<VisibilityIcon />} onClick={displayData}>Preview data</Button>
                      &nbsp;
                  </Stack>
                  <Stack>
                  <LoadingButton
                    variant="contained"
                    loading={loading}
                    loadingPosition="start"
                    disabled={!menuData.length} 
                    onClick={UploadCsv}>
                    Upload CSV
                  </LoadingButton>
                  </Stack>
                </Grid>
                <Grid item xs={12}>
                  <Accordion expanded={expanded} onChange={handleChange(!expanded)}>
                    <AccordionSummary aria-controls="panel1d-content" id="panel1d-header">
                      <Typography>Preview Data &nbsp;&nbsp;
                      <Button variant="contained" endIcon={<RestartAltIcon />} onClick={resetData}>Reset</Button>
                      </Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <DataGrid
                        columns={(menuData.length == 0)? []: columns}
                        rows={menuData}
                        pageSize={pageSize}
                        onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
                        rowsPerPageOptions={constants.GLOBAL_PAGE_SIZE_OPTIONS}
                        getRowId={(row) => row.foodName}
                        pagination
                        autoHeight={true}
                      />
                    </AccordionDetails>
                  </Accordion>
                </Grid>
              </Grid>
            </Stack>
          </DialogContent>
        </Dialog>
      </React.Fragment>
  );
};

MenuUploadCsv.propTypes = {};

MenuUploadCsv.defaultProps = {};

export default MenuUploadCsv;
