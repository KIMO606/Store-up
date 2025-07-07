import { Navigate, useLocation, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';

const ProtectedRoute = ({ children }) => {
  const location = useLocation();
  const { isAuthenticated } = useSelector((state) => state.auth);
  
  if (!isAuthenticated) {
    // إعادة توجيه المستخدم إلى صفحة تسجيل الدخول مع تخزين المسار المطلوب
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  
  // في حالة المصادقة، عرض المحتوى المحمي
  return children ? children : <Outlet />;
};

export default ProtectedRoute; 