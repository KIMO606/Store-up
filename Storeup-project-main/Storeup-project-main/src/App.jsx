import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Provider, useDispatch } from 'react-redux';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import store from './store';
import { getCurrentUser } from './features/auth/authActions';
import ProtectedRoute from './components/ProtectedRoute';
import DashboardLayout from './layout/DashboardLayout';
import ThemeProvider from './components/ThemeProvider';
import ApiTest from './components/ApiTest';
import { StoreProvider } from './context/StoreContext';

// Auth Pages
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import ForgotPassword from './pages/auth/ForgotPassword';

// Dashboard Pages
import Dashboard from './pages/dashboard/Dashboard';
import Products from './pages/dashboard/Products';
import Orders from './pages/dashboard/Orders';
import StoreSettings from './pages/dashboard/StoreSettings';
import Analytics from './pages/dashboard/Analytics';
import AddProduct from './pages/dashboard/AddProduct';
import StoreFront from './pages/storefront/StoreFront';
import EditProduct from './pages/dashboard/EditProduct';
import StorePreview from './pages/dashboard/StorePreview';
import Home from '../src/landingpage/Home';

function AppContent() {
  const dispatch = useDispatch();

  useEffect(() => {
    // حاول تحميل بيانات المستخدم عند بدء تشغيل التطبيق
    if (localStorage.getItem('token')) {
      dispatch(getCurrentUser());
    }
  }, [dispatch]);

  return (
    <Router>
      <Routes>
        {/* Landing Page */}
        
        

        
        {/* Public Routes */}
        {/* Auth Routes */}
        <Route path='/' element={<Home/>} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        
        {/* Dashboard Routes */}
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }>
          <Route index element={<Dashboard />} />
          <Route path="products" element={<Products />} />
          <Route path="products/add" element={<AddProduct />} />
          <Route path="products/:id/edit" element={<EditProduct />} />
          <Route path="orders" element={<Orders />} />
          <Route path="settings" element={<StoreSettings />} />
          <Route path="analytics" element={<Analytics />} />
          <Route path="preview" element={<StorePreview />} />
        </Route>

        {/* StoreFront Routes */}
        <Route path="/store/:storeId/*" element={<StoreFront />} />
        
        {/* Redirect root to dashboard or login */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        
        {/* 404 Page */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />

        <Route path="/api-test" element={<ApiTest />} />
      </Routes>
    </Router>
  );
}

function App() {
  return (
    <StoreProvider>
      <Provider store={store}>
        <ThemeProvider>
          <AppContent />
          <ToastContainer
            position="top-right"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="light"
          />
        </ThemeProvider>
      </Provider>
    </StoreProvider>
  );
}

export default App;
