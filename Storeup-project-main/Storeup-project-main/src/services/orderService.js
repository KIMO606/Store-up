// Base URL for API
const API_URL = 'https://api.ecoshop.com/api/v1/stores/';

// بيانات وهمية للطلبات
const mockOrders = [
  {
    id: 'order_1',
    orderNumber: 'ORD-001',
    customerId: 'cust_1',
    customerName: 'أحمد محمد',
    customerEmail: 'ahmed@example.com',
    customerPhone: '+966512345678',
    shippingAddress: {
      addressLine1: 'شارع الملك فهد',
      city: 'الرياض',
      state: 'الرياض',
      postalCode: '12345',
      country: 'المملكة العربية السعودية',
    },
    products: [
      {
        id: 'prod_1',
        name: 'هاتف ذكي - أيفون 15 برو',
        price: 999.99,
        salePrice: 899.99,
        quantity: 1,
        total: 899.99,
      },
      {
        id: 'prod_3',
        name: 'سماعات لاسلكية',
        price: 199.99,
        salePrice: 159.99,
        quantity: 2,
        total: 319.98,
      },
    ],
    subtotal: 1219.97,
    shippingCost: 15.00,
    tax: 61.00,
    total: 1295.97,
    status: 'تم الشحن', // [قيد المعالجة, تم التأكيد, تم الشحن, تم التسليم, ملغي]
    paymentMethod: 'بطاقة ائتمان',
    paymentStatus: 'مدفوع', // [مدفوع, قيد المعالجة, فشل الدفع]
    storeId: 'store_1',
    createdAt: '2025-04-20T14:30:00.000Z',
    updatedAt: '2025-04-22T10:15:00.000Z',
  },
  {
    id: 'order_2',
    orderNumber: 'ORD-002',
    customerId: 'cust_2',
    customerName: 'سارة خالد',
    customerEmail: 'sara@example.com',
    customerPhone: '+966523456789',
    shippingAddress: {
      addressLine1: 'شارع الأمير محمد بن عبدالعزيز',
      city: 'جدة',
      state: 'مكة المكرمة',
      postalCode: '23456',
      country: 'المملكة العربية السعودية',
    },
    products: [
      {
        id: 'prod_4',
        name: 'قميص رجالي كاجوال',
        price: 49.99,
        salePrice: 39.99,
        quantity: 2,
        total: 79.98,
      },
    ],
    subtotal: 79.98,
    shippingCost: 10.00,
    tax: 4.00,
    total: 93.98,
    status: 'قيد المعالجة',
    paymentMethod: 'الدفع عند الاستلام',
    paymentStatus: 'قيد المعالجة',
    storeId: 'store_2',
    createdAt: '2025-04-19T09:45:00.000Z',
    updatedAt: '2025-04-19T09:45:00.000Z',
  },
  {
    id: 'order_3',
    orderNumber: 'ORD-003',
    customerId: 'cust_3',
    customerName: 'عمر أحمد',
    customerEmail: 'omar@example.com',
    customerPhone: '+966534567890',
    shippingAddress: {
      addressLine1: 'شارع الخليج',
      city: 'الدمام',
      state: 'المنطقة الشرقية',
      postalCode: '34567',
      country: 'المملكة العربية السعودية',
    },
    products: [
      {
        id: 'prod_2',
        name: 'لابتوب - ماك بوك برو',
        price: 1499.99,
        salePrice: null,
        quantity: 1,
        total: 1499.99,
      },
    ],
    subtotal: 1499.99,
    shippingCost: 0.00, // شحن مجاني
    tax: 75.00,
    total: 1574.99,
    status: 'تم التأكيد',
    paymentMethod: 'تحويل بنكي',
    paymentStatus: 'مدفوع',
    storeId: 'store_1',
    createdAt: '2025-04-18T16:20:00.000Z',
    updatedAt: '2025-04-19T11:30:00.000Z',
  },
  {
    id: 'order_4',
    orderNumber: 'ORD-004',
    customerId: 'cust_4',
    customerName: 'ليلى عبدالله',
    customerEmail: 'laila@example.com',
    customerPhone: '+966545678901',
    shippingAddress: {
      addressLine1: 'شارع الملك عبدالله',
      city: 'الرياض',
      state: 'الرياض',
      postalCode: '11564',
      country: 'المملكة العربية السعودية',
    },
    products: [
      {
        id: 'prod_5',
        name: 'فستان نسائي',
        price: 79.99,
        salePrice: null,
        quantity: 1,
        total: 79.99,
      },
    ],
    subtotal: 79.99,
    shippingCost: 10.00,
    tax: 4.00,
    total: 93.99,
    status: 'ملغي',
    paymentMethod: 'بطاقة ائتمان',
    paymentStatus: 'تم رد المبلغ',
    storeId: 'store_2',
    createdAt: '2025-04-17T14:50:00.000Z',
    updatedAt: '2025-04-18T09:20:00.000Z',
  },
];

