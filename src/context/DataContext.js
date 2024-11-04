// DataContext.js
import React, { createContext, useContext, useEffect, useState } from 'react';
import { ref, onValue, query, get, child } from 'firebase/database';
import { useFirebase } from './FirebaseContext';
import { useAuth } from './AuthContext';
import { useNavigate } from 'react-router-dom';

const DataContext = createContext(null);

export const DataProvider = ({ children }) => {
  const { database } = useFirebase();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const COMPANY_ORDER = [
    'signzy',
    'idfy',
    'digitapai',
    'perfios',
    'bureau',
    'jocata',
    'jukshio',
    'videocx',
    'finbox',
    'Lentra',
    'm2p-fintech'
  ];

  const formatLastModified = (timestamp) => {
    if (!timestamp) return 'Unknown';

    const date = new Date(timestamp);
    const now = new Date();
    const diff = now - date;
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 30) {
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } else if (days > 0) {
      return `${days} day${days === 1 ? '' : 's'} ago`;
    } else if (hours > 0) {
      return `${hours} hour${hours === 1 ? '' : 's'} ago`;
    } else if (minutes > 0) {
      return `${minutes} minute${minutes === 1 ? '' : 's'} ago`;
    } else {
      return 'Just now';
    }
  };

  useEffect(() => {
    let unsubscribe = () => { };

    const fetchData = async () => {
      // Only fetch data if user is authenticated
      if (!user || !user.emailVerified) {
        setCompanies([]);
        setLoading(false);
        // If user is not authenticated, redirect to login
        if (!user) {
          navigate('/login');
        }
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const companiesRef = ref(database, 'companies');

        unsubscribe = onValue(companiesRef, async (snapshot) => {
          try {
            if (snapshot.exists()) {
              const companiesData = snapshot.val();

              // Get metadata for each company
              const orderedCompaniesPromises = COMPANY_ORDER.map(async (companyKey) => {
                try {
                  if (!companiesData[companyKey]) {
                    return null;
                  }
        
                  const value = companiesData[companyKey];
                  const companyRef = child(companiesRef, companyKey);
                  const metaSnapshot = await get(companyRef);
                  const updateTime = metaSnapshot.metadata?.lastUpdateTime || null;
        
                  const transformedProducts = value.products ? 
                    Object.entries(value.products).map(([productKey, productValue]) => ({
                      name: productKey,
                      url: productValue.url || '',
                      features: Array.isArray(productValue.features) ? 
                        productValue.features : [],
                      use_cases: Array.isArray(productValue.use_cases) ? 
                        productValue.use_cases : []
                    })) : [];
        
                  return {
                    company_name: companyKey,
                    ...value,
                    products: transformedProducts,
                    lastUpdated: updateTime,
                    formattedLastUpdated: formatLastModified(updateTime)
                  };
                } catch (err) {
                  console.error(`Error processing company ${companyKey}:`, err);
                  return null;
                }
              });
        
              // Find and process extra companies
              const extraCompanies = Object.keys(companiesData)
                .filter(key => !COMPANY_ORDER.includes(key));
        
              const extraCompaniesPromises = extraCompanies.map(async (companyKey) => {
                try {
                  const value = companiesData[companyKey];
                  const companyRef = child(companiesRef, companyKey);
                  const metaSnapshot = await get(companyRef);
                  const updateTime = metaSnapshot.metadata?.lastUpdateTime || null;
        
                  const transformedProducts = value.products ? 
                    Object.entries(value.products).map(([productKey, productValue]) => ({
                      name: productKey,
                      url: productValue.url || '',
                      features: Array.isArray(productValue.features) ? 
                        productValue.features : [],
                      use_cases: Array.isArray(productValue.use_cases) ? 
                        productValue.use_cases : []
                    })) : [];
        
                  return {
                    company_name: companyKey,
                    ...value,
                    products: transformedProducts,
                    lastUpdated: updateTime,
                    formattedLastUpdated: formatLastModified(updateTime),
                    isExtra: true // Optional: mark as extra company
                  };
                } catch (err) {
                  console.error(`Error processing company ${companyKey}:`, err);
                  return null;
                }
              });
        
              // Combine both ordered and extra companies
              const allCompanies = await Promise.all([
                ...orderedCompaniesPromises,
                ...extraCompaniesPromises
              ]);
        
              // Filter out nulls and set state
              const finalCompanies = allCompanies.filter(Boolean);
              setCompanies(finalCompanies);
            } else {
              setCompanies([]);
            }
          } catch (err) {
            console.error('Data transformation error:', err);
            setError('Error processing data. Please try again later.');
            if (err.code === 'PERMISSION_DENIED') {
              setError('Access denied. Please check your permissions.');
              navigate('/login');
            }
          } finally {
            setLoading(false);
          }
        }, (error) => {
          console.error('Firebase error:', error);
          setError(error.message);
          if (error.code === 'PERMISSION_DENIED') {
            setError('Access denied. Please check your permissions.');
            navigate('/login');
          }
          setLoading(false);
        });
      } catch (err) {
        console.error('Setup error:', err);
        setError('Error connecting to the database. Please try again later.');
        setLoading(false);
      }
    };

    fetchData();

    // Cleanup function
    return () => {
      unsubscribe();
    };
  }, [database, user, navigate]); // Added user to dependencies

  const value = {
    companies,
    loading,
    error,
    formatLastModified,
    // Add a method to check if user has access
    hasAccess: Boolean(user?.emailVerified)
  };

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};