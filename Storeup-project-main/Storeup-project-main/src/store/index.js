import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import productsReducer from '../features/products/productsSlice';
import storeReducer from '../features/store/storeSlice';
import ordersReducer from '../features/orders/ordersSlice';
import uiReducer from '../features/ui/uiSlice';
import analyticsReducer from '../features/analytics/analyticsSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    products: productsReducer,
    store: storeReducer,
    orders: ordersReducer,
    ui: uiReducer,
    analytics: analyticsReducer,
  },
});

export default store; 