// Base URL for API
const API_URL = 'https://api.storeup.com/api/v1/stores/';

// بدء القيم الافتراضية
const defaultStore = {
  id: 'store123',
  name: 'ستوراب',
  domain: 'storeup',
  description: 'متجر إلكتروني متكامل لبيع المنتجات الصديقة للبيئة',
  logo: '/logo.svg',
  theme: {
    primaryColor: '#0ea5e9',
    secondaryColor: '#8b5cf6',
    fontFamily: 'Cairo, sans-serif',
  },
  contactInfo: {
    email: 'info@storeup.com',
    phone: '+966 50 123 4567',
    address: 'الرياض، المملكة العربية السعودية',
  },
  socialMedia: {
    facebook: 'storeup',
    instagram: 'storeup',
    twitter: 'storeup',
  },
  shippingOptions: [
    { id: 1, name: 'توصيل قياسي', price: 20, daysToDeliver: '3-5' },
    { id: 2, name: 'توصيل سريع', price: 40, daysToDeliver: '1-2' },
  ],
  paymentMethods: [
    { id: 1, name: 'بطاقة ائتمان', isDefault: true },
    { id: 2, name: 'الدفع عند الاستلام', isDefault: false },
  ],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  userId: 'user_123'
};

// التحقق من وجود بيانات المتجر في localStorage
const initializeStores = () => {
  // جلب البيانات من localStorage إذا كانت موجودة
  const storedStores = localStorage.getItem('storeup_stores');
  
  if (storedStores) {
    return JSON.parse(storedStores);
  }
  
  // إذا لم تكن موجودة، استخدم القيم الافتراضية
  const initialStores = [defaultStore];
  localStorage.setItem('storeup_stores', JSON.stringify(initialStores));
  
  return initialStores;
};

// الحصول على متجر محدد
const getStoreFromStorage = (storeId) => {
  const stores = initializeStores();
  return stores.find((store) => store.id === storeId);
};

// تحديث المتاجر في localStorage
const updateStoresInStorage = (stores) => {
  localStorage.setItem('storeup_stores', JSON.stringify(stores));
};

// Create store
const createStore = async (storeData) => {
  const stores = initializeStores();
  
  const newStore = {
    id: `store_${Date.now()}`,
    name: storeData.name,
    domain: storeData.domain || storeData.name.toLowerCase().replace(/\s+/g, '-'),
    description: storeData.description || '',
    logo: storeData.logo || '/logo.svg',
    theme: {
      primaryColor: storeData.theme?.primaryColor || '#0ea5e9',
      secondaryColor: storeData.theme?.secondaryColor || '#8b5cf6',
      fontFamily: storeData.theme?.fontFamily || 'Cairo, sans-serif',
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    userId: 'user_123'
  };
  
  stores.push(newStore);
  updateStoresInStorage(stores);
  
  return newStore;
};

// Get user stores
const getUserStores = async () => {
  return initializeStores();
};

// Get store by ID
const getStoreById = async (storeId) => {
  const store = getStoreFromStorage(storeId);
  
  if (!store) {
    throw new Error('المتجر غير موجود');
  }
  
  return store;
};

// Update store
const updateStore = async (storeId, storeData) => {
  const stores = initializeStores();
  const storeIndex = stores.findIndex((store) => store.id === storeId);
  
  if (storeIndex === -1) {
    throw new Error('المتجر غير موجود');
  }
  
  // تأكد من وجود بنية صحيحة للخصائص
  const themeData = {
    primaryColor: storeData.theme?.primaryColor || stores[storeIndex].theme?.primaryColor || '#0ea5e9',
    secondaryColor: storeData.theme?.secondaryColor || stores[storeIndex].theme?.secondaryColor || '#8b5cf6',
    fontFamily: storeData.theme?.fontFamily || stores[storeIndex].theme?.fontFamily || 'Cairo, sans-serif',
    buttonStyle: storeData.theme?.buttonStyle || stores[storeIndex].theme?.buttonStyle || 'rounded-md',
    layout: storeData.theme?.layout || stores[storeIndex].theme?.layout || 'standard',
  };
  
  // دمج البيانات الجديدة مع البيانات الموجودة
  const updatedStore = {
    ...stores[storeIndex],
    name: storeData.name || stores[storeIndex].name,
    domain: storeData.domain || stores[storeIndex].domain,
    description: storeData.description || stores[storeIndex].description,
    logo: storeData.logo || stores[storeIndex].logo,
    theme: themeData,
    contactInfo: storeData.contactInfo || stores[storeIndex].contactInfo,
    socialMedia: storeData.socialMedia || stores[storeIndex].socialMedia,
    updatedAt: new Date().toISOString()
  };
  
  stores[storeIndex] = updatedStore;
  updateStoresInStorage(stores);
  
  // تسجيل الحدث في كونسول للتصحيح
  console.log('تم تحديث المتجر', updatedStore);
  
  return updatedStore;
};

// Delete store
const deleteStore = async (storeId) => {
  const stores = initializeStores();
  const filteredStores = stores.filter((store) => store.id !== storeId);
  
  updateStoresInStorage(filteredStores);
  
  return { success: true };
};

const storeService = {
  createStore,
  getUserStores,
  getStoreById,
  updateStore,
  deleteStore,
};

export default storeService; 