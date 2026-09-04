import React from 'react';

export interface NoiseBackgroundProps {
  children?: React.ReactNode;
  containerClassName?: string;
  gradientColors?: string[];
  noiseOpacity?: number;
}

export const NoiseBackground: React.FC<NoiseBackgroundProps> = ({
  children,
  containerClassName = '',
  gradientColors = [
    'rgb(227, 27, 35)',
    'rgb(180, 20, 20)',
    'rgb(255, 75, 75)',
  ],
  noiseOpacity = 0.2,
}) => {
  const gradient = `linear-gradient(135deg, ${gradientColors.join(', ')})`;

  return (
    <div
      className={`relative overflow-hidden p-0.5 shadow-xl transition-all duration-300 ${containerClassName}`}
      style={{
        background: gradient,
      }}
    >
      {/* Noise texture overlay */}
      <div
        className="pointer-events-none absolute inset-0 rounded-[inherit] z-10"
        style={{
          opacity: noiseOpacity,
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />
      <div className="relative z-20 rounded-[inherit] w-full h-full">{children}</div>
    </div>
  );
};

export default NoiseBackground;
