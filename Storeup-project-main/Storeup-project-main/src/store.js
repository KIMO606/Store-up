import { configureStore } from '@reduxjs/toolkit';
import authReducer from './features/auth/authSlice';
import storeReducer from './features/store/storeSlice';
import productsReducer from './features/products/productsSlice';
import uiReducer from './features/ui/uiSlice';
import ordersReducer from './features/orders/ordersSlice';
import analyticsReducer from './features/analytics/analyticsSlice';

// وسيط لمنع الطلبات المتكررة
const apiCallsCache = {};
const requestsTimestamp = {};

// وسيط لمنع الطلبات المتكررة للنقاط النهائية خلال فترة زمنية معينة
const apiMiddleware = () => next => action => {
  // فقط للطلبات غير المعلقة
  if (
    action.type && 
    typeof action.type === 'string' && 
    !action.type.endsWith('/pending')
  ) {
    return next(action);
  }

  // الحصول على نوع الطلب
  const requestType = action.type.replace('/pending', '');
  const currentTime = Date.now();
  const debounceTime = 500; // منع تكرار نفس الطلب خلال 500 مللي ثانية

  // التحقق مما إذا كان الطلب قد تم إرساله مؤخرًا
  if (
    requestsTimestamp[requestType] && 
    (currentTime - requestsTimestamp[requestType]) < debounceTime
  ) {
    console.log(`طلب متكرر لـ ${requestType}، تم تجاهله`);
    return Promise.resolve(); // تجاهل الطلب
  }

  // تحديث الطابع الزمني لهذا الطلب
  requestsTimestamp[requestType] = currentTime;
  
  return next(action);
};

// تكوين متجر Redux
const store = configureStore({
  reducer: {
    auth: authReducer,
    store: storeReducer,
    products: productsReducer,
    ui: uiReducer,
    orders: ordersReducer,
    analytics: analyticsReducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(apiMiddleware),
});

export default store; 