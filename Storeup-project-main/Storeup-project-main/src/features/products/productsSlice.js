import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';
import { productService, categoryService } from '../../services/apiService';

// الحالة المبدئية
const initialState = {
  products: [],
  product: null,
  loading: false,
  error: null,
  categories: [],
  featuredProducts: [],
  newArrivals: [],
  saleProducts: [],
};

// جلب المنتجات
export const getProducts = createAsyncThunk(
  'products/getProducts',
  async (_, thunkAPI) => {
    try {
      console.log('Getting products from API...');
      const products = await productService.getAllProducts();
      console.log(`Successfully loaded ${products.length} products`);
      
      const categories = await categoryService.getAllCategories();
      console.log(`Successfully loaded ${categories.length} categories`);
      
      return { products, categories };
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'فشل في جلب المنتجات';
      console.error('Error loading products:', message);
      toast.error(message);
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// جلب المنتج بواسطة المعرف
export const getProductById = createAsyncThunk(
  'products/getProductById',
  async (productId, thunkAPI) => {
    try {
      const response = await productService.getProductById(productId);
      return response;
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'فشل في جلب تفاصيل المنتج';
      toast.error(message);
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// جلب المنتجات المميزة
export const getFeaturedProducts = createAsyncThunk(
  'products/getFeaturedProducts',
  async (_, thunkAPI) => {
    try {
      const response = await productService.getFeaturedProducts();
      return response;
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'فشل في جلب المنتجات المميزة';
      toast.error(message);
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// جلب المنتجات الجديدة
export const getNewArrivals = createAsyncThunk(
  'products/getNewArrivals',
  async (_, thunkAPI) => {
    try {
      const response = await productService.getNewArrivals();
      return response;
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'فشل في جلب المنتجات الجديدة';
      toast.error(message);
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// جلب منتجات التخفيضات
export const getSaleProducts = createAsyncThunk(
  'products/getSaleProducts',
  async (_, thunkAPI) => {
    try {
      const response = await productService.getSaleProducts();
      return response;
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'فشل في جلب منتجات التخفيضات';
      toast.error(message);
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// جلب المنتجات حسب الفئة
export const getProductsByCategory = createAsyncThunk(
  'products/getProductsByCategory',
  async (categoryId, thunkAPI) => {
    try {
      const response = await productService.getProductsByCategory(categoryId);
      return response;
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'فشل في جلب منتجات الفئة';
      toast.error(message);
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// حذف منتج
export const deleteProduct = createAsyncThunk(
  'products/deleteProduct',
  async ({ productId }, thunkAPI) => {
    try {
      await productService.deleteProduct(productId);
      toast.success('تم حذف المنتج بنجاح!');
      return productId;
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'فشل في حذف المنتج';
      toast.error(message);
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// إنشاء منتج جديد
export const createProduct = createAsyncThunk(
  'products/createProduct',
  async (productData, thunkAPI) => {
    try {
      const response = await productService.createProduct(productData);
      toast.success('تم إضافة المنتج بنجاح!');
      return response;
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'فشل في إضافة المنتج';
      toast.error(message);
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// جلب المنتج بالمعرف
export const fetchProductById = createAsyncThunk(
  'products/fetchProductById',
  async (productId, thunkAPI) => {
    try {
      const response = await productService.getProductById(productId);
      return response;
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'فشل في جلب بيانات المنتج';
      toast.error(message);
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// جلب الفئات
export const getCategories = createAsyncThunk(
  'products/getCategories',
  async (_, thunkAPI) => {
    try {
      const response = await categoryService.getAllCategories();
      return response;
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'فشل في جلب الفئات';
      toast.error(message);
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// تحديث منتج
export const updateProduct = createAsyncThunk(
  'products/updateProduct',
  async ({ productId, productData }, thunkAPI) => {
    try {
      const response = await productService.updateProduct(productId, productData);
      toast.success('تم تحديث المنتج بنجاح!');
      return response;
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'فشل في تحديث المنتج';
      toast.error(message);
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// شريحة المنتجات
export const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    resetProductState: (state) => {
      state.product = null;
      state.error = null;
    },
    resetProductsState: (state) => {
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // حالات جلب المنتجات
      .addCase(getProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload.products;
        state.categories = action.payload.categories;
      })
      .addCase(getProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // حالات جلب المنتج بواسطة المعرف
      .addCase(getProductById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getProductById.fulfilled, (state, action) => {
        state.loading = false;
        state.product = action.payload;
      })
      .addCase(getProductById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // حالات جلب المنتجات المميزة
      .addCase(getFeaturedProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getFeaturedProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.featuredProducts = action.payload;
      })
      .addCase(getFeaturedProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // حالات جلب المنتجات الجديدة
      .addCase(getNewArrivals.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getNewArrivals.fulfilled, (state, action) => {
        state.loading = false;
        state.newArrivals = action.payload;
      })
      .addCase(getNewArrivals.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // حالات جلب منتجات التخفيضات
      .addCase(getSaleProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getSaleProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.saleProducts = action.payload;
      })
      .addCase(getSaleProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // حالات جلب المنتجات حسب الفئة
      .addCase(getProductsByCategory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getProductsByCategory.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload;
      })
      .addCase(getProductsByCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // حالات حذف المنتج
      .addCase(deleteProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.loading = false;
        // إزالة المنتج من مصفوفة المنتجات
        state.products = state.products.filter((product) => product.id !== action.payload);
        // إعادة تعيين المنتج إذا تم حذفه
        if (state.product?.id === action.payload) {
          state.product = null;
        }
      })
      .addCase(deleteProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // حالات إنشاء منتج
      .addCase(createProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.products.push(action.payload);
      })
      .addCase(createProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // حالات جلب المنتج بالمعرف
      .addCase(fetchProductById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProductById.fulfilled, (state, action) => {
        state.loading = false;
        state.product = action.payload;
      })
      .addCase(fetchProductById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // حالات جلب الفئات
      .addCase(getCategories.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.categories = action.payload;
      })
      .addCase(getCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // حالات تحديث منتج
      .addCase(updateProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.product = action.payload;
        
        // تحديث المنتج في قائمة المنتجات
        const index = state.products.findIndex((product) => product.id === action.payload.id);
        if (index !== -1) {
          state.products[index] = action.payload;
        }
      })
      .addCase(updateProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { resetProductState, resetProductsState } = productsSlice.actions;

export default productsSlice.reducer; 