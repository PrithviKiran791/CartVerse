import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { LoadingScreen } from './LoadingScreen';

export function getEndpointMessage(pathname: string, search: string = ''): string {
  if (search.includes('category=prebuilt')) return 'INDEXING PRE-BUILT BATTLESTATIONS';

  // Core Pages
  if (pathname === '/') return 'INITIALIZING CARTVERSE HOMEPAGE';
  if (pathname.startsWith('/about')) return 'RETRIEVING CARTVERSE ARCHITECTURE & MANIFESTO';
  if (pathname.startsWith('/builder') || pathname.startsWith('/pc-builder')) return 'LOADING PC BUILDER STUDIO';
  if (pathname === '/products') return 'INDEXING HARDWARE CATALOG';
  if (pathname.startsWith('/product/')) return 'FETCHING COMPONENT SPECIFICATIONS';
  if (pathname.startsWith('/console')) return 'INITIALIZING NEXT-GEN CONSOLE SUITE';

  // Servers & Enterprise Vertical
  if (pathname === '/servers') return 'CONNECTING TO ENTERPRISE CLUSTERS';
  if (pathname === '/servers/catalog') return 'INDEXING SERVER HARDWARE NODES';
  if (pathname === '/servers/builder') return 'INITIALIZING RACK BUILDER STUDIO';
  if (pathname === '/servers/pre-configured') return 'LOADING PRE-CONFIGURED NODES';
  if (pathname.startsWith('/servers/')) return 'FETCHING ENTERPRISE SERVER SPECS';

  // Category Hubs & Subcategories
  if (pathname.startsWith('/processors-gpus')) return 'CALIBRATING SILICON ARCHITECTURE';
  if (pathname.startsWith('/thermal-systems')) return 'INITIALIZING COOLING & THERMAL SYSTEMS';
  if (pathname.startsWith('/memory')) return 'SCANNING HIGH-SPEED MEMORY MATRICES';
  if (pathname.startsWith('/gaming-consoles')) return 'CONFIGURING GAMING CONSOLE SYSTEMS';
  if (pathname.startsWith('/cables-headers')) return 'VERIFYING INTERFACE PROTOCOLS';
  if (pathname.startsWith('/displays')) return 'CALIBRATING ULTRA-HD PANEL RESOLUTIONS';
  if (pathname.startsWith('/workspace') || pathname.startsWith('/tables-chairs') || pathname.startsWith('/desks-chairs')) return 'CONFIGURING ERGONOMIC WORKSPACE & SEATING';

  // Shopping, Cart & Transactions
  if (pathname.startsWith('/cart')) return 'SYNCING SECURE CART SYSTEM';
  if (pathname.startsWith('/checkout')) return 'SECURING CHECKOUT GATEWAY';
  if (pathname.startsWith('/order-confirmation')) return 'CONFIRMING ORDER MANIFEST';
  if (pathname.startsWith('/orders')) return 'RETRIEVING ORDER TELEMETRY';
  if (pathname.startsWith('/transactions') || pathname.startsWith('/account/transactions')) return 'AUDITING FINANCIAL TRANSACTION LEDGER';

  // Security & Authentication
  if (pathname.startsWith('/login')) return 'INITIALIZING SECURE AUTHENTICATION';

  return 'NAVIGATING TO DESTINATION';
}

export const RouteLoadingHandler: React.FC = () => {
  const location = useLocation();
  const [isNavigating, setIsNavigating] = useState(true);
  const [currentMessage, setCurrentMessage] = useState(() => 
    getEndpointMessage(window.location.pathname, window.location.search)
  );
  const prevKeyRef = useRef<string | null>(null);

  const handleComplete = useCallback(() => {
    setIsNavigating(false);
  }, []);

  useEffect(() => {
    const currentKey = location.pathname + (location.search.includes('category=') ? location.search : '');
    const prevKey = prevKeyRef.current;
    prevKeyRef.current = currentKey;

    // Skip if it is the first mount (already initialized in useState above)
    if (prevKey === null) {
      return;
    }

    // Only trigger when the target route differs from previous
    if (prevKey === currentKey) {
      return;
    }

    const msg = getEndpointMessage(location.pathname, location.search);
    setCurrentMessage(msg);
    setIsNavigating(true);

    // Scroll window to top
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [location.pathname, location.search]);

  // Guaranteed unmount safety timer so the screen can never get permanently stuck
  useEffect(() => {
    if (!isNavigating) return;

    const safetyTimer = setTimeout(() => {
      setIsNavigating(false);
    }, 1500);

    return () => clearTimeout(safetyTimer);
  }, [isNavigating]);

  if (!isNavigating) return null;

  return (
    <LoadingScreen
      key={location.pathname + (location.search.includes('category=') ? location.search : '')}
      fullScreen={true}
      message={currentMessage}
      duration={600}
      onComplete={handleComplete}
    />
  );
};

export default RouteLoadingHandler;
