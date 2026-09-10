import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../lib/utils';

export interface BoxesProps {
  className?: string;
  colors?: string[];
  rows?: number;
  cols?: number;
  [key: string]: any;
}

export const BoxesCore = ({
  className,
  colors: customColors,
  rows: numRows = 75,
  cols: numCols = 60,
  ...rest
}: BoxesProps) => {
  const rows = React.useMemo(() => new Array(numRows).fill(1), [numRows]);
  const cols = React.useMemo(() => new Array(numCols).fill(1), [numCols]);
  const defaultColors = [
    '#E31B23',
    '#FF4D4D',
    '#990000',
    '#FF6B6B',
    '#7F1D1D',
    '#DC2626',
    '#B91C1C',
    '#F59E0B',
  ];
  const activeColors = customColors && customColors.length > 0 ? customColors : defaultColors;

  const getRandomColor = () => {
    return activeColors[Math.floor(Math.random() * activeColors.length)];
  };

  return (
    <div
      style={{
        transform: `translate(-50%,-50%) skewX(-48deg) skewY(14deg) scale(0.75) rotate(0deg) translateZ(0)`,
      }}
      className={cn(
        'absolute left-1/2 top-1/2 flex w-full h-full z-0 pointer-events-auto opacity-60',
        className
      )}
      {...rest}
    >
      {rows.map((_, i) => (
        <motion.div
          key={`row` + i}
          className="w-16 h-8 border-l border-neutral-700/50 relative flex-shrink-0"
        >
          {cols.map((_, j) => (
            <motion.div
              whileHover={{
                backgroundColor: getRandomColor(),
                transition: { duration: 0 },
              }}
              animate={{
                transition: { duration: 2 },
              }}
              key={`col` + j}
              className="w-16 h-8 border-r border-t border-neutral-700/50 relative"
            >
              {j % 2 === 0 && i % 2 === 0 ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="absolute h-6 w-10 -top-[14px] -left-[22px] text-neutral-600/60 pointer-events-none"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 6v12m6-6H6"
                  />
                </svg>
              ) : null}
            </motion.div>
          ))}
        </motion.div>
      ))}
    </div>
  );
};

export const Boxes = React.memo(BoxesCore);

export interface BackgroundBoxesDemoProps {
  title?: React.ReactNode;
  subtitle?: React.ReactNode;
  badge?: React.ReactNode;
  colors?: string[];
  containerBg?: string;
  className?: string;
  children?: React.ReactNode;
}

export function BackgroundBoxesDemo({
  title,
  subtitle,
  badge,
  colors = [
    '#E31B23',
    '#FF2A35',
    '#DC2626',
    '#990000',
    '#7F1D1D',
    '#B91C1C',
    '#EF4444',
    '#FF4D4D',
  ],
  containerBg = 'bg-black',
  className,
  children,
}: BackgroundBoxesDemoProps = {}) {
  return (
    <div
      className={cn(
        'h-96 relative w-full overflow-hidden flex flex-col items-center justify-center rounded-2xl border border-red-950/50 shadow-2xl shadow-red-950/30',
        containerBg,
        className
      )}
    >
      <div
        className={cn(
          'absolute inset-0 w-full h-full z-20 [mask-image:radial-gradient(transparent,white)] pointer-events-none',
          containerBg
        )}
      />
      <Boxes colors={colors} />
      {badge && <div className="relative z-20 mb-3">{badge}</div>}
      {typeof title === 'string' ? (
        <h1 className={cn('md:text-4xl text-xl text-white relative z-20 font-bold tracking-tight text-center px-4')}>
          {title}
        </h1>
      ) : (
        <div className="relative z-20">{title}</div>
      )}
      {subtitle &&
        (typeof subtitle === 'string' ? (
          <p className="text-center mt-2 text-neutral-300 relative z-20 text-sm max-w-xl px-4">
            {subtitle}
          </p>
        ) : (
          <div className="relative z-20">{subtitle}</div>
        ))}
      {children}
    </div>
  );
}

export interface BoxesBackgroundProps {
  className?: string;
  maskClassName?: string;
  colors?: string[];
  opacity?: string;
  children?: React.ReactNode;
}

export const BoxesBackground: React.FC<BoxesBackgroundProps> = ({
  className,
  maskClassName,
  colors,
  opacity = 'opacity-40',
  children,
}) => {
  return (
    <div className={cn('absolute inset-0 w-full h-full overflow-hidden pointer-events-none z-0', className)}>
      <div
        className={cn(
          'absolute inset-0 w-full h-full bg-[#0A0A0C]/80 z-10 [mask-image:radial-gradient(transparent,white)] pointer-events-none',
          maskClassName
        )}
      />
      <Boxes colors={colors} className={opacity} />
      {children}
    </div>
  );
};

export default Boxes;
