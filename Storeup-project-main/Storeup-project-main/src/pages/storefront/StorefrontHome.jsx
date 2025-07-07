import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { StarIcon } from '@heroicons/react/20/solid';
import { ShoppingCartIcon } from '@heroicons/react/24/outline';
import { motion, AnimatePresence } from 'framer-motion';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const cardVariants = {
  hidden: { 
    opacity: 0,
    y: 20
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut"
    }
  }
};

const ProductCard = ({ product, store, theme, addToCart }) => {
  const primaryColor = theme?.primaryColor || '#3b82f6';
  const [imageError, setImageError] = useState(false);

  const handleAddToCart = (e) => {
    e.preventDefault(); // Prevent navigation when clicking the button
    if (!product || !product.id) {
      console.error('Invalid product:', product);
      return;
    }
    addToCart(product);
  };

  const getProductImage = () => {
    if (!product || imageError) {
      return `https://via.placeholder.com/300?text=${encodeURIComponent(product?.name || 'Product')}`;
    }

    // Check if images is an array with valid URLs
    if (Array.isArray(product.images) && product.images.length > 0) {
      const firstImage = product.images[0];
      
      // If the image is a string URL
      if (typeof firstImage === 'string') {
        // Check if it's a full URL or needs the API URL prefix
        return firstImage.startsWith('http') 
          ? firstImage 
          : `${import.meta.env.VITE_API_URL || ''}${firstImage}`;
      }
      
      // If the image is an object with image_url property
      if (firstImage && firstImage.image_url) {
        return firstImage.image_url;
      }
    }

    // Check for single image_url property
    if (product.image_url) {
      return product.image_url;
    }

    // Check for single image property
    if (product.image) {
      return typeof product.image === 'string'
        ? product.image
        : product.image.image_url || `https://via.placeholder.com/300?text=${encodeURIComponent(product.name)}`;
    }

    // Fallback to placeholder
    return `https://via.placeholder.com/300?text=${encodeURIComponent(product.name || 'Product')}`;
  };

  const handleImageError = (e) => {
    e.target.onerror = null; // Prevent infinite loop
    setImageError(true);
  };

  const calculateDiscount = () => {
    if (!product.salePrice || !product.price) return null;
    const discount = Math.round(((product.price - product.salePrice) / product.price) * 100);
    return discount > 0 ? discount : null;
  };

  const imageUrl = getProductImage();
  const discount = calculateDiscount();

  return (
    <motion.div
      variants={cardVariants}
      whileHover={{ 
        scale: 1.05,
        transition: { duration: 0.2 }
      }}
      className="group relative bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden"
    >
      <Link to={`/store/${store?.id}/product/${product.id}`} className="block aspect-square overflow-hidden">
        <motion.img
          src={imageUrl}
          alt={product.name}
          className="w-full h-full object-cover object-center"
          whileHover={{ scale: 1.1 }}
          transition={{ duration: 0.3 }}
          onError={handleImageError}
        />
        {discount && (
          <motion.div 
            initial={{ x: 100 }}
            animate={{ x: 0 }}
            transition={{ type: "spring", stiffness: 100 }}
            className="absolute top-2 right-2 bg-red-500 text-white text-sm font-bold px-2 py-1 rounded-lg"
            style={{ backgroundColor: theme?.secondaryColor || '#ef4444' }}
          >
            {discount}% خصم
          </motion.div>
        )}
      </Link>

      <div className="p-4">
        <Link to={`/store/${store?.id}/product/${product.id}`} className="block">
          <motion.h3 
            className="text-sm font-medium text-gray-900 truncate group-hover:text-primary-600 transition-colors duration-200"
            whileHover={{ scale: 1.02 }}
          >
            {product.name}
          </motion.h3>
          <div className="mt-2 flex items-center justify-between">
            <motion.div whileHover={{ scale: 1.05 }}>
              {product.salePrice ? (
                <div className="flex items-baseline gap-2">
                  <span className="text-lg font-semibold text-red-600">
                    {product.salePrice.toFixed(2)} ج.م
                  </span>
                  <span className="text-sm text-gray-500 line-through">
                    {product.price.toFixed(2)} ج.م
                  </span>
                </div>
              ) : (
                <span className="text-lg font-semibold text-gray-900">
                  {product.price.toFixed(2)} ج.م
                </span>
              )}
            </motion.div>
            {product.rating && (
              <motion.div 
                className="flex items-center"
                whileHover={{ scale: 1.1 }}
              >
                {[0, 1, 2, 3, 4].map((rating) => (
                  <StarIcon
                    key={rating}
                    className={`h-5 w-5 flex-shrink-0 ${
                      product.rating > rating ? 'text-yellow-400' : 'text-gray-200'
                    }`}
                  />
                ))}
              </motion.div>
            )}
          </div>
        </Link>

        <div className="mt-4">
          <motion.button
            onClick={handleAddToCart}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-white rounded-lg"
            style={{ 
              background: `linear-gradient(135deg, ${primaryColor}, ${theme?.secondaryColor || '#8b5cf6'})`,
            }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <ShoppingCartIcon className="h-5 w-5" />
            <span>أضف للسلة</span>
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

export { ProductCard };

const ProductSection = ({ title, products, viewAllLink, store, theme, addToCart }) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
        {viewAllLink && (
          <Link
            to={viewAllLink}
            className="text-sm font-medium text-primary-600 hover:text-primary-500"
          >
            عرض الكل
          </Link>
        )}
      </div>
      <AnimatePresence>
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6"
        >
          {products.map((product) => (
            <ProductCard 
              key={product.id} 
              product={product}
              store={store}
              theme={theme}
              addToCart={addToCart}
            />
          ))}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

const StorefrontHome = ({ products, loading, addToCart, theme, store }) => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [newProducts, setNewProducts] = useState([]);

  useEffect(() => {
    if (products && Array.isArray(products)) {
      // استبعد منتجات منزل وحديقة من جميع الأقسام
      const filtered = products.filter(
        p => !(p.category === 'منزل وحديقة' || (p.category && typeof p.category === 'object' && p.category.name === 'منزل وحديقة'))
      );
      const featured = filtered.filter(p => p.featured).slice(0, 4);
      const newest = filtered
        .sort((a, b) => new Date(b.createdAt || b.created_at) - new Date(a.createdAt || a.created_at))
        .slice(0, 4);
      
      setFeaturedProducts(featured);
      setNewProducts(newest);
    }
  }, [products]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.nav
        initial="hidden"
        animate="visible"
        variants={{
          hidden: { y: -100, opacity: 0 },
          visible: {
            y: 0,
            opacity: 1,
            transition: {
              type: "spring",
              stiffness: 100,
              damping: 20
            }
          }
        }}
        className="bg-white shadow-sm sticky top-0 z-50 mb-8 rounded-lg"
      >
        {/* Existing navbar content */}
      </motion.nav>

      <div className="space-y-8">
        <ProductSection
          title="منتجات مميزة"
          products={featuredProducts}
          viewAllLink={`/store/${store?.id}/products?filter=featured`}
          store={store}
          theme={theme}
          addToCart={addToCart}
        />
        <ProductSection
          title="وصل حديثاً"
          products={newProducts}
          viewAllLink={`/store/${store?.id}/products?filter=new`}
          store={store}
          theme={theme}
          addToCart={addToCart}
        />
        {/* تم حذف قسم منزل وحديقة */}
      </div>
    </div>
  );
};

export default StorefrontHome;