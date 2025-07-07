import { createSlice } from '@reduxjs/toolkit';

// الحالة الأولية
const initialState = {
  sidebarOpen: false,
  theme: 'light',
  notifications: [],
  isLoading: false,
  modal: {
    isOpen: false,
    type: null,
    data: null,
  },
  toast: {
    isVisible: false,
    message: '',
    type: 'info', // info, success, error, warning
  },
  mobileMenuOpen: false,
  searchOpen: false,
  cartDrawerOpen: false,
  filters: {
    isOpen: false,
    selectedCategories: [],
    priceRange: { min: 0, max: 1000 },
    sortBy: 'newest',
  },
};

// شريحة واجهة المستخدم
export const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    // التحكم في الشريط الجانبي
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen;
    },
    openSidebar: (state) => {
      state.sidebarOpen = true;
    },
    closeSidebar: (state) => {
      state.sidebarOpen = false;
    },
    
    // التحكم في السمة
    setTheme: (state, action) => {
      state.theme = action.payload;
    },
    toggleTheme: (state) => {
      state.theme = state.theme === 'light' ? 'dark' : 'light';
    },
    
    // التحكم في الإشعارات
    addNotification: (state, action) => {
      state.notifications.push({
        id: Date.now(),
        read: false,
        ...action.payload,
      });
    },
    markNotificationAsRead: (state, action) => {
      const notification = state.notifications.find(n => n.id === action.payload);
      if (notification) {
        notification.read = true;
      }
    },
    clearNotifications: (state) => {
      state.notifications = [];
    },
    
    // التحكم في حالة التحميل
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    
    // التحكم في الإشعارات المنبثقة
    showToast: (state, action) => {
      state.toast = {
        isVisible: true,
        message: action.payload.message,
        type: action.payload.type || 'info',
      };
    },
    hideToast: (state) => {
      state.toast.isVisible = false;
    },
    
    // التحكم في النوافذ المنبثقة
    openModal: (state, action) => {
      state.modal = {
        isOpen: true,
        type: action.payload.type,
        data: action.payload.data || null,
      };
    },
    closeModal: (state) => {
      state.modal.isOpen = false;
    },
    
    // التحكم في قائمة الهاتف المحمول
    toggleMobileMenu: (state) => {
      state.mobileMenuOpen = !state.mobileMenuOpen;
    },
    closeMobileMenu: (state) => {
      state.mobileMenuOpen = false;
    },
    
    // التحكم في حقل البحث
    toggleSearch: (state) => {
      state.searchOpen = !state.searchOpen;
    },
    closeSearch: (state) => {
      state.searchOpen = false;
    },
    
    // التحكم في سلة التسوق
    toggleCartDrawer: (state) => {
      state.cartDrawerOpen = !state.cartDrawerOpen;
    },
    openCartDrawer: (state) => {
      state.cartDrawerOpen = true;
    },
    closeCartDrawer: (state) => {
      state.cartDrawerOpen = false;
    },
    
    // التحكم في الفلاتر
    toggleFilters: (state) => {
      state.filters.isOpen = !state.filters.isOpen;
    },
    updateFilters: (state, action) => {
      state.filters = {
        ...state.filters,
        ...action.payload,
      };
    },
    resetFilters: (state) => {
      state.filters = {
        ...initialState.filters,
        isOpen: state.filters.isOpen,
      };
    },
  },
});

export const {
  toggleSidebar,
  openSidebar,
  closeSidebar,
  setTheme,
  toggleTheme,
  addNotification,
  markNotificationAsRead,
  clearNotifications,
  setLoading,
  showToast,
  hideToast,
  openModal,
  closeModal,
  toggleMobileMenu,
  closeMobileMenu,
  toggleSearch,
  closeSearch,
  toggleCartDrawer,
  openCartDrawer,
  closeCartDrawer,
  toggleFilters,
  updateFilters,
  resetFilters,
} = uiSlice.actions;

export default uiSlice.reducer; 