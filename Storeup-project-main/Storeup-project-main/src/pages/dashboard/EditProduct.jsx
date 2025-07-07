import React, { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { toast } from 'react-toastify';
import { fetchProductById, updateProduct, getCategories, resetProductState } from '../../features/products/productsSlice';
import { XCircleIcon, ArrowUpTrayIcon, CheckCircleIcon } from '@heroicons/react/24/outline';
import Spinner from '../../components/Spinner';

const EditProduct = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { productId } = useParams();
  
  const { categories, product, loading, error } = useSelector((state) => state.products);
  
  const [uploadedImages, setUploadedImages] = useState([]);
  const [isSaving, setIsSaving] = useState(false);
  
  // جلب بيانات المنتج والتصنيفات عند تحميل الصفحة
  useEffect(() => {
    dispatch(fetchProductById(productId));
    dispatch(getCategories());
    
    return () => {
      dispatch(resetProductState());
    };
  }, [dispatch, productId]);
  
  // إعداد الفورميك مع بيانات المنتج المحملة
  useEffect(() => {
    if (product) {
      formik.setValues({
        name: product.name || '',
        description: product.description || '',
        price: product.price || '',
        salePrice: product.sale_price || '',
        categoryId: product.category || '',
        stock: product.stock || '',
        featured: product.featured || false,
        newArrival: product.new_arrival || false,
        sale: product.sale || false,
      });
      
      // إعداد الصور المحملة مسبقاً
      if (product.image) {
        setUploadedImages([
          {
            id: '1',
            url: product.image,
            file: null,
            isExisting: true
          }
        ]);
      }
      
      if (product.images && product.images.length > 0) {
        const additionalImages = product.images.map((url, index) => ({
          id: (index + 2).toString(),
          url,
          file: null,
          isExisting: true
        }));
        
        setUploadedImages(prev => [...prev, ...additionalImages]);
      }
    }
  }, [product]);

  // مخطط التحقق
  const validationSchema = Yup.object({
    name: Yup.string().required('اسم المنتج مطلوب'),
    description: Yup.string().required('وصف المنتج مطلوب'),
    price: Yup.number().required('سعر المنتج مطلوب').positive('يجب أن يكون السعر أكبر من صفر'),
    salePrice: Yup.number().nullable().transform((value, originalValue) => 
      originalValue === '' ? null : value
    ).test('salePrice', 'سعر البيع يجب أن يكون أقل من السعر الأصلي', function(value) {
      const { price } = this.parent;
      return value === null || value < price;
    }),
    categoryId: Yup.string().required('التصنيف مطلوب'),
    stock: Yup.number().required('الكمية المتوفرة مطلوبة').integer('يجب أن تكون الكمية رقم صحيح').min(0, 'لا يمكن أن تكون الكمية أقل من صفر'),
  });

  // إعداد الفورميك
  const formik = useFormik({
    initialValues: {
      name: '',
      description: '',
      price: '',
      salePrice: '',
      categoryId: '',
      stock: '',
      featured: false,
      newArrival: false,
      sale: false,
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        setIsSaving(true);
        
        // تجهيز بيانات المنتج للتحديث
        const productData = {
          ...values,
          price: Number(values.price),
          stock: Number(values.stock),
          sale_price: values.salePrice ? Number(values.salePrice) : null,
          new_arrival: values.newArrival,
          image: uploadedImages.length > 0 ? uploadedImages[0].url : null,
          category: values.categoryId,
        };
        
        // تحديث المنتج
        await dispatch(updateProduct({ 
          productId, 
          productData 
        })).unwrap();
        
        setIsSaving(false);
        navigate('/dashboard/products');
      } catch (error) {
        setIsSaving(false);
        toast.error('حدث خطأ أثناء تحديث المنتج');
      }
    },
  });

  // معالجة رفع الصور
  const handleImageUpload = useCallback((e) => {
    const files = Array.from(e.target.files);
    
    if (files.length > 0) {
      const newImages = files.map((file) => {
        const id = Math.random().toString(36).substring(2);
        const url = URL.createObjectURL(file);
        
        return { id, file, url, isExisting: false };
      });
      
      setUploadedImages((prevImages) => [...prevImages, ...newImages]);
    }
  }, []);

  // إزالة صورة
  const removeImage = useCallback((idToRemove) => {
    setUploadedImages((prevImages) => 
      prevImages.filter((image) => image.id !== idToRemove)
    );
  }, []);

  if (loading && !product) {
    return <div className="flex justify-center items-center min-h-screen"><Spinner /></div>;
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <p className="text-red-500 text-xl">حدث خطأ: {error}</p>
        <button
          className="mt-4 px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark"
          onClick={() => navigate('/dashboard/products')}
        >
          العودة إلى المنتجات
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold mb-6 text-gray-800">تحديث المنتج</h1>
        
        <form onSubmit={formik.handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* اسم المنتج */}
            <div>
              <label 
                htmlFor="name" 
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                اسم المنتج
              </label>
              <input
                type="text"
                id="edit-name"
                name="name"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.name}
                className={`w-full px-3 py-2 border rounded-md ${
                  formik.touched.name && formik.errors.name 
                    ? 'border-red-500 focus:ring-red-500 focus:border-red-500' 
                    : 'border-gray-300 focus:ring-primary focus:border-primary'
                }`}
              />
              {formik.touched.name && formik.errors.name && (
                <p className="mt-1 text-sm text-red-500">{formik.errors.name}</p>
              )}
            </div>
            
            {/* سعر المنتج */}
            <div>
              <label 
                htmlFor="price" 
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                السعر
              </label>
              <input
                type="number"
                id="edit-price"
                name="price"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.price}
                className={`w-full px-3 py-2 border rounded-md ${
                  formik.touched.price && formik.errors.price 
                    ? 'border-red-500 focus:ring-red-500 focus:border-red-500' 
                    : 'border-gray-300 focus:ring-primary focus:border-primary'
                }`}
                step="0.01"
              />
              {formik.touched.price && formik.errors.price && (
                <p className="mt-1 text-sm text-red-500">{formik.errors.price}</p>
              )}
            </div>
            
            {/* سعر العرض */}
            <div>
              <label 
                htmlFor="salePrice" 
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                سعر العرض (اختياري)
              </label>
              <input
                type="number"
                id="edit-salePrice"
                name="salePrice"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.salePrice}
                className={`w-full px-3 py-2 border rounded-md ${
                  formik.touched.salePrice && formik.errors.salePrice 
                    ? 'border-red-500 focus:ring-red-500 focus:border-red-500' 
                    : 'border-gray-300 focus:ring-primary focus:border-primary'
                }`}
                step="0.01"
              />
              {formik.touched.salePrice && formik.errors.salePrice && (
                <p className="mt-1 text-sm text-red-500">{formik.errors.salePrice}</p>
              )}
            </div>
            
            {/* التصنيف */}
            <div>
              <label 
                htmlFor="categoryId" 
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                التصنيف
              </label>
              <select
                id="edit-categoryId"
                name="categoryId"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.categoryId}
                className={`w-full px-3 py-2 border rounded-md ${
                  formik.touched.categoryId && formik.errors.categoryId 
                    ? 'border-red-500 focus:ring-red-500 focus:border-red-500' 
                    : 'border-gray-300 focus:ring-primary focus:border-primary'
                }`}
              >
                <option value="">اختر تصنيفًا</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
              {formik.touched.categoryId && formik.errors.categoryId && (
                <p className="mt-1 text-sm text-red-500">{formik.errors.categoryId}</p>
              )}
            </div>
            
            {/* المخزون */}
            <div>
              <label 
                htmlFor="stock" 
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                المخزون
              </label>
              <input
                type="number"
                id="edit-stock"
                name="stock"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.stock}
                className={`w-full px-3 py-2 border rounded-md ${
                  formik.touched.stock && formik.errors.stock 
                    ? 'border-red-500 focus:ring-red-500 focus:border-red-500' 
                    : 'border-gray-300 focus:ring-primary focus:border-primary'
                }`}
              />
              {formik.touched.stock && formik.errors.stock && (
                <p className="mt-1 text-sm text-red-500">{formik.errors.stock}</p>
              )}
            </div>
          </div>
          
          {/* الخصائص المميزة */}
          <div className="mb-6">
            <span className="block text-sm font-medium text-gray-700 mb-2">
              خصائص المنتج
            </span>
            <div className="flex flex-wrap gap-4">
              <label className="inline-flex items-center">
                <input
                  type="checkbox"
                  name="featured"
                  onChange={formik.handleChange}
                  checked={formik.values.featured}
                  className="form-checkbox h-5 w-5 text-primary rounded"
                />
                <span className="mr-2 text-gray-700">منتج مميز</span>
              </label>
              
              <label className="inline-flex items-center">
                <input
                  type="checkbox"
                  name="newArrival"
                  onChange={formik.handleChange}
                  checked={formik.values.newArrival}
                  className="form-checkbox h-5 w-5 text-primary rounded"
                />
                <span className="mr-2 text-gray-700">وصل حديثاً</span>
              </label>
              
              <label className="inline-flex items-center">
                <input
                  type="checkbox"
                  name="sale"
                  onChange={formik.handleChange}
                  checked={formik.values.sale}
                  className="form-checkbox h-5 w-5 text-primary rounded"
                />
                <span className="mr-2 text-gray-700">عرض خاص</span>
              </label>
            </div>
          </div>
          
          {/* وصف المنتج */}
          <div className="mb-6">
            <label 
              htmlFor="description" 
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              وصف المنتج
            </label>
            <textarea
              id="edit-description"
              name="description"
              rows="4"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.description}
              className={`w-full px-3 py-2 border rounded-md ${
                formik.touched.description && formik.errors.description 
                  ? 'border-red-500 focus:ring-red-500 focus:border-red-500' 
                  : 'border-gray-300 focus:ring-primary focus:border-primary'
              }`}
            ></textarea>
            {formik.touched.description && formik.errors.description && (
              <p className="mt-1 text-sm text-red-500">{formik.errors.description}</p>
            )}
          </div>
          
          {/* رفع الصور */}
          <div className="mb-6">
            <span className="block text-sm font-medium text-gray-700 mb-2">
              صور المنتج
            </span>
            
            <div className="mt-1 flex flex-wrap gap-4 mb-4">
              {uploadedImages.map((image) => (
                <div 
                  key={image.id}
                  className="relative group"
                >
                  <img 
                    src={image.url} 
                    alt="Product preview" 
                    className="w-24 h-24 object-cover rounded-md border border-gray-300"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(image.id)}
                    className="absolute -top-2 -right-2 bg-white rounded-full border border-gray-300 p-1 shadow-sm opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <XCircleIcon className="w-4 h-4 text-red-500" />
                  </button>
                </div>
              ))}
              
              <label className="w-24 h-24 flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-md cursor-pointer hover:border-primary transition-colors">
                <ArrowUpTrayIcon className="w-6 h-6 text-gray-400" />
                <span className="mt-1 text-xs text-gray-500">إضافة صورة</span>
                <input 
                  type="file" 
                  className="hidden" 
                  onChange={handleImageUpload} 
                  accept="image/*"
                  multiple
                />
              </label>
            </div>
            
            {uploadedImages.length === 0 && (
              <p className="text-sm text-amber-500">
                يرجى رفع صورة واحدة على الأقل للمنتج
              </p>
            )}
          </div>
          
          <div className="flex justify-end space-x-4 space-x-reverse mt-6">
            <button
              type="button"
              onClick={() => navigate('/dashboard/products')}
              className="px-4 py-2 bg-gray-100 text-gray-800 rounded-md hover:bg-gray-200 transition-colors"
            >
              إلغاء
            </button>
            
            <button
              type="submit"
              disabled={isSaving || uploadedImages.length === 0}
              className={`px-6 py-2 bg-primary text-white rounded-md hover:bg-primary-dark transition-colors flex items-center ${
                (isSaving || uploadedImages.length === 0) ? 'opacity-70 cursor-not-allowed' : ''
              }`}
            >
              {isSaving ? (
                <>
                  <Spinner size="sm" className="mr-2" />
                  <span>جاري الحفظ...</span>
                </>
              ) : (
                <>
                  <CheckCircleIcon className="w-5 h-5 mr-1" />
                  <span>حفظ التغييرات</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProduct; 