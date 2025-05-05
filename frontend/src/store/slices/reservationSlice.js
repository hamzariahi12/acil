import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

export const fetchReservations = createAsyncThunk(
  'reservations/fetchAll',
  async () => {
    const response = await api.get('/reservations');
    return response.data;
  }
);

export const createReservation = createAsyncThunk(
  'reservations/create',
  async (reservationData) => {
    const response = await api.post('/reservations', reservationData);
    return response.data;
  }
);

export const updateReservation = createAsyncThunk(
  'reservations/update',
  async ({ id, reservationData }) => {
    const response = await api.patch(`/reservations/${id}`, reservationData);
    return response.data;
  }
);

export const deleteReservation = createAsyncThunk(
  'reservations/delete',
  async (id) => {
    await api.delete(`/reservations/${id}`);
    return id;
  }
);

const reservationSlice = createSlice({
  name: 'reservation',
  initialState: {
    reservations: [],
    status: 'idle',
    error: null
  },
  reducers: {
    clearReservations: (state) => {
      state.reservations = [];
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchReservations.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchReservations.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.reservations = action.payload;
      })
      .addCase(fetchReservations.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(createReservation.fulfilled, (state, action) => {
        state.reservations.push(action.payload);
      })
      .addCase(updateReservation.fulfilled, (state, action) => {
        const index = state.reservations.findIndex(res => res._id === action.payload._id);
        if (index !== -1) {
          state.reservations[index] = action.payload;
        }
      })
      .addCase(deleteReservation.fulfilled, (state, action) => {
        state.reservations = state.reservations.filter(res => res._id !== action.payload);
      });
  }
});

export const { clearReservations } = reservationSlice.actions;
export default reservationSlice.reducer; 