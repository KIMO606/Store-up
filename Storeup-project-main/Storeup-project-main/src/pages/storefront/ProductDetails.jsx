import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  StarIcon, 
  ShoppingCartIcon, 
  HeartIcon, 
  ArrowRightIcon,
  MinusIcon,
  PlusIcon,
  CheckIcon
} from '@heroicons/react/24/outline';
import { StarIcon as StarSolidIcon } from '@heroicons/react/20/solid';
import { useSelector } from 'react-redux';

const ProductDetails = ({ store, addToCart, cart, theme }) => {
  const { productId } = useParams();
  const { products } = useSelector((state) => state.products);
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [isInCart, setIsInCart] = useState(false);
  const [activeTab, setActiveTab] = useState('description');

  useEffect(() => {
    // التحقق من وجود المنتج في المنتجات
    if (products?.length > 0 && productId) {
      console.log("Product ID:", productId);
      console.log("Available products:", products.length);
      
      // تحويل معرف المنتج إلى رقم إذا كان ممكناً
      const numericId = !isNaN(productId) ? parseInt(productId) : null;
      
      const foundProduct = products.find(p => {
        // مقارنة المعرف كرقم إذا كان كلاهما رقمين
        if (numericId !== null && typeof p.id === 'number') {
          return p.id === numericId;
        }
        // مقارنة المعرف كنص في الحالات الأخرى
        return String(p.id) === String(productId);
      });
      
      if (foundProduct) {
        console.log("Found product:", foundProduct);
        console.log("Product stock:", foundProduct.stock);
        // Ensure consistent data format
        const normalizedProduct = {
          ...foundProduct,
          price: typeof foundProduct.price === 'number' && !isNaN(foundProduct.price) ? foundProduct.price : 0,
          salePrice: typeof foundProduct.salePrice === 'number' && !isNaN(foundProduct.salePrice) ? foundProduct.salePrice : null,
          inStock: foundProduct.stock > 0
        };
        console.log("Is product in stock?", normalizedProduct.inStock);
        
        setProduct(normalizedProduct);
        
        // التحقق من وجود المنتج في سلة التسوق
        const inCart = cart?.some(item => {
          if (numericId !== null && typeof item.id === 'number') {
            return item.id === numericId;
          }
          return String(item.id) === String(productId);
        });
        setIsInCart(inCart);
        
        // تعيين الخيار المختار افتراضيًا (إذا كان المنتج يحتوي على خيارات)
        if (normalizedProduct.variants && normalizedProduct.variants.length > 0) {
          setSelectedVariant(normalizedProduct.variants[0]);
        }
        
        // البحث عن المنتجات ذات الصلة (نفس التصنيف)
        if (normalizedProduct.category) {
          const related = products
            .filter(p => p.category === normalizedProduct.category && String(p.id) !== String(productId))
            .slice(0, 4);
          setRelatedProducts(related);
        }
      } else {
        console.log("Product not found in products array");
        console.log("Product IDs in array:", products.map(p => p.id));
        setLoading(false);
      }
      
      setLoading(false);
    } else {
      console.log("Either no products loaded or no productId:", { 
        productsLength: products?.length,
        productId
      });
    }
  }, [products, productId, cart]);

  // زيادة الكمية
  const incrementQuantity = () => {
    if (quantity < (product?.stock || 10)) {
      setQuantity(quantity + 1);
    }
  };

  // إنقاص الكمية
  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  // إضافة إلى سلة التسوق
  const handleAddToCart = () => {
    console.log('handleAddToCart called');
    console.log('Product:', product);
    if (product) {
      const itemToAdd = {
        ...product,
        quantity,
        variant: selectedVariant
      };
      console.log('Item to add:', itemToAdd);
      addToCart(itemToAdd);
      console.log('Item added to cart');
      setIsInCart(true);
    } else {
      console.log('Product is null or undefined');
    }
  };

  // عرض التقييمات
  const renderRating = (rating) => {
    return (
      <div className="flex items-center">
        {[0, 1, 2, 3, 4].map((star) => (
          <StarSolidIcon
            key={star}
            className={`${
              rating > star ? 'text-yellow-400' : 'text-gray-300'
            } h-5 w-5 flex-shrink-0`}
          />
        ))}
      </div>
    );
  };

  // Get product image with fallback
  const getProductImage = (productImages, index = 0) => {
    if (productImages && Array.isArray(productImages) && productImages.length > index) {
      const image = productImages[index];
      if (typeof image === 'string') return image;
      if (image && image.image_url) return image.image_url;
    }
    if (product?.image_url) return product.image_url;
    return `https://placehold.co/600x400?text=${encodeURIComponent(product?.name || 'منتج')}`;
  };

  if (loading) {
    return (
      <div className="py-24 flex justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">المنتج غير موجود</h1>
        <p className="text-gray-600 mb-6">عذراً، لم نتمكن من العثور على المنتج الذي تبحث عنه.</p>
        <Link 
          to={`/store/${store?.id}`}
          className="inline-flex items-center px-4 py-2 rounded-md text-white"
          style={{ backgroundColor: theme?.primaryColor }}
        >
          <ArrowRightIcon className="ml-2 h-5 w-5" />
          العودة إلى المتجر
        </Link>
      </div>
    );
  }

  const discountPercentage = product.salePrice
    ? Math.round(((product.price - product.salePrice) / product.price) * 100)
    : 0;

  return (
    <div className="bg-white">
      {/* فتات الخبز (التنقل) */}
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <ol className="flex items-center space-x-4 space-x-reverse text-sm">
          <li>
            <Link to={`/store/${store?.id}`} className="text-gray-500 hover:text-gray-700">
              الرئيسية
            </Link>
          </li>
          <li className="flex items-center">
            <span className="mx-2 text-gray-400">/</span>
            <Link 
              to={`/store/${store?.id}/category/${typeof product.category === 'string' ? product.category.toLowerCase().replace(/\s+/g, '-') : String(product.category).toLowerCase().replace(/\s+/g, '-')}`} 
              className="text-gray-500 hover:text-gray-700"
            >
              {product.category}
            </Link>
          </li>
          <li className="flex items-center">
            <span className="mx-2 text-gray-400">/</span>
            <span className="text-gray-900 font-medium" aria-current="page">
              {product.name}
            </span>
          </li>
        </ol>
      </nav>

      {/* تفاصيل المنتج */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 pt-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-8 gap-y-10">
          {/* صور المنتج */}
          <div className="lg:sticky lg:top-20">
            <div className="relative pt-[56.25%] rounded-lg overflow-hidden bg-gray-100 mb-4 max-h-[400px] md:max-h-[500px]">
              <img
                src={getProductImage(product.images, selectedImage)}
                alt={product.name}
                className="absolute inset-0 w-full h-full object-contain"
                onError={(e) => {
                  console.error('Failed to load product image:', e.target.src);
                  e.target.onerror = null; // Prevent infinite loop
                  e.target.src = getProductImage(product.images);
                }}
              />
            </div>
            
            {Array.isArray(product.images) && product.images.length > 1 && (
              <div className="grid grid-cols-5 gap-2">
                {product.images.map((imageObj, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`relative rounded overflow-hidden border-2 ${
                      selectedImage === index 
                        ? 'border-primary-500' 
                        : 'border-transparent hover:border-gray-300'
                    }`}
                  >
                    <img
                      src={getProductImage(product.images, index)}
                      alt={`${product.name} - صورة ${index + 1}`}
                      className="w-full h-16 object-cover"
                      onError={(e) => {
                        console.error('Failed to load thumbnail image:', index);
                        e.target.onerror = null; // Prevent infinite loop
                        e.target.src = getProductImage(product.images);
                      }}
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* معلومات المنتج */}
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">{product.name}</h1>
            
            <div className="flex items-center mb-4">
              <div className="flex items-center">
                {renderRating(product.rating || 0)}
                <span className="mr-2 text-sm text-gray-500">
                  ({product.reviewCount || 0} تقييم)
                </span>
              </div>
              {product.inStock ? (
                <span className="mr-4 text-sm text-green-600 flex items-center">
                  <CheckIcon className="h-4 w-4 ml-1" />
                  متوفر
                </span>
              ) : (
                <span className="mr-4 text-sm text-red-600">غير متوفر</span>
              )}
            </div>
            
            <div className="flex items-center mb-6">
              {product.salePrice ? (
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-bold text-red-600">
                    {parseFloat(product.salePrice).toFixed(2)} ج.م
                  </span>
                  <span className="text-xl text-gray-500 line-through">
                    {parseFloat(product.price).toFixed(2)} ج.م
                  </span>
                </div>
              ) : (
                <span className="text-2xl font-bold text-gray-900">
                  {parseFloat(product.price).toFixed(2)} ج.م
                </span>
              )}
            </div>

            <div className="mb-6">
              <p className="text-gray-700">{product.shortDescription || product.description}</p>
            </div>

            {/* خيارات المنتج */}
            {product.variants && product.variants.length > 0 && (
              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-900 mb-3">الخيارات المتاحة</h3>
                <div className="flex flex-wrap gap-2">
                  {product.variants.map((variant) => (
                    <button
                      key={variant.id}
                      onClick={() => setSelectedVariant(variant)}
                      className={`px-3 py-1 rounded-md text-sm ${
                        selectedVariant?.id === variant.id
                          ? 'text-white' 
                          : 'text-gray-700 bg-gray-100 hover:bg-gray-200'
                      }`}
                      style={
                        selectedVariant?.id === variant.id 
                          ? { backgroundColor: theme?.primaryColor } 
                          : {}
                      }
                    >
                      {variant.name}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* التحكم بالكمية */}
            <div className="mb-6 ">
              <h3 className="text-sm font-medium text-gray-900 mb-3">الكمية</h3>
              <div className="flex items-center">
                <button
                  type="button"
                  onClick={decrementQuantity}
                  className="p-2 rounded-l-md border border-gray-300 bg-gray-50 text-gray-600 hover:bg-gray-100"
                >
                  <MinusIcon className="h-4 w-4" />
                </button>
                <input
                  type="number"
                  id="product-detail-quantity"
                  name="product-quantity"
                  min="1"
                  max={product.stock || 10}
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, Math.min(product.stock || 10, parseInt(e.target.value) || 1)))}
                  className="p-2 w-12 text-center border-y bg-slate-50 border-gray-300 focus:outline-none focus:ring-0"
                />
                <button
                  type="button"
                  onClick={incrementQuantity}
                  className="p-2 rounded-r-md border border-gray-300 bg-gray-50 text-gray-600 hover:bg-gray-100"
                >
                  <PlusIcon className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* أزرار الإجراءات */}
            <div className="flex space-x-4 space-x-reverse mb-8">
              <button
                type="button"
                onClick={handleAddToCart}
                className={`flex-1 flex items-center justify-center px-6 py-3 rounded-md text-base font-medium text-white ${
                  !product.inStock ? 'opacity-50 cursor-not-allowed' : ''
                }`}
                style={{ backgroundColor: theme?.primaryColor }}
                disabled={!product.inStock}
              >
                <ShoppingCartIcon className="ml-2 h-5 w-5" />
                {isInCart ? 'تحديث السلة' : 'إضافة إلى السلة'}
              </button>
              
              <button
                type="button"
                className="p-3 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50"
                aria-label="إضافة إلى المفضلة"
              >
                <HeartIcon className="h-6 w-6" />
              </button>
            </div>

            {/* ميزات المنتج */}
            <div className="border-t border-gray-200 pt-6">
              <dl className="space-y-3 text-sm">
                <div className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <dt className="text-gray-600">توصيل سريع خلال 2-5 أيام عمل</dt>
                </div>
                <div className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <dt className="text-gray-600">ضمان استرجاع لمدة 14 يوم</dt>
                </div>
                <div className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <dt className="text-gray-600">دفع آمن ومضمون 100%</dt>
                </div>
              </dl>
            </div>
          </div>
        </div>

        {/* التبويبات */}
        <div className="mt-16">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 space-x-reverse">
              <button
                onClick={() => setActiveTab('description')}
                className={`py-4 px-1 text-sm font-medium border-b-2 ${
                  activeTab === 'description'
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
                style={{ 
                  color: activeTab === 'description' ? theme?.primaryColor : '',
                  borderColor: activeTab === 'description' ? theme?.primaryColor : '' 
                }}
              >
                الوصف
              </button>
              <button
                onClick={() => setActiveTab('specs')}
                className={`py-4 px-1 text-sm font-medium border-b-2 ${
                  activeTab === 'specs'
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
                style={{ 
                  color: activeTab === 'specs' ? theme?.primaryColor : '',
                  borderColor: activeTab === 'specs' ? theme?.primaryColor : '' 
                }}
              >
                المواصفات
              </button>
              <button
                onClick={() => setActiveTab('reviews')}
                className={`py-4 px-1 text-sm font-medium border-b-2 ${
                  activeTab === 'reviews'
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
                style={{ 
                  color: activeTab === 'reviews' ? theme?.primaryColor : '',
                  borderColor: activeTab === 'reviews' ? theme?.primaryColor : '' 
                }}
              >
                التقييمات ({product.reviewCount || 0})
              </button>
            </nav>
          </div>

          <div className="py-6">
            {activeTab === 'description' && (
              <div className="prose prose-sm max-w-none text-gray-700">
                <p>{product.description}</p>
              </div>
            )}
            
            {activeTab === 'specs' && (
              <div className="border rounded-md">
                <table className="min-w-full divide-y divide-gray-200">
                  <tbody className="divide-y divide-gray-200">
                    {product.specifications?.map((spec, index) => (
                      <tr key={index}>
                        <td className="py-3 px-4 text-sm font-medium text-gray-900 bg-gray-50 w-1/3">{spec.name}</td>
                        <td className="py-3 px-4 text-sm text-gray-700">{spec.value}</td>
                      </tr>
                    )) || (
                      <tr>
                        <td className="py-3 px-4 text-sm text-gray-500 text-center" colSpan="2">
                          لا توجد مواصفات متاحة لهذا المنتج.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
            
            {activeTab === 'reviews' && (
              <div>
                {product.reviews?.length > 0 ? (
                  <div className="space-y-6">
                    {product.reviews.map((review, index) => (
                      <div key={index} className="border-b border-gray-200 pb-6">
                        <div className="flex items-center mb-2">
                          <span className="font-medium text-gray-900">{review.name}</span>
                          <span className="mx-2 text-gray-300">•</span>
                          <span className="text-sm text-gray-500">{review.date}</span>
                        </div>
                        <div className="mb-2">
                          {renderRating(review.rating)}
                        </div>
                        <p className="text-gray-700">{review.comment}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-500">لا توجد تقييمات لهذا المنتج حتى الآن.</p>
                    <p className="mt-2 text-gray-700">كن أول من يقيم هذا المنتج!</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* المنتجات ذات الصلة */}
        {relatedProducts.length > 0 && (
          <div className="mt-16">
            <h2 className="text-xl font-bold text-gray-900 mb-6">منتجات مشابهة قد تعجبك</h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {console.log(`Rendering ${relatedProducts.length} related products`)}
              {relatedProducts.map((relatedProduct, index) => {
                // Ensure price is a valid number
                const price = typeof relatedProduct.price === 'number' && !isNaN(relatedProduct.price) ? relatedProduct.price : 0;
                // Ensure salePrice is a valid number or null
                const salePrice = typeof relatedProduct.salePrice === 'number' && !isNaN(relatedProduct.salePrice) ? relatedProduct.salePrice : null;
                
                return (
                  <div key={relatedProduct.id || index} className="group relative bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition duration-300">
                    <Link to={`/store/${store?.id}/product/${relatedProduct.id}`}>
                      <div className="relative pt-[100%] overflow-hidden">
                        <img
                          src={getProductImage(relatedProduct.images, 0)}
                          alt={relatedProduct.name}
                          className="absolute inset-0 h-full w-full object-cover object-center group-hover:opacity-90"
                          onError={(e) => {
                            console.error('Failed to load related product image:', relatedProduct.name);
                            e.target.onerror = null; // Prevent infinite loop
                            e.target.src = getProductImage(relatedProduct.images);
                          }}
                        />
                      </div>
                    </Link>
                    
                    <div className="p-4">
                      <h3 className="text-sm font-medium text-gray-900 mb-1">
                        <Link to={`/store/${store?.id}/product/${relatedProduct.id}`}>
                          {relatedProduct.name}
                        </Link>
                      </h3>
                      
                      <div className="mt-1 mb-2">
                        {renderRating(relatedProduct.rating || 0)}
                      </div>
                      
                      <div className="flex justify-between items-center mt-2">
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
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetails; 