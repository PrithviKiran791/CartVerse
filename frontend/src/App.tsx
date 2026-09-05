import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { CartDrawer } from './components/cart/CartDrawer';
import { ToastContainer } from './components/common/ToastContainer';
import { RouteLoadingHandler } from './components/LoadingScreen';
import { useAuthStore } from './store/useAuthStore';
import { RequireAuth } from './components/auth/RequireAuth';

// Direct Page Imports to guarantee rock-solid instantaneous rendering
import HomePage from './pages/HomePage';
import PCBuilderPage from './pages/PCBuilderPage';
import ProductsPage from './pages/ProductsPage';
import ProductDetailsPage from './pages/ProductDetailsPage';
import CartPage from './pages/CartPage';
import LoginPage from './pages/LoginPage';

export function App() {
  const { hydrateFromStorage } = useAuthStore();

  // Validate and hydrate stored auth session on initial load
  useEffect(() => {
    hydrateFromStorage();
  }, [hydrateFromStorage]);

  return (
    <Router>
      {/* Global Minimal Loading Screen Triggered On Route Endpoint Navigation */}
      <RouteLoadingHandler />

      <div className="min-h-screen flex flex-col bg-[#0A0A0C] text-neutral-100 font-sans selection:bg-red-600 selection:text-white">
        {/* Navigation Header */}
        <Header />

        {/* Global Cart Slide-Over Drawer */}
        <CartDrawer />

        {/* Global Toast Notification System */}
        <ToastContainer />

        {/* Main Routed Page Content */}
        <main className="flex-grow">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<HomePage />} />
            <Route path="/builder" element={<PCBuilderPage />} />
            <Route path="/products" element={<ProductsPage />} />
            <Route path="/product/:id" element={<ProductDetailsPage />} />
            <Route path="/login" element={<LoginPage />} />

            {/* Protected Routes */}
            <Route
              path="/cart"
              element={
                <RequireAuth>
                  <CartPage />
                </RequireAuth>
              }
            />
            <Route
              path="/checkout"
              element={
                <RequireAuth>
                  <CartPage />
                </RequireAuth>
              }
            />

            {/* Fallback route */}
            <Route path="*" element={<HomePage />} />
          </Routes>
        </main>

        {/* Footer */}
        <Footer />
      </div>
    </Router>
  );
}

export default App;
