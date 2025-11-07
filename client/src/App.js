import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { WebSocketProvider } from './contexts/WebSocketContext';
import HomePage from './components/HomePage';
import AuthPage from './components/AuthPage';
import EmailVerification from './components/EmailVerification';
import OTPVerification from './components/OTPVerification';
import Dashboard from './components/Dashboard';
import UserProfile from './components/UserProfile';
import AdminDashboard from './components/AdminDashboard';
import BookCourtPage from './components/BookCourtPage';
import PaymentPage from './components/PaymentPage';
import MyBookings from './components/MyBookings';
import './App.css';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, user } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }
  
  const userFromStorage = JSON.parse(localStorage.getItem('bookmycourt_user') || 'null');
  const currentUser = user || userFromStorage;
  const isUserVerified = currentUser?.isVerified;
  
  // Skip email verification for admin users
  if (!isUserVerified && currentUser?.role !== 'admin') {
    return <Navigate to="/verify-otp" replace />;
  }
  
  return children;
};

const AdminProtectedRoute = ({ children }) => {
  const { isAuthenticated, user } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }
  
  const userFromStorage = JSON.parse(localStorage.getItem('bookmycourt_user') || 'null');
  const currentUser = user || userFromStorage;
  const isAdmin = currentUser?.role === 'admin';
  
  // Skip OTP verification for admin users
  if (!isAdmin) {
    const isUserVerified = currentUser?.isVerified;
    if (!isUserVerified) {
      return <Navigate to="/verify-otp" replace />;
    }
  }
  
  if (!isAdmin) {
    return <Navigate to="/dashboard" replace />;
  }
  
  return children;
};

const AppRoutes = () => {
  const { isAuthenticated, user } = useAuth();
  
  const userFromStorage = JSON.parse(localStorage.getItem('bookmycourt_user') || 'null');
  const isUserVerified = user?.isVerified || userFromStorage?.isVerified;
  
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/auth" element={<AuthPage />} />
      <Route path="/verify-email" element={<EmailVerification />} />
      <Route path="/verify-otp" element={<OTPVerification />} />
      
      {/* Protected Routes */}
      <Route 
        path="/select-sport" 
        element={
          <ProtectedRoute>
            {(() => {
              const userFromStorage = JSON.parse(localStorage.getItem('bookmycourt_user') || 'null');
              const currentUser = user || userFromStorage;
              // Redirect admin users directly to admin panel
              if (currentUser?.role === 'admin') {
                return <Navigate to="/admin" replace />;
              }
              // Redirect all users to dashboard (sport selection removed)
              return <Navigate to="/dashboard" replace />;
            })()}
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/dashboard" 
        element={
          <ProtectedRoute>
            {(() => {
              const userFromStorage = JSON.parse(localStorage.getItem('bookmycourt_user') || 'null');
              const currentUser = user || userFromStorage;
              // Redirect admin users to admin panel
              if (currentUser?.role === 'admin') {
                return <Navigate to="/admin" replace />;
              }
              return <Dashboard />;
            })()}
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/profile" 
        element={
          <ProtectedRoute>
            <UserProfile />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/courts" 
        element={
          <ProtectedRoute>
            <BookCourtPage />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/payment" 
        element={
          <ProtectedRoute>
            <PaymentPage />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/my-bookings" 
        element={
          <ProtectedRoute>
            <MyBookings />
          </ProtectedRoute>
        } 
      />
      
      {/* Admin Routes */}
      <Route 
        path="/admin" 
        element={
          <AdminProtectedRoute>
            <AdminDashboard />
          </AdminProtectedRoute>
        } 
      />
      
      {/* Redirect authenticated users based on role */}
      <Route 
        path="*" 
        element={
          isAuthenticated && isUserVerified ? 
            (() => {
              const userFromStorage = JSON.parse(localStorage.getItem('bookmycourt_user') || 'null');
              const currentUser = user || userFromStorage;
              return currentUser?.role === 'admin' ? 
                <Navigate to="/admin" replace /> : 
                <Navigate to="/dashboard" replace />;
            })() : 
            <Navigate to="/" replace />
        } 
      />
    </Routes>
  );
};

function App() {
  return (
    <AuthProvider>
      <WebSocketProvider>
        <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
          <div className="App">
            <AppRoutes />
            <Toaster 
              position="top-right"
              toastOptions={{
                duration: 4000,
                style: {
                  background: '#1a1a2e',
                  color: '#fff',
                  border: '1px solid #00d4ff',
                  borderRadius: '12px',
                  fontSize: '14px',
                  fontWeight: '500'
                },
                success: {
                  iconTheme: {
                    primary: '#00ff88',
                    secondary: '#fff',
                  },
                },
                error: {
                  iconTheme: {
                    primary: '#ff4757',
                    secondary: '#fff',
                  },
                },
              }}
            />
          </div>
        </Router>
      </WebSocketProvider>
    </AuthProvider>
  );
}

export default App;
