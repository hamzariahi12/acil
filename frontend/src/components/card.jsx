import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Card,
  CardContent,
  Typography,
  Button,
  Box,
  Checkbox,
  List,
  ListItem,
  ListItemText,
  Divider,
  Stack,
  ListItemAvatar,
  Avatar,
  IconButton,
  Modal,
  TextField,
} from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';


const ReservationCard = () => {
  const [cartItems, setCartItems] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phoneNumber: '',
    numberOfGuests:'',
    city: '',
    reservationDate: ''
  });

  // Load cart items from localStorage on component mount
  useEffect(() => {
    const loadCartItems = () => {
      const storedCart = localStorage.getItem('cart');
      if (storedCart) {
        try {
          const parsedCart = JSON.parse(storedCart);
          setCartItems(parsedCart);
        } catch (error) {
          console.error('Error parsing cart data:', error);
          setCartItems([]);
        }
      }
    };

    loadCartItems();
  }, []);

  const handleSelect = (id) => {
    setSelectedItems((prev) => {
      if (prev.includes(id)) {
        return prev.filter((itemId) => itemId !== id);
      } else {
        return [...prev, id];
      }
    });
  };

  const handleDelete = () => {
    if (selectedItems.length === 0) return;
    
    // Filter out selected items
    const updatedCart = cartItems.filter(item => !selectedItems.includes(item.id));
    
    // Update localStorage
    localStorage.setItem('cart', JSON.stringify(updatedCart));
    
    // Update state
    setCartItems(updatedCart);
    setSelectedItems([]);
  };

  const handleDeleteSingle = (id) => {
    // Filter out the item
    const updatedCart = cartItems.filter(item => item.id !== id);
    
    // Update localStorage
    localStorage.setItem('cart', JSON.stringify(updatedCart));
    
    // Update state
    setCartItems(updatedCart);
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleFormSubmit = async(e) => {
    e.preventDefault();
    // Here you can add your checkout logic
    const data ={...formData,restaurant:"restaurantId"}
    console.log('Form submitted:', formData);
    const response =await axios.post('http://localhost:4000/api/reservations', formData)
    // Close the modal after submission
    setOpenModal(false);
  };

  const modalStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: '#1E1E1E',
    boxShadow: 24,
    p: 4,
    borderRadius: 2,
  };

  return (
    <Box
      sx={{
        backgroundColor: "black",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        py: 6,
        px: 2,
      }}
    >
      <Card
        sx={{
          backgroundColor: "#1E1E1E",
          borderRadius: 4,
          boxShadow: 5,
          width: "100%",
          maxWidth: 800,
        }}
      >
        <CardContent>
          <Typography
            variant="h5"
            align="center"
            gutterBottom
            sx={{ color: "#F4C95D", fontWeight: 600 }}
          >
            Your Cart
          </Typography>

          {cartItems.length > 0 ? (
            <List>
              {cartItems.map((item) => (
                <React.Fragment key={item.id}>
                  <ListItem
                    sx={{
                      bgcolor: selectedItems.includes(item.id) ? "#2a2a2a" : "transparent",
                      borderRadius: 2,
                      transition: "0.3s",
                      px: 2,
                    }}
                    secondaryAction={
                      <IconButton 
                        edge="end" 
                        aria-label="delete"
                        onClick={() => handleDeleteSingle(item.id)}
                        sx={{ color: "#A68E5D" }}
                      >
                        <DeleteIcon />
                      </IconButton>
                    }
                  >
                    <Checkbox
                      checked={selectedItems.includes(item.id)}
                      onChange={() => handleSelect(item.id)}
                      sx={{
                        color: "#A68E5D",
                        "&.Mui-checked": {
                          color: "#F4C95D",
                        },
                      }}
                    />
                    <ListItemAvatar>
                      <Avatar 
                        alt={item.name} 
                        src={item.image} 
                        sx={{ width: 56, height: 56, mr: 2 }}
                      />
                    </ListItemAvatar>
                    <ListItemText
                      primary={item.name}
                      secondary={`Type: ${item.type} | Price: ${item.price}`}
                      primaryTypographyProps={{ sx: { color: "white" } }}
                      secondaryTypographyProps={{ sx: { color: "gray" } }}
                    />
                  </ListItem>
                  <Divider sx={{ backgroundColor: "#444" }} />
                </React.Fragment>
              ))}
            </List>
          ) : (
            <Typography color="gray" align="center" mt={3}>
              Your cart is empty.
            </Typography>
          )}

          <Stack spacing={2} mt={4}>
            <Button
              fullWidth
              variant="contained"
              onClick={() => setOpenModal(true)}
              disabled={selectedItems.length === 0}
              sx={{
                backgroundColor: selectedItems.length === 0 ? "#666" : "#A68E5D",
                color: "black",
                fontWeight: 600,
                "&:hover": { 
                  backgroundColor: selectedItems.length === 0 ? "#666" : "#8C7A4D" 
                },
              }}
            >
              {selectedItems.length === 0 ? "Select Items to Checkout" : "Proceed to Checkout"}
            </Button>

            <Button
              fullWidth
              variant="outlined"
              onClick={handleDelete}
              disabled={selectedItems.length === 0}
              sx={{
                color: "#A68E5D",
                borderColor: "#A68E5D",
                fontWeight: 600,
                "&:hover": {
                  color: "#8C7A4D",
                  borderColor: "#8C7A4D",
                },
              }}
            >
              Remove Selected Items
            </Button>
          </Stack>
        </CardContent>
      </Card>

      <Modal
        open={openModal}
        onClose={() => setOpenModal(false)}
        aria-labelledby="checkout-form-modal"
      >
        <Box sx={modalStyle}>
          <Typography variant="h6" component="h2" sx={{ color: "#F4C95D", mb: 3 }}>
            Reservation Details
          </Typography>
          <form onSubmit={handleFormSubmit}>
            <Stack spacing={3}>
              <TextField
                required
                fullWidth
                label="Full Name"
                name="name"
                value={formData.name}
                onChange={handleFormChange}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    color: 'white',
                    '& fieldset': {
                      borderColor: '#A68E5D',
                    },
                    '&:hover fieldset': {
                      borderColor: '#F4C95D',
                    },
                  },
                  '& .MuiInputLabel-root': {
                    color: '#A68E5D',
                  },
                }}
              />
              <TextField
                required
                fullWidth
                label="Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleFormChange}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    color: 'white',
                    '& fieldset': {
                      borderColor: '#A68E5D',
                    },
                    '&:hover fieldset': {
                      borderColor: '#F4C95D',
                    },
                  },
                  '& .MuiInputLabel-root': {
                    color: '#A68E5D',
                  },
                }}
              />
              <TextField
                required
                fullWidth
                label="Number of Guests"
                name="numberOfGuests"
                type="number"
                value={formData.numberOfGuests}
                onChange={handleFormChange}
                inputProps={{ min: 1 }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    color: 'white', 
                    '& fieldset': {
                      borderColor: '#A68E5D',
                    },
                    '&:hover fieldset': {
                      borderColor: '#F4C95D',
                    },
                  },
                  '& .MuiInputLabel-root': {
                    color: '#A68E5D',
                  },
                }}
              />
              <TextField
                required
                fullWidth
                label="Phone Number"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleFormChange}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    color: 'white',
                    '& fieldset': {
                      borderColor: '#A68E5D',
                    },
                    '&:hover fieldset': {
                      borderColor: '#F4C95D',
                    },
                  },
                  '& .MuiInputLabel-root': {
                    color: '#A68E5D',
                  },
                }}
              />
              <TextField
                required
                fullWidth
                label="City"
                name="city"
                value={formData.city}
                onChange={handleFormChange}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    color: 'white',
                    '& fieldset': {
                      borderColor: '#A68E5D',
                    },
                    '&:hover fieldset': {
                      borderColor: '#F4C95D',
                    },
                  },
                  '& .MuiInputLabel-root': {
                    color: '#A68E5D',
                  },
                }}
              />
              <TextField
                required
                fullWidth
                label="Date of Reservation"
                name="reservationDate"
                type="datetime-local"
                value={formData.reservationDate}
                onChange={handleFormChange}
                InputLabelProps={{
                  shrink: true,
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    color: 'white',
                    '& fieldset': {
                      borderColor: '#A68E5D',
                    },
                    '&:hover fieldset': {
                      borderColor: '#F4C95D',
                    },
                  },
                  '& .MuiInputLabel-root': {
                    color: '#A68E5D',
                  },
                }}
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{
                  backgroundColor: "#A68E5D",
                  color: "black",
                  fontWeight: 600,
                  "&:hover": { backgroundColor: "#8C7A4D" },
                }}
              >
                Submit Reservation
              </Button>
            </Stack>
          </form>
        </Box>
      </Modal>
    </Box>
  );
};

export default ReservationCard;