// In your restaurantSlice.js or similar file
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { restaurants } from '../../services/api';

export const fetchRestaurants = createAsyncThunk(
  'restaurants/fetchAll', 
  async (_, { rejectWithValue }) => {
    try {
      const response = await restaurants.getAll(); // Call to the API to get all restaurants
      return response.data; // Assuming the data is in the response body
    } catch (error) {
      console.error("Error fetching restaurants:", error);
      return rejectWithValue(error.response?.data || error.message); // Handle errors
    }
  }
);

const restaurantSlice = createSlice({
  name: 'restaurant',
  initialState: {
    restaurants: [],
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchRestaurants.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchRestaurants.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.restaurants = action.payload;
      })
      .addCase(fetchRestaurants.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  },
});

export default restaurantSlice.reducer;
