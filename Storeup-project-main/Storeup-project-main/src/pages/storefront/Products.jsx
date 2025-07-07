import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ProductCard } from './StorefrontHome';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const Products = ({ products, loading, store, theme, addToCart }) => {
  const [searchParams] = useSearchParams();
  const [filteredProducts, setFilteredProducts] = useState([]);
  const filter = searchParams.get('filter');

  useEffect(() => {
    if (products && Array.isArray(products)) {
      let filtered = [...products];

      if (filter === 'featured') {
        filtered = filtered.filter(p => p.featured);
      } else if (filter === 'new') {
        filtered = filtered.sort((a, b) => 
          new Date(b.createdAt || b.created_at) - new Date(a.createdAt || a.created_at)
        );
      }

      setFilteredProducts(filtered);
    }
  }, [products, filter]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">
        {filter === 'featured' ? 'المنتجات المميزة' : 
         filter === 'new' ? 'أحدث المنتجات' : 
         'كل المنتجات'}
      </h1>

      <AnimatePresence>
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
        >
          {filteredProducts.map((product) => (
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

      {filteredProducts.length === 0 && (
        <div className="text-center py-12">
          <h3 className="text-lg font-medium text-gray-900">لا توجد منتجات</h3>
          <p className="mt-1 text-sm text-gray-500">
            لم يتم العثور على منتجات تطابق التصفية المحددة.
          </p>
        </div>
      )}
    </div>
  );
};

export default Products; 