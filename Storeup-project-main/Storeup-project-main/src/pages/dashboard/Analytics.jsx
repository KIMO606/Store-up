import React, { useState, useEffect } from 'react';
import { ArrowDownIcon, ArrowUpIcon } from '@heroicons/react/24/solid';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { Line, Bar, Doughnut } from 'react-chartjs-2';

// تسجيل مكونات الرسم البياني
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const Analytics = () => {
  const [period, setPeriod] = useState('daily');
  const [loading, setLoading] = useState(true);
  const [salesData, setSalesData] = useState([]);
  const [visitorData, setVisitorData] = useState([]);
  const [productPerformance, setProductPerformance] = useState([]);
  const [dashboardStats, setDashboardStats] = useState({
    totalSales: 0,
    totalOrders: 0,
    averageOrderValue: 0,
    conversionRate: 0,
  });

  // بيانات وهمية للمبيعات
  const mockSalesData = {
    daily: [
      { date: '01/04', sales: 1200.50 },
      { date: '02/04', sales: 950.25 },
      { date: '03/04', sales: 1450.75 },
      { date: '04/04', sales: 1320.30 },
      { date: '05/04', sales: 1800.10 },
      { date: '06/04', sales: 2100.60 },
      { date: '07/04', sales: 1750.90 },
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
      { date: '01/04', visitors: 120 },
      { date: '02/04', visitors: 95 },
      { date: '03/04', visitors: 145 },
      { date: '04/04', visitors: 132 },
      { date: '05/04', visitors: 180 },
      { date: '06/04', visitors: 210 },
      { date: '07/04', visitors: 175 },
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
    totalSales: 98500.25,
    totalOrders: 356,
    averageOrderValue: 276.69,
    conversionRate: 3.2,
  };

  useEffect(() => {
    // محاكاة طلب واجهة برمجة التطبيقات
    setLoading(true);
    setTimeout(() => {
      setSalesData(mockSalesData[period]);
      setVisitorData(mockVisitorData[period]);
      setProductPerformance(mockProductPerformance);
      setDashboardStats(mockDashboardStats);
      setLoading(false);
    }, 1000);
  }, [period]);

  // تكوين بيانات مخطط المبيعات
  const salesChartData = {
    labels: salesData.map(item => {
      if (period === 'daily') return item.date;
      if (period === 'weekly') return item.week;
      return item.month;
    }),
    datasets: [
      {
        label: 'المبيعات',
        data: salesData.map(item => item.sales),
        borderColor: 'rgb(53, 162, 235)',
        backgroundColor: 'rgba(53, 162, 235, 0.5)',
      },
    ],
  };

  // تكوين بيانات مخطط الزوار
  const visitorChartData = {
    labels: visitorData.map(item => {
      if (period === 'daily') return item.date;
      if (period === 'weekly') return item.week;
      return item.month;
    }),
    datasets: [
      {
        label: 'الزوار',
        data: visitorData.map(item => item.visitors),
        borderColor: 'rgb(75, 192, 192)',
        backgroundColor: 'rgba(75, 192, 192, 0.5)',
      },
    ],
  };

  // تكوين بيانات مخطط أداء المنتج
  const productPerformanceChartData = {
    labels: productPerformance.map(product => product.name),
    datasets: [
      {
        label: 'المبيعات',
        data: productPerformance.map(product => product.sales),
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
      },
      {
        label: 'المشاهدات',
        data: productPerformance.map(product => product.views),
        backgroundColor: 'rgba(53, 162, 235, 0.5)',
      },
    ],
  };

  // تكوين بيانات مخطط توزيع المبيعات
  const salesDistributionChartData = {
    labels: ['هواتف ذكية', 'أجهزة كمبيوتر محمولة', 'ملابس', 'إلكترونيات', 'أخرى'],
    datasets: [
      {
        label: 'توزيع المبيعات',
        data: [42, 28, 18, 8, 4],
        backgroundColor: [
          'rgba(255, 99, 132, 0.5)',
          'rgba(54, 162, 235, 0.5)',
          'rgba(255, 206, 86, 0.5)',
          'rgba(75, 192, 192, 0.5)',
          'rgba(153, 102, 255, 0.5)',
        ],
      },
    ],
  };

  // خيارات الرسم البياني الخطي
  const lineOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'المبيعات بمرور الوقت',
      },
    },
  };

  // خيارات الرسم البياني الشريطي
  const barOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'أداء المنتج',
      },
    },
  };

  // خيارات الرسم البياني الدائري
  const doughnutOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'right',
      },
      title: {
        display: true,
        text: 'توزيع المبيعات حسب الفئة',
      },
    },
  };

  const renderStatCard = (title, value, change, isPositive) => (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-semibold mt-1">{value}</p>
        </div>
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${isPositive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
          {isPositive ? <ArrowUpIcon className="h-3 w-3 mr-1" /> : <ArrowDownIcon className="h-3 w-3 mr-1" />}
          {change}
        </span>
      </div>
      <div className="mt-2">
        <div className={`h-1 w-full rounded-full bg-gray-200`}>
          <div
            className={`h-1 rounded-full ${isPositive ? 'bg-green-500' : 'bg-red-500'}`}
            style={{ width: isPositive ? '70%' : '30%' }}
          ></div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-800">التحليلات</h1>
        <div className="flex space-x-2">
          <select
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
            className="block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          >
            <option value="daily">يومي</option>
            <option value="weekly">أسبوعي</option>
            <option value="monthly">شهري</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <>
          {/* إحصائيات سريعة */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {renderStatCard('إجمالي المبيعات', `${dashboardStats.totalSales.toLocaleString()} ج.م`, '+12.5%', true)}
            {renderStatCard('إجمالي الطلبات', dashboardStats.totalOrders, '+7.2%', true)}
            {renderStatCard('متوسط قيمة الطلب', `${dashboardStats.averageOrderValue.toLocaleString()} ج.م`, '+3.1%', true)}
            {renderStatCard('معدل التحويل', `${dashboardStats.conversionRate}%`, '-0.8%', false)}
          </div>

          {/* مخططات على شكل شبكة */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-lg font-semibold mb-4">تحليل المبيعات</h2>
              <Line options={lineOptions} data={salesChartData} />
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-lg font-semibold mb-4">تحليل الزوار</h2>
              <Line options={lineOptions} data={visitorChartData} />
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-lg font-semibold mb-4">أداء المنتج</h2>
              <Bar options={barOptions} data={productPerformanceChartData} />
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-lg font-semibold mb-4">توزيع المبيعات حسب الفئة</h2>
              <Doughnut options={doughnutOptions} data={salesDistributionChartData} />
            </div>
          </div>

          {/* جدول أداء المنتج */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-lg font-semibold mb-4">أفضل المنتجات أداءً</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      المنتج
                    </th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      المبيعات
                    </th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      الإيرادات
                    </th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      المشاهدات
                    </th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      معدل التحويل
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {productPerformance.map((product) => (
                    <tr key={product.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {product.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {product.sales}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {product.revenue.toLocaleString()} ج.م
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {product.views}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {((product.sales / product.views) * 100).toFixed(1)}%
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Analytics; 