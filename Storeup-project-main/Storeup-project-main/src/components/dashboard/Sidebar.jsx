import { Link, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
  HomeIcon,
  ShoppingBagIcon,
  ShoppingCartIcon,
  CogIcon,
  ChartBarIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';

const Sidebar = ({ sidebarOpen, setSidebarOpen }) => {
  const location = useLocation();
  const { user } = useSelector((state) => state.auth);
  const { currentStore } = useSelector((state) => state.store);

  const navigation = [
    { name: 'الرئيسية', href: '/dashboard', icon: HomeIcon },
    { name: 'المنتجات', href: '/dashboard/products', icon: ShoppingBagIcon },
    { name: 'الطلبات', href: '/dashboard/orders', icon: ShoppingCartIcon },
    { name: 'التحليلات', href: '/dashboard/analytics', icon: ChartBarIcon },
    { name: 'الإعدادات', href: '/dashboard/settings', icon: CogIcon },
  ];

  return (
    <>
      {/* Mobile sidebar */}
      <div
        className={`fixed inset-0 z-40 lg:hidden bg-gray-600 bg-opacity-75 transition-opacity ease-linear duration-300 ${
          sidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setSidebarOpen(false)}
      />

      <div
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-white border-r border-gray-200 transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-auto lg:w-20 xl:w-64 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Sidebar header */}
        <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200 lg:justify-center xl:justify-between">
          <Link to="/dashboard" className="flex items-center space-x-2 xl:space-x-4 rtl:space-x-reverse">
            <span className="text-xl font-bold text-primary-600 xl:block lg:hidden">إيكوشوب</span>
          </Link>
          <button
            onClick={() => setSidebarOpen(false)}
            className="p-1 text-gray-500 rounded-md hover:bg-gray-100 lg:hidden"
          >
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex flex-col mt-4 px-2 space-y-1">
          {navigation.map((item) => {
            const isActive = location.pathname === item.href || location.pathname.startsWith(item.href + '/');
            return (
              <Link
                key={item.name}
                to={item.href}
                className={`flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                  isActive
                    ? 'bg-primary-50 text-primary-600'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <item.icon
                  className={`h-6 w-6 flex-shrink-0 ${
                    isActive ? 'text-primary-600' : 'text-gray-500'
                  }`}
                />
                <span className="ml-3 lg:hidden xl:inline">{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* Store selector */}
        {currentStore && (
          <div className="absolute bottom-0 w-full p-4 border-t border-gray-200">
            <div className="flex items-center space-x-3 rtl:space-x-reverse">
              <div 
                className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center"
              >
                <span className="text-primary-700 font-semibold text-lg">
                  {currentStore.name ? currentStore.name[0].toUpperCase() : 'S'}
                </span>
              </div>
              <div className="lg:hidden xl:block">
                <p className="text-sm font-medium text-gray-700">{currentStore.name || 'متجر إيكوشوب'}</p>
                <p className="text-xs text-gray-500 truncate">
                  {currentStore.domain ? (
                    <a href={`https://${currentStore.domain}.mydomain.com`} target="_blank" rel="noopener noreferrer">
                      {`${currentStore.domain}.mydomain.com`}
                    </a>
                  ) : 'yourdomain.storeup.com'}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Sidebar; 