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
    if (!duration || duration <= 0) {
      setProgress(100);
      return;
    }

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

        // 200ms quick exit transition before unmounting
        exitTimerId = setTimeout(() => {
          if (onCompleteRef.current) {
            onCompleteRef.current();
          }
        }, 200);
      }
    };

    animationFrameId = requestAnimationFrame(updateProgress);

    return () => {
      cancelAnimationFrame(animationFrameId);
      if (exitTimerId) clearTimeout(exitTimerId);
    };
  }, [duration]);

  const containerClasses = fullScreen
    ? `fixed inset-0 z-[99999] flex flex-col items-center justify-center p-6 minimal-loading-backdrop text-white select-none overflow-hidden transition-opacity duration-300 ease-out ${
        isFadingOut ? 'opacity-0 pointer-events-none' : 'opacity-100 pointer-events-auto'
      }`
    : 'w-full h-full min-h-[420px] flex flex-col items-center justify-center p-6 bg-transparent text-white select-none overflow-hidden';

  return (
    <div
      className={containerClasses}
      role="dialog"
      aria-modal="true"
      aria-label="CartVerse Loading Screen"
    >
      {/* Centered Minimal Card */}
      <div className="relative flex flex-col items-center text-center max-w-sm w-full space-y-6">
        {/* Soft Radial Ambient Glow */}
        <div className="relative flex items-center justify-center">
          <div className="absolute w-28 h-28 rounded-full bg-[#FF1E2D]/20 blur-2xl cartverse-glow-ring pointer-events-none" />
          
          {/* Minimal Icon Container */}
          <div className="relative w-20 h-20 rounded-2xl bg-neutral-900/80 border border-white/10 shadow-2xl backdrop-blur-xl flex items-center justify-center p-3">
            <img
              src={imgSrc}
              onError={() => setImgSrc('/Spin_logo.png')}
              alt="CartVerse Logo"
              className="cartverse-minimal-logo"
            />
          </div>
        </div>

        {/* Minimal Brand Typography */}
        <div className="space-y-1.5">
          <h1 className="text-xl font-bold tracking-wider text-white uppercase font-sans">
            CART<span className="text-[#FF1E2D]">VERSE</span>
          </h1>
          <p className="text-xs text-neutral-400 font-sans tracking-wide">
            {message}
          </p>
        </div>

        {/* Minimal Progress Bar */}
        <div className="w-48 sm:w-56 space-y-2">
          <div
            role="progressbar"
            aria-valuenow={progress}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label={message}
            className="h-1 w-full bg-white/10 rounded-full overflow-hidden relative"
          >
            {/* Progress track */}
            <div
              className="h-full bg-[#FF1E2D] rounded-full transition-all duration-150 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>

          <div className="flex items-center justify-between text-[11px] font-sans text-neutral-500 tabular-nums">
            <span className="text-neutral-500 uppercase tracking-wider text-[10px]">Loading</span>
            <span className="font-medium text-neutral-400">{progress}%</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen;

