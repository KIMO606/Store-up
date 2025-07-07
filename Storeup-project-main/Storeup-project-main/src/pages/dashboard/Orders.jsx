import React, { useState, useEffect } from 'react';
import { PlusIcon, MagnifyingGlassIcon, AdjustmentsHorizontalIcon } from '@heroicons/react/24/outline';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  // Mock data for demonstration
  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      const mockOrders = [
        {
          id: '#ORD-123456',
          customer: 'أحمد محمد',
          date: '2023-06-15',
          total: 299.99,
          status: 'completed',
          items: 3,
          paymentMethod: 'بطاقة ائتمان'
        },
        {
          id: '#ORD-123457',
          customer: 'سارة أحمد',
          date: '2023-06-14',
          total: 149.50,
          status: 'processing',
          items: 2,
          paymentMethod: 'باي بال'
        },
        {
          id: '#ORD-123458',
          customer: 'محمد علي',
          date: '2023-06-12',
          total: 599.99,
          status: 'pending',
          items: 5,
          paymentMethod: 'تحويل بنكي'
        },
        {
          id: '#ORD-123459',
          customer: 'فاطمة خالد',
          date: '2023-06-10',
          total: 89.99,
          status: 'completed',
          items: 1,
          paymentMethod: 'بطاقة ائتمان'
        },
        {
          id: '#ORD-123460',
          customer: 'عمر حسن',
          date: '2023-06-08',
          total: 199.99,
          status: 'cancelled',
          items: 2,
          paymentMethod: 'الدفع عند الاستلام'
        }
      ];
      setOrders(mockOrders);
      setLoading(false);
    }, 1000);
  }, []);

  const handleFilterChange = (newFilter) => {
    setFilter(newFilter);
  };

  const filteredOrders = orders.filter(order => {
    if (filter === 'all') return true;
    return order.status === filter;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'completed':
        return 'مكتمل';
      case 'processing':
        return 'قيد المعالجة';
      case 'pending':
        return 'معلق';
      case 'cancelled':
        return 'ملغي';
      default:
        return status;
    }
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-800">الطلبات</h1>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-md flex items-center">
          <PlusIcon className="h-5 w-5 mr-2" />
          <span>طلب جديد</span>
        </button>
      </div>

      <div className="bg-white rounded-lg shadow mb-6 p-4">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center">
          <div className="relative mb-4 md:mb-0">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="البحث عن الطلبات..."
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>
          
          <div className="flex items-center space-x-4">
            <AdjustmentsHorizontalIcon className="h-5 w-5 text-gray-500" />
            <div className="flex space-x-2">
              <button 
                className={`px-3 py-1 rounded-md text-sm ${filter === 'all' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-800'}`}
                onClick={() => handleFilterChange('all')}
              >
                الكل
              </button>
              <button 
                className={`px-3 py-1 rounded-md text-sm ${filter === 'pending' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-800'}`}
                onClick={() => handleFilterChange('pending')}
              >
                معلق
              </button>
              <button 
                className={`px-3 py-1 rounded-md text-sm ${filter === 'processing' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-800'}`}
                onClick={() => handleFilterChange('processing')}
              >
                قيد المعالجة
              </button>
              <button 
                className={`px-3 py-1 rounded-md text-sm ${filter === 'completed' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-800'}`}
                onClick={() => handleFilterChange('completed')}
              >
                مكتمل
              </button>
              <button 
                className={`px-3 py-1 rounded-md text-sm ${filter === 'cancelled' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-800'}`}
                onClick={() => handleFilterChange('cancelled')}
              >
                ملغي
              </button>
            </div>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-x-auto">
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
                  التاريخ
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  القيمة
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  الحالة
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  طريقة الدفع
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  الإجراءات
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredOrders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {order.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {order.customer}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(order.date).toLocaleDateString('ar-EG')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {parseFloat(order.total).toFixed(2)} ج.م
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(order.status)}`}>
                      {getStatusText(order.status)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {order.paymentMethod}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <button className="text-blue-600 hover:text-blue-900 mr-3">عرض</button>
                    <button className="text-gray-600 hover:text-gray-900">تعديل</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {filteredOrders.length === 0 && (
            <div className="text-center py-10">
              <p className="text-gray-500">لا توجد طلبات تطابق الفلتر المحدد</p>
            </div>
          )}
        </div>
      )}
      
      <div className="mt-6 flex justify-between items-center">
        <div className="text-sm text-gray-700">
          عرض <span className="font-medium">{filteredOrders.length}</span> من أصل <span className="font-medium">{orders.length}</span> طلب
        </div>
        <div className="flex justify-center space-x-1">
          <button className="px-3 py-1 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50">
            السابق
          </button>
          <button className="px-3 py-1 border border-gray-300 bg-blue-600 text-sm font-medium text-white hover:bg-blue-700">
            1
          </button>
          <button className="px-3 py-1 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50">
            2
          </button>
          <button className="px-3 py-1 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50">
            3
          </button>
          <button className="px-3 py-1 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50">
            التالي
          </button>
        </div>
      </div>
    </div>
  );
};

export default Orders; 