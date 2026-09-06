import React, { useEffect, useRef, Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ScrollShadow } from '@heroui/react';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { CartDrawer } from './components/cart/CartDrawer';
import { ToastContainer } from './components/common/ToastContainer';
import { RouteLoadingHandler } from './components/LoadingScreen';
import { useAuthStore } from './store/useAuthStore';
import { RequireAuth } from './components/auth/RequireAuth';
import { ScrollContainerProvider } from './context/ScrollContainerContext';
import { ScrollToTop } from './components/common/ScrollToTop';

import { Provider } from 'react-redux';
import { store } from './store/redux/store';

// Route-level Dynamic Code Splitting for Ultra-Fast Initial Load
const HomePage = lazy(() => import('./pages/HomePage'));
const PCBuilderPage = lazy(() => import('./pages/PCBuilderPage'));
const ProductsPage = lazy(() => import('./pages/ProductsPage'));
const ProductDetailsPage = lazy(() => import('./pages/ProductDetailsPage'));
const ConsolePage = lazy(() => import('./pages/ConsolePage'));
const CartPage = lazy(() => import('./pages/CartPage'));
const LoginPage = lazy(() => import('./pages/LoginPage'));

// Hierarchical Category Hub & Product Listing Pages
const ProcessorsGpusPage = lazy(() => import('./pages/category/ProcessorsGpusPage'));
const ThermalSystemsPage = lazy(() => import('./pages/category/ThermalSystemsPage'));
const GamingConsolesPage = lazy(() => import('./pages/category/GamingConsolesPage'));
const CablesHeadersPage = lazy(() => import('./pages/category/CablesHeadersPage'));
const DisplaysPage = lazy(() => import('./pages/category/DisplaysPage'));
const WarrantyDeliveryPage = lazy(() => import('./pages/category/WarrantyDeliveryPage'));
const ProductListingPage = lazy(() => import('./pages/category/ProductListingPage'));

export function App() {
  const { hydrateFromStorage } = useAuthStore();
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Validate and hydrate stored auth session on initial load
  useEffect(() => {
    hydrateFromStorage();
  }, [hydrateFromStorage]);

  return (
    <Provider store={store}>
      <Router>
        <ScrollContainerProvider scrollContainerRef={scrollContainerRef}>
          <ScrollToTop />

          {/* Global Minimal Loading Screen Triggered On Route Endpoint Navigation */}
          <RouteLoadingHandler />

          <div className="h-screen w-full flex flex-col bg-[#0A0A0C] text-neutral-100 font-sans selection:bg-red-600 selection:text-white overflow-hidden">
            {/* Navigation Header */}
            <Header />

            {/* Global Cart Slide-Over Drawer */}
            <CartDrawer />

            {/* Global Toast Notification System */}
            <ToastContainer />

            {/* Global ScrollShadow for Entire Website */}
            <ScrollShadow
              ref={scrollContainerRef}
              className="flex-1 w-full overflow-y-auto"
              size={50}
            >
              {/* Main Routed Page Content */}
              <main className="flex-grow min-h-[calc(100vh-140px)]">
                <Suspense
                  fallback={
                    <div className="min-h-[60vh] flex items-center justify-center">
                      <div className="w-8 h-8 rounded-full border-2 border-red-500 border-t-transparent animate-spin" />
                    </div>
                  }
                >
                  <Routes>
                    {/* Public Routes */}
                    <Route path="/" element={<HomePage />} />
                    <Route path="/builder" element={<PCBuilderPage />} />
                    <Route path="/products" element={<ProductsPage />} />
                    <Route path="/console" element={<ConsolePage />} />
                    <Route path="/product/:id" element={<ProductDetailsPage />} />
                    <Route path="/login" element={<LoginPage />} />

                    {/* Category Hub & Reusable Product Discovery Routes */}
                    <Route path="/processors-gpus" element={<ProcessorsGpusPage />} />
                    <Route path="/processors-gpus/processors/:brand" element={<ProductListingPage />} />
                    <Route path="/processors-gpus/gpu/:brand" element={<ProductListingPage />} />

                    <Route path="/thermal-systems" element={<ThermalSystemsPage />} />
                    <Route path="/thermal-systems/:subcategoryId" element={<ProductListingPage />} />

                    <Route path="/memory" element={<ProductListingPage />} />
                    <Route path="/memory/:subcategoryId" element={<ProductListingPage />} />

                    <Route path="/gaming-consoles" element={<GamingConsolesPage />} />
                    <Route path="/gaming-consoles/:brand" element={<ProductListingPage />} />

                    <Route path="/cables-headers" element={<CablesHeadersPage />} />
                    <Route path="/cables-headers/:subcategoryId" element={<ProductListingPage />} />

                    <Route path="/displays" element={<DisplaysPage />} />
                    <Route path="/displays/:filterType" element={<ProductListingPage />} />

                    <Route path="/warranty-delivery" element={<WarrantyDeliveryPage />} />

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
                </Suspense>
              </main>

              {/* Footer */}
              <Footer />
            </ScrollShadow>
          </div>
        </ScrollContainerProvider>
      </Router>
    </Provider>
  );
}

export default App;
