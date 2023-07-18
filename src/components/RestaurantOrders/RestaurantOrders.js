import {
  Avatar,
  Box,
  Chip,
  Divider,
  FormControl,
  NativeSelect,
  Grid,
  Switch,
  Popover
} from "@mui/material";
import Typography from "@mui/material/Typography";
import LinearProgress from "@mui/material/LinearProgress";
import { DataGrid } from "@mui/x-data-grid";
import React, { useState } from "react";
import { NotificationManager } from "react-notifications";
import {
  updateOrderStatus,
  startListeningToCollection,
} from "../../services/orderService";
import "./RestaurantOrders.css";
import * as constants from '../../constants/index'
import CommentIcon from "@mui/icons-material/Comment";


const CustomNoRowsOverlay = (message) => {
  return (
    <div xs={12} style={{ textAlign: "center", paddingTop: "50px" }}>
      <Typography variant="h6" gutterBottom>
        {message}
      </Typography>
    </div>
  );
};

const CustomStatusCellRenderer = ({ params }) => {
  const rowId = params.row.id;
  const [selectedStatus, setSelectedStatus] = useState(params.row.status);

  const handleStatusChange = async (event) => {
    setSelectedStatus(event.target.value);
    try {
      const response = await updateOrderStatus(rowId, event.target.value);
      console.log(
        "🚀 ~ file: RestaurantOrders.js:46 ~ handleStatusChange ~ response:",
        response
      );
    } catch (error) {
      console.log(
        "🚀 ~ file: RestaurantOrders.js:47 ~ handleStatusChange ~ error:",
        error
      );
    }
  };

  return (
    <FormControl fullWidth size="small" variant="outlined">
      <NativeSelect
        labelId="header-label"
        id="header-select"
        value={selectedStatus}
        onChange={handleStatusChange}
        label="Status"
        size="small"
      >
        {["In Progress", "Prepared", "Completed",  "Cancelled"].map((status) => (
          <option key={status} value={status}>
            {status}
          </option>
        ))}
      </NativeSelect>
    </FormControl>
  );
};

