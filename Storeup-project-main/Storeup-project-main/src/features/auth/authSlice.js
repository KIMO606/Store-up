import { createSlice } from '@reduxjs/toolkit';
import {
  register,
  login,
  logout,
  forgotPassword,
  resetPassword,
  updateProfile,
  changePassword,
  verifyEmail,
  getCurrentUser
} from './authActions';

// الحالة الأولية
const initialState = {
  token: localStorage.getItem('token'),
  isAuthenticated: null,
  isLoading: false,
  user: null,
  isError: false,
  message: ''
};

// إنشاء شريحة المصادقة
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    reset: (state) => {
      state.isLoading = false;
      state.isError = false;
      state.message = '';
    },
  },
  extraReducers: (builder) => {
    builder
      // حالات التسجيل والدخول (نجاح)
      .addCase(register.fulfilled, (state, action) => {
        state.isAuthenticated = true;
        state.isLoading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isAuthenticated = true;
        state.isLoading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
      })
      
      // حالات التسجيل والدخول (انتظار)
      .addCase(register.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(login.pending, (state) => {
        state.isLoading = true;
      })
      
      // حالات التسجيل والدخول (فشل)
      .addCase(register.rejected, (state, action) => {
        localStorage.removeItem('token');
        state.token = null;
        state.user = null;
        state.isAuthenticated = false;
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(login.rejected, (state, action) => {
        localStorage.removeItem('token');
        state.token = null;
        state.user = null;
        state.isAuthenticated = false;
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      
      // حالات جلب المستخدم الحالي
      .addCase(getCurrentUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getCurrentUser.fulfilled, (state, action) => {
        state.isAuthenticated = true;
        state.isLoading = false;
        state.user = action.payload;
      })
      .addCase(getCurrentUser.rejected, (state) => {
        localStorage.removeItem('token');
        state.token = null;
        state.user = null;
        state.isAuthenticated = false;
        state.isLoading = false;
      })

      // حالات تسجيل الخروج
      .addCase(logout.fulfilled, (state) => {
        localStorage.removeItem('token');
        state.token = null;
        state.user = null;
        state.isAuthenticated = false;
        state.isLoading = false;
      });
  },
});

export const { reset } = authSlice.actions;
export default authSlice.reducer; 