import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast'; 
import Auth from './page/Auth';
import Dashboard from './page/Dashboard';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthProvider } from './context/Authcontext';

function App() {
  return (
    <AuthProvider>
      <Router>
        <>
          <Toaster position="top-right" />
          <Routes>
            <Route path="/auth" element={<Auth />} />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<Navigate to="/auth" />} />
          </Routes>
        </>
      </Router>
    </AuthProvider>
  );
}

export default App;
