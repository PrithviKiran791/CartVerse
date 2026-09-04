import React, { useEffect, useState, useRef } from 'react';
import fanLogo from '../../assets/icons/Spin_logo.png';
import './LoadingScreen.css';

export interface LoadingScreenProps {
  /** Optional override for the status message */
  message?: string;
  /** Callback fired when loading completes */
  onComplete?: () => void;
  /** Duration in ms before triggering onComplete (default: 400) */
  duration?: number;
  /** Whether to render as full-screen overlay fixed over viewport */
  fullScreen?: boolean;
}

export const LoadingScreen: React.FC<LoadingScreenProps> = ({
  message = 'LOADING CARTVERSE...',
  onComplete,
  duration = 400,
  fullScreen = true,
}) => {
  const [imgSrc, setImgSrc] = useState(fanLogo);

  // Store onComplete in ref so inline function changes do NOT clear the timer
  const onCompleteRef = useRef(onComplete);
  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (onCompleteRef.current) {
        onCompleteRef.current();
      }
    }, duration);

    return () => clearTimeout(timer);
  }, [duration]); // Only depend on duration to prevent premature cancellation

  const containerClasses = fullScreen
    ? 'fixed inset-0 z-[99999] pointer-events-none flex flex-col items-center justify-center p-6 bg-[#080808]/95 backdrop-blur-md text-white select-none overflow-hidden transition-opacity duration-300'
    : 'w-full h-full min-h-[300px] flex flex-col items-center justify-center p-6 bg-[#080808] text-white select-none overflow-hidden';

  return (
    <div className={containerClasses} role="dialog" aria-modal="true" aria-label="CartVerse Loading Screen">
      <div className="flex flex-col items-center justify-center text-center space-y-5">
        {/* CartVerse Spinning Fan Turbine Logo */}
        <div className="relative flex items-center justify-center">
          <img
            src={imgSrc}
            onError={() => setImgSrc('/Spin_logo.png')}
            alt="CartVerse Cooling Fan Logo"
            className="cartverse-fan-logo"
          />
        </div>

        {/* Brand Wordmark */}
        <div className="space-y-1">
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-[#F5F5F5] uppercase">
            CART<span className="text-[#E31B23]">VERSE</span>
          </h1>
          <p className="text-[10px] sm:text-xs font-mono text-[#666666] tracking-[0.25em] uppercase font-bold">
            BUILD. SHOP. PLAY.
          </p>
        </div>

        {/* Minimal Status Label */}
        <div className="pt-1">
          <span className="cartverse-status-text text-xs font-mono text-[#BDBDBD] font-semibold tracking-widest uppercase">
            {message}
          </span>
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen;
