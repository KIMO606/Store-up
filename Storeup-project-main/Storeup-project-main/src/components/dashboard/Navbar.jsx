import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import {
  Bars3Icon,
  BellIcon,
  UserCircleIcon,
  ArrowRightOnRectangleIcon,
  Cog6ToothIcon
} from '@heroicons/react/24/outline';
import { logout } from '../../features/auth/authActions';

const Navbar = ({ toggleSidebar }) => {
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <header className="bg-white border-b border-gray-200">
      <div className="px-4 h-16 flex items-center justify-between">
        {/* Left side - Mobile menu button */}
        <div className="flex items-center">
          <button
            type="button"
            className="inline-flex items-center justify-center p-2 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100 lg:hidden"
            onClick={toggleSidebar}
          >
            <Bars3Icon className="h-6 w-6" />
          </button>
        </div>

        {/* Right side - Search, notifications, profile */}
        <div className="flex items-center space-x-4 rtl:space-x-reverse">
          {/* Notifications dropdown */}
          <div className="relative">
            <button
              type="button"
              className="p-1 rounded-full text-gray-500 hover:text-gray-700 hover:bg-gray-100 focus:outline-none"
              onClick={() => setNotificationsOpen(!notificationsOpen)}
            >
              <BellIcon className="h-6 w-6" />
              <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-white" />
            </button>

            {/* Notifications dropdown menu */}
            {notificationsOpen && (
              <div
                className="absolute left-0 mt-2 w-80 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-10"
                onBlur={() => setNotificationsOpen(false)}
              >
                <div className="py-1" role="menu" aria-orientation="vertical">
                  <div className="px-4 py-2 text-sm font-medium text-gray-700 border-b border-gray-200">
                    الإشعارات
                  </div>
                  <div className="max-h-60 overflow-y-auto">
                    <div className="px-4 py-3 border-b border-gray-200">
                      <p className="text-sm font-medium text-gray-900">طلب جديد</p>
                      <p className="text-xs text-gray-500">تم إنشاء طلب جديد بقيمة $29.99</p>
                      <p className="text-xs text-gray-500 mt-1">منذ 5 دقائق</p>
                    </div>
                  </div>
                  <div className="p-2 border-t border-gray-200">
                    <Link
                      to="/dashboard/notifications"
                      className="block w-full text-center px-4 py-2 text-sm font-medium text-primary-600 bg-primary-50 hover:bg-primary-100 rounded-md"
                    >
                      عرض كل الإشعارات
                    </Link>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Profile dropdown */}
          <div className="relative">
            <button
              type="button"
              className="flex items-center space-x-2 rtl:space-x-reverse focus:outline-none"
              onClick={() => setUserMenuOpen(!userMenuOpen)}
            >
              <span className="sr-only">افتح قائمة المستخدم</span>
              <div className="h-8 w-8 rounded-full bg-primary-100 flex items-center justify-center">
                {user?.avatar ? (
                  <img
                    className="h-8 w-8 rounded-full"
                    src={user.avatar}
                    alt={user.name}
                  />
                ) : (
                  <UserCircleIcon className="h-6 w-6 text-primary-600" />
                )}
              </div>
              <span className="text-sm font-medium text-gray-700 hidden md:block">
                {user?.name || 'مستخدم Storeup'}
              </span>
            </button>

            {/* Profile dropdown menu */}
            {userMenuOpen && (
              <div
                className="absolute left-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-10"
                onBlur={() => setUserMenuOpen(false)}
              >
                <div className="py-1" role="menu" aria-orientation="vertical">
                  <Link
                    to="/dashboard/profile"
                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    role="menuitem"
                  >
                    <UserCircleIcon className="mr-3 h-5 w-5 text-gray-500" />
                    الملف الشخصي
                  </Link>
                  <Link
                    to="/dashboard/settings"
                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    role="menuitem"
                  >
                    <Cog6ToothIcon className="mr-3 h-5 w-5 text-gray-500" />
                    الإعدادات
                  </Link>
                  <button
                    className="w-full flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    role="menuitem"
                    onClick={handleLogout}
                  >
                    <ArrowRightOnRectangleIcon className="mr-3 h-5 w-5 text-gray-500" />
                    تسجيل خروج
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar; 