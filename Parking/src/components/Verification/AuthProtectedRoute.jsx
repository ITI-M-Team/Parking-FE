import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import instance from "../../apis/config.js";

const AuthProtectedRoute = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const storedToken = localStorage.getItem("authTokens") || sessionStorage.getItem("authTokens");
      const token = storedToken ? JSON.parse(storedToken).access : null;
      
      if (!token) {
        setIsAuthenticated(false);
        setLoading(false);
        return;
      }

      try {
        await instance.get('/user-info/', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        setIsAuthenticated(true);
      } catch (err) {
        console.error('Authentication failed:', err);
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default AuthProtectedRoute;