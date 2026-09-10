import React, { useEffect, useState, useRef } from 'react';
import fanLogo from '../../assets/icons/Spin_logo.png';
import './LoadingScreen.css';

export interface LoadingScreenProps {
  /** Optional override for the status message */
  message?: string;
  /** Callback fired when loading completes */
  onComplete?: () => void;
  /** Duration in ms before initiating fade-out (default: 600) */
  duration?: number;
  /** Whether to render as full-screen overlay fixed over viewport */
  fullScreen?: boolean;
}

export const LoadingScreen: React.FC<LoadingScreenProps> = ({
  message = 'LOADING CARTVERSE...',
  onComplete,
  duration = 600,
  fullScreen = true,
}) => {
  const [imgSrc, setImgSrc] = useState(fanLogo);
  const [progress, setProgress] = useState(0);
  const [isFadingOut, setIsFadingOut] = useState(false);

  // Store onComplete in ref so inline function changes do NOT re-trigger effects
  const onCompleteRef = useRef(onComplete);
  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  // Smooth progress animation and exit transition
  useEffect(() => {
    if (!duration || duration <= 0) return;

    const startTime = performance.now();
    let animationFrameId: number;
    let exitTimerId: NodeJS.Timeout;

    const updateProgress = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const pct = Math.min(100, Math.round((elapsed / duration) * 100));
      setProgress(pct);

      if (elapsed < duration) {
        animationFrameId = requestAnimationFrame(updateProgress);
      } else {
        setProgress(100);
        setIsFadingOut(true);

        // Allow 300ms for the CSS opacity fade-out before calling onComplete
        exitTimerId = setTimeout(() => {
          if (onCompleteRef.current) {
            onCompleteRef.current();
          }
        }, 300);
      }
    };

    animationFrameId = requestAnimationFrame(updateProgress);

    return () => {
      cancelAnimationFrame(animationFrameId);
      if (exitTimerId) clearTimeout(exitTimerId);
    };
  }, [duration]);

  const containerClasses = fullScreen
    ? `fixed inset-0 z-[99999] flex flex-col items-center justify-center p-6 bg-[#080808]/98 backdrop-blur-2xl text-white select-none overflow-hidden transition-opacity duration-300 ease-out ${
        isFadingOut ? 'opacity-0 pointer-events-none' : 'opacity-100 pointer-events-auto'
      }`
    : 'w-full h-full min-h-[350px] flex flex-col items-center justify-center p-6 bg-transparent text-white select-none overflow-hidden';

  return (
    <div className={containerClasses} role="dialog" aria-modal="true" aria-label="CartVerse Loading Screen">
      <div className="flex flex-col items-center justify-center text-center space-y-5 max-w-sm w-full">
        {/* CartVerse Spinning Fan Turbine Logo with Radial Glow */}
        <div className="relative flex items-center justify-center">
          <div className="absolute w-40 h-40 sm:w-48 sm:h-48 rounded-full bg-[#E31B23]/20 blur-3xl pointer-events-none animate-pulse" />
          <img
            src={imgSrc}
            onError={() => setImgSrc('/Spin_logo.png')}
            alt="CartVerse Cooling Fan Logo"
            className="cartverse-fan-logo relative z-10"
          />
        </div>

        {/* Brand Wordmark */}
        <div className="space-y-1">
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-[#F5F5F5] uppercase font-sans">
            CART<span className="text-[#E31B23]">VERSE</span>
          </h1>
          <p className="text-[10px] sm:text-xs font-mono text-neutral-400 tracking-[0.28em] uppercase font-semibold">
            BUILD. SHOP. PLAY.
          </p>
        </div>

        {/* Minimal Status Label & Technical Telemetry */}
        <div className="flex flex-col items-center gap-3 pt-1 w-full">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#E31B23] animate-ping" />
            <span className="cartverse-status-text text-xs font-mono text-[#D0D0D0] font-semibold tracking-widest uppercase">
              {message}
            </span>
          </div>

          {/* Brutalist Glowing Progress Track */}
          <div className="w-48 sm:w-56 h-[3px] bg-neutral-800/90 rounded-full overflow-hidden relative border border-neutral-700/40">
            <div
              className="h-full bg-gradient-to-r from-red-600 to-[#E31B23] rounded-full shadow-[0_0_10px_rgba(227,27,35,0.75)] transition-all duration-75 ease-out"
              style={{
                width: duration && duration > 0 ? `${Math.min(100, Math.max(3, progress))}%` : '100%',
                animation: !duration || duration <= 0 ? 'cartverse-progress-indeterminate 1.4s ease-in-out infinite' : undefined,
              }}
            />
          </div>

          {/* Telemetry Footer */}
          <div className="flex items-center justify-between w-48 sm:w-56 text-[9px] font-mono text-neutral-500 tracking-wider">
            <span>KERNEL // ROUTE</span>
            <span>{duration && duration > 0 ? `${progress}%` : 'SYNC'}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen;