// إنشاء طلب جديد
const createOrder = async (orderData) => {
  // في تطبيق حقيقي، ستقوم باستدعاء واجهة برمجة التطبيقات الخاصة بك
  // const response = await axios.post(`${API_URL}${orderData.storeId}/orders`, orderData);
  
  // لأغراض العرض، سنقوم بمحاكاة استجابة واجهة برمجة التطبيقات
  const mockResponse = {
    id: `order_${Date.now()}`,
    orderNumber: `ORD-${100 + mockOrders.length}`,
    customerId: orderData.customerId,
    customerName: orderData.customerName,
    customerEmail: orderData.customerEmail,
    customerPhone: orderData.customerPhone,
    shippingAddress: orderData.shippingAddress,
    products: orderData.products,
    subtotal: orderData.subtotal,
    shippingCost: orderData.shippingCost,
    tax: orderData.tax,
    total: orderData.total,
    status: 'قيد المعالجة',
    paymentMethod: orderData.paymentMethod,
    paymentStatus: orderData.paymentStatus || 'قيد المعالجة',
    storeId: orderData.storeId,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  
  // في تطبيق حقيقي، ستتم إدارة هذا بواسطة قاعدة البيانات
  mockOrders.push(mockResponse);
  
  return mockResponse;
};

// الحصول على طلبات لمتجر معين
const getOrders = async (storeId) => {
  // في تطبيق حقيقي، ستقوم باستدعاء واجهة برمجة التطبيقات الخاصة بك
  // const response = await axios.get(`${API_URL}${storeId}/orders`);
  
  // لأغراض العرض، سنقوم بتصفية الطلبات الوهمية حسب معرف المتجر
  const storeOrders = mockOrders.filter((order) => order.storeId === storeId);
  
  return storeOrders;
};

// الحصول على طلب حسب المعرف
const getOrderById = async (storeId, orderId) => {
  // في تطبيق حقيقي، ستقوم باستدعاء واجهة برمجة التطبيقات الخاصة بك
  // const response = await axios.get(`${API_URL}${storeId}/orders/${orderId}`);
  
  // لأغراض العرض، سنجد الطلب في بياناتنا الوهمية
  const order = mockOrders.find(
    (order) => order.storeId === storeId && order.id === orderId
  );
  
  if (!order) {
    throw new Error('الطلب غير موجود');
  }
  
  return order;
};

// الحصول على طلبات المستخدم
const getUserOrders = async () => {
  // في تطبيق حقيقي، ستقوم باستدعاء واجهة برمجة التطبيقات الخاصة بك
  // const response = await axios.get(`${API_URL}user/orders`);
  
  // لأغراض العرض، سنفترض أن المستخدم هو "cust_1" ونعيد طلباته
  const userOrders = mockOrders.filter((order) => order.customerId === 'cust_1');
  
  return userOrders;
};

// تحديث حالة الطلب
const updateOrderStatus = async (storeId, orderId, status) => {
  // في تطبيق حقيقي، ستقوم باستدعاء واجهة برمجة التطبيقات الخاصة بك
  // const response = await axios.put(`${API_URL}${storeId}/orders/${orderId}/status`, { status });
  
  // لأغراض العرض، سنجد ونحدث الطلب في بياناتنا الوهمية
  const orderIndex = mockOrders.findIndex(
    (order) => order.storeId === storeId && order.id === orderId
  );
  
  if (orderIndex === -1) {
    throw new Error('الطلب غير موجود');
  }
  
  mockOrders[orderIndex] = {
    ...mockOrders[orderIndex],
    status,
    updatedAt: new Date().toISOString(),
  };
  
  return mockOrders[orderIndex];
};

// الحصول على إحصائيات الطلبات
const getOrderStats = async (storeId) => {
  // في تطبيق حقيقي، ستقوم باستدعاء واجهة برمجة التطبيقات الخاصة بك
  // const response = await axios.get(`${API_URL}${storeId}/orders/stats`);
  
  // لأغراض العرض، سنحسب الإحصائيات من البيانات الوهمية
  const storeOrders = mockOrders.filter((order) => order.storeId === storeId);
  
  const totalOrders = storeOrders.length;
  
  // حساب إجمالي المبيعات (باستثناء الطلبات الملغاة)
  const totalSales = storeOrders
    .filter((order) => order.status !== 'ملغي')
    .reduce((sum, order) => sum + order.total, 0);
  
  // عدد الطلبات قيد المعالجة
  const pendingOrders = storeOrders.filter((order) => order.status === 'قيد المعالجة').length;
  
  return {
    totalOrders,
    totalSales,
    pendingOrders,
  };
};

const orderService = {
  createOrder,
  getOrders,
  getOrderById,
  getUserOrders,
  updateOrderStatus,
  getOrderStats,
};

export default orderService; 