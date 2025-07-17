import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useVerification } from './VerificationContext';
import instance from "../../apis/config.js";
const VerificationProtectedRoute = ({ children }) => {
  const [verificationStatus, setVerificationStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isSuperUser, setIsSuperUser] = useState(false);
//load user data and verification status
useEffect(() => {
    const checkVerificationStatus = async () => {
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
        setVerificationStatus(userData.verification_status || 'Pending');
        setIsSuperUser(userData.is_superuser || false);
        console.log('User data:', {
          isAuthenticated: true,
          isSuperUser: userData.is_superuser || false,
          verificationStatus: userData.verification_status || 'Pending'
        });
      } catch (err) {
        console.error('Failed to load user data:', err);
        setIsAuthenticated(false);
        setVerificationStatus('Pending');
      } finally {
        setLoading(false);
      }
    };

    checkVerificationStatus();
  }, []);
//END-///
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
  // SuperUser can access any page without verification
  if (isSuperUser) {
    return children;
  }
 // If not verified, redirect to not-authorized with specific reason
  if (verificationStatus === 'Pending') {
    return <Navigate to="/not-authorized?reason=not_verified" replace />;
  }

  if (verificationStatus === 'Rejected') {
    return <Navigate to="/not-authorized?reason=verification_rejected" replace />;
  }

  return children;
};
export default VerificationProtectedRoute;