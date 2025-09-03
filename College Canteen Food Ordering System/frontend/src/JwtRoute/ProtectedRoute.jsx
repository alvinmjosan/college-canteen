import React, { useState, useEffect } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { toast } from 'react-toastify';

// Utility function to check if token is expired
const isTokenExpired = (token) => {
  if (!token) return true;
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const exp = payload.exp * 1000;
    return Date.now() >= exp;
  } catch (error) {
    console.error('Error decoding token:', error);
    return true;
  }
};

const ProtectedRoute = () => {
  const [shouldRedirect, setShouldRedirect] = useState(false);
  const token = localStorage.getItem('token');
  const isAuthenticated = token && !isTokenExpired(token);

  useEffect(() => {
    if (!isAuthenticated) {
      if (token) {
        // Token exists but is expired
        localStorage.removeItem('token');
        toast.info('Session expired. Please log in again.', {
          onClose: () => setShouldRedirect(true), // Redirect after toast closes
        });
      } else {
        toast.info('Please log in to access this page.', {
          onClose: () => setShouldRedirect(true), // Redirect after toast closes
        });
      }
    }
  }, [isAuthenticated]);

  if (shouldRedirect) {
    return <Navigate to="/" replace />;
  }

  return isAuthenticated ? <Outlet /> : null; // Render nothing until redirect
};

export default ProtectedRoute;