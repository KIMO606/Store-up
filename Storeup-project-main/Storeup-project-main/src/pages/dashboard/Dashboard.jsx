import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell
} from 'recharts';
import {
  CurrencyDollarIcon,
  ShoppingCartIcon,
  UsersIcon,
  ShoppingBagIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  EyeIcon,
} from '@heroicons/react/24/outline';

// Mock data for charts
const salesData = [
  { name: 'يناير', مبيعات: 4000 },
  { name: 'فبراير', مبيعات: 3000 },
  { name: 'مارس', مبيعات: 2000 },
  { name: 'أبريل', مبيعات: 2780 },
  { name: 'مايو', مبيعات: 1890 },
  { name: 'يونيو', مبيعات: 2390 },
  { name: 'يوليو', مبيعات: 3490 },
];

const recentOrders = [
  {
    id: 'ORD-001',
    customer: 'أحمد محمد',
    total: 124.99,
    status: 'مكتمل',
    date: '2025-04-20',
  },
  {
    id: 'ORD-002',
    customer: 'سارة خالد',
    total: 89.99,
    status: 'قيد المعالجة',
    date: '2025-04-19',
  },
  {
    id: 'ORD-003',
    customer: 'عمر أحمد',
    total: 42.50,
    status: 'مكتمل',
    date: '2025-04-18',
  },
  {
    id: 'ORD-004',
    customer: 'ليلى عبدالله',
    total: 199.99,
    status: 'ملغي',
    date: '2025-04-17',
  },
];

const categoryData = [
  { name: 'إلكترونيات', value: 400 },
  { name: 'ملابس', value: 300 },
  { name: 'أثاث', value: 200 },
  { name: 'كتب', value: 100 },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const StatsCard = ({ title, value, icon, change, isIncrease }) => {
  const Icon = icon;
  
  return (
    <div className="card flex p-4">
      <div className="flex-shrink-0 mr-4">
        <div className="bg-primary-100 p-3 rounded-lg">
          <Icon className="h-8 w-8 text-primary-600" />
        </div>
      </div>
      <div>
        <h3 className="text-lg font-medium text-gray-500">{title}</h3>
        <div className="flex items-center mt-1">
          <span className="text-2xl font-bold text-gray-900">{value}</span>
          {change && (
            <span className={`flex items-center ml-2 text-sm ${isIncrease ? 'text-green-600' : 'text-red-600'}`}>
              {isIncrease ? (
                <ArrowUpIcon className="h-4 w-4 mr-1" />
              ) : (
                <ArrowDownIcon className="h-4 w-4 mr-1" />
              )}
              {change}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

const Dashboard = () => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  
  useEffect(() => {
    // Here you would fetch dashboard data
    // dispatch(fetchDashboardData())
  }, [dispatch]);
  
  return (
    <div className="space-y-6">
      <div className="pb-5 border-b border-gray-200">
        <h1 className="text-2xl font-semibold text-gray-900">مرحباً، {user?.name || 'مستخدم Storeup'}</h1>
        <p className="mt-1 text-sm text-gray-500">
          هذه هي لوحة التحكم الخاصة بك. يمكنك هنا إدارة متجرك والاطلاع على الإحصائيات.
        </p>
      </div>
      
      {/* معاينة المتجر */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg shadow-md overflow-hidden">
        <div className="p-6 flex flex-col md:flex-row items-center justify-between">
          <div className="flex items-center mb-4 md:mb-0">
            <div className="p-3 rounded-full bg-blue-100 mr-4">
              <EyeIcon className="h-8 w-8 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">معاينة متجرك الإلكتروني</h2>
              <p className="text-gray-600 mt-1">شاهد متجرك كما يراه العملاء واختبر تجربة المستخدم</p>
            </div>
          </div>
          <Link 
            to="/dashboard/preview" 
            className="px-5 py-2 bg-primary text-white rounded-md hover:bg-primary-dark transition-colors flex items-center"
          >
            <EyeIcon className="h-5 w-5 ml-1" />
            <span>معاينة المتجر</span>
          </Link>
        </div>
      </div>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="المبيعات (شهري)"
          value="$8,450"
          icon={CurrencyDollarIcon}
          change="12%"
          isIncrease={true}
        />
        <StatsCard
          title="الطلبات"
          value="42"
          icon={ShoppingCartIcon}
          change="8%"
          isIncrease={true}
        />
        <StatsCard
          title="العملاء"
          value="128"
          icon={UsersIcon}
          change="15%"
          isIncrease={true}
        />
        <StatsCard
          title="المنتجات"
          value="24"
          icon={ShoppingBagIcon}
        />
      </div>
      
      {/* Sales Chart */}
      <div className="card">
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">المبيعات</h2>
        </div>
        <div className="p-4">
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={salesData}
                margin={{
                  top: 20,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="مبيعات" stroke="#8b5cf6" activeDot={{ r: 8 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
      
      {/* Bottom Section: Recent Orders and Category Distribution */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        {/* Recent Orders */}
        <div className="card overflow-hidden">
          <div className="p-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">الطلبات الأخيرة</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    رقم الطلب
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    العميل
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    المبلغ
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    الحالة
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    التاريخ
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {recentOrders.map((order) => (
                  <tr key={order.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {order.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {order.customer}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      ${order.total.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        order.status === 'مكتمل'
                          ? 'bg-green-100 text-green-800'
                          : order.status === 'قيد المعالجة'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {order.date}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        
        {/* Category Distribution */}
        <div className="card">
          <div className="p-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">توزيع الفئات</h2>
          </div>
          <div className="p-4">
            <div className="h-80 flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart >
                  <Pie 
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label =  {({ name, value, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`} 
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]}  />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 