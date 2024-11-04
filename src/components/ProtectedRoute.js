// src/components/ProtectedRoute.js
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const ProtectedRoute = ({ children }) => {
    const { user, loading } = useAuth();
    const location = useLocation();
  
    if (loading) {
      return <div>Loading...</div>; // Or your loading component
    }
  
    if (!user || !user.emailVerified) {
      return <Navigate to="/login" replace state={{ from: location }} />;
    }
  
    return children;
  };

export const PublicRoute = ({ children }) => {
    const { user, loading } = useAuth();
  
    if (loading) {
      return <div>Loading...</div>; // Or your loading component
    }
  
    // Only redirect if user exists and is verified
    if (user && user.emailVerified) {
      return <Navigate to="/" replace />;
    }
  
    return children;
  };