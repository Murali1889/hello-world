// src/App.js
import React from 'react';
import './App.css'
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { FirebaseProvider } from './context/FirebaseContext';
import { DataProvider } from './context/DataContext';
import { DashboardProvider } from './context/DashboardContext';
import { AuthProvider } from './context/AuthContext';
import { MessageProvider } from './context/MessageContext';
import { ProtectedRoute, PublicRoute } from './components/ProtectedRoute';
import HomePage from './pages/Home';
import CompanyDetails from './pages/CompanyDetails';
import LoginPage from './pages/Login';
import ConfigManager from './components/ConfigManager';
import PageTransition from './components/PageTransition';

const MemoizedProviders = React.memo(({ children }) => (
  <FirebaseProvider>
    <MessageProvider>
      <AuthProvider>
        <DataProvider>
          <DashboardProvider>
            {children}
          </DashboardProvider>
        </DataProvider>
      </AuthProvider>
    </MessageProvider>
  </FirebaseProvider>
));

const AnimatedRoutes = () => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        {/* Public Routes */}
        <Route
          path="/login"
          element={
            <PublicRoute>
              <PageTransition>
                <LoginPage />
              </PageTransition>
            </PublicRoute>
          }
        />

        {/* Protected Routes */}
        <Route
          path="/"
          element={
            <Navigate to="/page/1" replace />
          }
        />
        
        <Route
          path="/page/:pageNumber"
          element={
            <ProtectedRoute>
              <PageTransition>
                <HomePage />
              </PageTransition>
            </ProtectedRoute>
          }
        />

        <Route
          path="/company/:name"
          element={
            <ProtectedRoute>
              <PageTransition>
                <CompanyDetails />
              </PageTransition>
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/update"
          element={
            <ProtectedRoute>
              <PageTransition>
                <ConfigManager />
              </PageTransition>
            </ProtectedRoute>
          }
        />

        {/* Catch all route */}
        <Route path="*" element={<Navigate to="/page/1" />} />
      </Routes>
    </AnimatePresence>
  );
};

const App = () => {
  return (
    <Router>
      <MemoizedProviders>
        <AnimatedRoutes />
      </MemoizedProviders>
    </Router>
  );
};

export default App;