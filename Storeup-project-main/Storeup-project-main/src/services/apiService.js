import axios from 'axios';

// Function to get API URL based on current subdomain
const getApiUrl = () => {
  const hostname = window.location.hostname;
  
  // Check if we're on a subdomain
  if (hostname.includes('onrender.com')) {
    // Extract subdomain from Render URL (e.g., store1-app.onrender.com)
    const parts = hostname.split('.');
    if (parts.length >= 3) {
      const subdomain = parts[0];
      return `https://${subdomain}-storeup-backend.onrender.com/api`;
    }
  } else if (hostname.includes('localhost')) {
    return 'http://localhost:8000/api';
  } else {
    // Custom domain with subdomain
    return `https://${hostname}/api`;
  }
  
  // Fallback
  return 'http://localhost:8000/api';
};

// Update all API calls to use dynamic URL
const API_BASE_URL = getApiUrl();

// إعداد المثيل الافتراضي لـ axios
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// إضافة interceptor لإرفاق التوكن مع كل طلب
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Token ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// معالجة بيانات المنتج لتوحيد التنسيق
const normalizeProductData = (product) => {
  if (!product) return product;
  
  // Create a new object to avoid mutation issues
  const normalizedProduct = { ...product };
  
  // تحويل الأسعار إلى أرقام بشكل متسق
  if (normalizedProduct.price !== undefined) {
    // Convert string price to number and handle NaN
    const priceNum = parseFloat(normalizedProduct.price);
    normalizedProduct.price = !isNaN(priceNum) ? priceNum : 0;
  } else {
    normalizedProduct.price = 0;
  }
  
  // معالجة سعر البيع بشكل متسق
  if (normalizedProduct.sale_price || normalizedProduct.salePrice) {
    const salePriceValue = normalizedProduct.sale_price || normalizedProduct.salePrice;
    const salePriceNum = parseFloat(salePriceValue);
    normalizedProduct.salePrice = !isNaN(salePriceNum) ? salePriceNum : null;
  } else {
    normalizedProduct.salePrice = null;
  }
  
  // توحيد حقل التخفيضات
  normalizedProduct.sale = Boolean(normalizedProduct.salePrice);
  
  // معالجة الصور بشكل شامل
  if (!normalizedProduct.images || !Array.isArray(normalizedProduct.images)) {
    normalizedProduct.images = [];
  }
  
  // If images array is empty, try to add from other image fields
  if (normalizedProduct.images.length === 0) {
    // Try from image_url first
    if (normalizedProduct.image_url) {
      normalizedProduct.images.push({ image_url: normalizedProduct.image_url });
    } 
    // Then try from image field
    else if (normalizedProduct.image) {
      const imageUrl = typeof normalizedProduct.image === 'string' ? normalizedProduct.image : null;
      if (imageUrl) {
        normalizedProduct.images.push({ image_url: imageUrl });
      }
    }
    // If still no images, add a placeholder
    if (normalizedProduct.images.length === 0) {
      normalizedProduct.images.push({ 
        image_url: `https://placehold.co/600x400?text=${encodeURIComponent(normalizedProduct.name || 'منتج')}` 
      });
    }
  }
  
  // Normalize each image in the array to have a consistent structure
  normalizedProduct.images = normalizedProduct.images.map(img => {
    if (typeof img === 'string') {
      return { image_url: img };
    } else if (img && img.image_url) {
      return img;
    } else if (img && typeof img === 'object') {
      // Try to find any property that might contain the image URL
      const possibleKeys = ['url', 'src', 'source', 'path', 'href'];
      for (const key of possibleKeys) {
        if (img[key] && typeof img[key] === 'string') {
          return { image_url: img[key] };
        }
      }
    }
    // If all else fails, return a placeholder
    return { 
      image_url: `https://placehold.co/600x400?text=${encodeURIComponent(normalizedProduct.name || 'منتج')}` 
    };
  });
  
  // التأكد من أن الحقول الأساسية موجودة
  if (!normalizedProduct.name) normalizedProduct.name = 'منتج بدون اسم';
  if (!normalizedProduct.description) normalizedProduct.description = '';
  if (!normalizedProduct.category) normalizedProduct.category = 'بدون تصنيف';
  if (normalizedProduct.stock === undefined) normalizedProduct.stock = 0;
  if (normalizedProduct.rating === undefined) normalizedProduct.rating = 0;
  if (normalizedProduct.featured === undefined) normalizedProduct.featured = false;
  
  // تحويل stock إلى quantity للتوافق مع الواجهة الأمامية
  normalizedProduct.quantity = normalizedProduct.stock;
  
  // التأكد من أن المعرف متوفر وبتنسيق صحيح
  if (!normalizedProduct.id) {
    normalizedProduct.id = Date.now().toString();
  }
  
  console.log('Normalized product:', normalizedProduct.id, normalizedProduct.name, 
    'Price:', normalizedProduct.price, 
    'Sale Price:', normalizedProduct.salePrice,
    'Images:', normalizedProduct.images.length);
  
  return normalizedProduct;
};

