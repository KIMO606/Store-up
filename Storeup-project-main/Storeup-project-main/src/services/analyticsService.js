// Base URL for API
const API_URL = 'https://api.ecoshop.com/api/v1/stores/';

// بيانات وهمية للمبيعات
const mockSalesData = {
  daily: [
    { date: '2025-04-01', sales: 1200.50 },
    { date: '2025-04-02', sales: 950.25 },
    { date: '2025-04-03', sales: 1450.75 },
    { date: '2025-04-04', sales: 1320.30 },
    { date: '2025-04-05', sales: 1800.10 },
    { date: '2025-04-06', sales: 2100.60 },
    { date: '2025-04-07', sales: 1750.90 },
  ],
  weekly: [
    { week: 'الأسبوع 1', sales: 7520.50 },
    { week: 'الأسبوع 2', sales: 8150.25 },
    { week: 'الأسبوع 3', sales: 6950.75 },
    { week: 'الأسبوع 4', sales: 9320.30 },
  ],
  monthly: [
    { month: 'يناير', sales: 32500.50 },
    { month: 'فبراير', sales: 28750.25 },
    { month: 'مارس', sales: 35120.75 },
    { month: 'أبريل', sales: 42350.30 },
  ],
};

// بيانات وهمية للزوار
const mockVisitorData = {
  daily: [
    { date: '2025-04-01', visitors: 120 },
    { date: '2025-04-02', visitors: 95 },
    { date: '2025-04-03', visitors: 145 },
    { date: '2025-04-04', visitors: 132 },
    { date: '2025-04-05', visitors: 180 },
    { date: '2025-04-06', visitors: 210 },
    { date: '2025-04-07', visitors: 175 },
  ],
  weekly: [
    { week: 'الأسبوع 1', visitors: 752 },
    { week: 'الأسبوع 2', visitors: 815 },
    { week: 'الأسبوع 3', visitors: 695 },
    { week: 'الأسبوع 4', visitors: 932 },
  ],
  monthly: [
    { month: 'يناير', visitors: 3250 },
    { month: 'فبراير', visitors: 2875 },
    { month: 'مارس', visitors: 3512 },
    { month: 'أبريل', visitors: 4235 },
  ],
};

// بيانات وهمية لأداء المنتجات
const mockProductPerformance = [
  { id: 'prod_1', name: 'هاتف ذكي - أيفون 15 برو', sales: 42, revenue: 37795.80, views: 520 },
  { id: 'prod_2', name: 'لابتوب - ماك بوك برو', sales: 28, revenue: 41999.72, views: 410 },
  { id: 'prod_3', name: 'سماعات لاسلكية', sales: 65, revenue: 10399.35, views: 780 },
  { id: 'prod_4', name: 'قميص رجالي كاجوال', sales: 95, revenue: 3799.05, views: 1250 },
  { id: 'prod_5', name: 'فستان نسائي', sales: 72, revenue: 5759.28, views: 920 },
];

// بيانات وهمية لإحصائيات لوحة التحكم
const mockDashboardStats = {
  store_1: {
    totalSales: 98500.25,
    totalOrders: 356,
    averageOrderValue: 276.69,
    conversionRate: 3.2,
  },
  store_2: {
    totalSales: 57820.50,
    totalOrders: 214,
    averageOrderValue: 270.19,
    conversionRate: 2.8,
  },
};

// الحصول على بيانات المبيعات
const getSalesData = async (storeId, period = 'daily') => {
  // في تطبيق حقيقي، ستقوم باستدعاء واجهة برمجة التطبيقات الخاصة بك
  // const response = await axios.get(`${API_URL}${storeId}/analytics/sales?period=${period}`);
  
  // لأغراض العرض، سنعيد البيانات الوهمية حسب الفترة المطلوبة
  return mockSalesData[period];
};

// الحصول على بيانات الزوار
const getVisitorData = async (storeId, period = 'daily') => {
  // في تطبيق حقيقي، ستقوم باستدعاء واجهة برمجة التطبيقات الخاصة بك
  // const response = await axios.get(`${API_URL}${storeId}/analytics/visitors?period=${period}`);
  
  // لأغراض العرض، سنعيد البيانات الوهمية حسب الفترة المطلوبة
  return mockVisitorData[period];
};

// الحصول على بيانات أداء المنتجات
const getProductPerformance = async (storeId, limit = 5) => {
  // في تطبيق حقيقي، ستقوم باستدعاء واجهة برمجة التطبيقات الخاصة بك
  // const response = await axios.get(`${API_URL}${storeId}/analytics/products?limit=${limit}`);
  
  // لأغراض العرض، سنعيد البيانات الوهمية محدودة بالعدد المطلوب
  return mockProductPerformance.slice(0, limit);
};

// الحصول على إحصائيات لوحة التحكم
const getDashboardStats = async (storeId) => {
  // في تطبيق حقيقي، ستقوم باستدعاء واجهة برمجة التطبيقات الخاصة بك
  // const response = await axios.get(`${API_URL}${storeId}/analytics/dashboard`);
  
  // لأغراض العرض، سنعيد البيانات الوهمية للمتجر المحدد أو بيانات افتراضية
  return mockDashboardStats[storeId] || {
    totalSales: 0,
    totalOrders: 0,
    averageOrderValue: 0,
    conversionRate: 0,
  };
};

const analyticsService = {
  getSalesData,
  getVisitorData,
  getProductPerformance,
  getDashboardStats,
};

export default analyticsService; 