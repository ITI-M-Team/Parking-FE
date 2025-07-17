import React, { createContext, useContext, useState, useEffect } from 'react';
import instance from "../../apis/config.js";


const VerificationContext = createContext();
export const useVerification = () => {

  const context = useContext(VerificationContext);
  if (!context) {
    throw new Error('useVerification must be used within a VerificationProvider');
  }
  return context;

};

export const VerificationProvider = ({ children }) => {
  const [verificationStatus, setVerificationStatus] = useState('Pending');
  const [loading, setLoading] = useState(true);

  const loadUserData = async () => {
    const storedToken = localStorage.getItem("authTokens") || sessionStorage.getItem("authTokens");
    const token = storedToken ? JSON.parse(storedToken).access : null;
    
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const res = await instance.get('/user-info/', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      setVerificationStatus(res.data.verification_status || 'Pending');
    } catch (err) {
      console.error('Failed to load user data:', err);
      setVerificationStatus('Pending');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUserData();
  }, []);

  return (
    <VerificationContext.Provider value={{ 
      verificationStatus, 
      loading, 
      refreshVerificationStatus: loadUserData 
    }}>
      {children}
    </VerificationContext.Provider>
  );
};
