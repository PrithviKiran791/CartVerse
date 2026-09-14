import React, { useEffect, useState, useRef } from 'react';
import { Cpu, Terminal, Activity, ShieldCheck } from 'lucide-react';
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
    ? `fixed inset-0 z-[99999] flex flex-col items-center justify-center p-4 sm:p-6 brutalist-grid-bg text-white select-none overflow-hidden transition-opacity duration-200 ease-out ${
        isFadingOut ? 'opacity-0 pointer-events-none' : 'opacity-100 pointer-events-auto'
      }`
    : 'w-full h-full min-h-[400px] flex flex-col items-center justify-center p-4 sm:p-6 bg-transparent text-white select-none overflow-hidden';

  return (
    <div
      className={containerClasses}
      role="dialog"
      aria-modal="true"
      aria-label="CartVerse System Boot Loader"
    >
      {/* Fullscreen Technical Viewport Corner Crosshairs */}
      {fullScreen && (
        <>
          <div className="absolute top-4 left-4 font-mono text-[10px] text-neutral-500 tracking-widest hidden sm:block select-none">
            + [SYS.POS: 00.00.00]
          </div>
          <div className="absolute top-4 right-4 font-mono text-[10px] text-neutral-500 tracking-widest hidden sm:block select-none">
            // CV_KERNEL_V4.2 [ONLINE] +
          </div>
          <div className="absolute bottom-4 left-4 font-mono text-[10px] text-neutral-500 tracking-widest hidden sm:block select-none">
            + [SEC_GATE: SHA-256]
          </div>
          <div className="absolute bottom-4 right-4 font-mono text-[10px] text-neutral-500 tracking-widest hidden sm:block select-none">
            // HARDWARE_INDEX_LIVE +
          </div>
        </>
      )}

      {/* Main Technical Brutalist Chassis Card */}
      <div className="w-full max-w-md sm:max-w-lg rounded-none border-2 sm:border-[3px] border-neutral-700 bg-[#0E0C13] p-5 sm:p-7 shadow-[10px_10px_0px_0px_#FF1E2D] relative z-20 space-y-5">
        {/* Top Header Telemetry Strip */}
        <div className="flex items-center justify-between pb-3 border-b-2 border-neutral-800">
          <span className="text-[10px] font-mono font-black uppercase tracking-widest bg-[#FF1E2D] text-white px-2 py-0.5 border border-black shadow-[2px_2px_0px_0px_#000000] flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 bg-white rounded-none animate-ping" />
            // SYS.BOOT_SEQUENCE
          </span>
          <span className="text-[10px] font-mono text-neutral-400 tracking-wider">
            [BUS_ACTIVE]
          </span>
        </div>

        {/* Center Turbine Bay & Brand Wordmark */}
        <div className="flex flex-col items-center justify-center space-y-4">
          {/* Hardware Spinner Bay with Brutalist Accents */}
          <div className="relative">
            <span className="absolute -top-2 -left-2 font-mono text-xs text-[#FF1E2D] font-bold select-none">+</span>
            <span className="absolute -top-2 -right-2 font-mono text-xs text-[#FF1E2D] font-bold select-none">+</span>
            <span className="absolute -bottom-2 -left-2 font-mono text-xs text-[#FF1E2D] font-bold select-none">+</span>
            <span className="absolute -bottom-2 -right-2 font-mono text-xs text-[#FF1E2D] font-bold select-none">+</span>

            <div className="w-24 h-24 sm:w-28 sm:h-28 border-2 border-neutral-700 bg-neutral-950 p-2 shadow-[4px_4px_0px_0px_#FF1E2D] flex flex-col items-center justify-center relative">
              <div className="absolute top-1 left-2 right-2 flex items-center justify-between text-[8px] font-mono text-neutral-500 border-b border-neutral-900 pb-0.5">
                <span>BAY_01</span>
                <span className="text-[#FF1E2D] font-bold">4200 RPM</span>
              </div>
              <img
                src={imgSrc}
                onError={() => setImgSrc('/Spin_logo.png')}
                alt="CartVerse Cooling Turbine"
                className="cartverse-fan-logo mt-2"
              />
            </div>
          </div>

          {/* Wordmark */}
          <div className="space-y-1 text-center">
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white uppercase font-sans">
              CART<span className="text-[#FF1E2D]">VERSE</span>
            </h1>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 border border-neutral-800 bg-neutral-950 text-[10px] font-mono text-neutral-400 tracking-widest uppercase">
              <Terminal className="w-3 h-3 text-[#FF1E2D]" />
              <span>HIGH-PERFORMANCE HARDWARE ARCHITECTURE</span>
            </div>
          </div>
        </div>

        {/* Technical Brutalist Progress Bar Section */}
        <div className="w-full space-y-2 pt-1">
          {/* Status & Output row */}
          <div className="flex items-center justify-between gap-2 text-xs font-mono">
            <div className="flex items-center gap-1.5 truncate text-neutral-200 font-bold uppercase tracking-wider">
              <span className="text-[#FF1E2D] font-black">&gt;&gt;</span>
              <span className="truncate">{message}</span>
              <span className="inline-block w-1.5 h-3.5 bg-[#FF1E2D] brutalist-cursor" />
            </div>
            <div className="shrink-0 bg-neutral-950 border border-neutral-700 px-2 py-0.5 text-[#FF1E2D] font-black text-xs shadow-[2px_2px_0px_0px_#000000]">
              {progress}%
            </div>
          </div>

          {/* Heavy brutalist progress track */}
          <div
            role="progressbar"
            aria-valuenow={progress}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label={message}
            className="h-5 sm:h-6 w-full bg-neutral-950 border-2 border-neutral-700 p-0.5 shadow-[4px_4px_0px_0px_#FF1E2D] rounded-none relative overflow-hidden"
          >
            <div
              className="h-full bg-[#FF1E2D] transition-all duration-75 ease-out relative brutalist-stripes"
              style={{ width: `${progress}%` }}
            />
          </div>

          {/* Telemetry Diagnostics Spec Sheet */}
          <div className="grid grid-cols-2 gap-2 pt-2 text-[10px] font-mono text-neutral-400">
            <div className="border border-neutral-800 bg-neutral-950/80 p-1.5 flex items-center justify-between">
              <span className="text-neutral-500 uppercase flex items-center gap-1">
                <Cpu className="w-3 h-3 text-[#FF1E2D]" /> BUS
              </span>
              <span className="text-neutral-200 font-bold">PCIe 5.0 x16</span>
            </div>
            <div className="border border-neutral-800 bg-neutral-950/80 p-1.5 flex items-center justify-between">
              <span className="text-neutral-500 uppercase flex items-center gap-1">
                <Activity className="w-3 h-3 text-[#FF1E2D]" /> STATUS
              </span>
              <span className="text-emerald-400 font-bold">NOMINAL</span>
            </div>
            <div className="border border-neutral-800 bg-neutral-950/80 p-1.5 flex items-center justify-between">
              <span className="text-neutral-500 uppercase flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-[#FF1E2D]" /> SECURE
              </span>
              <span className="text-neutral-200 font-bold">SHA-256</span>
            </div>
            <div className="border border-neutral-800 bg-neutral-950/80 p-1.5 flex items-center justify-between">
              <span className="text-neutral-500 uppercase">MEMORY</span>
              <span className="text-neutral-200 font-bold">128MB L3</span>
            </div>
          </div>
        </div>

        {/* Bottom Status Log */}
        <div className="border-t border-neutral-800 pt-3 flex items-center justify-between text-[9px] font-mono text-neutral-500">
          <span>KERNEL // BUILD_INDEX_V4.2</span>
          <span>{duration && duration > 0 ? `TIME: ${duration}MS` : 'STANDALONE_MODE'}</span>
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen;

