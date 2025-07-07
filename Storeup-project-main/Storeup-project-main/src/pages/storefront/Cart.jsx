import React, { useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { XMarkIcon, MinusIcon, PlusIcon, ArrowLeftIcon } from '@heroicons/react/24/outline';

const Cart = ({ cart, updateCartItemQuantity, removeFromCart, clearCart }) => {
  const { storeId } = useParams();
  const navigate = useNavigate();
  const [couponCode, setCouponCode] = useState('');
  const [couponError, setCouponError] = useState('');
  const [couponSuccess, setCouponSuccess] = useState('');

  // حساب المجموع الفرعي
  const subtotal = cart.reduce(
    (total, item) => total + (parseFloat(item.salePrice) || parseFloat(item.price)) * item.quantity,
    0
  );

  // تطبيق الخصم (وهمي للعرض فقط)
  const [discount, setDiscount] = useState(0);

  // رسوم الشحن (وهمية)
  const shippingCost = subtotal > 0 ? 15 : 0;

  // حساب الضريبة
  const tax = subtotal * 0.14; // 14% ضريبة القيمة المضافة في مصر

  // إجمالي السلة
  const total = subtotal + shippingCost + tax - discount;

  // التعامل مع إدخال كوبون الخصم
  const handleApplyCoupon = (e) => {
    e.preventDefault();
    
    // محاكاة التحقق من الكوبون (في تطبيق حقيقي، سيتم التحقق من الخادم)
    if (couponCode.toLowerCase() === 'discount20') {
      const newDiscount = subtotal * 0.2; // خصم 20%
      setDiscount(newDiscount);
      setCouponSuccess('تم تطبيق الخصم: 20%');
      setCouponError('');
    } else if (couponCode.toLowerCase() === 'free-shipping') {
      setDiscount(shippingCost);
      setCouponSuccess('تم تطبيق شحن مجاني!');
      setCouponError('');
    } else {
      setCouponError('كود الخصم غير صالح');
      setCouponSuccess('');
    }
  };

  // إذا كانت السلة فارغة
  if (cart.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <h1 className="text-2xl font-bold mb-8 text-gray-800">سلة التسوق</h1>
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <div className="flex flex-col items-center">
            <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-gray-700 mb-2">سلة التسوق فارغة</h2>
            <p className="text-gray-500 mb-6">لم تقم بإضافة أية منتجات إلى سلة التسوق بعد</p>
            <Link
              to={`/store/${storeId}`}
              className="px-6 py-3 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition duration-300"
            >
              تصفح المنتجات
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <h1 className="text-2xl font-bold mb-8 text-gray-800">سلة التسوق</h1>
      <div className="flex flex-col lg:flex-row gap-8">
        {/* قائمة المنتجات */}
        <div className="lg:w-2/3">
          <div className="bg-white rounded-lg shadow-md overflow-hidden mb-4">
            <div className="p-6">
              <div className="flow-root">
                <ul className="-my-6 divide-y divide-gray-200">
                  {cart.map((item) => (
                    <li key={item.id} className="py-6 flex">
                      <div className="flex-shrink-0 w-24 h-24 rounded-md overflow-hidden">
                        <img
                          src={
                            (item.images && Array.isArray(item.images) && item.images.length > 0 && item.images[0]?.image_url) ||
                            item.image_url ||
                            'https://placehold.co/150x150?text=صورة+المنتج'
                          }
                          alt={item.name}
                          className="w-full h-full object-center object-cover"
                          onError={(e) => {
                            e.target.src = 'https://placehold.co/150x150?text=صورة+المنتج';
                          }}
                        />
                      </div>

                      <div className="flex-1 mr-4 flex flex-col">
                        <div>
                          <div className="flex justify-between text-base font-medium text-gray-900">
                            <h3>
                              <Link to={`/store/${storeId}/products/${item.id}`}>
                                {item.name}
                              </Link>
                            </h3>
                            <p className="mr-4 text-base font-medium">
                              {item.salePrice ? (
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
                          {item.color && <p className="mt-1 text-sm text-gray-500">اللون: {item.color}</p>}
                          {item.size && <p className="mt-1 text-sm text-gray-500">الحجم: {item.size}</p>}
                        </div>
                        <div className="flex-1 flex items-end justify-between">
                          <div className="flex items-center border border-gray-300 rounded">
                            <button
                              type="button"
                              className="p-1 text-gray-600 hover:text-gray-900"
                              onClick={() => updateCartItemQuantity(item.id, item.quantity - 1)}
                            >
                              <MinusIcon className="h-4 w-4" />
                            </button>
                            <input
                              type="text"
                              id={`quantity-${item.id}`}
                              name={`quantity-${item.id}`}
                              className="w-10 text-center border-transparent focus:border-transparent focus:ring-0 bg-white"
                              value={item.quantity}
                              readOnly
                            />
                            <button
                              type="button"
                              className="p-1 text-gray-600 hover:text-gray-900"
                              onClick={() => updateCartItemQuantity(item.id, item.quantity + 1)}
                            >
                              <PlusIcon className="h-4 w-4" />
                            </button>
                          </div>
                          <div className="flex">
                            <button
                              type="button"
                              className="text-red-600 hover:text-red-800"
                              onClick={() => removeFromCart(item.id)}
                            >
                              <XMarkIcon className="h-5 w-5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
              <div className="flex justify-between">
                <button
                  type="button"
                  className="text-blue-600 hover:text-blue-800 flex items-center"
                  onClick={() => navigate(`/store/${storeId}`)}
                >
                  <ArrowLeftIcon className="h-4 w-4 ml-1" />
                  متابعة التسوق
                </button>
                <button
                  type="button"
                  className="text-red-600 hover:text-red-800"
                  onClick={clearCart}
                >
                  إفراغ السلة
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* ملخص السلة */}
        <div className="lg:w-1/3">
          <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
            <h2 className="text-lg font-medium text-gray-900 mb-4">ملخص الطلب</h2>
            <div className="flow-root">
              <dl className="space-y-4">
                <div className="flex justify-between">
                  <dt className="text-gray-600">المجموع الفرعي</dt>
                  <dd className="text-gray-900">{parseFloat(subtotal).toFixed(2)} ج.م</dd>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between">
                    <dt className="text-gray-600">الخصم</dt>
                    <dd className="text-green-600">- {parseFloat(discount).toFixed(2)} ج.م</dd>
                  </div>
                )}
                <div className="flex justify-between">
                  <dt className="text-gray-600">الشحن</dt>
                  <dd className="text-gray-900">{parseFloat(shippingCost).toFixed(2)} ج.م</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-gray-600">الضريبة (14%)</dt>
                  <dd className="text-gray-900">{parseFloat(tax).toFixed(2)} ج.م</dd>
                </div>
                <div className="flex justify-between border-t border-gray-200 pt-4 mt-4">
                  <dt className="text-lg font-medium text-gray-900">الإجمالي</dt>
                  <dd className="text-lg font-medium text-gray-900">{parseFloat(total).toFixed(2)} ج.م</dd>
                </div>
              </dl>
            </div>
            
            {/* نموذج الكوبون */}
            <div className="mt-6">
              <form onSubmit={handleApplyCoupon} className="flex">
                <input
                  type="text"
                  id="coupon-code"
                  name="coupon-code"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  className="flex-1 min-w-0 block px-3 py-2  bg-white rounded-r-md border border-gray-300 shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
                  placeholder="كود الخصم"
                />
                <button
                  type="submit"
                  className="inline-flex justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-l-md text-white bg-blue-600 hover:bg-blue-700"
                >
                  تطبيق
                </button>
              </form>
              {couponError && <p className="mt-2 text-sm text-red-600">{couponError}</p>}
              {couponSuccess && <p className="mt-2 text-sm text-green-600">{couponSuccess}</p>}
            </div>
            
            <div className="mt-6">
              <Link
                to={`/store/${storeId}/checkout`}
                className="w-full flex justify-center items-center px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                متابعة الشراء
              </Link>
            </div>
            
            <div className="mt-6 text-center text-sm text-gray-500">
              <p>الأسعار تشمل ضريبة القيمة المضافة</p>
              <div className="flex justify-center space-x-4 mt-4">
                <img src="https://placehold.co/40x25?text=Visa" alt="Visa" className="h-6" />
                <img src="https://placehold.co/40x25?text=Mastercard" alt="Mastercard" className="h-6" />
                <img src="https://placehold.co/40x25?text=Apple+Pay" alt="Apple Pay" className="h-6" />
                <img src="https://placehold.co/40x25?text=mada" alt="mada" className="h-6" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart; 