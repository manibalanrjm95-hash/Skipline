import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { StoreProvider, useStore } from './context/StoreContext';

// Screens
import Landing from './screens/Landing';
import ShopCodeEntry from './screens/ShopCodeEntry';
import Dashboard from './screens/Dashboard';
import Scan from './screens/Scan';
import Cart from './screens/Cart';
import Checkout from './screens/Checkout';
import ExitVerification from './screens/ExitVerification';
import ThankYou from './screens/ThankYou';
import AdminLogin from './screens/AdminLogin';
import PaymentMethod from './screens/PaymentMethod';
import StoreQR from './screens/StoreQR';
import POSPayment from './screens/POSPayment';
import AdminDashboard from './screens/AdminDashboard';
import Inventory from './screens/Inventory';
import Analytics from './screens/Analytics';
import QRCodes from './screens/QRCodes';

const ProtectedRoute = ({ children }) => {
  const { user } = useStore();
  if (!user) return <Navigate to="/" />;
  return children;
};

const AdminProtectedRoute = ({ children }) => {
  const isAdmin = sessionStorage.getItem('skipline_isAdmin') === 'true';
  if (!isAdmin) return <Navigate to="/admin/login" />;
  return children;
};

const App = () => {
  return (
    <StoreProvider>
      <Router>
        <Routes>
          {/* Customer Flow */}
          <Route path="/" element={<Landing />} />
          <Route path="/entry" element={<ShopCodeEntry />} />
          <Route path="/dashboard" element={
            <ProtectedRoute><Dashboard /></ProtectedRoute>
          } />
          <Route path="/scan" element={
            <ProtectedRoute><Scan /></ProtectedRoute>
          } />
          <Route path="/cart" element={
            <ProtectedRoute><Cart /></ProtectedRoute>
          } />
          <Route path="/checkout" element={
            <ProtectedRoute><Checkout /></ProtectedRoute>
          } />
          <Route path="/payment-method" element={
            <ProtectedRoute><PaymentMethod /></ProtectedRoute>
          } />
          <Route path="/payment-qr" element={
            <ProtectedRoute><StoreQR /></ProtectedRoute>
          } />
          <Route path="/payment-counter" element={
            <ProtectedRoute><POSPayment /></ProtectedRoute>
          } />
          <Route path="/exit" element={
            <ProtectedRoute><ExitVerification /></ProtectedRoute>
          } />
          <Route path="/thanks" element={<ThankYou />} />

          {/* Admin Flow */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin" element={
            <AdminProtectedRoute><AdminDashboard /></AdminProtectedRoute>
          } />
          <Route path="/admin/inventory" element={
            <AdminProtectedRoute><Inventory /></AdminProtectedRoute>
          } />
          <Route path="/admin/analytics" element={
            <AdminProtectedRoute><Analytics /></AdminProtectedRoute>
          } />
          <Route path="/admin/qrcodes" element={
            <AdminProtectedRoute><QRCodes /></AdminProtectedRoute>
          } />

          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Router>
    </StoreProvider>
  );
};

export default App;