const RestaurantOrders = () => {
  let completed = 0;
  let prepared = 0;
  let cancelled = 0;
  let progress = 0;
  let totalOrders = 0;
  const [orders, setOrders] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [pageSize, setPageSize] = React.useState(constants.GLOBAL_PAGE_SIZE);
  const [myOrders, setMyOrders] = useState(true);
  const [allOrders, setAllOrders] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [comment, setComment] = useState("");
  const porterId = localStorage.getItem("porter-id");

  const handleMyOrders = () => {
    setMyOrders(true);
    setAllOrders(false);
  };

  const handleAllOrders = () => {
    setAllOrders(true);
    setMyOrders(false);
  };

  React.useEffect(() => {
      let unsubscribe;  
      const fetchData = async () => {
            unsubscribe = await startListeningToCollection(
              handleNewOrderState,
              handleNewOrder,
              setIsLoading
            );
      };
    const handleNewOrder = (order) => {
      NotificationManager.info(
        // `New order received for Table No. ${order.tableId}.`
        `A New order is received or a already existing order status is changed.`
      );
    };
   

    fetchData();

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [myOrders,allOrders]);

  function handleNewOrderState(orders) {
    if(porterId){
      if(myOrders){
        const filteredData = orders.filter((order)=> order.porterId === porterId);
        setOrders(filteredData);
      }else{
        setOrders(orders);
      }
    }else{
      setOrders(orders);
    }
  }

const today = new Date(); // Get the current date
const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());
const todayEnd = new Date(todayStart.getTime() + 24 * 60 * 60 * 1000);
orders.forEach((row) => {
  const orderDate = new Date(row.orderDate.seconds * 1000 + row.orderDate.nanoseconds / 1000000);
  if (orderDate >= todayStart && orderDate < todayEnd) {
    switch (row.status) {
      case "Completed":
        completed++;
        break;
      case "Prepared":
        prepared++;
        break;
      case "In Progress":
        progress++;
        break;
      case "Cancelled":
        cancelled++;
        break;
      default:
        console.log("Sorry, we are out of.");
    }
    totalOrders++;
  }
});

    const filteredRows = React.useMemo(() => {
    const today = new Date(); 
    const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const todayEnd = new Date(todayStart.getTime() + 24 * 60 * 60 * 1000);  
    const todayOrders = orders.filter((row) => {
      const orderDate = new Date(row.orderDate.seconds * 1000 + row.orderDate.nanoseconds / 1000000);
      return (
        orderDate >= todayStart && orderDate < todayEnd && row.status !== 'Completed'
      );
    });  
    const sortedOrders = todayOrders.sort(
      (a, b) => new Date(a.orderDate.seconds * 1000 + a.orderDate.nanoseconds / 1000000) - new Date(b.orderDate.seconds * 1000 + b.orderDate.nanoseconds / 1000000)
    );  
    return sortedOrders;
  }, [orders]);   

  const columns = [
    {
      field: "tableId",
      headerName: "Table No.",
      width: 100,
      sortable: true,
    },
    {
      field: "porterName",
      headerName: "Porters",
      width: 200,
      sortable: true,
      renderCell: (params) => {
        return (
          <>
            <Chip
              avatar={<Avatar src="/broken-image.jpg" />}
              label={
                params.row.porterId != "" && params.row.porterName.length !== 0
                  ? params.row.porterName
                  : "Not assigned"
              }
              variant={params.row.porterName !== "" ? "default" : "outlined"}
              color={params.row.porterName !== "" ? "primary" : "secondary"}
              size="small"
            />
          </>
        );
      },
    },
    {
      field: "menuItems",
      headerName: "Food Items",
      width: 400,
      sortable: false,
      renderCell: (params) => {
        const open = Boolean(anchorEl);
        const handleClick = (event, comment) => {
          setComment(comment)
          setAnchorEl(event.currentTarget);
        };
        const handleClose = () => {
          setAnchorEl(null);
        };
        return (
          <>
            <ul style={{ listStyleType: "none", padding: 0 }}>
              {params.row.menuItems.map((d, index) => (
                <li
                  key={d.id}
                  style={{
                    marginBottom: "4px",
                    height: "100%",
                    overflow: "auto",
                  }}
                >
                  <Chip
                    avatar={<Avatar>{`${index + 1}`}</Avatar>}
                    label={`${d.foodName ? d.foodName : "Loading..."}`}
                    sx={{ minWidth: "50px" }}
                    size="small"
                    variant="default"
                  />
              {d.comment && (
              <CommentIcon
                style={{ marginLeft: "5px", cursor: "pointer" }}
                onClick={(event) => handleClick(event, d.comment)}
              />
              )}
              </li>
            ))}
            </ul>
            <Popover
              open={open}
              anchorEl={anchorEl}
              onClose={handleClose}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "center",
              }}
              transformOrigin={{
                vertical: "top",
                horizontal: "center",
              }}
            >
            <Typography sx={{ p: 2 }}>{comment}</Typography>
            </Popover>
          </>
        );
      },
    },
    {
      field: "qty",
      headerName: "Quantity",
      width: 100,
      sortable: false,
      renderCell: (params) => {
        return (
          <>
            <ul style={{ listStyleType: "none", padding: 0 }}>
              {params.row.menuItems.map((d) => (
                <li key={d.id} style={{ marginBottom: "4px" }}>
                  <Chip label={`${d.qty}`} size="small" variant="default" />
                </li>
              ))}
            </ul>
          </>
        );
      },
    },
    {
      field: "status",
      headerName: "Status",
      width: 200,
      sortable: true,
      renderCell: (params) => <CustomStatusCellRenderer params={params} />,
    },
  ];

  return (
    <>
      <Box
        className="ManageTables"
        sx={{pl: 9,pr: 1,pt: 1,width: "100%",overflow: "auto",backgroundColor: "#EAEAEA",}}
        >
        <Grid
          container padding={1}
          style={{borderTopLeftRadius: "8px", borderTopRightRadius: "8px", backgroundColor: "#fff", alignContent: "space-around",}}
          marginBottom={0.5}
        >
          <Grid item xs={10} className="breadcrumb">
            <span>Order Status</span>
          </Grid>
          {porterId && (
            <>
            <Grid item xs={.9} style={{ textAlign:"center" }}>
              <Switch checked={myOrders} onChange={handleMyOrders}/>
              <label>My Orders</label>
            </Grid>
            <Grid item xs={.2}   style={{display: "flex",justifyContent: "center",alignItems: "center"}}>
              <Divider orientation="vertical" sx={{bgcolor:"gray", width:"2px"}} />
            </Grid>
            <Grid item xs={.9}>
              <Switch checked={allOrders} onChange={handleAllOrders} />
              <label>All Orders</label>
            </Grid>
            </>
          )}
          </Grid>

        <Grid container padding={2} style={{ backgroundColor: "#fff" }}>
          <Grid item xs={12} className="">
            <div style={{ height: "77vh", width: "100%" }}>
              <div style={{ display: "flex", height: "100%" }}>
                <div style={{ flexGrow: 1 }}>
                  <DataGrid
                    AutoGenerateColumns="False"
                    rows={filteredRows}
                    columns={columns}
                    pageSize={pageSize}
                    onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
                    components={{
                      NoRowsOverlay: () =>
                        CustomNoRowsOverlay("No Orders found."),
                      LoadingOverlay: LinearProgress,
                    }}
                    initialState={{
                      pagination: {
                        paginationModel: { page: 0, pageSize: 100 },
                      },
                    }}
                    loading={isLoading}
                    // autoHeight
                    pageSizeOptions={constants.GLOBAL_PAGE_SIZE_OPTIONS}
                    getRowHeight={() => "auto"}
                    rowSpacingType="border"
                    sx={{
                      backgroundColor: "#fff",
                      "& .MuiDataGrid-row": {
                        borderTopColor: "#fafafa",
                        borderTopStyle: "solid",
                      },
                    }}
                    getRowId={(row) => row.id}
                    rowKeyGetter={(row) => row.id}
                  />
                </div>
              </div>
            </div>
          </Grid>

        </Grid>
        <Box
            style={{
              display: "flex",
              justifyContent: "space-around",
              alignItems: "center",
              flexWrap: "wrap",
            }}
          >
            <Typography variant="subtitle1">
              Total | Number of Orders : <strong>{totalOrders}</strong>
            </Typography>
            <Divider offset="horizontal" />
            <Typography variant="subtitle2">
              In Progress  : <strong>{progress}</strong>
            </Typography>
            <Divider offset="horizontal" />      
            <Typography variant="subtitle2">
              Prepared : <strong>{prepared}</strong>
            </Typography>
            <Divider offset="horizontal" />
            <Typography variant="subtitle2">
              Completed  : <strong>{completed}</strong>
            </Typography>               
            <Divider offset="horizontal" />
            <Typography variant="subtitle2">
              Cancelled  : <strong>{cancelled}</strong>
            </Typography>           
          </Box>
      </Box>
    </>
  );
};

RestaurantOrders.propTypes = {};

RestaurantOrders.defaultProps = {};

export default RestaurantOrders;
