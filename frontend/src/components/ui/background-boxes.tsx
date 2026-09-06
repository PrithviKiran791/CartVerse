import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../lib/utils';

export interface BoxesProps {
  className?: string;
  colors?: string[];
  [key: string]: any;
}

export const BoxesCore = ({
  className,
  colors: customColors,
  ...rest
}: BoxesProps) => {
  const rows = new Array(70).fill(1);
  const cols = new Array(40).fill(1);
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
        transform: `translate(-40%,-60%) skewX(-48deg) skewY(14deg) scale(0.675) rotate(0deg) translateZ(0)`,
      }}
      className={cn(
        'absolute left-1/4 p-4 -top-1/4 flex -translate-x-1/2 -translate-y-1/2 w-full h-full z-0 pointer-events-auto opacity-40',
        className
      )}
      {...rest}
    >
      {rows.map((_, i) => (
        <motion.div
          key={`row` + i}
          className="w-16 h-8 border-l border-neutral-800/70 relative"
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
              className="w-16 h-8 border-r border-t border-neutral-800/70 relative"
            >
              {j % 2 === 0 && i % 2 === 0 ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="absolute h-6 w-10 -top-[14px] -left-[22px] text-neutral-800/50 pointer-events-none"
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

export default Boxes;
