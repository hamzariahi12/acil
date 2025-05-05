import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMenusByRestaurant } from '../store/slices/menuSlice';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardMedia,
  CardContent,
  CircularProgress,
  Alert,
  Paper,
  Divider,
  Button,
  Snackbar,
  Fade
} from '@mui/material';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';

const API_URL ='http://localhost:4000/api';

const RestaurantDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { menus, status: menuStatus, error: menuError } = useSelector((state) => state.menu);
  const { isAuthenticated } = useSelector((state) => state.auth);
  const [restaurant, setRestaurant] = useState(null);
  const [status, setStatus] = useState('idle');
  const [error, setError] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  useEffect(() => {
    const fetchRestaurantDetails = async () => {
      setStatus('loading');
      try {
        const response = await axios.get(`${API_URL}/restaurants/${id}`);
        setRestaurant(response.data);
        setStatus('succeeded');
        dispatch(fetchMenusByRestaurant(id));
      } catch (err) {
        setStatus('failed');
        setError(err.message || 'Error fetching restaurant details');
      }
    };

    if (id) {
      fetchRestaurantDetails();
    }
  }, [id, dispatch]);
const API_URL = 'http://localhost:4000/api';
  const handleAddToCart = async() => {
    if (isAuthenticated) {
      const user= JSON.parse(localStorage.getItem('user'));
      console.log(user);
      console.log(user.id);
      await axios.post(`${API_URL}/cart`, {
        restaurant: id,
        userId: user.id
      })
      
      
      const currentCart = JSON.parse(localStorage.getItem('cart')) || [];
      const restaurantExists = currentCart.some(item => item.id === id);

      if (restaurantExists) {
        setSnackbarMessage('Restaurant is already in your cart');
      } else {
        const restaurantToAdd = {
          id: id,
          name: restaurant.name,
          image: restaurant.image,
          price: restaurant.price || 'N/A',
          type: 'restaurant'
        };

        currentCart.push(restaurantToAdd);
        localStorage.setItem('cart', JSON.stringify(currentCart));
        setSnackbarMessage('Restaurant added to cart successfully');
      }

      setSnackbarOpen(true);
    } else {
      navigate('/login');
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  if (status === 'loading' || menuStatus === 'loading') {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress />
      </Box>
    );
  }

  if (status === 'failed' || menuError) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Alert severity="error">
          {error || menuError || 'Error loading restaurant details'}
        </Alert>
      </Container>
    );
  }

  if (!restaurant) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Alert severity="info">Restaurant not found</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 8 }}>
      <Paper elevation={6} sx={{ p: 3, mb: 4, backgroundColor: '#1a1a1a', color: 'white', borderRadius: 3, boxShadow: '0 8px 24px rgba(166, 142, 93, 0.3)', border: '1px solid #A68E5D' }}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <CardMedia
              component="img"
              image={restaurant.image || "/assets/default.jpg"}
              alt={restaurant.name}
              sx={{ height: 300, objectFit: 'cover', borderRadius: 2 }}
            />
          </Grid>
          <Grid item xs={12} md={8}>
            <Typography variant="h4" gutterBottom>
              {restaurant.name}
            </Typography>
            <Typography variant="body1" color="gray" paragraph>
              {restaurant.description}
            </Typography>
            <Box sx={{ mt: 2 }}>
              <Typography variant="body2" color="#A68E5D">
                📍 {restaurant.address}, {restaurant.city}
              </Typography>
              <br />
              <Typography variant="body2" color="#A68E5D">
                📞 {restaurant.phone}
              </Typography>
              <br />
              <Typography variant="body2" color="#A68E5D">
                🕒 {restaurant.openingHours}
              </Typography>
            </Box>
            <Box sx={{ mt: 3 }}>
              <Button
                variant="contained"
                color="primary"
                size="large"
                onClick={handleAddToCart}
                startIcon={<AddShoppingCartIcon />}
                sx={{
                  backgroundColor: '#A68E5D',
                  boxShadow: '0px 4px 12px rgba(166, 142, 93, 0.5)',
                  '&:hover': {
                    backgroundColor: '#8A6E3D',
                    boxShadow: '0px 6px 18px rgba(166, 142, 93, 0.6)',
                  },
                  px: 4,
                  py: 1.5,
                  borderRadius: 3
                }}
              >
                Add to Cart
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Paper>

      <Typography variant="h5" gutterBottom sx={{ color: 'white', mb: 3 }}>
        Available Menus
      </Typography>

      {menuStatus === 'succeeded' && menus.length > 0 ? (
        <Grid container spacing={3}>
          {menus.map((menu) => (
            <Grid item xs={12} sm={6} md={4} key={menu._id}>
              <Fade in timeout={500}>
                <Card
                  sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    backgroundColor: '#1a1a1a',
                    color: 'white',
                    border: '1px solid transparent',
                    transition: 'transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease',
                    borderRadius: 3,
                    boxShadow: 3,
                    '&:hover': {
                      transform: 'scale(1.03)',
                      boxShadow: 6,
                      borderColor: '#A68E5D',
                    },
                  }}
                >
                  <CardContent>
                    <Typography variant="h6" gutterBottom color="#A68E5D">
                      {menu.name}
                    </Typography>
                    <Typography variant="body2" color="gray" gutterBottom>
                      Category: {menu.category}
                    </Typography>
                    <Typography variant="h6" color="#A68E5D" gutterBottom>
                      ${menu.price}
                    </Typography>
                    <Divider sx={{ my: 1, borderColor: '#A68E5D' }} />
                    <Typography variant="body2" sx={{ mt: 1 }}>
                      {menu.description}
                    </Typography>
                    {menu.items && menu.items.length > 0 && (
                      <Box sx={{ mt: 2 }}>
                        <Typography variant="subtitle2" color="#A68E5D" gutterBottom>
                          Items included:
                        </Typography>
                        <ul style={{ margin: 0, paddingLeft: 20, color: 'gray' }}>
                          {menu.items.map((item, index) => (
                            <li key={index}>
                              <Typography variant="body2">{item}</Typography>
                            </li>
                          ))}
                        </ul>
                      </Box>
                    )}
                  </CardContent>
                </Card>
              </Fade>
            </Grid>
          ))}
        </Grid>
      ) : (
        <Alert severity="info" sx={{ backgroundColor: '#1a1a1a', color: 'white' }}>
          No menus available for this restaurant.
        </Alert>
      )}

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        message={snackbarMessage}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      />
    </Container>
  );
};

export default RestaurantDetails;
