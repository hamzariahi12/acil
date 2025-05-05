import { configureStore } from "@reduxjs/toolkit";
import menuReducer from './slices/menuSlice';
import tableReducer from './slices/tableSlice';
import authReducer from './slices/authSlice';

export const store = configureStore({
  reducer: {
    menu: menuReducer,
    table: tableReducer,
    auth: authReducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});
