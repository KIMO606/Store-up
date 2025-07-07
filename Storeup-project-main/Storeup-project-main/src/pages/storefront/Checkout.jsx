import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ChevronRightIcon } from '@heroicons/react/24/outline';

const ReceiptPopup = ({ orderNumber, formData, cart, total, onClose, onPrint }) => (
  <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
    <div className="bg-white rounded-lg shadow-lg w-full max-w-lg p-8 relative animate-fade-in">
      <button
        onClick={onClose}
        className="absolute top-3 left-3 text-gray-500 hover:text-gray-700 text-xl font-bold"
        aria-label="إغلاق الإيصال"
      >
        ×
      </button>
      <h2 className="text-2xl font-bold text-center mb-4 text-green-700">إيصال الطلب</h2>
      <div className="mb-4">
        <div className="flex justify-between mb-2">
          <span className="text-gray-600">رقم الطلب:</span>
          <span className="font-semibold">{orderNumber}</span>
        </div>
        <div className="flex justify-between mb-2">
          <span className="text-gray-600">اسم العميل:</span>
          <span>{formData.fullName}</span>
        </div>
        <div className="flex justify-between mb-2">
          <span className="text-gray-600">البريد الإلكتروني:</span>
          <span>{formData.email}</span>
        </div>
        <div className="flex justify-between mb-2">
          <span className="text-gray-600">رقم الجوال:</span>
          <span>{formData.phone}</span>
        </div>
        <div className="flex justify-between mb-2">
          <span className="text-gray-600">العنوان:</span>
          <span>{formData.address}, {formData.city}, {formData.country}</span>
        </div>
        <div className="flex justify-between mb-2">
          <span className="text-gray-600">طريقة الدفع:</span>
          <span>{formData.paymentMethod === 'creditCard' ? 'بطاقة ائتمان' : 'الدفع عند الاستلام'}</span>
        </div>
      </div>
      <div className="mb-4">
        <h3 className="font-semibold mb-2">المنتجات:</h3>
        <ul className="divide-y divide-gray-200">
          {cart.map((item) => (
            <li key={item.id} className="py-2 flex justify-between text-sm">
              <span>{item.name} × {item.quantity}</span>
              <span>{((item.salePrice || item.price) * item.quantity).toFixed(2)} ج.م</span>
            </li>
          ))}
        </ul>
      </div>
      <div className="flex justify-between text-lg font-bold border-t pt-4 mb-4">
        <span>الإجمالي:</span>
        <span>{total.toFixed(2)} ج.م</span>
      </div>
      <div className="flex gap-4 justify-center">
        <button
          onClick={onPrint}
          className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          طباعة الإيصال
        </button>
        <button
          onClick={onClose}
          className="px-6 py-2 border border-gray-300 text-gray-700 rounded hover:bg-gray-50"
        >
          إغلاق
        </button>
      </div>
    </div>
  </div>
);

