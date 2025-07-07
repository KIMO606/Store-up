import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  AdjustmentsHorizontalIcon,
  XMarkIcon,
  ChevronDownIcon,
  FunnelIcon,
  Squares2X2Icon,
  ListBulletIcon,
  HeartIcon,
} from '@heroicons/react/24/outline';
import { StarIcon } from '@heroicons/react/24/solid';
import { getProducts } from '../../features/products/productsSlice';

const CategoryPage = ({ store, addToCart, theme, filter, showAllCategories, searchParam, categories, products: propProducts }) => {
  const dispatch = useDispatch();
  const { storeId, categoryId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  
  // جلب البيانات من ردكس
  const { products: reduxProducts, categories: storeCategories, loading } = useSelector((state) => state.products);
  
  // استخدام المنتجات المقدمة كـ props أو من ردكس
  const products = propProducts || reduxProducts || [];
  
  // استخدام التصنيفات المقدمة أو الجلب من ردكس
  const allCategories = categories || storeCategories || [];
  
  const [currentCategory, setCurrentCategory] = useState(null);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [viewType, setViewType] = useState('grid'); // 'grid' أو 'list'
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [priceRange, setPriceRange] = useState([0, 5000]);
  const [selectedRating, setSelectedRating] = useState(0);
  const [sortBy, setSortBy] = useState('newest');
  const [selectedBrands, setSelectedBrands] = useState([]);

  useEffect(() => {
    console.log('CategoryPage mounted');
    console.log('Filter:', filter);
    console.log('CategoryId:', categoryId);
    console.log('Products count:', products?.length);
    console.log('Categories:', allCategories);
  }, []);

  // جلب المنتجات عند تحميل الصفحة
  useEffect(() => {
    if (!products || products.length === 0) {
      console.log('Fetching products...');
      dispatch(getProducts(storeId));
    }
  }, [dispatch, storeId, products]);
  
  // الحصول على العلامات التجارية الفريدة من المنتجات
  const brands = [...new Set(products?.map(product => product.brand).filter(Boolean))];
  
  // جلب المنتجات وفقاً للفلاتر والتصنيف
  const filterAndSortProducts = useCallback(() => {
    if (!products || !products.length) {
      console.log('No products available');
      return [];
    }
    
    console.log('Starting to filter products:', products.length);
    console.log('Current filter:', filter);
    console.log('Current categoryId:', categoryId);
    
    let filtered = [...products];
    
    // تصفية حسب فلتر خاص
    if (filter) {
      console.log('Applying special filter:', filter);
      switch (filter) {
        case 'sale':
          filtered = filtered.filter(product => {
            const isSale = product.sale === true || 
              (product.sale_price && product.sale_price < product.price) ||
              (product.salePrice && product.salePrice < product.price);
            return isSale;
          });
          break;
        case 'newArrival':
          filtered = [...products]
            .sort((a, b) => {
              const dateA = new Date(a.created_at || a.createdAt);
              const dateB = new Date(b.created_at || b.createdAt);
              return dateB - dateA;
            })
            .slice(0, 20);
          break;
        case 'featured':
          filtered = filtered.filter(product => product.featured === true);
          break;
        default:
          break;
      }
      console.log(`After ${filter} filter:`, filtered.length);
    }
    // تصفية حسب معلمة البحث
    else if (searchParam) {
      const searchQuery = new URLSearchParams(location.search).get('q')?.toLowerCase() || '';
      if (searchQuery) {
        filtered = filtered.filter(product => 
          product.name.toLowerCase().includes(searchQuery) || 
          (product.description && product.description.toLowerCase().includes(searchQuery))
        );
      }
    }
    // تصفية حسب الفئة إذا كانت محددة
    else if (categoryId) {
      console.log('Filtering by category:', categoryId);
      filtered = filtered.filter(product => {
        const productCategory = product.category_name || product.category;
        console.log('Product category:', productCategory);
        const productCategoryId = typeof productCategory === 'string' 
          ? productCategory.toLowerCase().replace(/\s+/g, '-')
          : String(productCategory).toLowerCase().replace(/\s+/g, '-');
        console.log('Comparing:', productCategoryId, 'with:', categoryId);
        return productCategoryId === categoryId;
      });
      console.log('After category filter:', filtered.length);
    }
    
    // تصفية حسب نطاق السعر
    filtered = filtered.filter(product => {
      const price = product.salePrice || product.sale_price || product.price;
      return price >= priceRange[0] && price <= priceRange[1];
    });
    
    // تصفية حسب التقييم
    if (selectedRating > 0) {
      filtered = filtered.filter(product => Math.round(product.rating || 0) >= selectedRating);
    }
    
    // تصفية حسب العلامة التجارية
    if (selectedBrands.length > 0) {
      filtered = filtered.filter(product => selectedBrands.includes(product.brand));
    }
    
    // الترتيب حسب الاختيار
    switch (sortBy) {
      case 'price-asc':
        filtered.sort((a, b) => {
          const priceA = a.salePrice || a.sale_price || a.price;
          const priceB = b.salePrice || b.sale_price || b.price;
          return priceA - priceB;
        });
        break;
      case 'price-desc':
        filtered.sort((a, b) => {
          const priceA = a.salePrice || a.sale_price || a.price;
          const priceB = b.salePrice || b.sale_price || b.price;
          return priceB - priceA;
        });
        break;
      case 'rating':
        filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      case 'popular':
        filtered.sort((a, b) => (b.reviewCount || 0) - (a.reviewCount || 0));
        break;
      case 'newest':
      default:
        filtered.sort((a, b) => {
          const dateA = new Date(a.created_at || a.createdAt);
          const dateB = new Date(b.created_at || b.createdAt);
          return dateB - dateA;
        });
    }
    
    console.log('Final filtered products count:', filtered.length);
    return filtered;
  }, [products, categoryId, filter, searchParam, location.search, priceRange, selectedRating, selectedBrands, sortBy]);
  
  // تحديث المنتجات المفلترة عند تغيير أي من المرشحات
  useEffect(() => {
    const filtered = filterAndSortProducts();
    setFilteredProducts(filtered);
  }, [filterAndSortProducts]);
  
  // تحديث الفئة الحالية عند تغيير معرف الفئة
  useEffect(() => {
    if (categoryId && allCategories.length) {
      const category = allCategories.find(cat => cat.id === categoryId);
      setCurrentCategory(category || null);
    } else {
      setCurrentCategory(null);
    }
  }, [categoryId, allCategories]);
  
  // التعامل مع تغيير نطاق السعر
  const handlePriceChange = (event, index) => {
    const newRange = [...priceRange];
    newRange[index] = parseInt(event.target.value);
    setPriceRange(newRange);
  };
  
  // التعامل مع تحديد العلامات التجارية
  const handleBrandChange = (brand) => {
    if (selectedBrands.includes(brand)) {
      setSelectedBrands(selectedBrands.filter(b => b !== brand));
    } else {
      setSelectedBrands([...selectedBrands, brand]);
    }
  };
  
  // اختيار فئة
  const handleCategorySelect = (categoryId) => {
    navigate(`/store/${storeId}/category/${categoryId}`);
  };
  
  // عرض تقييم المنتج بالنجوم
  const renderRating = (rating) => {
    // التأكد من أن التقييم هو رقم صالح
    const numericRating = typeof rating === 'number' && !isNaN(rating) ? rating : 0;
    
    const stars = [];
    const fullStars = Math.floor(numericRating);
    const hasHalfStar = numericRating % 1 >= 0.5;
    
    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(<StarIcon key={i} className="h-4 w-4 text-yellow-400" />);
      } else if (i === fullStars && hasHalfStar) {
        stars.push(
          <div key={i} className="relative">
            <StarIcon className="h-4 w-4 text-gray-300" />
            <div className="absolute inset-0 overflow-hidden w-1/2">
              <StarIcon className="h-4 w-4 text-yellow-400" />
            </div>
          </div>
        );
      } else {
        stars.push(<StarIcon key={i} className="h-4 w-4 text-gray-300" />);
      }
    }
    
    return (
      <div className="flex">
        {stars}
        <span className="mr-1 text-sm text-gray-500">({numericRating.toFixed(1)})</span>
      </div>
    );
  };
  
  // عرض قائمة التصنيفات
  const renderCategories = () => {
    if (!allCategories || allCategories.length === 0) return null;
    
    return (
      <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">التصنيفات</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {allCategories.map((category) => (
            <div 
              key={category.id}
              onClick={() => handleCategorySelect(category.id)}
              className={`p-4 rounded-lg cursor-pointer border hover:shadow-md transition ${
                currentCategory && currentCategory.id === category.id 
                  ? 'border-primary-500 bg-primary-50' 
                  : 'border-gray-200'
              }`}
              style={currentCategory && currentCategory.id === category.id 
                ? {borderColor: theme?.primaryColor, backgroundColor: `${theme?.primaryColor}10`} 
                : {}}
            >
              <h3 className="text-center font-medium text-gray-800">
                {category.name}
              </h3>
            </div>
          ))}
        </div>
      </div>
    );
  };
  
  // عرض مرشحات الجوال
  const renderMobileFilters = () => (
    <div
      className={`fixed inset-0 z-40 bg-white p-4 transform transition-transform ${
        filtersOpen ? 'translate-x-0' : 'translate-x-full'
      } md:hidden`}
    >
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-medium text-gray-900">الفلاتر</h2>
        <button
          type="button"
          className="text-gray-500 hover:text-gray-700"
          onClick={() => setFiltersOpen(false)}
        >
          <XMarkIcon className="h-6 w-6" />
        </button>
      </div>
      {renderFilters()}
      <div className="mt-6">
        <button
          type="button"
          className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          onClick={() => setFiltersOpen(false)}
        >
          تطبيق الفلاتر
        </button>
      </div>
    </div>
  );
  
  // عرض المرشحات
  const renderFilters = () => (
    <div className="space-y-6">
      {/* نطاق السعر */}
      <div>
        <h3 className="text-sm font-medium text-gray-900 mb-2">نطاق السعر</h3>
        <div className="flex items-center space-x-4 rtl:space-x-reverse">
          <input
            type="number"
            id="price-min"
            name="price-min"
            min="0"
            max={priceRange[1]}
            value={priceRange[0]}
            onChange={(e) => handlePriceChange(e, 0)}
            className="block w-24 border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
          <span className="text-gray-500">-</span>
          <input
            type="number"
            id="price-max"
            name="price-max"
            min={priceRange[0]}
            value={priceRange[1]}
            onChange={(e) => handlePriceChange(e, 1)}
            className="block w-24 border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
        </div>
      </div>
      
      {/* التقييم */}
      <div>
        <h3 className="text-sm font-medium text-gray-900 mb-2">التقييم</h3>
        <div className="space-y-2">
          {[5, 4, 3, 2, 1].map((rating) => (
            <label key={rating} className="flex items-center">
              <input
                type="radio"
                id={`rating-${rating}`}
                name="rating"
                checked={selectedRating === rating}
                onChange={() => setSelectedRating(rating)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
              />
              <span className="mr-2 flex items-center">
                {[...Array(5)].map((_, i) => (
                  <StarIcon
                    key={i}
                    className={`h-4 w-4 ${
                      i < rating ? 'text-yellow-400' : 'text-gray-300'
                    }`}
                  />
                ))}
                <span className="mr-1 text-sm text-gray-500">أو أعلى</span>
              </span>
            </label>
          ))}
          {selectedRating > 0 && (
            <button
              type="button"
              className="text-sm text-blue-600 hover:text-blue-800"
              onClick={() => setSelectedRating(0)}
            >
              إعادة ضبط
            </button>
          )}
        </div>
      </div>
      
      {/* العلامات التجارية */}
      {brands.length > 0 && (
        <div>
          <h3 className="text-sm font-medium text-gray-900 mb-2">العلامة التجارية</h3>
          <div className="space-y-2 max-h-40 overflow-y-auto">
            {brands.map((brand) => (
              <label key={brand} className="flex items-center">
                <input
                  type="checkbox"
                  id={`brand-${brand}`}
                  name={`brand-${brand}`}
                  checked={selectedBrands.includes(brand)}
                  onChange={() => handleBrandChange(brand)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <span className="mr-2 text-sm text-gray-600">{brand}</span>
              </label>
            ))}
          </div>
        </div>
      )}
    </div>
  );
  
  // عرض شبكة المنتجات
  const renderGridView = () => (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
      {console.log(`Rendering grid view with ${filteredProducts.length} products`)}
      {filteredProducts.map((product, index) => {
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
          return `https://placehold.co/600x400?text=${encodeURIComponent(product.name || 'منتج')}`;
        };
        
        const primaryColor = theme?.primaryColor || '#3b82f6';
        const accentColor = theme?.accentColor || '#f97316';
        
        return (
          <div
            key={product.id || index}
            className="group relative bg-white rounded-lg shadow-sm hover:shadow-lg transition-all duration-300"
          >
            {/* Wishlist button - top left */}
            <button 
              className="absolute top-3 left-3 z-10 p-1.5 rounded-full bg-white/80 text-gray-600 hover:text-red-500 hover:bg-white backdrop-blur-sm shadow-sm transition-colors focus:outline-none group-hover:opacity-100 opacity-0"
              aria-label="إضافة إلى المفضلة"
            >
              <HeartIcon className="h-4 w-4" />
            </button>
            
            <Link to={`/store/${storeId}/product/${product.id}`}>
              <div className="relative pt-[80%] overflow-hidden bg-gray-50">
                <img
                  src={getProductImage()}
                  alt={product.name || 'صورة المنتج'}
                  className="absolute inset-0 h-full w-full object-contain group-hover:scale-105 transition-transform duration-300"
                  onError={(e) => {
                    console.error('Failed to load image:', e.target.src);
                    e.target.onerror = null; // Prevent infinite loop
                    e.target.src = 'https://placehold.co/600x400?text=صورة+غير+متوفرة';
                  }}
                  loading="lazy"
                />
                {salePrice && (
                  <div className="absolute top-3 right-3 z-10 px-2.5 py-1.5 rounded-full text-xs font-bold text-white shadow-sm backdrop-blur-sm" 
                   style={{ backgroundColor: `${accentColor}dd` }}>
                    <span className="flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v8m-4-4h8" />
                      </svg>
                      {Math.round(((price - salePrice) / price) * 100)}%
                    </span>
                  </div>
                )}
              </div>
            </Link>
            <div className="p-4">
              {/* Category */}
              <div className="mb-2">
                <span className="text-xs font-medium px-2 py-1 rounded-full bg-gray-100 text-gray-600">{product.category || 'بدون تصنيف'}</span>
              </div>
              
              <Link to={`/store/${storeId}/product/${product.id}`}>
                <h3 className="text-sm font-medium text-gray-900 line-clamp-2 mb-1 min-h-[2.5rem] hover:text-blue-600 transition-colors">
                  {product.name}
                </h3>
              </Link>
              <div className="mt-1 mb-3">{renderRating(product.rating)}</div>
              <div className="flex justify-between items-center">
                <div>
                  {salePrice ? (
                    <div className="flex items-baseline gap-2">
                      <span className="text-lg font-semibold text-red-600">
                        {parseFloat(salePrice).toFixed(2)} ج.م
                      </span>
                      <span className="text-sm text-gray-500 line-through">
                        {parseFloat(price).toFixed(2)} ج.م
                      </span>
                    </div>
                  ) : (
                    <span className="text-lg font-semibold text-gray-900">
                      {parseFloat(price).toFixed(2)} ج.م
                    </span>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => addToCart(product)}
                  className="flex-shrink-0 p-2 text-white rounded-full shadow-md hover:shadow-lg transform hover:scale-110 transition-all"
                  style={{ backgroundColor: primaryColor }}
                >
                  <svg
                    className="h-4 w-4"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
  
  // عرض قائمة المنتجات
  const renderListView = () => (
    <div className="space-y-4">
      {console.log(`Rendering list view with ${filteredProducts.length} products`)}
      {filteredProducts.map((product, index) => {
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
          return `https://placehold.co/150x150?text=${encodeURIComponent(product.name || 'منتج')}`;
        };
        
        const primaryColor = theme?.primaryColor || '#3b82f6';
        const accentColor = theme?.accentColor || '#f97316';
        
        return (
          <div
            key={product.id || index}
            className="flex flex-col sm:flex-row bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-all duration-300 border border-gray-100"
          >
            <Link
              to={`/store/${storeId}/product/${product.id}`}
              className="relative sm:w-44 md:w-52 flex-shrink-0"
            >
              <div className="relative h-40 sm:h-full w-full bg-gray-50 overflow-hidden">
                <img
                  src={getProductImage()}
                  alt={product.name || 'صورة المنتج'}
                  className="w-full h-full object-contain transition-transform hover:scale-105 duration-300"
                  onError={(e) => {
                    console.error('Failed to load image:', e.target.src);
                    e.target.onerror = null; // Prevent infinite loop
                    e.target.src = 'https://placehold.co/150x150?text=صورة+غير+متوفرة';
                  }}
                  loading="lazy"
                />
                {salePrice && (
                  <div className="absolute top-3 right-3 z-10 px-2 py-1 rounded-full text-xs font-bold text-white shadow-sm backdrop-blur-sm" 
                    style={{ backgroundColor: `${accentColor}dd` }}>
                    <span className="flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v8m-4-4h8" />
                      </svg>
                      {Math.round(((price - salePrice) / price) * 100)}%
                    </span>
                  </div>
                )}
              </div>
            </Link>
            <div className="flex-1 p-4 flex flex-col justify-between">
              <div>
                <div className="mb-2">
                  <span className="text-xs font-medium px-2 py-1 rounded-full bg-gray-100 text-gray-600">{product.category || 'بدون تصنيف'}</span>
                </div>
                <Link to={`/store/${storeId}/product/${product.id}`}>
                  <h3 className="text-base font-medium text-gray-900 line-clamp-2 mb-2 hover:text-blue-600 transition-colors">
                    {product.name}
                  </h3>
                </Link>
                <div className="mb-2">{renderRating(product.rating)}</div>
                <p className="text-sm text-gray-600 line-clamp-2 mb-4">{product.description}</p>
              </div>
              <div className="flex justify-between items-end">
                <div>
                  {salePrice ? (
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold" style={{ color: primaryColor }}>
                        {salePrice.toFixed(2)} ر.س
                      </span>
                      <span className="text-sm text-gray-500 line-through">
                        {price.toFixed(2)} ر.س
                      </span>
                    </div>
                  ) : (
                    <span className="text-sm font-bold" style={{ color: primaryColor }}>
                      {price.toFixed(2)} ر.س
                    </span>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => addToCart(product)}
                  className="inline-flex items-center px-4 py-2 text-sm font-medium text-white rounded-lg shadow-md hover:shadow-lg transform hover:scale-105 transition-all"
                  style={{ backgroundColor: primaryColor }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  إضافة للسلة
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
  
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* عنوان الصفحة */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          {filter === 'sale' && 'عروض وتخفيضات'}
          {filter === 'newArrival' && 'وصل حديثاً'}
          {filter === 'featured' && 'منتجات مميزة'}
          {searchParam && `نتائج البحث: ${new URLSearchParams(location.search).get('q') || ''}`}
          {!filter && !searchParam && (currentCategory ? currentCategory.name : 'جميع المنتجات')}
        </h1>
        {currentCategory && currentCategory.description && (
          <p className="text-gray-600">{currentCategory.description}</p>
        )}
      </div>
      
      {/* عرض التصنيفات إذا طلب ذلك */}
      {showAllCategories && renderCategories()}
      
      <div className="flex flex-col lg:flex-row gap-8">
        {/* فلاتر الجانب - مرئية فقط على الشاشات الكبيرة */}
        <div className="hidden md:block w-64 flex-shrink-0">
          <div className="bg-white p-4 rounded-lg shadow-sm sticky top-4">
            <h2 className="text-lg font-medium text-gray-900 mb-4">الفلاتر</h2>
            {renderFilters()}
          </div>
        </div>
        
        {/* قائمة المنتجات */}
        <div className="flex-1">
          {/* شريط أدوات الفرز والعرض */}
          <div className="bg-white p-4 rounded-lg shadow-sm mb-6 flex flex-wrap justify-between items-center gap-4">
            <div className="flex items-center">
              <button
                type="button"
                className="mr-2 md:hidden text-gray-600 hover:text-gray-900"
                onClick={() => setFiltersOpen(true)}
              >
                <FunnelIcon className="h-5 w-5" />
              </button>
              <span className="text-sm text-gray-600">
                عرض {filteredProducts.length} منتج
              </span>
            </div>
            
            <div className="flex items-center space-x-4 rtl:space-x-reverse">
              <div className="flex items-center">
                <label htmlFor="sort-by" className="text-sm text-gray-600 ml-2">
                  ترتيب حسب:
                </label>
                <select
                  id="sort-by"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="block w-auto pl-3 pr-10 py-1 text-sm border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="newest">الأحدث</option>
                  <option value="price-asc">السعر: من الأقل للأعلى</option>
                  <option value="price-desc">السعر: من الأعلى للأقل</option>
                  <option value="rating">التقييم</option>
                  <option value="popular">الأكثر شعبية</option>
                </select>
              </div>
              
              <div className="flex items-center">
                <button
                  type="button"
                  onClick={() => setViewType('grid')}
                  className={`p-1 rounded-md ${
                    viewType === 'grid' ? 'text-blue-600 bg-blue-50' : 'text-gray-500'
                  }`}
                  style={viewType === 'grid' ? {color: theme?.primaryColor, backgroundColor: `${theme?.primaryColor}10`} : {}}
                >
                  <Squares2X2Icon className="h-5 w-5" />
                </button>
                <button
                  type="button"
                  onClick={() => setViewType('list')}
                  className={`p-1 rounded-md ${
                    viewType === 'list' ? 'text-blue-600 bg-blue-50' : 'text-gray-500'
                  }`}
                  style={viewType === 'list' ? {color: theme?.primaryColor, backgroundColor: `${theme?.primaryColor}10`} : {}}
                >
                  <ListBulletIcon className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
          
          {/* رسالة عندما لا توجد منتجات */}
          {filteredProducts.length === 0 ? (
            <div className="bg-white rounded-lg shadow-sm p-8 text-center">
              <h3 className="text-xl font-medium text-gray-900 mb-2">لا توجد منتجات</h3>
              <p className="text-gray-600 mb-4">
                لم يتم العثور على منتجات تطابق المعايير المحددة.
              </p>
              <button
                onClick={() => {
                  setPriceRange([0, 5000]);
                  setSelectedRating(0);
                  setSelectedBrands([]);
                  setSortBy('newest');
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                style={{backgroundColor: theme?.primaryColor}}
              >
                إعادة ضبط الفلاتر
              </button>
            </div>
          ) : (
            <div>{viewType === 'grid' ? renderGridView() : renderListView()}</div>
          )}
        </div>
      </div>
      
      {/* فلاتر الجوال */}
      {renderMobileFilters()}
    </div>
  );
};

export default CategoryPage; 