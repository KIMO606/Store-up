import { useState, useEffect } from 'react';
import { useParams, useNavigate, Routes, Route, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  ShoppingCartIcon,
  MagnifyingGlassIcon,
  UserIcon,
  Bars3Icon,
  XMarkIcon,
  HeartIcon,
} from '@heroicons/react/24/outline';
import { getStoreById } from '../../features/store/storeSlice';
import { getProducts } from '../../features/products/productsSlice';
import { useStore } from '../../context/StoreContext';

// Storefront Components
import StorefrontHome from './StorefrontHome';
import ProductDetails from './ProductDetails';
import Cart from './Cart';
import Checkout from './Checkout';
import CategoryPage from './CategoryPage';
import SearchResults from './SearchResults';
import Products from './Products';

const StoreFront = () => {
  const { storeId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { cart, addToCart: contextAddToCart, setCart } = useStore();
  
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [isScrolled, setIsScrolled] = useState(false);
  const [wishlist, setWishlist] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  
  const { currentStore, loading: storeLoading } = useSelector((state) => state.store);
  const { products, categories, loading: productsLoading } = useSelector((state) => state.products);
  
  // استخدام useEffect لتطبيق متغيرات CSS للمتجر الحالي
  useEffect(() => {
    if (currentStore?.theme) {
      const { primaryColor, secondaryColor } = currentStore.theme;
      
      // تطبيق متغيرات CSS على العنصر المحدد أو على root إذا لم يكن العنصر موجودًا بعد
      const container = document.getElementById('storefront-container') || document.documentElement;
      
      // تطبيق اللون الأساسي
      container.style.setProperty('--color-primary', primaryColor);
      container.style.setProperty('--color-primary-hover', primaryColor);
      container.style.setProperty('--color-primary-light', `${primaryColor}33`);
      container.style.setProperty('--color-primary-bg', `${primaryColor}10`);
      
      // تطبيق اللون الثانوي
      container.style.setProperty('--color-secondary', secondaryColor);
      container.style.setProperty('--color-secondary-hover', secondaryColor);
      container.style.setProperty('--color-secondary-light', `${secondaryColor}33`);
      container.style.setProperty('--color-secondary-bg', `${secondaryColor}10`);
    }
  }, [currentStore]);
  
  useEffect(() => {
    if (storeId) {
      dispatch(getStoreById(storeId));
      dispatch(getProducts(storeId));
    }
  }, [dispatch, storeId]);

  // إضافة مراقب للتمرير لتطبيق الرأس الثابت
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 100) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // إعادة تحميل المنتجات عند زيارة الصفحة
  useEffect(() => {
    // عندما يتم زيارة الصفحة، قم بإعادة تحميل المنتجات وبيانات المتجر
    const fetchData = () => {
      if (storeId) {
        dispatch(getStoreById(storeId));
        dispatch(getProducts(storeId));
      }
    };
    
    fetchData();
    
    // إضافة مستمع للنافذة للتحديث عند العودة إلى الصفحة
    window.addEventListener('focus', fetchData);
    
    return () => {
      window.removeEventListener('focus', fetchData);
    };
  }, [dispatch, storeId]);

  // حفظ سلة التسوق في localStorage عند أي تغيير
  useEffect(() => {
    // The cart is now managed by the context, so this effect is no longer needed
    // localStorage.setItem('ecoshop_cart', JSON.stringify(cart));
  }, [cart]);
  
  // Cart functions
  const addToCart = (product) => {
    contextAddToCart(product);
  };
  
  const removeFromCart = (productId) => {
    setCart(prevCart => prevCart.filter(item => item.id !== productId));
  };
  
  const updateCartItemQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    
    setCart(prevCart =>
      prevCart.map(item =>
        item.id === productId ? { ...item, quantity } : item
      )
    );
  };
  
  const clearCart = () => {
    setCart([]);
  };
  
  const cartItemsCount = cart.reduce((total, item) => total + item.quantity, 0);
  
  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      // تصفية المنتجات بناءً على مصطلح البحث
      const filtered = products.filter(product => {
        const searchLower = searchTerm.toLowerCase();
        return (
          product.name.toLowerCase().includes(searchLower) ||
          (product.description && product.description.toLowerCase().includes(searchLower)) ||
          (product.category && typeof product.category === 'object' 
            ? product.category.name.toLowerCase().includes(searchLower)
            : typeof product.category === 'string' 
              ? product.category.toLowerCase().includes(searchLower)
              : false)
        );
      });
      
      // تحديث state للمنتجات المصفاة
      setFilteredProducts(filtered);
      // التنقل إلى صفحة نتائج البحث
      navigate(`/store/${storeId}/search?q=${encodeURIComponent(searchTerm.trim())}`);
    }
  };

  // إضافة وظائف قائمة المفضلات
  const toggleWishlist = (productId) => {
    if (wishlist.includes(productId)) {
      setWishlist(wishlist.filter(id => id !== productId));
    } else {
      setWishlist([...wishlist, productId]);
    }
  };
  
  // عرض مؤشر التحميل أثناء جلب بيانات المتجر والمنتجات
  if (storeLoading || productsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }
  
  if (!currentStore) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800">المتجر غير موجود</h1>
          <p className="mt-2 text-gray-600">لم يتم العثور على المتجر المطلوب.</p>
        </div>
      </div>
    );
  }
  
  // Set theme based on store settings
  const theme = currentStore.theme || {
    primaryColor: '#0ea5e9',
    secondaryColor: '#8b5cf6',
    fontFamily: 'Cairo, sans-serif',
  };
  
  return (
    <div
      id="storefront-container"
      className="min-h-screen bg-gray-50"
      style={{ fontFamily: theme.fontFamily.split(',')[0] }}
    >
      {/* Navigation Bar */}
      <nav
        className={`fixed w-full top-0 z-50 transition-all duration-300 ${
          isScrolled ? 'bg-white shadow-md' : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo and Store Name */}
            <div className="flex items-center">
              <Link to={`/store/${storeId}`} className="flex items-center group">
                {currentStore?.logo && (
                  <img
                    src={currentStore.logo}
                    alt={currentStore?.name}
                    className="h-8 w-auto transition-transform duration-200 group-hover:scale-105"
                  />
                )}
                <span 
                  className="ml-2 text-xl font-bold transition-all duration-200 group-hover:scale-105"
                  style={{ 
                    background: `linear-gradient(135deg, ${currentStore?.theme?.primaryColor || '#3b82f6'}, ${currentStore?.theme?.secondaryColor || '#8b5cf6'})`,
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text'
                  }}
                >
                  {currentStore?.name}
                </span>
              </Link>
            </div>

            {/* Navigation Links */}
            <div className="hidden md:flex items-center space-x-6">
              <Link
                to={`/store/${storeId}/categories`}
                className="text-gray-700 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover:shadow-md"
                style={{
                  background: 'transparent',
                  backgroundImage: `linear-gradient(135deg, ${currentStore?.theme?.primaryColor || '#3b82f6'}, ${currentStore?.theme?.secondaryColor || '#8b5cf6'})`,
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  '&:hover': {
                    WebkitTextFillColor: 'white'
                  }
                }}
              >
                التصنيفات
              </Link>
              <Link
                to={`/store/${storeId}/new-arrivals`}
                className="text-gray-700 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover:shadow-md"
                style={{
                  background: 'transparent',
                  backgroundImage: `linear-gradient(135deg, ${currentStore?.theme?.primaryColor || '#3b82f6'}, ${currentStore?.theme?.secondaryColor || '#8b5cf6'})`,
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text'
                }}
              >
                وصل حديثاً
              </Link>
              <Link
                to={`/store/${storeId}/sale`}
                className="text-gray-700 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover:shadow-md"
                style={{
                  background: 'transparent',
                  backgroundImage: `linear-gradient(135deg, ${currentStore?.theme?.primaryColor || '#3b82f6'}, ${currentStore?.theme?.secondaryColor || '#8b5cf6'})`,
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text'
                }}
              >
                عروض
              </Link>
            </div>

            {/* Search Bar */}
            <div className="flex-1 max-w-lg mx-4">
              <form onSubmit={handleSearch} className="relative">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="ابحث عن منتجات..."
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
                <button
                  type="submit"
                  className="absolute left-2 top-1/2 transform -translate-y-1/2"
                >
                  <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
                </button>
              </form>
            </div>

            {/* Cart and Mobile Menu */}
            <div className="flex items-center space-x-4">
              {/* Cart Icon */}
              <Link
                to={`/store/${storeId}/cart`}
                className="relative p-2 text-gray-600 transition-colors duration-200 hover:scale-110"
                style={{
                  color: currentStore?.theme?.primaryColor || '#3b82f6'
                }}
              >
                <ShoppingCartIcon className="h-6 w-6" />
                {cartItemsCount > 0 && (
                  <span 
                    className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center text-xs font-bold text-white rounded-full transform transition-transform duration-200"
                    style={{ 
                      background: `linear-gradient(135deg, ${currentStore?.theme?.primaryColor || '#3b82f6'}, ${currentStore?.theme?.secondaryColor || '#8b5cf6'})`,
                      boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                    }}
                  >
                    {cartItemsCount}
                  </span>
                )}
              </Link>
              
              {/* Mobile Menu Button */}
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="md:hidden p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500"
              >
                {menuOpen ? (
                  <XMarkIcon className="h-6 w-6" />
                ) : (
                  <Bars3Icon className="h-6 w-6" />
                )}
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {menuOpen && (
            <div className="md:hidden border-t border-gray-100 py-2">
              <div className="space-y-1 px-2">
                <Link
                  to={`/store/${storeId}/categories`}
                  className="block px-3 py-2 rounded-md text-base font-medium transition-all duration-200"
                  style={{
                    background: 'transparent',
                    backgroundImage: `linear-gradient(135deg, ${currentStore?.theme?.primaryColor || '#3b82f6'}, ${currentStore?.theme?.secondaryColor || '#8b5cf6'})`,
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text'
                  }}
                  onClick={() => setMenuOpen(false)}
                >
                  التصنيفات
                </Link>
                <Link
                  to={`/store/${storeId}/new-arrivals`}
                  className="block px-3 py-2 rounded-md text-base font-medium transition-all duration-200"
                  style={{
                    background: 'transparent',
                    backgroundImage: `linear-gradient(135deg, ${currentStore?.theme?.primaryColor || '#3b82f6'}, ${currentStore?.theme?.secondaryColor || '#8b5cf6'})`,
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text'
                  }}
                  onClick={() => setMenuOpen(false)}
                >
                  وصل حديثاً
                </Link>
                <Link
                  to={`/store/${storeId}/sale`}
                  className="block px-3 py-2 rounded-md text-base font-medium transition-all duration-200"
                  style={{
                    background: 'transparent',
                    backgroundImage: `linear-gradient(135deg, ${currentStore?.theme?.primaryColor || '#3b82f6'}, ${currentStore?.theme?.secondaryColor || '#8b5cf6'})`,
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text'
                  }}
                  onClick={() => setMenuOpen(false)}
                >
                  عروض
                </Link>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Main Content */}
      <div className="pt-16">
        <Routes>
          <Route index element={
            <StorefrontHome
              products={products}
              loading={productsLoading}
              store={currentStore}
              theme={theme}
              addToCart={addToCart}
            />
          } />
          <Route path="products" element={
            <Products
              products={products}
              loading={productsLoading}
              store={currentStore}
              theme={theme}
              addToCart={addToCart}
            />
          } />
          <Route path="product/:productId" element={
            <ProductDetails
              addToCart={addToCart}
              theme={theme}
              store={currentStore}
            />
          } />
          <Route path="cart" element={
            <Cart
              cart={cart}
              updateQuantity={updateCartItemQuantity}
              removeFromCart={removeFromCart}
              clearCart={clearCart}
              theme={theme}
            />
          } />
          <Route path="checkout" element={
            <Checkout
              cart={cart}
              clearCart={clearCart}
              theme={theme}
            />
          } />
          <Route path="category/:categoryId" element={
            <CategoryPage
              products={products}
              loading={productsLoading}
              addToCart={addToCart}
              theme={theme}
              store={currentStore}
            />
          } />
          <Route path="search" element={
            <SearchResults
              products={filteredProducts}
              searchTerm={searchTerm}
              addToCart={addToCart}
              theme={theme}
              store={currentStore}
            />
          } />
          {/* Adding back the categories and sale pages */}
          <Route
            path="categories"
            element={
              <CategoryPage
                products={products}
                categories={categories}
                addToCart={addToCart}
                showAllCategories={true}
              />
            }
          />
          <Route
            path="new-arrivals"
            element={
              <CategoryPage
                products={products.filter(p => {
                  const createdDate = new Date(p.createdAt || p.created_at);
                  const thirtyDaysAgo = new Date();
                  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
                  return createdDate >= thirtyDaysAgo;
                })}
                categories={categories}
                addToCart={addToCart}
                title="وصل حديثاً"
              />
            }
          />
          <Route
            path="sale"
            element={
              <CategoryPage
                products={products.filter(p => p.salePrice && p.salePrice < p.price)}
                categories={categories}
                addToCart={addToCart}
                title="عروض"
              />
            }
          />
        </Routes>
      </div>
      
      {/* Footer */}
      <footer className="bg-white border-t border-gray-100 mt-auto">
        <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
          <div className="md:flex md:items-center md:justify-between">
            <div className="md:order-2">
              <p className="text-center text-sm text-gray-500">
                &copy; {new Date().getFullYear()} {currentStore.name}. جميع الحقوق محفوظة.
              </p>
            </div>
            <div className="mt-4 md:mt-0 md:order-1">
              <p className="text-center text-sm text-gray-500">
                {currentStore.contactInfo?.email && (
                  <span className="inline-flex items-center">
                    <svg className="h-4 w-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    {currentStore.contactInfo.email}
                  </span>
                )}
                {currentStore.contactInfo?.phone && (
                  <span className="inline-flex items-center mr-4">
                    <svg className="h-4 w-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    {currentStore.contactInfo.phone}
                  </span>
                )}
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default StoreFront; 