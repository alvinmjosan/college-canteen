import { toast } from 'react-toastify';
import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

// Create the context
export const CartContext = createContext();

// Create an Axios instance with the backend base URL
const api = axios.create({
  baseURL: 'https://bitebuddy-backend-6wwq.onrender.com', // Replace with your backend port
});

// Create a CartProvider component
export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [cartCount, setCartCount] = useState(0);
  const [userRole, setUserRole] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Update cart count whenever cartItems changes
  useEffect(() => {
    const count = cartItems.reduce((total, item) => total + item.quantity, 0);
    setCartCount(count);
  }, [cartItems]);

  // Set user role from localStorage on mount
  useEffect(() => {
    const role = localStorage.getItem('userRole');
    if (role) setUserRole(role);
  }, []);

  // Fetch cart on mount (no token validation here)
  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await api.get('/api/cart', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setCartItems(response.data.cart?.items || []);
    } catch (error) {
      console.error('Error fetching cart:', error.response?.status, error.response?.data);
      setCartItems([]);
    } finally {
      setLoading(false);
    }
  };

  // Add item to cart
  const addToCart = async (item) => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const currentCart = await api.get('/api/cart', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      let updatedItems = currentCart.data.cart?.items || [];
      const existingItemIndex = updatedItems.findIndex(
        (cartItem) => cartItem._id === item._id
      );

      if (existingItemIndex >= 0) {
        updatedItems[existingItemIndex].quantity += 1;
        toast.success(`${item.name} added to your cart!`, { icon: '🍔' });
      } else {
        updatedItems.push({ ...item, quantity: 1 });
        toast.success(`${item.name} added to your cart!`, { icon: '🍔' });
      }

      console.log('Updating cart with items:', updatedItems);
      const response = await api.post(
        '/api/cart',
        { items: updatedItems },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log('Cart update response:', response.data);
      setCartItems(response.data.cart.items);
    } catch (error) {
      console.error('Error adding to cart:', error.response?.status, error.response?.data);
      toast.error('Failed to add item to cart');
    } finally {
      setLoading(false);
    }
  };

  // Remove item from cart
  const removeFromCart = async (itemId) => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await api.delete(`/api/cart/${itemId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setCartItems(response.data.cart.items);
      toast.success('Item removed from cart');
    } catch (error) {
      console.error('Error removing from cart:', error.response?.status, error.response?.data);
      toast.error('Failed to remove item from cart');
    } finally {
      setLoading(false);
    }
  };

  // Change item quantity
  const changeQuantity = async (itemId, change) => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await api.patch(
        `/api/cart/${itemId}`,
        { change },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setCartItems(response.data.cart.items);
      toast.success('Quantity updated');
    } catch (error) {
      console.error('Error changing quantity:', error.response?.status, error.response?.data);
      toast.error('Failed to update quantity');
    } finally {
      setLoading(false);
    }
  };

  // Clear cart
  const clearCart = async () => {
    if (window.confirm('Are you sure you want to clear your cart?')) {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        const response = await api.delete('/api/cart', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setCartItems([]);
        toast.success('Cart cleared');
      } catch (error) {
        console.error('Error clearing cart:', error.response?.status, error.response?.data);
        toast.error('Failed to clear cart');
      } finally {
        setLoading(false);
      }
    }
  };

  // Logout and clear cart
  const clear = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await api.delete('/api/cart', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setCartItems([]);
      toast.success('Cart cleared');
    } catch (error) {
      console.error('Error clearing cart:', error.response?.status, error.response?.data);
      toast.error('Failed to clear cart');
    } finally {
      setLoading(false);
    }
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        cartCount,
        addToCart,
        removeFromCart,
        changeQuantity,
        clearCart,
        clear,
        userRole,
        setUserRole,
        loading,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

// Custom hook to use the cart context
export const useCart = () => useContext(CartContext);
