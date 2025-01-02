import React, { useMemo } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ADMIN_EMAILS = [
    "murali.g@hyperverge.co",
    "tushar.bijalwan@hyperverge.co"
];

export const ProtectedRoute = ({ children }) => {
    const { user, loading } = useAuth();
    const location = useLocation();
    
    const isAdmin = useMemo(() => {
        return user?.email && ADMIN_EMAILS.includes(user.email);
    }, [user?.email]);
    
    if (loading) {
        return <div>Loading...</div>;
    }

    if (!user || !user.emailVerified) {
        return <Navigate to="/login" replace state={{ from: location }} />;
    }

    if (location.pathname.includes('/admin') && !isAdmin) {
        return <Navigate to="/" replace />;
    }

    return children;
};

export const PublicRoute = React.memo(({ children }) => {
    const { user, loading } = useAuth();
    
    if (loading) {
        return <div>Loading...</div>;
    }
    
    if (user && user.emailVerified) {
        return <Navigate to="/" replace />;
    }
    
    return children;
});