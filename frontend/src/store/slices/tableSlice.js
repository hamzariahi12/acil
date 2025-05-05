import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { tables } from '../../services/api';

export const fetchTablesByRestaurant = createAsyncThunk(
  'tables/fetchByRestaurant',
  async (restaurantId, { rejectWithValue }) => {
    try {
      const response = await tables.getAll();
      // Filter tables by restaurant ID
      const restaurantTables = response.data.filter(table => table.restaurant === restaurantId);
      return restaurantTables;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch tables');
    }
  }
);

export const createTable = createAsyncThunk(
  'tables/create',
  async (tableData, { rejectWithValue }) => {
    try {
      const response = await tables.create(tableData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create table');
    }
  }
);

export const updateTableStatus = createAsyncThunk(
  'tables/updateStatus',
  async ({ id, status }, { rejectWithValue }) => {
    try {
      const response = await tables.update(id, { status });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update table status');
    }
  }
);

export const deleteTable = createAsyncThunk(
  'tables/delete',
  async (id, { rejectWithValue }) => {
    try {
      await tables.delete(id);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete table');
    }
  }
);

const tableSlice = createSlice({
  name: 'table',
  initialState: {
    tables: [],
    status: 'idle',
    error: null
  },
  reducers: {
    clearTables: (state) => {
      state.tables = [];
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTablesByRestaurant.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchTablesByRestaurant.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.tables = action.payload;
      })
      .addCase(fetchTablesByRestaurant.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(createTable.fulfilled, (state, action) => {
        state.tables.push(action.payload);
      })
      .addCase(updateTableStatus.fulfilled, (state, action) => {
        const index = state.tables.findIndex(table => table._id === action.payload._id);
        if (index !== -1) {
          state.tables[index] = action.payload;
        }
      })
      .addCase(deleteTable.fulfilled, (state, action) => {
        state.tables = state.tables.filter(table => table._id !== action.payload);
      });
  }
});

export const { clearTables } = tableSlice.actions;
export default tableSlice.reducer; 