import React, { useState, useEffect } from "react";
import { Box, Card, CardMedia, CardContent, Typography, Button, IconButton, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Tabs, Tab, Grid, Chip, Select, MenuItem, FormControl, InputLabel, Snackbar, Alert, CircularProgress } from "@mui/material";
import { Edit, Delete, Add } from "@mui/icons-material";

const Responsable = () => {
  const [user, setUser] = useState({ restaurant: { _id: '123', name: 'My Restaurant' } }); // Mock user state
  const [menus, setMenus] = useState([]);
  const [tables, setTables] = useState([]);
  const [reservations, setReservations] = useState([]);
  const [menuStatus, setMenuStatus] = useState('idle');
  const [tableStatus, setTableStatus] = useState('idle');
  const [reservationStatus, setReservationStatus] = useState('idle');

  const [activeTab, setActiveTab] = useState(0);
  const [alert, setAlert] = useState({ open: false, message: '', severity: 'success' });

  const [openMenu, setOpenMenu] = useState(false);
  const [openTable, setOpenTable] = useState(false);
  const [openReservation, setOpenReservation] = useState(false);

  const [isEditingMenu, setIsEditingMenu] = useState(false);
  const [isEditingTable, setIsEditingTable] = useState(false);
  const [isEditingReservation, setIsEditingReservation] = useState(false);

  const [menuData, setMenuData] = useState({ name: "", category: "", price: "", description: "", image: "", items: [] });
  const [tableData, setTableData] = useState({ number: "", capacity: "", status: "Available" });
  const [reservationData, setReservationData] = useState({ customerName: "", date: "", time: "", guests: "", tableId: "", status: "Pending", specialRequests: "", contactNumber: "" });

  useEffect(() => {
    if (user?.restaurant?._id) {
      fetchData();
    }
  }, [user]);

  const fetchData = async () => {
    try {
      const restaurantId = user.restaurant._id;
      // Replace these with your actual API calls
      setMenuStatus('loading');
      setTableStatus('loading');
      setReservationStatus('loading');

      const fetchedMenus = await fetchMenusByRestaurant(restaurantId); // Mock API call
      const fetchedTables = await fetchTablesByRestaurant(restaurantId); // Mock API call
      const fetchedReservations = await fetchReservations(); // Mock API call

      setMenus(fetchedMenus);
      setTables(fetchedTables);
      setReservations(fetchedReservations);

      setMenuStatus('succeeded');
      setTableStatus('succeeded');
      setReservationStatus('succeeded');
    } catch (error) {
      showAlert('Error fetching data', 'error');
      setMenuStatus('failed');
      setTableStatus('failed');
      setReservationStatus('failed');
    }
  };

  const fetchMenusByRestaurant = async (restaurantId) => {
    // Simulate API call
    return [{ _id: '1', name: 'Menu 1', category: 'Appetizers', price: 12.99, description: 'Delicious appetizers', items: ['Item 1', 'Item 2'], image: 'https://via.placeholder.com/150' }];
  };

  const fetchTablesByRestaurant = async (restaurantId) => {
    // Simulate API call
    return [{ _id: '1', number: '1', capacity: 4, status: 'Available' }];
  };

  const fetchReservations = async () => {
    // Simulate API call
    return [{ _id: '1', customerName: 'John Doe', date: '2025-04-28', time: '19:00', guests: 2, tableId: '1', status: 'Pending', specialRequests: 'Window seat', contactNumber: '123-456-7890' }];
  };

  const showAlert = (message, severity = 'success') => {
    setAlert({ open: true, message, severity });
  };

  const handleMenuSubmit = async () => {
    try {
      if (isEditingMenu) {
        // Handle menu update
      } else {
        const menuWithRestaurant = { ...menuData, restaurant: user.restaurant._id };
        setMenus([...menus, menuWithRestaurant]);
        showAlert('Menu created successfully');
      }
      setOpenMenu(false);
      setMenuData({ name: "", category: "", price: "", description: "", image: "", items: [] });
    } catch (error) {
      showAlert('Error creating menu', 'error');
    }
  };

  const handleDeleteMenu = (id) => {
    try {
      setMenus(menus.filter(menu => menu._id !== id));
      showAlert('Menu deleted successfully');
    } catch (error) {
      showAlert('Error deleting menu', 'error');
    }
  };

  const handleTableSubmit = async () => {
    try {
      if (isEditingTable) {
        // Handle table update
      } else {
        const tableWithRestaurant = { ...tableData, restaurant: user.restaurant._id };
        setTables([...tables, tableWithRestaurant]);
        showAlert('Table created successfully');
      }
      setOpenTable(false);
      setTableData({ number: "", capacity: "", status: "Available" });
    } catch (error) {
      showAlert('Error creating table', 'error');
    }
  };

  const handleDeleteTable = (id) => {
    try {
      setTables(tables.filter(table => table._id !== id));
      showAlert('Table deleted successfully');
    } catch (error) {
      showAlert('Error deleting table', 'error');
    }
  };

  const handleReservationSubmit = async () => {
    try {
      if (isEditingReservation) {
        // Handle reservation update
      } else {
        setReservations([...reservations, reservationData]);
        showAlert('Reservation created successfully');
      }
      setOpenReservation(false);
      setReservationData({ customerName: "", date: "", time: "", guests: "", tableId: "", status: "Pending", specialRequests: "", contactNumber: "" });
    } catch (error) {
      showAlert('Error managing reservation', 'error');
    }
  };

  const handleDeleteReservation = (id) => {
    try {
      setReservations(reservations.filter(reservation => reservation._id !== id));
      showAlert('Reservation deleted successfully');
    } catch (error) {
      showAlert('Error deleting reservation', 'error');
    }
  };

  const isLoading = menuStatus === 'loading' || tableStatus === 'loading' || reservationStatus === 'loading';

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress />
      </Box>
    );
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "Confirmed": return "green";
      case "Pending": return "orange";
      case "Cancelled": return "red";
      default: return "gray";
    }
  };

  return (
    <Box sx={{ width: "100%", py: 5, backgroundColor: "black", color: "white", textAlign: "center" }}>
      <Typography variant="h4" fontWeight="bold" mb={2} color="#A68E5D">
        {user?.restaurant?.name || 'Restaurant Dashboard'}
      </Typography>

      <Tabs 
        value={activeTab} 
        onChange={(e, newValue) => setActiveTab(newValue)}
        sx={{ mb: 4, '& .MuiTab-root': { color: '#A68E5D' }, '& .Mui-selected': { color: 'white !important' } }}
      >
        <Tab label="Menus" />
        <Tab label="Tables" />
        <Tab label="Reservations" />
      </Tabs>

      {activeTab === 0 ? (
        <>
          <Button 
            startIcon={<Add />} 
            onClick={() => {
              setIsEditingMenu(false);
              setMenuData({ name: "", category: "", price: "", description: "", image: "", items: [] });
              setOpenMenu(true);
            }}
            variant="contained" 
            sx={{ backgroundColor: "#A68E5D", mb: 4, fontWeight: "bold", "&:hover": { backgroundColor: "#8c7845" } }}
          >
            Add New Menu
          </Button>

          <Box sx={{ display: "flex", justifyContent: "center", flexWrap: "wrap" }}>
            {menus.map((menu) => (
              <Card key={menu._id} sx={{ width: 300, margin: 2, backgroundColor: "#2A2A2A", color: "white" }}>
                <CardMedia
                  component="img"
                  height="140"
                  image={menu.image || 'https://via.placeholder.com/150'}
                  alt={menu.name}
                />
                <CardContent>
                  <Typography variant="h6">{menu.name}</Typography>
                  <Typography variant="body2" color="text.secondary">{menu.category}</Typography>
                  <Typography variant="body2">{menu.description}</Typography>
                  <Typography variant="body2">${menu.price}</Typography>
                </CardContent>
                <Box sx={{ display: "flex", justifyContent: "space-between", p: 1 }}>
                  <IconButton 
                    onClick={() => {
                      setIsEditingMenu(true);
                      setMenuData(menu);
                      setOpenMenu(true);
                    }}
                    color="primary"
                  >
                    <Edit />
                  </IconButton>
                  <IconButton onClick={() => handleDeleteMenu(menu._id)} color="error">
                    <Delete />
                  </IconButton>
                </Box>
              </Card>
            ))}
          </Box>
        </>
      ) : activeTab === 1 ? (
        <>
          <Button 
            startIcon={<Add />} 
            onClick={() => {
              setIsEditingTable(false);
              setTableData({ number: "", capacity: "", status: "Available" });
              setOpenTable(true);
            }}
            variant="contained" 
            sx={{ backgroundColor: "#A68E5D", mb: 4, fontWeight: "bold", "&:hover": { backgroundColor: "#8c7845" } }}
          >
            Add New Table
          </Button>

          <Box sx={{ display: "flex", justifyContent: "center", flexWrap: "wrap" }}>
            {tables.map((table) => (
              <Card key={table._id} sx={{ width: 300, margin: 2, backgroundColor: "#2A2A2A", color: "white" }}>
                <CardContent>
                  <Typography variant="h6">Table {table.number}</Typography>
                  <Typography variant="body2">Capacity: {table.capacity}</Typography>
                  <Chip label={table.status} color={table.status === "Available" ? "success" : "warning"} />
                </CardContent>
                <Box sx={{ display: "flex", justifyContent: "space-between", p: 1 }}>
                  <IconButton 
                    onClick={() => {
                      setIsEditingTable(true);
                      setTableData(table);
                      setOpenTable(true);
                    }}
                    color="primary"
                  >
                    <Edit />
                  </IconButton>
                  <IconButton onClick={() => handleDeleteTable(table._id)} color="error">
                    <Delete />
                  </IconButton>
                </Box>
              </Card>
            ))}
          </Box>
        </>
      ) : (
        <>
          <Button 
            startIcon={<Add />} 
            onClick={() => {
              setIsEditingReservation(false);
              setReservationData({ customerName: "", date: "", time: "", guests: "", tableId: "", status: "Pending", specialRequests: "", contactNumber: "" });
              setOpenReservation(true);
            }}
            variant="contained" 
            sx={{ backgroundColor: "#A68E5D", mb: 4, fontWeight: "bold", "&:hover": { backgroundColor: "#8c7845" } }}
          >
            Add New Reservation
          </Button>

          <Box sx={{ display: "flex", justifyContent: "center", flexWrap: "wrap" }}>
            {reservations.map((reservation) => (
              <Card key={reservation._id} sx={{ width: 300, margin: 2, backgroundColor: "#2A2A2A", color: "white" }}>
                <CardContent>
                  <Typography variant="h6">{reservation.customerName}</Typography>
                  <Typography variant="body2">{reservation.date} {reservation.time}</Typography>
                  <Typography variant="body2">Guests: {reservation.guests}</Typography>
                  <Typography variant="body2">{reservation.specialRequests}</Typography>
                  <Chip label={reservation.status} color={getStatusColor(reservation.status)} />
                </CardContent>
                <Box sx={{ display: "flex", justifyContent: "space-between", p: 1 }}>
                  <IconButton 
                    onClick={() => {
                      setIsEditingReservation(true);
                      setReservationData(reservation);
                      setOpenReservation(true);
                    }}
                    color="primary"
                  >
                    <Edit />
                  </IconButton>
                  <IconButton onClick={() => handleDeleteReservation(reservation._id)} color="error">
                    <Delete />
                  </IconButton>
                </Box>
              </Card>
            ))}
          </Box>
        </>
      )}

      <Dialog open={openMenu} onClose={() => setOpenMenu(false)}>
        <DialogTitle>{isEditingMenu ? 'Edit Menu' : 'Add New Menu'}</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Menu Name"
            variant="outlined"
            value={menuData.name}
            onChange={(e) => setMenuData({ ...menuData, name: e.target.value })}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Category"
            variant="outlined"
            value={menuData.category}
            onChange={(e) => setMenuData({ ...menuData, category: e.target.value })}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Price"
            type="number"
            variant="outlined"
            value={menuData.price}
            onChange={(e) => setMenuData({ ...menuData, price: e.target.value })}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Description"
            variant="outlined"
            value={menuData.description}
            onChange={(e) => setMenuData({ ...menuData, description: e.target.value })}
            sx={{ mb: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenMenu(false)} color="primary">Cancel</Button>
          <Button onClick={handleMenuSubmit} color="primary">{isEditingMenu ? 'Save Changes' : 'Create Menu'}</Button>
        </DialogActions>
      </Dialog>

      {/* Similar Dialogs for Table and Reservation can be added here */}

      <Snackbar
        open={alert.open}
        autoHideDuration={6000}
        onClose={() => setAlert({ open: false, message: '', severity: 'success' })}
      >
        <Alert onClose={() => setAlert({ open: false, message: '', severity: 'success' })} severity={alert.severity}>
          {alert.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Responsable;
