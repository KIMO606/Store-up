// Base URL for API
const API_URL = 'https://api.ecoshop.com/api/v1/stores/';

// بيانات المنتجات الافتراضية
const defaultProducts = [
  {
    id: '1',
    name: 'هاتف ذكي صديق للبيئة',
    price: 1999,
    salePrice: 1799,
    categoryId: '1',
    category: 'إلكترونيات',
    description: 'هاتف ذكي عالي الأداء مصنوع من مواد معاد تدويرها وصديقة للبيئة. يتميز بشاشة عالية الدقة وبطارية طويلة العمر وكاميرا متطورة.',
    images: [
      'https://placehold.co/600x400?text=هاتف+ذكي+1',
      'https://placehold.co/600x400?text=هاتف+ذكي+2',
      'https://placehold.co/600x400?text=هاتف+ذكي+3',
    ],
    rating: 4.5,
    reviewCount: 120,
    stock: 50,
    featured: true,
    newArrival: false,
    sale: true,
    specifications: [
      { name: 'المعالج', value: 'ثماني النواة 2.5 جيجاهرتز' },
      { name: 'الذاكرة', value: '8 جيجابايت' },
      { name: 'التخزين', value: '128 جيجابايت' },
      { name: 'الشاشة', value: '6.5 بوصة AMOLED' },
      { name: 'البطارية', value: '5000 مللي أمبير' },
    ],
    storeId: 'store123',
    createdAt: '2023-04-10T10:00:00.000Z',
  },
  {
    id: '2',
    name: 'سماعات لاسلكية مستدامة',
    price: 499,
    salePrice: null,
    categoryId: '1',
    category: 'إلكترونيات',
    description: 'سماعات لاسلكية عالية الجودة مصنوعة من مواد مستدامة. تتميز بجودة صوت استثنائية وعمر بطارية طويل ومقاومة للماء.',
    images: [
      'https://picsum.photos/600/400?random=1',
      'https://picsum.photos/600/400?random=2',
    ],
    rating: 4.3,
    reviewCount: 85,
    stock: 30,
    featured: false,
    newArrival: true,
    sale: false,
    specifications: [
      { name: 'نوع الاتصال', value: 'بلوتوث 5.2' },
      { name: 'عمر البطارية', value: '30 ساعة' },
      { name: 'مقاومة الماء', value: 'IPX7' },
    ],
    storeId: 'store123',
    createdAt: '2023-05-20T14:30:00.000Z',
  },
  {
    id: '3',
    name: 'قميص قطني عضوي',
    price: 199,
    salePrice: 149,
    categoryId: '2',
    category: 'ملابس',
    description: 'قميص مصنوع من القطن العضوي 100٪، مريح وأنيق ومناسب لجميع المناسبات. متوفر بعدة ألوان وأحجام.',
    images: [
      'https://picsum.photos/600/400?random=3',
      'https://picsum.photos/600/400?random=4',
      'https://picsum.photos/600/400?random=5',
    ],
    rating: 4.7,
    reviewCount: 65,
    stock: 100,
    featured: true,
    newArrival: false,
    sale: true,
    storeId: 'store123',
    createdAt: '2023-04-25T09:15:00.000Z',
  }
];

// بيانات التصنيفات الافتراضية
const defaultCategories = [
  { id: '1', name: 'إلكترونيات', description: 'أجهزة إلكترونية متنوعة', storeId: 'store123' },
  { id: '2', name: 'ملابس', description: 'ملابس رجالية ونسائية وأطفال', storeId: 'store123' },
  { id: '3', name: 'منزل وحديقة', description: 'منتجات للمنزل والحديقة', storeId: 'store123' },
  { id: '4', name: 'العناية الشخصية', description: 'منتجات العناية الشخصية', storeId: 'store123' },
];

// التحقق من وجود بيانات المنتجات في localStorage
const initializeProducts = () => {
  // جلب البيانات من localStorage إذا كانت موجودة
  const storedProducts = localStorage.getItem('ecoshop_products');
  
  if (storedProducts) {
    return JSON.parse(storedProducts);
  }
  
  // إذا لم تكن موجودة، استخدم القيم الافتراضية
  localStorage.setItem('ecoshop_products', JSON.stringify(defaultProducts));
  
  return defaultProducts;
};

// التحقق من وجود بيانات التصنيفات في localStorage
const initializeCategories = () => {
  // جلب البيانات من localStorage إذا كانت موجودة
  const storedCategories = localStorage.getItem('ecoshop_categories');
  
  if (storedCategories) {
    return JSON.parse(storedCategories);
  }
  
  // إذا لم تكن موجودة، استخدم القيم الافتراضية
  localStorage.setItem('ecoshop_categories', JSON.stringify(defaultCategories));
  
  return defaultCategories;
};

// تحديث المنتجات في localStorage
const updateProductsInStorage = (products) => {
  localStorage.setItem('ecoshop_products', JSON.stringify(products));
};

// Create product
const createProduct = async (productData) => {
  const products = initializeProducts();
  
  const newProduct = {
    id: Date.now().toString(),
    name: productData.name,
    description: productData.description || '',
    price: parseFloat(productData.price) || 0,
    salePrice: productData.salePrice ? parseFloat(productData.salePrice) : null,
    categoryId: productData.categoryId || '',
    category: productData.category || '',
    images: productData.images || ['https://placehold.co/600x400?text=صورة+المنتج'],
    stock: parseInt(productData.stock) || 0,
    featured: productData.featured || false,
    newArrival: productData.newArrival || false,
    sale: productData.sale || false,
    specifications: productData.specifications || [],
    storeId: productData.storeId || 'store123',
    rating: 0,
    reviewCount: 0,
    createdAt: new Date().toISOString(),
    sku: 'SKU-' + Date.now().toString().substr(-6),
    quantity: parseInt(productData.stock) || 0,
  };
  
  products.push(newProduct);
  updateProductsInStorage(products);
  
  return newProduct;
};

// Get products for a store
const getProducts = async () => {
  const products = initializeProducts();
  const categories = initializeCategories();
  
  // للاستخدام الحقيقي، سنحاول تصفية المنتجات حسب متجر محدد
  // const storeProducts = products.filter((product) => product.storeId === storeId);
  
  // ولكن في بيئة الاختبار هذه، نعيد جميع المنتجات والتصنيفات
  return { products, categories };
};

// Get product by ID
const getProductById = async (storeId, productId) => {
  const products = initializeProducts();
  
  const product = products.find(product => product.id === productId);
  
  if (!product) {
    throw new Error('المنتج غير موجود');
  }
  
  return product;
};

// Update product
const updateProduct = async (storeId, productId, productData) => {
  const products = initializeProducts();
  
  const productIndex = products.findIndex(product => product.id === productId);
  
  if (productIndex === -1) {
    throw new Error('المنتج غير موجود');
  }
  
  const updatedProduct = {
    ...products[productIndex],
    ...productData,
    updatedAt: new Date().toISOString()
  };
  
  products[productIndex] = updatedProduct;
  updateProductsInStorage(products);
  
  return updatedProduct;
};

// Delete product
const deleteProduct = async (storeId, productId) => {
  const products = initializeProducts();
  
  const filteredProducts = products.filter(product => product.id !== productId);
  
  updateProductsInStorage(filteredProducts);
  
  return { success: true };
};

// Get categories
const getCategories = async () => {
  return initializeCategories();
};

const productService = {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  getCategories,
};

export default productService; 