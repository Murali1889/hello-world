import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { ref, onValue, get, child } from 'firebase/database';
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
  const [initialized, setInitialized] = useState(false);

  const COMPANY_ORDER = [
    'signzy', 'idfy', 'digitapai', 'perfios', 'bureau',
    'jocata', 'jukshio', 'videocx', 'finbox', 'Lentra', 'm2p-fintech'
  ];

  const formatLastModified = useCallback((timestamp) => {
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
    }
    return 'Just now';
  }, []);

  const transformCompanyData = useCallback(async (companyKey, value, companiesRef, isExtra = false) => {
    try {
      const companyRef = child(companiesRef, companyKey);
      const metaSnapshot = await get(companyRef);
      const updateTime = metaSnapshot.metadata?.lastUpdateTime || null;

      const transformedProducts = value.products ? 
        Object.entries(value.products).map(([productKey, productValue]) => ({
          name: productKey,
          title: productValue?.title,
          url: productValue.url || '',
          features: Array.isArray(productValue.features) ? productValue.features : [],
          use_cases: Array.isArray(productValue.use_cases) ? productValue.use_cases : []
        })) : [];

      return {
        company_name: companyKey,
        ...value,
        products: transformedProducts,
        lastUpdated: updateTime,
        formattedLastUpdated: formatLastModified(updateTime),
        isExtra
      };
    } catch (err) {
      console.error(`Error processing company ${companyKey}:`, err);
      return null;
    }
  }, [formatLastModified]);

  useEffect(() => {
    let unsubscribe = () => {};

    const setupDataListener = async () => {
      // Only setup listener if user is authenticated and not already initialized
      if (!user?.emailVerified || initialized) {
        if (!user) {
          setCompanies([]);
          setLoading(false);
          navigate('/login');
        }
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const companiesRef = ref(database, 'companies');

        // Set up a single snapshot listener
        unsubscribe = onValue(companiesRef, async (snapshot) => {
          try {
            if (!snapshot.exists()) {
              setCompanies([]);
              return;
            }

            const companiesData = snapshot.val();
            
            // Process all companies in parallel
            const orderedCompaniesPromises = COMPANY_ORDER.map(companyKey => 
              companiesData[companyKey] ? 
                transformCompanyData(companyKey, companiesData[companyKey], companiesRef) : 
                null
            );

            const extraCompanies = Object.keys(companiesData)
              .filter(key => !COMPANY_ORDER.includes(key))
              .map(companyKey => 
                transformCompanyData(companyKey, companiesData[companyKey], companiesRef, true)
              );

            const allCompanies = await Promise.all([
              ...orderedCompaniesPromises,
              ...extraCompanies
            ]);

            setCompanies(allCompanies.filter(Boolean));
            setInitialized(true);

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

    setupDataListener();

    return () => {
      unsubscribe();
    };
  }, [database, user?.emailVerified, initialized, navigate, transformCompanyData]);

  const value = {
    companies,
    loading,
    error,
    formatLastModified,
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