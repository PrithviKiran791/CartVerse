import React from 'react';

interface SpinLogoProps {
  className?: string;
  size?: number | string;
  showLabel?: boolean;
}

export const SpinLogo: React.FC<SpinLogoProps> = ({
  className = '',
  size = 280,
}) => {
  return (
    <div className={`flex flex-col items-center justify-center select-none ${className}`}>
      <div
        className="relative rounded-full transition-all duration-300 group pointer-events-auto"
        style={{
          width: typeof size === 'number' ? `${size}px` : size,
          height: typeof size === 'number' ? `${size}px` : size,
        }}
        aria-label="High performance cooler fan"
      >
        {/* Subtle Ambient Radial Glow */}
        <div
          className="absolute inset-0 rounded-full bg-red-600/20 blur-2xl scale-110 pointer-events-none"
        />

        {/* Outer broken ring (static) */}
        <svg viewBox="0 0 200 200" className="absolute inset-0 w-full h-full pointer-events-none z-10">
          <defs>
            <linearGradient id="ringRed" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ff2b2b" />
              <stop offset="100%" stopColor="#ff5a5a" />
            </linearGradient>
            <linearGradient id="ringDark" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#2e2e33" />
              <stop offset="100%" stopColor="#1a1a1e" />
            </linearGradient>
          </defs>

          {/* Dark hardware arc, left/bottom */}
          <path
            d="M 100 12 A 88 88 0 0 0 12 100"
            fill="none"
            stroke="url(#ringDark)"
            strokeWidth="6"
            strokeLinecap="round"
          />
          <path
            d="M 12 108 A 88 88 0 0 0 92 188"
            fill="none"
            stroke="url(#ringDark)"
            strokeWidth="6"
            strokeLinecap="round"
          />

          {/* Red cyber arc, top/right, with high-intensity neon glow */}
          <path
            d="M 108 12 A 88 88 0 0 1 188 92"
            fill="none"
            stroke="url(#ringRed)"
            strokeWidth="6"
            strokeLinecap="round"
            style={{ filter: 'drop-shadow(0 0 8px rgba(255,43,43,0.85))' }}
          />
          <path
            d="M 188 108 A 88 88 0 0 1 108 188"
            fill="none"
            stroke="url(#ringRed)"
            strokeWidth="6"
            strokeLinecap="round"
            style={{ filter: 'drop-shadow(0 0 8px rgba(255,43,43,0.85))' }}
          />
        </svg>

        {/* Spinning fan blades + hub - spins continuously */}
        <div
          className="absolute inset-0 z-0 transition-transform animate-[spinFan_1.5s_linear_infinite]"
          style={{
            animation: 'spinFan 1.5s linear infinite',
          }}
        >
          <svg viewBox="0 0 200 200" className="w-full h-full">
            <defs>
              <linearGradient id="bladeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#0a0a0a" />
                <stop offset="60%" stopColor="#1c1c1c" />
                <stop offset="100%" stopColor="#2a2a2a" />
              </linearGradient>
              <radialGradient id="hubGrad" cx="50%" cy="45%" r="60%">
                <stop offset="0%" stopColor="#2a2a2a" />
                <stop offset="100%" stopColor="#0a0a0a" />
              </radialGradient>
            </defs>

            {/* 5 aerodynamic curved fan blades */}
            <g>
              {[0, 1, 2, 3, 4].map((i) => (
                <path
                  key={i}
                  d="M100,100 C100,70 108,45 135,35 C120,45 118,60 128,72 C142,68 150,48 148,30 C158,55 155,85 128,100 Z"
                  fill="url(#bladeGrad)"
                  stroke="#ff2b2b"
                  strokeWidth="2"
                  transform={`rotate(${i * 72} 100 100)`}
                />
              ))}
            </g>

            {/* Hub structure */}
            <circle cx="100" cy="100" r="26" fill="url(#hubGrad)" stroke="#000" strokeWidth="2" />
            <circle
              cx="100"
              cy="100"
              r="17"
              fill="#0a0a0a"
              stroke="#ff2b2b"
              strokeWidth="3"
              style={{ filter: 'drop-shadow(0 0 5px rgba(255,43,43,0.95))' }}
            />
          </svg>
        </div>
      </div>

      <style>{`
        @keyframes spinFan {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default SpinLogo;
