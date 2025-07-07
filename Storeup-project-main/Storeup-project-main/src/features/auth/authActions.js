import { createAsyncThunk } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';
import authService from '../../services/authService';

// تسجيل مستخدم جديد
export const register = createAsyncThunk(
  'auth/register',
  async (userData, thunkAPI) => {
    try {
      return await authService.register(userData);
    } catch (error) {
      // Show all backend errors, not just .message
      let message =
        (error.response && error.response.data &&
          (typeof error.response.data === 'object'
            ? Object.values(error.response.data).flat().join(' | ')
            : error.response.data.message)) ||
        error.message ||
        'حدث خطأ أثناء التسجيل';
      toast.error(message);
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// تسجيل الدخول
export const login = createAsyncThunk(
  'auth/login',
  async (userData, thunkAPI) => {
    try {
      const result = await authService.login(userData);
      toast.success('تم تسجيل الدخول بنجاح');
      return result;
    } catch (error) {
      const message = 
        (error.response && 
         error.response.data && 
         error.response.data.message) || 
        error.message || 
        'فشل تسجيل الدخول، تحقق من بريدك الإلكتروني وكلمة المرور';
        
      toast.error(message);
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// استعادة كلمة المرور
export const forgotPassword = createAsyncThunk(
  'auth/forgotPassword',
  async (email, thunkAPI) => {
    try {
      const response = await authService.forgotPassword(email);
      toast.success('تم إرسال رابط إعادة تعيين كلمة المرور إلى بريدك الإلكتروني');
      return response;
    } catch (error) {
      const message = 
        (error.response && 
         error.response.data && 
         error.response.data.message) || 
        error.message || 
        'فشل في إرسال رابط إعادة تعيين كلمة المرور';
        
      toast.error(message);
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// إعادة تعيين كلمة المرور
export const resetPassword = createAsyncThunk(
  'auth/resetPassword',
  async ({ token, newPassword }, thunkAPI) => {
    try {
      const response = await authService.resetPassword(token, newPassword);
      toast.success('تم إعادة تعيين كلمة المرور بنجاح');
      return response;
    } catch (error) {
      const message = 
        (error.response && 
         error.response.data && 
         error.response.data.message) || 
        error.message || 
        'فشل في إعادة تعيين كلمة المرور';
        
      toast.error(message);
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// تحديث الملف الشخصي
export const updateProfile = createAsyncThunk(
  'auth/updateProfile',
  async (userData, thunkAPI) => {
    try {
      const response = await authService.updateProfile(userData);
      toast.success('تم تحديث الملف الشخصي بنجاح');
      return response;
    } catch (error) {
      const message = 
        (error.response && 
         error.response.data && 
         error.response.data.message) || 
        error.message || 
        'فشل في تحديث الملف الشخصي';
        
      toast.error(message);
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// تغيير كلمة المرور
export const changePassword = createAsyncThunk(
  'auth/changePassword',
  async ({ currentPassword, newPassword }, thunkAPI) => {
    try {
      const response = await authService.changePassword(currentPassword, newPassword);
      toast.success('تم تغيير كلمة المرور بنجاح');
      return response;
    } catch (error) {
      const message = 
        (error.response && 
         error.response.data && 
         error.response.data.message) || 
        error.message || 
        'فشل في تغيير كلمة المرور';
        
      toast.error(message);
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// التحقق من البريد الإلكتروني
export const verifyEmail = createAsyncThunk(
  'auth/verifyEmail',
  async (token, thunkAPI) => {
    try {
      const response = await authService.verifyEmail(token);
      toast.success('تم التحقق من البريد الإلكتروني بنجاح');
      return response;
    } catch (error) {
      const message = 
        (error.response && 
         error.response.data && 
         error.response.data.message) || 
        error.message || 
        'فشل في التحقق من البريد الإلكتروني';
        
      toast.error(message);
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// استرجاع معلومات المستخدم الحالي
export const getCurrentUser = createAsyncThunk(
  'auth/getCurrentUser',
  async (_, thunkAPI) => {
    try {
      return await authService.getCurrentUser();
    } catch (error) {
      const message = 
        (error.response && 
         error.response.data && 
         error.response.data.message) || 
        error.message || 
        'فشل في استرجاع معلومات المستخدم';
        
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// تسجيل الخروج
export const logout = createAsyncThunk(
  'auth/logout', 
  async () => {
    authService.logout();
    toast.success('تم تسجيل الخروج بنجاح');
  }
);