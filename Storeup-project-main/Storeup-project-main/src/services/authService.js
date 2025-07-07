import api from './apiService'; // استخدام apiService لإرسال التوكن تلقائياً

// Register user
const register = async (userData) => {
  const response = await api.post('/users/', userData);
  if (response.data.token) {
    localStorage.setItem('token', response.data.token);
  }
  return response.data;
};

// Login user
const login = async (userData) => {
  const response = await api.post('/users/login/', userData);
  if (response.data.token) {
    localStorage.setItem('token', response.data.token);
  }
  return response.data;
};

// Logout user
const logout = () => {
  localStorage.removeItem('token');
};

// Get current user info from the server
const getCurrentUser = async () => {
  const response = await api.get('/users/me/');
  return response.data;
};

// Forgot password
const forgotPassword = async (email) => {
  const response = await api.post('/auth/forgot-password/', { email });
  return response.data;
};

// Reset password
const resetPassword = async (token, newPassword) => {
  const response = await api.post('/auth/reset-password/', {
    token,
    password: newPassword
  });
  return response.data;
};

// Verify email
const verifyEmail = async (token) => {
  const response = await api.get(`/auth/verify-email/${token}`);
  return response.data;
};

// Update profile
const updateProfile = async (userData) => {
  const response = await api.put('/auth/profile/', userData);
  
  // Update local storage with new data
  if (response.data) {
    const user = JSON.parse(localStorage.getItem('user'));
    const updatedUser = { ...user, ...response.data };
    localStorage.setItem('user', JSON.stringify(updatedUser));
  }
  
  return response.data;
};

// Change password
const changePassword = async (passwordData) => {
  const response = await api.put('/auth/change-password/', passwordData);
  return response.data;
};

const authService = {
  register,
  login,
  logout,
  forgotPassword,
  resetPassword,
  verifyEmail,
  getCurrentUser,
  updateProfile,
  changePassword
};

export default authService; 