// معالجة قائمة المنتجات
const normalizeProductsData = (products) => {
  if (!products || !Array.isArray(products)) return [];
  return products.map(normalizeProductData);
};

// دالة مساعدة لإنشاء FormData من بيانات المنتج
const createFormDataFromProduct = (productData) => {
  const formData = new FormData();
  
  // إضافة البيانات الأساسية
  formData.append('name', productData.name);
  formData.append('description', productData.description);
  formData.append('price', productData.price);
  formData.append('sale_price', productData.sale_price || '');
  formData.append('category', productData.category);
  formData.append('stock', productData.stock);
  formData.append('featured', productData.featured);
  formData.append('new_arrival', productData.new_arrival);
  formData.append('sale', productData.sale);
  
  // إضافة الصورة الرئيسية
  if (productData.image) {
    formData.append('image', productData.image);
  }
  
  // إضافة الصور الإضافية
  if (productData.images && productData.images.length > 0) {
    productData.images.forEach((image) => {
      formData.append('images', image);
    });
  }
  
  return formData;
};

// خدمات المنتجات
const productService = {
  // جلب كل المنتجات
  getAllProducts: async () => {
    try {
      const response = await api.get('/products/');
      return normalizeProductsData(response.data);
    } catch (error) {
      console.error('خطأ في جلب المنتجات:', error);
      throw error;
    }
  },

  // جلب منتج معين بواسطة المعرف
  getProductById: async (productId) => {
    try {
      const response = await api.get(`/products/${productId}/`);
      return normalizeProductData(response.data);
    } catch (error) {
      console.error(`خطأ في جلب المنتج رقم ${productId}:`, error);
      throw error;
    }
  },

  // جلب المنتجات المميزة
  getFeaturedProducts: async () => {
    try {
      const response = await api.get('/products/featured/');
      return normalizeProductsData(response.data);
    } catch (error) {
      console.error('خطأ في جلب المنتجات المميزة:', error);
      throw error;
    }
  },

  // جلب المنتجات الجديدة
  getNewArrivals: async () => {
    try {
      const response = await api.get('/products/new_arrivals/');
      return normalizeProductsData(response.data);
    } catch (error) {
      console.error('خطأ في جلب المنتجات الجديدة:', error);
      throw error;
    }
  },

  // جلب منتجات التخفيضات
  getSaleProducts: async () => {
    try {
      const response = await api.get('/products/sale/');
      return normalizeProductsData(response.data);
    } catch (error) {
      console.error('خطأ في جلب منتجات التخفيضات:', error);
      throw error;
    }
  },

  // جلب المنتجات حسب الفئة
  getProductsByCategory: async (categoryId) => {
    try {
      const response = await api.get(`/products/?category=${categoryId}`);
      return normalizeProductsData(response.data);
    } catch (error) {
      console.error(`خطأ في جلب منتجات الفئة ${categoryId}:`, error);
      throw error;
    }
  },

  // حذف منتج
  deleteProduct: async (productId) => {
    try {
      const response = await api.delete(`/products/${productId}/`);
      return response.data;
    } catch (error) {
      console.error(`خطأ في حذف المنتج رقم ${productId}:`, error);
      throw error;
    }
  },

  // إنشاء منتج جديد
  createProduct: async (productData) => {
    try {
      console.log('إرسال بيانات المنتج إلى الخادم:', productData);
      
      // التحقق من نوع البيانات - إذا كانت بالفعل FormData نستخدمها مباشرة
      const formData = productData instanceof FormData ? 
        productData : 
        createFormDataFromProduct(productData);
      
      // طباعة محتويات FormData للتشخيص (فقط الحقول وليس القيم الفعلية للصور)
      console.log('حقول FormData:', [...formData.entries()]
        .map(([key, value]) => {
          if (value instanceof File) {
            return `${key}: File (${value.name}, ${value.size} bytes)`;
          }
          return `${key}: ${value}`;
        }));
      
      const response = await api.post('/products/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      console.error('خطأ في إنشاء المنتج:', error);
      if (error.response) {
        console.error('استجابة الخطأ من الخادم:', error.response.data);
      }
      throw error;
    }
  },

  // تحديث منتج
  updateProduct: async (productId, productData) => {
    try {
      const response = await api.put(`/products/${productId}/`, productData);
      return response.data;
    } catch (error) {
      console.error(`خطأ في تحديث المنتج رقم ${productId}:`, error);
      throw error;
    }
  },
};

// خدمات الفئات
const categoryService = {
  // جلب كل الفئات
  getAllCategories: async () => {
    try {
      const response = await api.get('/categories/');
      return response.data;
    } catch (error) {
      console.error('خطأ في جلب الفئات:', error);
      throw error;
    }
  },

  // جلب فئة معينة بواسطة المعرف
  getCategoryById: async (categoryId) => {
    try {
      const response = await api.get(`/categories/${categoryId}/`);
      return response.data;
    } catch (error) {
      console.error(`خطأ في جلب الفئة رقم ${categoryId}:`, error);
      throw error;
    }
  },
};

// Add this at the end of the file to provide a default export for the api instance
export default api;

export { productService, categoryService }; 