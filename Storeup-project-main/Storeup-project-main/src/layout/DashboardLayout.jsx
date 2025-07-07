import { useState } from 'react';import Lottie from "lottie-react";import logo from "../assets/logo.json";import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';import { useSelector, useDispatch } from 'react-redux';import {  HomeIcon,  ShoppingBagIcon,  ShoppingCartIcon,  Cog6ToothIcon,  ChartBarIcon,  ArrowRightOnRectangleIcon,  EyeIcon,} from '@heroicons/react/24/outline';import Navbar from '../components/dashboard/Navbar';import { logout } from '../features/auth/authActions';import ChatBot from '../components/ChatBot';

const DashboardLayout = () => {  const location = useLocation();  const navigate = useNavigate();  const dispatch = useDispatch();  const { user } = useSelector((state) => state.auth);  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  const navigation = [
    { name: 'لوحة التحكم', href: '/dashboard', icon: HomeIcon },
    { name: 'المنتجات', href: '/dashboard/products', icon: ShoppingBagIcon },
    { name: 'الطلبات', href: '/dashboard/orders', icon: ShoppingCartIcon },
    { name: 'إعدادات المتجر', href: '/dashboard/settings', icon: Cog6ToothIcon },
    { name: 'التحليلات', href: '/dashboard/analytics', icon: ChartBarIcon },
    { name: 'معاينة المتجر', href: '/dashboard/preview', icon: EyeIcon },
  ];
  
  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };
  
  return (
    <div className="h-screen flex overflow-hidden bg-gray-100">
      {/* Sidebar for mobile */}
      <div
        className={`fixed inset-0 flex z-40 md:hidden ${
          sidebarOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        } transition-opacity ease-linear duration-300`}
      >
        <div
          className={`fixed inset-0 bg-gray-600 bg-opacity-75 ${
            sidebarOpen ? 'opacity-100' : 'opacity-0'
          } transition-opacity ease-linear duration-300`}
          onClick={() => setSidebarOpen(false)}
        ></div>
        
        <div
          className={`relative flex-1 flex flex-col max-w-xs w-full pt-5 pb-4 bg-white transform ${
            sidebarOpen ? 'translate-x-0' : '-translate-x-full'
          } transition duration-300 ease-in-out`}
        >
          <div className="absolute top-0 left-0 mt-3 -ml-12 bg-white rounded-full p-1">
            <button
              type="button"
              className="flex items-center justify-center h-10 w-10 rounded-full focus:outline-none"
              onClick={() => setSidebarOpen(false)}
            >
              <span className="sr-only">إغلاق القائمة الجانبية</span>
              <svg
                className="h-6 w-6 text-gray-600"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
          
          {renderSidebarContent()}
        </div>
      </div>
      
      {/* Sidebar for desktop */}
      <div className="hidden md:flex md:flex-shrink-0">
        <div className="flex flex-col w-64">
          <div className="flex flex-col h-0 flex-1">
            {renderSidebarContent()}
          </div>
        </div>
      </div>
      
      {/* Main content */}
      <div className="flex flex-col w-0 flex-1 overflow-hidden">
        <Navbar toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
        
        <main className="flex-1 relative overflow-y-auto focus:outline-none p-6 bg-gray-100">
          <Outlet />
        </main>
      </div>

      {/* Add ChatBot component */}
      <ChatBot />
    </div>
  );
  
  function renderSidebarContent() {
    return (
      <div className="flex flex-col flex-grow overflow-y-auto">
        <div className="flex items-center flex-shrink-0 px-4">
          <Lottie animationData={logo} className="w-10" />
          <span className="mr-2 text-xl font-bold text-primary-600">Storeup</span>
        </div>
        
        <div className="flex-1 flex flex-col mt-5">
          <nav className="flex-1 px-2 bg-white space-y-1">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`${
                  location.pathname === item.href
                    ? 'bg-primary-50 text-primary-600'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                } group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors`}
              >
                <item.icon
                  className={`${
                    location.pathname === item.href
                      ? 'text-primary-600'
                      : 'text-gray-400 group-hover:text-gray-500'
                  } ml-3 flex-shrink-0 h-6 w-6 transition-colors`}
                  aria-hidden="true"
                />
                {item.name}
              </Link>
            ))}
            
           
            
            <button
              onClick={handleLogout}
              className="w-full text-right text-gray-600 hover:bg-gray-50 hover:text-gray-900 group flex items-center px-2 py-2 text-sm font-medium rounded-md"
            >
              <ArrowRightOnRectangleIcon
                className="text-gray-400 group-hover:text-gray-500 ml-3 flex-shrink-0 h-6 w-6"
                aria-hidden="true"
              />
              تسجيل الخروج
            </button>
          </nav>
        </div>
        
        <div className="flex-shrink-0 flex border-t border-gray-200 p-4">
          <Link to="/dashboard/profile" className="flex-shrink-0 w-full group block">
            <div className="flex items-center">
              <div>
                {user?.avatar ? (
                  <img
                    className="inline-block h-10 w-10 rounded-full"
                    src={user.avatar}
                    alt={user?.name}
                  />
                ) : (
                  <div className="inline-block h-10 w-10 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center">
                    <span className="font-medium text-lg">
                      {user?.name?.charAt(0) || 'U'}
                    </span>
                  </div>
                )}
              </div>
              <div className="mr-3">
                <p className="text-sm font-medium text-gray-700 group-hover:text-gray-900">
                  {user?.name || 'مستخدم'}
                </p>
                <p className="text-xs font-medium text-gray-500 group-hover:text-gray-700">
                  الملف الشخصي
                </p>
              </div>
            </div>
          </Link>
        </div>
      </div>
    );
  }
};

export default DashboardLayout; 