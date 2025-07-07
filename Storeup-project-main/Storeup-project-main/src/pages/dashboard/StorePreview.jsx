import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { getProducts } from '../../features/products/productsSlice';
import { getStoreById } from '../../features/store/storeSlice';
import { ArrowTopRightOnSquareIcon, DevicePhoneMobileIcon, DeviceTabletIcon, ComputerDesktopIcon } from '@heroicons/react/24/outline';
import Spinner from '../../components/Spinner';

const StorePreview = () => {
  const dispatch = useDispatch();
  const { products, categories, loading: productsLoading } = useSelector((state) => state.products);
  const { currentStore, loading: storeLoading } = useSelector((state) => state.store);
  const [viewMode, setViewMode] = useState('desktop'); // desktop, tablet, mobile
  const [iframeLoading, setIframeLoading] = useState(true);
  const [selectedTab, setSelectedTab] = useState('preview'); // preview, products, categories
  const storeId = 'store123'; // في التطبيق الحقيقي، هذا سيكون مأخوذًا من المتجر الحالي

  useEffect(() => {
    // جلب بيانات المتجر والمنتجات عند تحميل الصفحة
    dispatch(getStoreById(storeId));
    dispatch(getProducts(storeId));
  }, [dispatch, storeId]);

  // مراقبة تحميل المنتجات للتشخيص
  useEffect(() => {
    if (products && products.length > 0) {
      console.log("StorePreview: Products loaded successfully:", products.length);
      console.log("First product sample:", products[0]);
    }
  }, [products]);

  const getPreviewWidth = () => {
    switch (viewMode) {
      case 'mobile':
        return 'w-[375px]';
      case 'tablet':
        return 'w-[768px]';
      case 'desktop':
      default:
        return 'w-full max-w-[1200px]';
    }
  };

  const handleIframeLoad = () => {
    setIframeLoading(false);
  };

  // تحديد رابط معاينة المتجر
  const previewUrl = `/store/${storeId}`;
  
  // تحديد ما إذا كان جاري تحميل البيانات
  const isLoading = productsLoading || storeLoading;
  
  // في حالة التحميل، عرض مؤشر التحميل
  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-20">
        <Spinner size="xl" />
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 px-4">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        {/* Enhanced Header Section */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white p-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
            <div className="mb-4 md:mb-0">
              <h1 className="text-3xl font-bold">معاينة المتجر</h1>
              {currentStore && (
                <div className="mt-2 flex items-center">
                  {currentStore.logo ? (
                    <img 
                      src={currentStore.logo} 
                      alt={currentStore.name} 
                      className="w-10 h-10 rounded-full mr-2 bg-white p-1"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-white text-blue-600 flex items-center justify-center font-bold mr-2">
                      {currentStore.name ? currentStore.name[0].toUpperCase() : 'S'}
                    </div>
                  )}
          <div>
                    <p className="font-medium">{currentStore.name}</p>
                    <p className="text-blue-100 text-sm">{currentStore.description}</p>
                  </div>
                </div>
            )}
          </div>
          
            <div className="flex flex-col sm:flex-row items-center space-y-3 sm:space-y-0 sm:space-x-4 sm:space-x-reverse">
            {/* أزرار تغيير وضع العرض */}
              <div className="flex bg-white/20 backdrop-blur-sm rounded-lg p-1 self-stretch">
              <button
                onClick={() => setViewMode('mobile')}
                  className={`p-2 rounded-md flex items-center ${viewMode === 'mobile' ? 'bg-white text-blue-600' : 'text-white hover:bg-white/10'}`}
                title="عرض جوال"
              >
                  <DevicePhoneMobileIcon className="w-5 h-5 ml-1" />
                  <span className="text-sm">جوال</span>
              </button>
              
              <button
                onClick={() => setViewMode('tablet')}
                  className={`p-2 rounded-md flex items-center ${viewMode === 'tablet' ? 'bg-white text-blue-600' : 'text-white hover:bg-white/10'}`}
                title="عرض تابلت"
              >
                  <DeviceTabletIcon className="w-5 h-5 ml-1" />
                  <span className="text-sm">تابلت</span>
              </button>
              
              <button
                onClick={() => setViewMode('desktop')}
                  className={`p-2 rounded-md flex items-center ${viewMode === 'desktop' ? 'bg-white text-blue-600' : 'text-white hover:bg-white/10'}`}
                title="عرض سطح المكتب"
              >
                  <ComputerDesktopIcon className="w-5 h-5 ml-1" />
                  <span className="text-sm">سطح المكتب</span>
              </button>
            </div>
            
            {/* زر فتح في صفحة جديدة */}
            <Link
              to={previewUrl}
              target="_blank"
              rel="noopener noreferrer"
                className="flex items-center px-4 py-2 bg-white text-blue-600 rounded-md hover:bg-blue-50 transition-colors font-medium"
            >
                <ArrowTopRightOnSquareIcon className="w-5 h-5 ml-1" />
              <span>فتح في نافذة جديدة</span>
            </Link>
            </div>
          </div>
        </div>
        
        {/* Enhanced Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 p-6">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl overflow-hidden shadow-sm relative">
            <div className="absolute top-0 right-0 p-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
            <div className="p-6">
              <p className="text-blue-700 font-semibold">إجمالي المنتجات</p>
              <p className="text-3xl font-bold mt-2 text-blue-900">{products?.length || 0}</p>
              <div className="mt-4 text-xs flex justify-between text-blue-600">
                <span>المنتجات النشطة</span>
                <span>{products?.filter(p => p.active !== false)?.length || 0}</span>
              </div>
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl overflow-hidden shadow-sm relative">
            <div className="absolute top-0 right-0 p-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
              </svg>
            </div>
            <div className="p-6">
            <p className="text-green-700 font-semibold">التصنيفات</p>
              <p className="text-3xl font-bold mt-2 text-green-900">{categories?.length || 0}</p>
              <div className="mt-4 text-xs flex justify-between text-green-600">
                <span>متوسط المنتجات لكل تصنيف</span>
                <span>{categories?.length ? (products?.length / categories.length).toFixed(1) : 0}</span>
              </div>
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl overflow-hidden shadow-sm relative">
            <div className="absolute top-0 right-0 p-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-purple-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
              </svg>
            </div>
            <div className="p-6">
            <p className="text-purple-700 font-semibold">المنتجات المميزة</p>
              <p className="text-3xl font-bold mt-2 text-purple-900">{products?.filter(p => p.featured)?.length || 0}</p>
              <div className="mt-4 text-xs flex justify-between text-purple-600">
                <span>النسبة من إجمالي المنتجات</span>
                <span>
                  {products?.length ? 
                    ((products.filter(p => p.featured)?.length / products.length) * 100).toFixed(1) + '%' 
                    : '0%'}
                </span>
              </div>
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-xl overflow-hidden shadow-sm relative">
            <div className="absolute top-0 right-0 p-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-amber-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
              </svg>
            </div>
            <div className="p-6">
            <p className="text-amber-700 font-semibold">العروض والتخفيضات</p>
              <p className="text-3xl font-bold mt-2 text-amber-900">{products?.filter(p => p.sale)?.length || 0}</p>
              <div className="mt-4 text-xs flex justify-between text-amber-600">
                <span>متوسط نسبة الخصم</span>
                <span>
                  {products?.filter(p => p.sale && p.price && p.salePrice)?.length ? 
                    ((products
                      .filter(p => p.sale && p.price && p.salePrice)
                      .reduce((acc, p) => acc + ((p.price - p.salePrice) / p.price), 0) 
                      / products.filter(p => p.sale && p.price && p.salePrice).length) * 100).toFixed(0) + '%' 
                    : '0%'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* تبويبات المعاينة المحسنة */}
        <div className="px-6">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 space-x-reverse">
              <button
                onClick={() => setSelectedTab('preview')}
                className={`relative py-4 px-3 text-sm font-medium ${
                  selectedTab === 'preview'
                    ? 'text-blue-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <span className="flex items-center space-x-2 space-x-reverse">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  <span>معاينة المتجر</span>
                </span>
                {selectedTab === 'preview' && (
                  <span className="absolute inset-x-0 bottom-0 h-0.5 bg-blue-600"></span>
                )}
              </button>
              <button
                onClick={() => setSelectedTab('products')}
                className={`relative py-4 px-3 text-sm font-medium ${
                  selectedTab === 'products'
                    ? 'text-blue-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <span className="flex items-center space-x-2 space-x-reverse">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                  <span>المنتجات</span>
                  <span className="bg-gray-100 text-gray-700 px-2 py-0.5 rounded-full text-xs">
                    {products?.length || 0}
                  </span>
                </span>
                {selectedTab === 'products' && (
                  <span className="absolute inset-x-0 bottom-0 h-0.5 bg-blue-600"></span>
                )}
              </button>
              <button
                onClick={() => setSelectedTab('categories')}
                className={`relative py-4 px-3 text-sm font-medium ${
                  selectedTab === 'categories'
                    ? 'text-blue-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <span className="flex items-center space-x-2 space-x-reverse">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                  </svg>
                  <span>التصنيفات</span>
                  <span className="bg-gray-100 text-gray-700 px-2 py-0.5 rounded-full text-xs">
                    {categories?.length || 0}
                  </span>
                </span>
                {selectedTab === 'categories' && (
                  <span className="absolute inset-x-0 bottom-0 h-0.5 bg-blue-600"></span>
                )}
              </button>
            </nav>
          </div>
        </div>
        
        {/* عرض التبويب المحدد */}
        {selectedTab === 'preview' && (
          <div className="p-6">
            <div className="bg-white rounded-lg overflow-hidden shadow-lg border border-gray-200">
              {/* تصميم متصفح محسن */}
              <div className="w-full bg-gray-100 border-b border-gray-200 flex items-center p-2">
            <div className="flex space-x-1.5 space-x-reverse">
              <div className="w-3 h-3 rounded-full bg-red-400"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
              <div className="w-3 h-3 rounded-full bg-green-400"></div>
            </div>
                <div className="flex mx-4 flex-1 bg-white rounded-md overflow-hidden border border-gray-200 h-8">
                  <div className="flex items-center px-2 bg-gray-50 border-l border-gray-200">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </div>
                  <div className="flex-1 px-2 flex items-center overflow-hidden text-xs text-gray-600">
                    {previewUrl}
                  </div>
                  <button className="p-1.5 hover:bg-gray-50">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                  </button>
                </div>
                <div className="flex space-x-1 space-x-reverse">
                  <button className="p-1.5 hover:bg-gray-200 rounded">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </button>
                  <button className="p-1.5 hover:bg-gray-200 rounded">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                  </button>
            </div>
          </div>
          
              {/* المحتوى */}
              <div className="bg-gray-100 p-3 border-b border-gray-200">
                <div 
                  className={`mx-auto transition-all duration-300 ${getPreviewWidth()} bg-white rounded-lg overflow-hidden shadow`}
                  style={{ height: '600px' }}
                >
            {iframeLoading && (
                    <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-80 z-10">
                      <div className="flex flex-col items-center">
                <Spinner size="lg" />
                        <p className="mt-2 text-gray-600">جاري تحميل المعاينة...</p>
                      </div>
              </div>
            )}
            
            <iframe
              src={previewUrl}
                    className="w-full h-full border-0"
              title="معاينة المتجر"
              onLoad={handleIframeLoad}
            ></iframe>
          </div>
        </div>
        
              {/* تحكم المعاينة */}
              <div className="bg-gray-50 p-3 flex justify-between items-center">
                <div className="flex space-x-2 space-x-reverse">
                  <button 
                    className="px-3 py-1.5 bg-white border border-gray-200 rounded text-xs font-medium text-gray-600 hover:bg-gray-50"
                    onClick={() => {
                      const iframe = document.querySelector('iframe');
                      if (iframe && iframe.contentWindow) {
                        iframe.contentWindow.location.reload();
                      }
                    }}
                  >
                    <span className="flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                      تحديث
                    </span>
                  </button>
                  
                  <select 
                    className="text-xs border border-gray-200 rounded bg-white py-1.5 px-2 text-gray-600 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                    onChange={(e) => {
                      const iframe = document.querySelector('iframe');
                      if (iframe && iframe.contentWindow) {
                        iframe.contentWindow.location.href = `/store/${storeId}/${e.target.value}`;
                      }
                    }}
                  >
                    <option value="">الصفحة الرئيسية</option>
                    <option value="products">كل المنتجات</option>
                    <option value="categories">التصنيفات</option>
                    <option value="sale">التخفيضات</option>
                    <option value="new-arrivals">وصل حديثاً</option>
                    <option value="cart">سلة التسوق</option>
                    <option value="checkout">إتمام الطلب</option>
                  </select>
                </div>
                
                <div className="text-xs text-gray-500">
                  {viewMode === 'desktop' ? 'عرض سطح المكتب' : viewMode === 'tablet' ? 'عرض جهاز لوحي' : 'عرض هاتف جوال'}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* عرض المنتجات */}
        {selectedTab === 'products' && (
          <div className="border border-gray-200 rounded-lg overflow-hidden bg-white">
            <div className="p-4 border-b border-gray-200 bg-gray-50">
              <h3 className="font-medium text-gray-700">المنتجات المعروضة في المتجر ({products?.length || 0})</h3>
            </div>
            {products && products.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
                {console.log("Rendering products grid with", products.length, "products")}
                {products.map((product, index) => {
                  // Ensure price is a valid number
                  const price = typeof product.price === 'number' && !isNaN(product.price) ? product.price : 0;
                  // Ensure salePrice is a valid number or null
                  const salePrice = typeof product.salePrice === 'number' && !isNaN(product.salePrice) ? product.salePrice : null;
                  
                  // Get product image with fallback
                  const getProductImage = () => {
                    if (product.images && Array.isArray(product.images) && product.images.length > 0) {
                      const firstImage = product.images[0];
                      if (typeof firstImage === 'string') return firstImage;
                      if (firstImage && firstImage.image_url) return firstImage.image_url;
                    }
                    if (product.image_url) return product.image_url;
                    return `https://placehold.co/300x300?text=${encodeURIComponent(product.name || 'منتج')}`;
                  };
                  
                  const discountPercentage = salePrice && price > 0
                    ? Math.round(((price - salePrice) / price) * 100)
                    : 0;
                  
                  return (
                    <div key={product.id || index} className="group relative bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 border border-gray-100">
                      <div className="relative pt-[80%] bg-gray-50 overflow-hidden">
                        {salePrice && (
                          <div className="absolute top-3 right-3 z-10 px-2.5 py-1.5 rounded-full text-xs font-bold text-white shadow-sm backdrop-blur-sm" 
                            style={{ backgroundColor: 'rgba(249, 115, 22, 0.85)' }}>
                            <span className="flex items-center">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v8m-4-4h8" />
                              </svg>
                              {discountPercentage}%
                            </span>
                          </div>
                        )}
                        <img
                          src={getProductImage()}
                          alt={product.name || 'منتج'}
                          className="absolute inset-0 h-full w-full object-contain group-hover:scale-105 transition-transform duration-300"
                          onError={(e) => {
                            console.error('Failed to load product image:', product.name);
                            e.target.onerror = null; // Prevent infinite loop
                            e.target.src = 'https://placehold.co/300x300?text=صورة+المنتج';
                          }}
                        />
                      </div>
                      <div className="p-4">
                        {/* Category tag */}
                        <div className="mb-2">
                          <span className="text-xs font-medium px-2 py-1 rounded-full bg-gray-100 text-gray-600">{product.category || 'بدون تصنيف'}</span>
                        </div>
                        
                        <h4 className="text-sm font-medium text-gray-900 mb-2 line-clamp-2 min-h-[2.5rem]">{product.name}</h4>
                        
                        <div className="mt-2 flex justify-between items-center">
                          <div>
                            {salePrice ? (
                              <div className="flex flex-col">
                                <span className="text-sm font-bold text-blue-600">
                                  {salePrice.toFixed(2)} ر.س
                                </span>
                                <span className="mr-2 text-xs line-through text-gray-500">
                                  {price.toFixed(2)} ر.س
                                </span>
                              </div>
                            ) : (
                              <span className="text-sm font-bold text-blue-600">
                                {price.toFixed(2)} ر.س
                              </span>
                            )}
                          </div>
                          <div className="flex space-x-1 space-x-reverse">
                            {product.featured && (
                              <span className="bg-yellow-100 text-yellow-800 px-1.5 py-0.5 rounded-full text-xs">مميز</span>
                            )}
                            {product.sale && (
                              <span className="bg-red-100 text-red-800 px-1.5 py-0.5 rounded-full text-xs">تخفيض</span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="col-span-full p-8 text-center text-gray-500">
                لا توجد منتجات متاحة حاليًا
              </div>
            )}
          </div>
        )}
        
        {/* عرض التصنيفات */}
        {selectedTab === 'categories' && (
          <div className="border border-gray-200 rounded-lg overflow-hidden bg-white">
            <div className="p-4 border-b border-gray-200 bg-gray-50">
              <h3 className="font-medium text-gray-700">التصنيفات المتاحة في المتجر</h3>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
              {categories && categories.length > 0 ? (
                categories.map((category) => {
                  // البحث عن منتج في هذه الفئة للحصول على صورة
                  const categoryProduct = products?.find(p => p.category === category.id || p.category === category.name);
                  
                  return (
                    <div key={category.id} className="group relative border border-gray-200 rounded-md overflow-hidden hover:shadow-md transition-shadow">
                      <div className="aspect-h-1 aspect-w-1 bg-gray-200">
                        <img
                          src={
                            (categoryProduct?.images && Array.isArray(categoryProduct.images) && 
                              categoryProduct.images.length > 0 && categoryProduct.images[0]?.image_url) ||
                            categoryProduct?.image_url ||
                            'https://placehold.co/300x300?text=صورة+التصنيف'
                          }
                          alt={category.name || 'تصنيف'}
                          className="h-32 w-full object-cover object-center group-hover:opacity-80"
                          onError={(e) => {
                            e.target.src = 'https://placehold.co/300x300?text=صورة+التصنيف';
                          }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end">
                          <h4 className="text-white font-medium p-3">{category.name}</h4>
                        </div>
                      </div>
                      <div className="p-3 bg-white">
                        <p className="text-xs text-gray-500">
                          عدد المنتجات: {products?.filter(p => 
                            p.category === category.id || p.category === category.name
                          ).length || 0}
                        </p>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="col-span-full p-8 text-center text-gray-500">
                  لا توجد تصنيفات متاحة حاليًا
                </div>
              )}
            </div>
          </div>
        )}
        
        <div className="mt-6 p-6">
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100 shadow-sm">
            <div className="flex items-start">
              <div className="hidden sm:block w-16 h-16 mr-4 bg-white p-3 rounded-lg shadow-sm">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-full w-full text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-blue-800 mb-3">نصائح لتحسين متجرك</h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium text-blue-700 mb-2">كيفية استخدام المعاينة بفعالية</h4>
                    <ul className="space-y-2 text-blue-600 text-sm">
                      <li className="flex items-start">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-400 ml-1 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>استخدم أزرار تغيير وضع العرض لاختبار تجاوب المتجر على مختلف الأجهزة.</span>
                      </li>
                      <li className="flex items-start">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-400 ml-1 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>جرب التنقل بين صفحات المتجر المختلفة باستخدام القائمة المنسدلة.</span>
                      </li>
                      <li className="flex items-start">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-400 ml-1 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>قم بتحديث المعاينة بعد إجراء أي تغييرات على المنتجات أو الإعدادات.</span>
                      </li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium text-blue-700 mb-2">تحسينات مقترحة لمتجرك</h4>
                    <ul className="space-y-2 text-blue-600 text-sm">
                      <li className="flex items-start">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-400 ml-1 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                        <span>{products?.length < 5 ? 'أضف المزيد من المنتجات لإثراء محتوى متجرك.' : 'عدد منتجاتك جيد، استمر في التنويع!'}</span>
                      </li>
                      <li className="flex items-start">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-400 ml-1 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                        <span>{products?.filter(p => p.featured)?.length === 0 ? 'حدد بعض المنتجات المميزة لإبرازها في الصفحة الرئيسية.' : 'لديك منتجات مميزة، وهذا رائع!'}</span>
                      </li>
                      <li className="flex items-start">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-400 ml-1 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                        <span>{!currentStore?.logo ? 'أضف شعارًا لمتجرك لزيادة الاحترافية والتميز.' : 'شعار متجرك يعزز هويتك التجارية!'}</span>
                      </li>
          </ul>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-blue-100">
                  <div className="flex justify-between items-center">
                    <Link
                      to="/dashboard/settings"
                      className="inline-flex items-center text-sm font-medium text-blue-700 hover:text-blue-800"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <span>تعديل إعدادات المتجر</span>
                    </Link>
                    <Link
                      to="/dashboard/products/add"
                      className="inline-flex items-center px-3 py-1.5 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                      <span>إضافة منتج جديد</span>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StorePreview; 