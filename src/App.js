// src/App.js
import React from 'react';
import './App.css'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { FirebaseProvider } from './context/FirebaseContext';
import { DataProvider } from './context/DataContext';
import { DashboardProvider } from './context/DashboardContext';
import { AuthProvider } from './context/AuthContext';
import { MessageProvider } from './context/MessageContext';
import { ProtectedRoute, PublicRoute } from './components/ProtectedRoute';
import HomePage from './pages/Home';
import CompanyDetails from './pages/CompanyDetails';
import LoginPage from './pages/Login';

const App = () => {
  return (<Router>
    <FirebaseProvider>
     <MessageProvider>
     <AuthProvider>
        <DataProvider>
          <DashboardProvider>
            
              <Routes>
                {/* Public Routes */}
                <Route 
                  path="/login" 
                  element={
                    <PublicRoute>
                      <LoginPage />
                    </PublicRoute>
                  } 
                />

                {/* Protected Routes */}
                <Route 
                  path="/" 
                  element={
                    <ProtectedRoute>
                      <HomePage />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/company/:name" 
                  element={
                    <ProtectedRoute>
                      <CompanyDetails />
                    </ProtectedRoute>
                  } 
                />

                {/* Catch all route */}
                <Route path="*" element={<Navigate to="/" />} />
              </Routes>
            
          </DashboardProvider>
        </DataProvider>
      </AuthProvider>
     </MessageProvider>
    </FirebaseProvider>
    </Router>
  );
};

export default App; 