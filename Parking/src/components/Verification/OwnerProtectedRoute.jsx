import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import instance from "../../apis/config.js";

const OwnerProtectedRoute = ({ children }) => {
  const [userRole, setUserRole] = useState(null);
  const [verificationStatus, setVerificationStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isSuperUser, setIsSuperUser] = useState(false);

  useEffect(() => {
    const checkUserAccess = async () => {
      const storedToken = localStorage.getItem("authTokens") || sessionStorage.getItem("authTokens");
      const token = storedToken ? JSON.parse(storedToken).access : null;
      
      if (!token) {
        setIsAuthenticated(false);
        setLoading(false);
        return;
      }

      try {
        const res = await instance.get('/user-info/', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        const userData = res.data;
        setIsAuthenticated(true);
        setUserRole(userData.role || 'driver'); // assuming 'role' field exists
        setVerificationStatus(userData.verification_status || 'Pending');
        setIsSuperUser(userData.is_superuser || false);
        
        console.log('User access check:', {
          isAuthenticated: true,
          role: userData.role || 'driver',
          isSuperUser: userData.is_superuser || false,
          verificationStatus: userData.verification_status || 'Pending'
        });
      } catch (err) {
        console.error('Failed to load user data:', err);
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    checkUserAccess();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // SuperUser can access any page
  if (isSuperUser) {
    return children;
  }

  // Check if user is verified first
  if (verificationStatus === 'Pending') {
    return <Navigate to="/not-authorized?reason=not_verified" replace />;
  }

  if (verificationStatus === 'Rejected') {
    return <Navigate to="/not-authorized?reason=verification_rejected" replace />;
  }

  // Check if user has owner or garage role
  if (userRole !== 'garage_owner' && !isSuperUser ) {
    return <Navigate to="/not-authorized?reason=insufficient_permissions" replace />;
  }

  return children;
};

export default OwnerProtectedRoute;