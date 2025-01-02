// src/context/AuthContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { useFirebase } from './FirebaseContext';

const AuthContext = createContext(null);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

const ALLOWED_DOMAINS = ['hyperverge.co'];

export const AuthProvider = ({ children }) => {
    const { auth } = useFirebase();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [authError, setAuthError] = useState(null);
    const [isVerifying, setIsVerifying] = useState(false);

    const checkDomainAccess = (email) => {
        if (!email) return false;
        const domain = email.split('@')[1];
        return ALLOWED_DOMAINS.includes(domain);
    };

    useEffect(() => {
        let mounted = true;
        
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (!mounted) return;
            
            setIsVerifying(true);
            try {
                if (user) {
                    if (!checkDomainAccess(user.email)) {
                        await signOut(auth);
                        setAuthError('Access restricted to Hyperverge employees only.');
                        setUser(null);
                    } else {
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
    }, [auth]); // Only depend on auth

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