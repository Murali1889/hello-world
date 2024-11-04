// src/context/DashboardContext.js
import React, { createContext, useContext, useState } from 'react';

const DashboardContext = createContext(null);

export const DashboardProvider = ({ children }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isDarkMode, setIsDarkMode] = useState(() => {
    // Check if user has a dark mode preference saved
    const savedMode = localStorage.getItem('darkMode');
    return savedMode ? JSON.parse(savedMode) : false;
  });

  // Update localStorage when dark mode changes
  const toggleDarkMode = () => {
    setIsDarkMode(prev => {
      const newValue = !prev;
      localStorage.setItem('darkMode', JSON.stringify(newValue));
      return newValue;
    });
  };

  const value = {
    searchTerm,
    setSearchTerm,
    isDarkMode,
    setIsDarkMode: toggleDarkMode
  };

  return (
    <DashboardContext.Provider value={value}>
      {children}
    </DashboardContext.Provider>
  );
};

export const useDashboard = () => {
  const context = useContext(DashboardContext);
  if (!context) {
    throw new Error('useDashboard must be used within a DashboardProvider');
  }
  return context;
};

export { DashboardContext };