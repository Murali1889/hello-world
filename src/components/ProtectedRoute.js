import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ADMIN_EMAILS = [
  "murali.g@hyperverge.co",
  "tushar.bijalwan@hyperverge.co"
];

export const ProtectedRoute = ({ children }) => {
    const { user, loading } = useAuth();
    const location = useLocation();
    
    if (loading) {
        return <div>Loading...</div>; // Or your loading component
    }

    // Check if user is not logged in or email not verified
    if (!user || !user.emailVerified) {
        return <Navigate to="/login" replace state={{ from: location }} />;
    }

    // Check for admin routes
    if (location.pathname.includes('/admin')) {
        // If not admin email, redirect to home
        if (!ADMIN_EMAILS.includes(user.email)) {
            return <Navigate to="/" replace />;
        }
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