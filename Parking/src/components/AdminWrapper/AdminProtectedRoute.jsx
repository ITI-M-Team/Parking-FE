import React from 'react';
import { Navigate } from 'react-router-dom';

const AdminProtectedRoute = ({ children }) => {
  const authTokens = JSON.parse(localStorage.getItem("authTokens") || sessionStorage.getItem("authTokens"));

  if (!authTokens?.is_superuser) {
    return <Navigate to="/not-authorized" replace />;
  }

  return children;
};

export default AdminProtectedRoute;