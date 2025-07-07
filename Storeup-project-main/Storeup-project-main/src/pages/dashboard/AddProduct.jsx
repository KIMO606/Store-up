import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { createProduct } from '../../features/products/productsSlice';
import {
  PhotoIcon,
  ArrowPathIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';

const AddProduct = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { categories, loading } = useSelector((state) => state.products);
  const { currentStore } = useSelector((state) => state.store);
  const [images, setImages] = useState([]);
  const [previewImages, setPreviewImages] = useState([]);
  
  // تحقق Yup للنموذج
  const validationSchema = Yup.object({
    name: Yup.string().required('اسم المنتج مطلوب'),
    description: Yup.string().required('وصف المنتج مطلوب'),
    price: Yup.number().positive('السعر يجب أن يكون أكبر من صفر').required('السعر مطلوب'),
    salePrice: Yup.number().nullable().positive('سعر العرض يجب أن يكون أكبر من صفر'),
    categoryId: Yup.string().required('تصنيف المنتج مطلوب'),
    stock: Yup.number().integer('الكمية يجب أن تكون رقم صحيح').min(0, 'الكمية لا تقل عن صفر').required('الكمية المتوفرة مطلوبة'),
  });
  
  // معالجة تحميل الصور
  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    setImages([...images, ...files]);
    
    // إنشاء عناوين URL مؤقتة للصور المحملة للعرض
    const newPreviewImages = files.map((file) => URL.createObjectURL(file));
    setPreviewImages([...previewImages, ...newPreviewImages]);
    
    console.log("تم تحميل الصور:", files);
  };
  
  // إزالة صورة
  const removeImage = (index) => {
    const newImages = [...images];
    newImages.splice(index, 1);
    setImages(newImages);
    
    const newPreviewImages = [...previewImages];
    // تحرير عنوان URL المؤقت عند إزالة الصورة
    URL.revokeObjectURL(newPreviewImages[index]);
    newPreviewImages.splice(index, 1);
    setPreviewImages(newPreviewImages);
  };
  
  // تنسيق الخانة للأرقام فقط
  const formatNumberInput = (e) => {
    // إزالة أي حرف ليس رقم أو نقطة عشرية
    e.target.value = e.target.value.replace(/[^0-9.]/g, '');
  };
  
  // إعداد Formik
  const formik = useFormik({
    initialValues: {
      name: '',
      description: '',
      price: '',
      salePrice: '',
      categoryId: '',
      stock: '',
      featured: false,
      newArrival: true,
      sale: false,
    },
    validationSchema,
    onSubmit: (values) => {
      // تجهيز بيانات المنتج للإرسال
      const formData = new FormData();
      
      // إضافة البيانات الأساسية
      formData.append('name', values.name);
      formData.append('description', values.description);
      formData.append('price', Number(values.price));
      formData.append('sale_price', values.salePrice ? Number(values.salePrice) : '');
      formData.append('stock', Number(values.stock));
      formData.append('category', parseInt(values.categoryId));
      formData.append('featured', values.featured);
      formData.append('new_arrival', values.newArrival);
      formData.append('sale', values.sale);
      
      // إضافة الصورة الرئيسية
      if (images.length > 0) {
        formData.append('image', images[0]);
      }
      
      // إضافة الصور الإضافية
      if (images.length > 1) {
        images.slice(1).forEach((img) => {
          formData.append('images', img);
        });
      }
      
      console.log('بيانات المنتج المرسلة:', {
        name: values.name,
        description: values.description,
        price: values.price,
        sale_price: values.salePrice,
        category: values.categoryId,
        stock: values.stock,
        featured: values.featured,
        new_arrival: values.newArrival,
        sale: values.sale,
        image: images.length > 0 ? 'Image attached' : 'No image',
        extra_images: images.length > 1 ? `${images.length - 1} extra images` : 'No extra images'
      });
      
      dispatch(createProduct(formData))
        .unwrap()
        .then(() => {
          navigate('/dashboard/products');
        })
        .catch((error) => {
          console.error('خطأ في إضافة المنتج:', error);
        });
    },
  });
  
  return (
    <div className="max-w-3xl mx-auto">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">إضافة منتج جديد</h1>
        
        <form onSubmit={formik.handleSubmit} className="space-y-6">
          {/* اسم المنتج */}
          <div>
            <label htmlFor="product-name" className="block text-sm font-medium text-gray-700 mb-1">
              اسم المنتج <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="product-name"
              name="name"
              className={`block w-full rounded-md border bg-slate-50 ${
                formik.touched.name && formik.errors.name ? 'border-red-500' : 'border-gray-300'
              } shadow-sm p-2 focus:border-primary-500 focus:ring-primary-500`}
              value={formik.values.name}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.name && formik.errors.name && (
              <p className="mt-1 text-sm text-red-500">{formik.errors.name}</p>
            )}
          </div>
          
          {/* وصف المنتج */}
          <div>
            <label htmlFor="product-description" className="block text-sm font-medium  text-gray-700 mb-1">
              وصف المنتج <span className="text-red-500">*</span>
            </label>
            <textarea
              id="product-description"
              name="description"
              rows="4"
              className={`block w-full rounded-md border bg-slate-50 ${
                formik.touched.description && formik.errors.description
                  ? 'border-red-500'
                  : 'border-gray-300'
              } shadow-sm p-2 focus:border-primary-500 focus:ring-primary-500`}
              value={formik.values.description}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            ></textarea>
            {formik.touched.description && formik.errors.description && (
              <p className="mt-1 text-sm text-red-500">{formik.errors.description}</p>
            )}
          </div>
          
          {/* السعر والخصم */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="product-price" className="block text-sm font-medium text-gray-700 mb-1">
                السعر (ج.م) <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="product-price"
                name="price"
                className={`block w-full rounded-md border bg-slate-50 ${
                  formik.touched.price && formik.errors.price ? 'border-red-500' : 'border-gray-300'
                } shadow-sm p-2 focus:border-primary-500 focus:ring-primary-500`}
                value={formik.values.price}
                onChange={formik.handleChange}
                onInput={formatNumberInput}
                onBlur={formik.handleBlur}
              />
              {formik.touched.price && formik.errors.price && (
                <p className="mt-1 text-sm text-red-500">{formik.errors.price}</p>
              )}
            </div>
            
            <div>
              <label htmlFor="product-sale-price" className="block text-sm font-medium text-gray-700 mb-1">
                سعر العرض (ج.م)
              </label>
              <input
                type="text"
                id="product-sale-price"
                name="salePrice"
                className={`block w-full rounded-md border bg-slate-50 ${
                  formik.touched.salePrice && formik.errors.salePrice
                    ? 'border-red-500'
                    : 'border-gray-300'
                } shadow-sm p-2 focus:border-primary-500 focus:ring-primary-500`}
                value={formik.values.salePrice}
                onChange={formik.handleChange}
                onInput={formatNumberInput}
                onBlur={formik.handleBlur}
              />
              {formik.touched.salePrice && formik.errors.salePrice && (
                <p className="mt-1 text-sm text-red-500">{formik.errors.salePrice}</p>
              )}
            </div>
          </div>
          
          {/* التصنيف والكمية */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="product-category" className="block text-sm font-medium text-gray-700 mb-1">
                تصنيف المنتج <span className="text-red-500">*</span>
              </label>
              <select
                id="product-category"
                name="categoryId"
                className={`block w-full rounded-md border bg-slate-50 ${
                  formik.touched.categoryId && formik.errors.categoryId
                    ? 'border-red-500'
                    : 'border-gray-300'
                } shadow-sm p-2 focus:border-primary-500 focus:ring-primary-500`}
                value={formik.values.categoryId}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              >
                <option value="" disabled>
                  اختر تصنيف
                </option>
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
            
            <div>
              <label htmlFor="product-stock" className="block text-sm font-medium text-gray-700 mb-1">
                الكمية المتوفرة <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="product-stock"
                name="stock"
                className={`block w-full rounded-md border bg-slate-50 ${
                  formik.touched.stock && formik.errors.stock ? 'border-red-500' : 'border-gray-300'
                } shadow-sm p-2 focus:border-primary-500 focus:ring-primary-500`}
                value={formik.values.stock}
                onChange={formik.handleChange}
                onInput={(e) => {
                  e.target.value = e.target.value.replace(/[^0-9]/g, '');
                }}
                onBlur={formik.handleBlur}
              />
              {formik.touched.stock && formik.errors.stock && (
                <p className="mt-1 text-sm text-red-500">{formik.errors.stock}</p>
              )}
            </div>
          </div>
          
          {/* خيارات العرض */}
          <div className="space-y-3">
            <div className="flex items-center">
              <input
                id="product-featured"
                name="featured"
                type="checkbox"
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                checked={formik.values.featured}
                onChange={formik.handleChange}
              />
              <label htmlFor="product-featured" className="mr-2 block text-sm ">
                منتج مميز
              </label>
            </div>
            
            <div className="flex items-center">
              <input
                id="product-new-arrival"
                name="newArrival"
                type="checkbox"
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded bg-slate-50"
                checked={formik.values.newArrival}
                onChange={formik.handleChange}
              />
              <label htmlFor="product-new-arrival" className="mr-2 block text-sm text-gray-900">
                وصل حديثاً
              </label>
            </div>
            
            <div className="flex items-center">
              <input
                id="product-sale"
                name="sale"
                type="checkbox"
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded bg-slate-50"
                checked={formik.values.sale}
                onChange={formik.handleChange}
              />
              <label htmlFor="product-sale" className="mr-2 block text-sm text-gray-900">
                عرض خاص
              </label>
            </div>
          </div>
          
          {/* تحميل الصور */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">صور المنتج</label>
            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
              <div className="space-y-1 text-center">
                <PhotoIcon className="mx-auto h-12 w-12 text-gray-400" />
                <div className="flex text-sm text-gray-600">
                  <label
                    htmlFor="image-upload"
                    className="relative cursor-pointer bg-white rounded-md font-medium text-primary-600 hover:text-primary-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-primary-500"
                  >
                    <span>رفع صور</span>
                    <input
                      id="image-upload"
                      name="images"
                      type="file"
                      className="sr-only"
                      multiple
                      accept="image/*"
                      onChange={handleImageUpload}
                    />
                  </label>
                  <p className="pr-1">أو سحب وإفلات</p>
                </div>
                <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
              </div>
            </div>
            
            {/* عرض الصور المختارة */}
            {previewImages.length > 0 && (
              <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
                {previewImages.map((image, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={image}
                      alt={`preview-${index}`}
                      className="h-24 w-full object-cover rounded-md"
                    />
                    <button
                      type="button"
                      className="absolute top-1 left-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => removeImage(index)}
                    >
                      <XMarkIcon className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          {/* أزرار الإجراءات */}
          <div className="flex justify-end space-x-2 rtl:space-x-reverse">
            <button
              type="button"
              className="py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              onClick={() => navigate('/dashboard/products')}
            >
              إلغاء
            </button>
            <button
              type="submit"
              disabled={loading}
              className="py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 relative"
            >
              {loading ? (
                <>
                  <ArrowPathIcon className="animate-spin h-4 w-4 mx-auto" />
                  <span className="sr-only">جاري الحفظ...</span>
                </>
              ) : (
                'حفظ المنتج'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProduct; 