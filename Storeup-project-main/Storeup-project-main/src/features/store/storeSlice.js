import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import storeService from '../../services/storeService';
import { toast } from 'react-toastify';
import axios from 'axios';

// Initial state
const initialState = {
  currentStore: null,
  stores: [],
  loading: false,
  error: null,
  lastUpdated: null,
};

// Create store
export const createStore = createAsyncThunk(
  'store/createStore',
  async (storeData, thunkAPI) => {
    try {
      const response = await storeService.createStore(storeData);
      toast.success('تم إنشاء المتجر بنجاح!');
      return response;
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'فشل في إنشاء المتجر';
      toast.error(message);
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Get user stores
export const getUserStores = createAsyncThunk(
  'store/getUserStores',
  async (_, thunkAPI) => {
    try {
      const response = await storeService.getUserStores();
      return response;
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'فشل في جلب المتاجر';
      toast.error(message);
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Get store by ID
export const getStoreById = createAsyncThunk(
  'store/getStoreById',
  async (storeId, thunkAPI) => {
    try {
      const response = await storeService.getStoreById(storeId);
      return response;
    } catch (error) {
      const message = 
        (error.response && error.response.data && error.response.data.message) || 
        error.message || 
        'حدث خطأ أثناء جلب بيانات المتجر';
        
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Update store
export const updateStore = createAsyncThunk(
  'store/updateStore',
  async ({ storeId, storeData }, thunkAPI) => {
    try {
      const response = await storeService.updateStore(storeId, storeData);
      toast.success('تم تحديث بيانات المتجر بنجاح!');
      return response;
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'فشل في تحديث بيانات المتجر';
      toast.error(message);
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Delete store
export const deleteStore = createAsyncThunk(
  'store/deleteStore',
  async (storeId, thunkAPI) => {
    try {
      await storeService.deleteStore(storeId);
      toast.success('تم حذف المتجر بنجاح!');
      return storeId;
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'فشل في حذف المتجر';
      toast.error(message);
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Store slice
export const storeSlice = createSlice({
  name: 'store',
  initialState,
  reducers: {
    setCurrentStore: (state, action) => {
      state.currentStore = action.payload;
    },
    resetStoreError: (state) => {
      state.error = null;
    },
    resetStoreState: (state) => {
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Create store cases
      .addCase(createStore.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createStore.fulfilled, (state, action) => {
        state.loading = false;
        state.currentStore = action.payload;
        state.stores.push(action.payload);
      })
      .addCase(createStore.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Get user stores cases
      .addCase(getUserStores.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getUserStores.fulfilled, (state, action) => {
        state.loading = false;
        state.stores = action.payload;
        // Set first store as current store if no current store is selected
        if (!state.currentStore && action.payload.length > 0) {
          state.currentStore = action.payload[0];
        }
      })
      .addCase(getUserStores.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Get store by ID cases
      .addCase(getStoreById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getStoreById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentStore = action.payload;
      })
      .addCase(getStoreById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Update store cases
      .addCase(updateStore.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateStore.fulfilled, (state, action) => {
        state.loading = false;
        // Update current store if it matches the updated store ID
        if (state.currentStore?.id === action.payload.id) {
          state.currentStore = action.payload;
        }
        // Update store in stores array
        const index = state.stores.findIndex((store) => store.id === action.payload.id);
        if (index !== -1) {
          state.stores[index] = action.payload;
        }
      })
      .addCase(updateStore.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Delete store cases
      .addCase(deleteStore.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteStore.fulfilled, (state, action) => {
        state.loading = false;
        // Remove deleted store from stores array
        state.stores = state.stores.filter((store) => store.id !== action.payload);
        // Reset current store if it was deleted
        if (state.currentStore?.id === action.payload) {
          state.currentStore = state.stores.length > 0 ? state.stores[0] : null;
        }
      })
      .addCase(deleteStore.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setCurrentStore, resetStoreError, resetStoreState } = storeSlice.actions;
export default storeSlice.reducer; 