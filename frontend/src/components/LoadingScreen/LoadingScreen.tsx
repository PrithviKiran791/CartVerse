import React, { useEffect, useState, useRef } from 'react';
import { ProgressBar, Label } from '@heroui/react';
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
          <div className="absolute w-40 h-40 sm:w-48 sm:h-48 rounded-full bg-[#FF1E2D]/20 blur-3xl pointer-events-none animate-pulse" />
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
            CART<span className="text-[#FF1E2D]">VERSE</span>
          </h1>
          <p className="text-[10px] sm:text-xs font-sans text-neutral-400 tracking-[0.28em] uppercase font-semibold">
            BUILD. SHOP. PLAY.
          </p>
        </div>

        {/* HeroUI Red Progress Bar with Telemetry */}
        <div className="w-full max-w-[280px] sm:max-w-xs pt-1">
          <ProgressBar
            aria-label="Loading CartVerse"
            className="w-full space-y-2.5"
            value={progress}
            minValue={0}
            maxValue={100}
            color="danger"
          >
            <div className="flex items-center justify-between gap-2 w-full">
              <Label className="cartverse-status-text text-xs font-sans text-[#D0D0D0] font-semibold tracking-widest uppercase flex items-center gap-2 truncate">
                <span className="w-1.5 h-1.5 rounded-full bg-[#FF1E2D] animate-ping shrink-0" />
                <span className="truncate">{message}</span>
              </Label>
              <ProgressBar.Output className="text-xs font-mono font-bold text-red-500 tracking-wider shrink-0" />
            </div>
            <ProgressBar.Track className="h-2 w-full bg-neutral-900/90 rounded-full overflow-hidden border border-neutral-800/80 relative shadow-inner">
              <ProgressBar.Fill className="h-full bg-gradient-to-r from-red-600 via-[#FF1E2D] to-red-500 rounded-full shadow-[0_0_14px_rgba(255, 30, 45,0.9)] transition-all duration-75 ease-out" />
            </ProgressBar.Track>
          </ProgressBar>

          {/* Telemetry Footer */}
          <div className="flex items-center justify-between w-full mt-2 text-[9px] font-sans text-neutral-500 tracking-wider">
            <span>KERNEL // ROUTE</span>
            <span>{duration && duration > 0 ? `${progress}%` : 'SYNC'}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen;
