import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import analyticsService from '../../services/analyticsService';
import { toast } from 'react-toastify';

// الحالة الأولية
const initialState = {
  salesData: [],
  visitorData: [],
  productPerformance: [],
  loading: false,
  error: null,
  dashboardStats: {
    totalSales: 0,
    totalOrders: 0,
    averageOrderValue: 0,
    conversionRate: 0,
  },
};

// جلب بيانات المبيعات
export const getSalesData = createAsyncThunk(
  'analytics/getSalesData',
  async ({ storeId, period }, thunkAPI) => {
    try {
      const response = await analyticsService.getSalesData(storeId, period);
      return response;
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'فشل في جلب بيانات المبيعات';
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// جلب بيانات الزوار
export const getVisitorData = createAsyncThunk(
  'analytics/getVisitorData',
  async ({ storeId, period }, thunkAPI) => {
    try {
      const response = await analyticsService.getVisitorData(storeId, period);
      return response;
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'فشل في جلب بيانات الزوار';
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// جلب أداء المنتجات
export const getProductPerformance = createAsyncThunk(
  'analytics/getProductPerformance',
  async ({ storeId, limit }, thunkAPI) => {
    try {
      const response = await analyticsService.getProductPerformance(storeId, limit);
      return response;
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'فشل في جلب بيانات أداء المنتجات';
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// جلب إحصائيات لوحة التحكم
export const getDashboardStats = createAsyncThunk(
  'analytics/getDashboardStats',
  async (storeId, thunkAPI) => {
    try {
      const response = await analyticsService.getDashboardStats(storeId);
      return response;
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'فشل في جلب إحصائيات لوحة التحكم';
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// شريحة التحليلات
export const analyticsSlice = createSlice({
  name: 'analytics',
  initialState,
  reducers: {
    resetAnalyticsState: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // جلب بيانات المبيعات
      .addCase(getSalesData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getSalesData.fulfilled, (state, action) => {
        state.loading = false;
        state.salesData = action.payload;
      })
      .addCase(getSalesData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // جلب بيانات الزوار
      .addCase(getVisitorData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getVisitorData.fulfilled, (state, action) => {
        state.loading = false;
        state.visitorData = action.payload;
      })
      .addCase(getVisitorData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // جلب أداء المنتجات
      .addCase(getProductPerformance.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getProductPerformance.fulfilled, (state, action) => {
        state.loading = false;
        state.productPerformance = action.payload;
      })
      .addCase(getProductPerformance.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // جلب إحصائيات لوحة التحكم
      .addCase(getDashboardStats.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getDashboardStats.fulfilled, (state, action) => {
        state.loading = false;
        state.dashboardStats = action.payload;
      })
      .addCase(getDashboardStats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { resetAnalyticsState } = analyticsSlice.actions;
export default analyticsSlice.reducer; 