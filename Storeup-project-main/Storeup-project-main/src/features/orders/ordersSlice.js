import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import orderService from '../../services/orderService';
import { toast } from 'react-toastify';

// الحالة الأولية
const initialState = {
  orders: [],
  userOrders: [],
  order: null,
  loading: false,
  error: null,
  stats: {
    totalOrders: 0,
    totalSales: 0,
    pendingOrders: 0,
  },
};

// إنشاء طلب جديد
export const createOrder = createAsyncThunk(
  'orders/createOrder',
  async (orderData, thunkAPI) => {
    try {
      const response = await orderService.createOrder(orderData);
      toast.success('تم إنشاء الطلب بنجاح!');
      return response;
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'فشل في إنشاء الطلب';
      toast.error(message);
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// جلب جميع الطلبات لمتجر معين
export const getOrders = createAsyncThunk(
  'orders/getOrders',
  async (storeId, thunkAPI) => {
    try {
      const response = await orderService.getOrders(storeId);
      return response;
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'فشل في جلب الطلبات';
      toast.error(message);
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// جلب طلب واحد
export const getOrderById = createAsyncThunk(
  'orders/getOrderById',
  async ({ storeId, orderId }, thunkAPI) => {
    try {
      const response = await orderService.getOrderById(storeId, orderId);
      return response;
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'فشل في جلب تفاصيل الطلب';
      toast.error(message);
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// جلب طلبات المستخدم
export const getUserOrders = createAsyncThunk(
  'orders/getUserOrders',
  async (_, thunkAPI) => {
    try {
      const response = await orderService.getUserOrders();
      return response;
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'فشل في جلب طلباتك';
      toast.error(message);
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// تحديث حالة الطلب
export const updateOrderStatus = createAsyncThunk(
  'orders/updateOrderStatus',
  async ({ storeId, orderId, status }, thunkAPI) => {
    try {
      const response = await orderService.updateOrderStatus(storeId, orderId, status);
      toast.success('تم تحديث حالة الطلب بنجاح!');
      return response;
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'فشل في تحديث حالة الطلب';
      toast.error(message);
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// جلب إحصائيات الطلبات
export const getOrderStats = createAsyncThunk(
  'orders/getOrderStats',
  async (storeId, thunkAPI) => {
    try {
      const response = await orderService.getOrderStats(storeId);
      return response;
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'فشل في جلب إحصائيات الطلبات';
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// شريحة الطلبات
export const ordersSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    resetOrderState: (state) => {
      state.order = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // إنشاء طلب
      .addCase(createOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.order = action.payload;
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // جلب الطلبات
      .addCase(getOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload;
      })
      .addCase(getOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // جلب طلب واحد
      .addCase(getOrderById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getOrderById.fulfilled, (state, action) => {
        state.loading = false;
        state.order = action.payload;
      })
      .addCase(getOrderById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // جلب طلبات المستخدم
      .addCase(getUserOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getUserOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.userOrders = action.payload;
      })
      .addCase(getUserOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // تحديث حالة الطلب
      .addCase(updateOrderStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateOrderStatus.fulfilled, (state, action) => {
        state.loading = false;
        state.order = action.payload;
        
        // تحديث الطلب في مصفوفة الطلبات
        const index = state.orders.findIndex((order) => order.id === action.payload.id);
        if (index !== -1) {
          state.orders[index] = action.payload;
        }
      })
      .addCase(updateOrderStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // جلب إحصائيات الطلبات
      .addCase(getOrderStats.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getOrderStats.fulfilled, (state, action) => {
        state.loading = false;
        state.stats = action.payload;
      })
      .addCase(getOrderStats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { resetOrderState } = ordersSlice.actions;
export default ordersSlice.reducer; 