import { createContext, useState, useContext } from 'react';

export const StoreContext = createContext();

export const StoreProvider = ({ children }) => {
  const [store, setStore] = useState(null);
  const [theme, setTheme] = useState({
    primaryColor: '#3b82f6',
    secondaryColor: '#8b5cf6'
  });
  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem('storeup_cart');
    return savedCart ? JSON.parse(savedCart) : [];
  });

  const addToCart = (product) => {
    setCart(prevCart => {
      // Check if product already exists in cart
      const existingProductIndex = prevCart.findIndex(item => item.id === product.id);
      
      let newCart;
      if (existingProductIndex >= 0) {
        // If product exists, increment quantity
        newCart = prevCart.map((item, index) => {
          if (index === existingProductIndex) {
            return { ...item, quantity: item.quantity + 1 };
          }
          return item;
        });
      } else {
        // If product doesn't exist, add it with quantity 1
        newCart = [...prevCart, { ...product, quantity: 1 }];
      }
      
      // Save to localStorage
      localStorage.setItem('storeup_cart', JSON.stringify(newCart));
      return newCart;
    });
  };

  const value = {
    store,
    setStore,
    theme,
    setTheme,
    cart,
    setCart,
    addToCart
  };

  return (
    <StoreContext.Provider value={value}>
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
}; 