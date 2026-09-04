import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { FontProvider } from './components/font-provider';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { CartDrawer } from './components/cart/CartDrawer';
import { ToastContainer } from './components/common/ToastContainer';
import { RouteLoadingHandler } from './components/LoadingScreen';

// Pages
import HomePage from './pages/HomePage';
import PCBuilderPage from './pages/PCBuilderPage';
import ProductsPage from './pages/ProductsPage';
import ProductDetailsPage from './pages/ProductDetailsPage';
import CartPage from './pages/CartPage';

export function App() {
  return (
    <FontProvider defaultFont="Inter">
      <Router>
        {/* Global Minimal Loading Screen Triggered On Route Endpoint Navigation */}
        <RouteLoadingHandler />

        <div className="min-h-screen flex flex-col bg-[#0A0A0C] text-neutral-100 selection:bg-red-600 selection:text-white" style={{ fontFamily: 'var(--app-font-family)' }}>
          {/* Navigation Header */}
          <Header />

          {/* Global Cart Slide-Over Drawer */}
          <CartDrawer />

          {/* Global Toast Notification System */}
          <ToastContainer />

          {/* Main Routed Page Content */}
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/builder" element={<PCBuilderPage />} />
              <Route path="/products" element={<ProductsPage />} />
              <Route path="/product/:id" element={<ProductDetailsPage />} />
              <Route path="/cart" element={<CartPage />} />
              {/* Fallback route */}
              <Route path="*" element={<HomePage />} />
            </Routes>
          </main>

          {/* Footer */}
          <Footer />
        </div>
      </Router>
    </FontProvider>
  );
}

export default App;