const Checkout = ({ cart, clearCart }) => {
  const { storeId } = useParams();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    postalCode: '',
    country: 'مصر',
    paymentMethod: 'creditCard',
    cardNumber: '',
    cardExpiry: '',
    cardCVC: '',
  });
  const [errors, setErrors] = useState({});
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderNumber, setOrderNumber] = useState('');
  const [processing, setProcessing] = useState(false);
  const [showReceipt, setShowReceipt] = useState(false);

  // حساب إجمالي السلة
  const subtotal = cart.reduce(
    (total, item) => total + (parseFloat(item.salePrice) || parseFloat(item.price)) * item.quantity,
    0
  );
  const shippingCost = subtotal > 0 ? 15 : 0;
  const tax = subtotal * 0.14; // 14% ضريبة القيمة المضافة في مصر
  const total = subtotal + shippingCost + tax;

  // التعامل مع تغييرات النموذج
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    // إزالة الخطأ عند الكتابة
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: '',
      });
    }
  };

  // التحقق من صحة النموذج
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.fullName.trim()) newErrors.fullName = 'الاسم الكامل مطلوب';
    
    if (!formData.email.trim()) {
      newErrors.email = 'البريد الإلكتروني مطلوب';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'البريد الإلكتروني غير صالح';
    }
    
    if (!formData.phone.trim()) {
      newErrors.phone = 'رقم الهاتف مطلوب';
    } else if (!/^\d{9,15}$/.test(formData.phone.replace(/[+\s]/g, ''))) {
      newErrors.phone = 'رقم الهاتف غير صالح';
    }
    
    if (!formData.address.trim()) newErrors.address = 'العنوان مطلوب';
    if (!formData.city.trim()) newErrors.city = 'المدينة مطلوبة';
    if (!formData.postalCode.trim()) newErrors.postalCode = 'الرمز البريدي مطلوب';
    
    if (formData.paymentMethod === 'creditCard') {
      if (!formData.cardNumber.trim()) newErrors.cardNumber = 'رقم البطاقة مطلوب';
      if (!formData.cardExpiry.trim()) newErrors.cardExpiry = 'تاريخ الانتهاء مطلوب';
      if (!formData.cardCVC.trim()) newErrors.cardCVC = 'رمز الأمان مطلوب';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // تقديم الطلب
  const handleSubmit = (e) => {
    e.preventDefault();

    if (typeof clearCart !== 'function') {
      alert('حدث خطأ: لم يتم تمرير دالة clearCart بشكل صحيح من المكون الأب.');
      return;
    }

    if (!validateForm()) return;

    setProcessing(true);

    // حفظ نسخة من بيانات السلة الحالية قبل التفريغ
    const cartSnapshot = [...cart];
    const formDataSnapshot = { ...formData };
    const totalSnapshot = total;

    setTimeout(() => {
      const randomOrderNumber = `ECO-${Math.floor(100000 + Math.random() * 900000)}`;
      setOrderNumber(randomOrderNumber);
      setOrderPlaced(true);
      setProcessing(false);
      setShowReceipt({
        cart: cartSnapshot,
        formData: formDataSnapshot,
        total: totalSnapshot,
        orderNumber: randomOrderNumber
      });
      clearCart();
    }, 1000);
  };

  // إذا كانت السلة فارغة وليس في صفحة نجاح الطلب
  if (cart.length === 0 && !orderPlaced) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <div className="flex flex-col items-center">
            <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-gray-700 mb-2">السلة فارغة</h2>
            <p className="text-gray-500 mb-6">يرجى إضافة منتجات إلى السلة قبل إتمام الطلب</p>
            <Link
              to={`/store/${storeId}`}
              className="px-6 py-3 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition duration-300"
            >
              العودة للتسوق
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // عرض تأكيد الطلب
  if (orderPlaced && showReceipt) {
    return (
      <ReceiptPopup
        orderNumber={showReceipt.orderNumber}
        formData={showReceipt.formData}
        cart={showReceipt.cart}
        total={showReceipt.total}
        onClose={() => setShowReceipt(false)}
        onPrint={() => window.print()}
      />
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="mb-6">
        <nav className="flex" aria-label="Breadcrumb">
          <ol className="inline-flex items-center space-x-1 rtl:space-x-reverse">
            <li className="inline-flex items-center">
              <Link to={`/store/${storeId}`} className="text-gray-600 hover:text-gray-900">
                الرئيسية
              </Link>
            </li>
            <li>
              <div className="flex items-center">
                <ChevronRightIcon className="h-4 w-4 text-gray-400 mx-1" />
                <Link to={`/store/${storeId}/cart`} className="text-gray-600 hover:text-gray-900">
                  سلة التسوق
                </Link>
              </div>
            </li>
            <li>
              <div className="flex items-center">
                <ChevronRightIcon className="h-4 w-4 text-gray-400 mx-1" />
                <span className="text-gray-800 font-medium">إتمام الطلب</span>
              </div>
            </li>
          </ol>
        </nav>
      </div>

      <h1 className="text-2xl font-bold mb-8 text-gray-800">إتمام الطلب</h1>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* نموذج إتمام الطلب */}
        <div className="lg:w-2/3">
          <form onSubmit={handleSubmit}>
            <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
              <div className="p-6">
                <h2 className="text-lg font-medium text-gray-900 mb-4">معلومات العميل</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">
                      الاسم الكامل <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="fullName"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleChange}
                      className={`mt-1 block w-full rounded-md border ${
                        errors.fullName ? 'border-red-500' : 'border-gray-300'
                      } shadow-sm px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                      autoComplete="name"
                    />
                    {errors.fullName && <p className="mt-1 text-sm text-red-600">{errors.fullName}</p>}
                  </div>
                  
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                      البريد الإلكتروني <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className={`mt-1 block w-full rounded-md border ${
                        errors.email ? 'border-red-500' : 'border-gray-300'
                      } shadow-sm px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                      autoComplete="email"
                    />
                    {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
                  </div>
                  
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                      رقم الجوال <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className={`mt-1 block w-full rounded-md border ${
                        errors.phone ? 'border-red-500' : 'border-gray-300'
                      } shadow-sm px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                      autoComplete="tel"
                    />
                    {errors.phone && <p className="mt-1 text-sm text-red-600">{errors.phone}</p>}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
              <div className="p-6">
                <h2 className="text-lg font-medium text-gray-900 mb-4">عنوان الشحن</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
                    <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                      العنوان <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="address"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      className={`mt-1 block w-full rounded-md border ${
                        errors.address ? 'border-red-500' : 'border-gray-300'
                      } shadow-sm px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                      autoComplete="street-address"
                    />
                    {errors.address && <p className="mt-1 text-sm text-red-600">{errors.address}</p>}
                  </div>
                  
                  <div>
                    <label htmlFor="city" className="block text-sm font-medium text-gray-700">
                      المحافظة <span className="text-red-500">*</span>
                    </label>
                    <select
                      id="city"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      className={`mt-1 block w-full rounded-md border ${
                        errors.city ? 'border-red-500' : 'border-gray-300'
                      } shadow-sm px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                    >
                      <option value="">اختر المحافظة</option>
                      <option value="القاهرة">القاهرة</option>
                      <option value="الجيزة">الجيزة</option>
                      <option value="الإسكندرية">الإسكندرية</option>
                      <option value="الدقهلية">الدقهلية</option>
                      <option value="البحر الأحمر">البحر الأحمر</option>
                      <option value="البحيرة">البحيرة</option>
                      <option value="الفيوم">الفيوم</option>
                      <option value="الغربية">الغربية</option>
                      <option value="الإسماعيلية">الإسماعيلية</option>
                      <option value="المنوفية">المنوفية</option>
                      <option value="المنيا">المنيا</option>
                      <option value="القليوبية">القليوبية</option>
                      <option value="الوادي الجديد">الوادي الجديد</option>
                      <option value="السويس">السويس</option>
                      <option value="اسوان">أسوان</option>
                      <option value="اسيوط">أسيوط</option>
                      <option value="بني سويف">بني سويف</option>
                      <option value="بورسعيد">بورسعيد</option>
                      <option value="دمياط">دمياط</option>
                      <option value="الشرقية">الشرقية</option>
                      <option value="جنوب سيناء">جنوب سيناء</option>
                      <option value="كفر الشيخ">كفر الشيخ</option>
                      <option value="مطروح">مطروح</option>
                      <option value="الأقصر">الأقصر</option>
                      <option value="قنا">قنا</option>
                      <option value="شمال سيناء">شمال سيناء</option>
                      <option value="سوهاج">سوهاج</option>
                    </select>
                    {errors.city && <p className="mt-1 text-sm text-red-600">{errors.city}</p>}
                  </div>

                  <div>
                    <label htmlFor="country" className="block text-sm font-medium text-gray-700">
                      الدولة <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="country"
                      name="country"
                      value="مصر"
                      readOnly
                      className="mt-1 block w-full rounded-md border border-gray-300 bg-gray-100 shadow-sm px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    />
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
              <div className="p-6">
                <h2 className="text-lg font-medium text-gray-900 mb-4">طريقة الدفع</h2>
                
                <div className="space-y-4">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="creditCard"
                      checked={formData.paymentMethod === 'creditCard'}
                      onChange={handleChange}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                    />
                    <span className="mr-2">بطاقة ائتمان</span>
                  </label>
                  
                  {formData.paymentMethod === 'creditCard' && (
                    <div className="mt-4 border rounded-md p-4 bg-gray-50">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="md:col-span-2">
                          <label htmlFor="cardNumber" className="block text-sm font-medium text-gray-700">
                            رقم البطاقة <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            id="cardNumber"
                            name="cardNumber"
                            placeholder="0000 0000 0000 0000"
                            value={formData.cardNumber}
                            onChange={handleChange}
                            className={`mt-1 block w-full rounded-md border ${
                              errors.cardNumber ? 'border-red-500' : 'border-gray-300'
                            } shadow-sm px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                            autoComplete="cc-number"
                          />
                          {errors.cardNumber && <p className="mt-1 text-sm text-red-600">{errors.cardNumber}</p>}
                        </div>
                        
                        <div>
                          <label htmlFor="cardExpiry" className="block text-sm font-medium text-gray-700">
                            تاريخ الانتهاء <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            id="cardExpiry"
                            name="cardExpiry"
                            placeholder="MM/YY"
                            value={formData.cardExpiry}
                            onChange={handleChange}
                            className={`mt-1 block w-full rounded-md border ${
                              errors.cardExpiry ? 'border-red-500' : 'border-gray-300'
                            } shadow-sm px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                            autoComplete="cc-exp"
                          />
                          {errors.cardExpiry && <p className="mt-1 text-sm text-red-600">{errors.cardExpiry}</p>}
                        </div>
                        
                        <div>
                          <label htmlFor="cardCVC" className="block text-sm font-medium text-gray-700">
                            رمز الأمان <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            id="cardCVC"
                            name="cardCVC"
                            placeholder="CVC"
                            value={formData.cardCVC}
                            onChange={handleChange}
                            className={`mt-1 block w-full rounded-md border ${
                              errors.cardCVC ? 'border-red-500' : 'border-gray-300'
                            } shadow-sm px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                            autoComplete="cc-csc"
                          />
                          {errors.cardCVC && <p className="mt-1 text-sm text-red-600">{errors.cardCVC}</p>}
                        </div>
                      </div>
                    </div>
                  )}
                  
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="cod"
                      checked={formData.paymentMethod === 'cod'}
                      onChange={handleChange}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                    />
                    <span className="mr-2">الدفع عند الاستلام</span>
                  </label>
                </div>
              </div>
            </div>
            
            <div className="flex justify-end mt-6">
              <button
                type="submit"
                disabled={processing || Object.keys(errors).length > 0}
                className={`px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                  processing ? 'opacity-70 cursor-not-allowed' : ''
                }`}
              >
                {processing ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    جاري المعالجة...
                  </span>
                ) : (
                  'تأكيد الطلب'
                )}
              </button>
            </div>
          </form>
        </div>
        
        {/* ملخص الطلب */}
        <div className="lg:w-1/3">
          <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
            <h2 className="text-lg font-medium text-gray-900 mb-4">ملخص الطلب</h2>
            
            <div className="flow-root">
              <ul className="divide-y divide-gray-200">
                {cart.map((item) => (
                  <li key={item.id} className="py-3 flex">
                    <div className="flex-shrink-0 w-16 h-16 rounded-md overflow-hidden">
                      <img
                        src={
                          // Try multiple image sources in order of preference
                          (item.images && item.images.length > 0 && item.images[0].image_url) || // Try ProductImage's image_url first
                          item.image_url || // Then try Product's image_url
                          (item.images && item.images.length > 0 && item.images[0].image) || // Then try ProductImage's image
                          item.image || // Then try Product's image
                          // Finally fall back to placeholder
                          'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTUwIiBoZWlnaHQ9IjE1MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTUwIiBoZWlnaHQ9IjE1MCIgZmlsbD0iI2VlZSIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTQiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIiBmaWxsPSIjYWFhIj5ObyBJbWFnZTwvdGV4dD48L3N2Zz4='
                        }
                        alt={item.name || 'Product image'}
                        className="w-full h-full object-center object-cover"
                        onError={(e) => {
                          console.log('Image failed to load:', e.target.src);
                          e.target.onerror = null; // Prevent infinite loop
                          e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTUwIiBoZWlnaHQ9IjE1MCIgeG1zbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTUwIiBoZWlnaHQ9IjE1MCIgZmlsbD0iI2VlZSIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTQiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIiBmaWxsPSIjYWFhIj5ObyBJbWFnZTwvdGV4dD48L3N2Zz4=';
                        }}
                      />
                    </div>
                    <div className="flex-1 mr-4 flex flex-col">
                      <div>
                        <div className="flex justify-between text-sm font-medium text-gray-900">
                          <h3>{item.name}</h3>
                          <p className="mr-2">
                            {((item.salePrice || item.price) * item.quantity).toFixed(2)} ر.س
                          </p>
                        </div>
                        <p className="mt-1 text-sm text-gray-500">
                          الكمية: {item.quantity}
                        </p>
                        <p className="mt-1 text-sm text-gray-900">
                          السعر: {item.salePrice ? (
                            <span>
                              <span className="text-red-600">{parseFloat(item.salePrice).toFixed(2)} ج.م</span>{' '}
                              <span className="text-gray-500 line-through text-sm">
                                {parseFloat(item.price).toFixed(2)} ج.م
                              </span>
                            </span>
                          ) : (
                            <span>{parseFloat(item.price).toFixed(2)} ج.م</span>
                          )}
                        </p>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="border-t border-gray-200 pt-4 mt-4">
              <div className="flex justify-between text-sm text-gray-600 mb-2">
                <p>المجموع الفرعي</p>
                <p>{parseFloat(subtotal).toFixed(2)} ج.م</p>
              </div>
              <div className="flex justify-between text-sm text-gray-600 mb-2">
                <p>الشحن</p>
                <p>{parseFloat(shippingCost).toFixed(2)} ج.م</p>
              </div>
              <div className="flex justify-between text-sm text-gray-600 mb-2">
                <p>الضريبة (14%)</p>
                <p>{parseFloat(tax).toFixed(2)} ج.م</p>
              </div>
              <div className="flex justify-between text-base font-medium text-gray-900">
                <p>الإجمالي</p>
                <p>{parseFloat(total).toFixed(2)} ج.م</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;