import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCartIcon } from '@heroicons/react/24/outline';

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

const SearchResults = ({ filteredProducts, addToCart, theme }) => {
  const primaryColor = theme?.primaryColor || '#0ea5e9';
  const secondaryColor = theme?.secondaryColor || '#8b5cf6';

  if (!filteredProducts || filteredProducts.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <p className="text-gray-600">لم يتم العثور على نتائج.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <AnimatePresence>
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
        >
          {filteredProducts.map((product) => (
            <motion.div
              key={product.id}
              variants={cardVariants}
              className="bg-white rounded-lg shadow-md overflow-hidden"
              whileHover={{ y: -5 }}
              transition={{ duration: 0.2 }}
            >
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h3 className="text-lg font-semibold mb-2">{product.name}</h3>
                <p className="text-gray-600 mb-2">{product.description}</p>
                <div className="flex flex-col gap-2">
                  <p className="text-primary-600 font-bold">{product.price}جنية</p>
                  <motion.button
                    onClick={() => addToCart(product)}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-white rounded-lg shadow-sm hover:shadow-md"
                    style={{ 
                      background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})`,
                    }}
                    whileHover={{ scale: 1.02, shadow: "0 4px 6px rgba(0, 0, 0, 0.1)" }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <ShoppingCartIcon className="h-5 w-5" />
                    <span>أضف للسلة</span>
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default SearchResults;