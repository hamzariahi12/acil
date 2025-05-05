import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { menus } from '../../services/api';

export const fetchMenusByRestaurant = createAsyncThunk(
  'menus/fetchByRestaurant',
  async (restaurantId, { rejectWithValue }) => {
    try {
      const response = await menus.getAll();
      // Filter menus by restaurant ID
      const restaurantMenus = response.data.filter(menu => menu.restaurant === restaurantId);
      return restaurantMenus;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch menus');
    }
  }
);

export const createMenu = createAsyncThunk(
  'menus/create',
  async (menuData, { rejectWithValue }) => {
    try {
      const response = await menus.create(menuData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create menu');
    }
  }
);

export const updateMenu = createAsyncThunk(
  'menus/update',
  async ({ id, menuData }, { rejectWithValue }) => {
    try {
      const response = await menus.update(id, menuData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update menu');
    }
  }
);

export const deleteMenu = createAsyncThunk(
  'menus/delete',
  async (id, { rejectWithValue }) => {
    try {
      await menus.delete(id);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete menu');
    }
  }
);

const menuSlice = createSlice({
  name: 'menu',
  initialState: {
    menus: [],
    status: 'idle',
    error: null
  },
  reducers: {
    clearMenus: (state) => {
      state.menus = [];
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMenusByRestaurant.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchMenusByRestaurant.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.menus = action.payload;
      })
      .addCase(fetchMenusByRestaurant.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(createMenu.fulfilled, (state, action) => {
        state.menus.push(action.payload);
      })
      .addCase(updateMenu.fulfilled, (state, action) => {
        const index = state.menus.findIndex(menu => menu._id === action.payload._id);
        if (index !== -1) {
          state.menus[index] = action.payload;
        }
      })
      .addCase(deleteMenu.fulfilled, (state, action) => {
        state.menus = state.menus.filter(menu => menu._id !== action.payload);
      });
  }
});

export const { clearMenus } = menuSlice.actions;
export default menuSlice.reducer; 