// src/context/AuthContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { useFirebase } from './FirebaseContext';
import { useNavigate, useLocation } from 'react-router-dom';

// Create the context
const AuthContext = createContext(null);

// Export the useAuth hook
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

const ALLOWED_DOMAINS = ['hyperverge.co'];

// Export the AuthProvider component
export const AuthProvider = ({ children }) => {
    const { auth } = useFirebase();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [authError, setAuthError] = useState(null);
    const [isVerifying, setIsVerifying] = useState(false);
    const location = useLocation();

    const checkDomainAccess = (email) => {
        if (!email) return false;
        const domain = email.split('@')[1];
        return ALLOWED_DOMAINS.includes(domain);
    };

    useEffect(() => {
        let mounted = true;
        
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            console.log(await user.getIdToken())
            if (!mounted) return;
            
            setIsVerifying(true);
            try {
                if (user) {
                    // Check domain access
                    if (!checkDomainAccess(user.email)) {
                        await signOut(auth);
                        setAuthError('Access restricted to Hyperverge employees only.');
                        setUser(null);
                    } else {
                        // Set user with verification status
                        setUser({
                            ...user,
                            needsVerification: !user.emailVerified
                        });

                        if (!user.emailVerified) {
                            setAuthError('Please verify your email before accessing the application.');
                        } else {
                            setAuthError(null);
                        }
                    }
                } else {
                    setUser(null);
                    setAuthError(null);
                }
            } catch (error) {
                console.error('Auth error:', error);
                setAuthError('Authentication error occurred');
                setUser(null);
            } finally {
                if (mounted) {
                    setIsVerifying(false);
                    setLoading(false);
                }
            }
        });

        return () => {
            mounted = false;
            unsubscribe();
        };
    }, [auth]);

    const value = {
        user,
        loading: loading || isVerifying,
        authError,
        checkDomainAccess,
        isEmailVerified: user?.emailVerified ?? false,
        needsVerification: user?.needsVerification ?? false
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};