import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { LoadingScreen } from './LoadingScreen';

function getEndpointMessage(pathname: string): string {
  if (pathname === '/') return 'INITIALIZING HOMEPAGE';
  if (pathname.startsWith('/builder')) return 'LOADING PC BUILDER STUDIO';
  if (pathname.startsWith('/products')) return 'INDEXING HARDWARE CATALOG';
  if (pathname.startsWith('/product/')) return 'FETCHING COMPONENT SPECS';
  if (pathname.startsWith('/cart')) return 'SYNCING CART SYSTEM';
  return 'INITIALIZING ENDPOINT';
}

export const RouteLoadingHandler: React.FC = () => {
  const location = useLocation();
  const [isNavigating, setIsNavigating] = useState(false);
  const [currentMessage, setCurrentMessage] = useState('LOADING CARTVERSE...');
  const prevPathnameRef = useRef<string | null>(null);

  const handleComplete = useCallback(() => {
    setIsNavigating(false);
  }, []);

  useEffect(() => {
    const prevPath = prevPathnameRef.current;
    prevPathnameRef.current = location.pathname;

    // Only trigger when navigating between DIFFERENT pathnames
    if (!prevPath || prevPath === location.pathname) {
      return;
    }

    const msg = getEndpointMessage(location.pathname);
    setCurrentMessage(msg);
    setIsNavigating(true);

    window.scrollTo(0, 0);

    // Guaranteed unmount safety timer
    const timer = setTimeout(() => {
      setIsNavigating(false);
    }, 450);

    return () => clearTimeout(timer);
  }, [location.pathname]);

  if (!isNavigating) return null;

  return (
    <LoadingScreen
      key={location.pathname}
      fullScreen={true}
      message={currentMessage}
      duration={350}
      onComplete={handleComplete}
    />
  );
};

export default RouteLoadingHandler;
