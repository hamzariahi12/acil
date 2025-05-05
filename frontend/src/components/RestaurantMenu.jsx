import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMenusByRestaurant } from '../store/slices/menuSlice';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  CircularProgress,
  Alert
} from '@mui/material';

const RestaurantMenus = ({ restaurantId }) => {
  const dispatch = useDispatch();
  const { menus, status, error } = useSelector((state) => state.menu);

  useEffect(() => {
    if (restaurantId) {
      dispatch(fetchMenusByRestaurant(restaurantId));
    }
  }, [dispatch, restaurantId]);

  if (status === 'loading') {
    return (
      <Box display="flex" justifyContent="center" p={3}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ m: 2 }}>
        {error}
      </Alert>
    );
  }

  if (!menus || menus.length === 0) {
    return (
      <Typography variant="body1" color="text.secondary" sx={{ p: 2, textAlign: 'center' }}>
        No menus available for this restaurant.
      </Typography>
    );
  }

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h6" gutterBottom>
        Available Menus
      </Typography>
      <Grid container spacing={2}>
        {menus.map((menu) => (
          <Grid item xs={12} sm={6} md={4} key={menu._id}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {menu.name}
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Category: {menu.category}
                </Typography>
                <Typography variant="body1" color="primary">
                  Price: ${menu.price}
                </Typography>
                <Typography variant="body2" sx={{ mt: 1 }}>
                  {menu.description}
                </Typography>
                {menu.items && menu.items.length > 0 && (
                  <Box sx={{ mt: 2 }}>
                    <Typography variant="subtitle2" gutterBottom>
                      Items included:
                    </Typography>
                    <ul style={{ margin: 0, paddingLeft: 20 }}>
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
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default RestaurantMenus; 