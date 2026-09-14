import React, { useEffect, useRef } from 'react';
import { animate, stagger, utils } from 'animejs';

interface StaggerGridProps {
  className?: string;
  columns?: number;
  rows?: number;
}

export const StaggerGrid: React.FC<StaggerGridProps> = ({
  className = '',
  columns = 11,
  rows = 4,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const totalSquares = columns * rows;
  const squaresArray = Array.from({ length: totalSquares }, (_, i) => i);
  const animRef = useRef<any>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const $squares = containerRef.current.querySelectorAll('.square');
    if (!$squares.length) return;

    let isMounted = true;
    const grid = [columns, rows] as const;

    function animateGrid(customFrom?: number) {
      if (!isMounted) return;

      const from = typeof customFrom === 'number' ? customFrom : utils.random(0, totalSquares - 1);

      if (animRef.current) {
        try {
          animRef.current.pause();
        } catch {
          // ignore
        }
      }

      animRef.current = animate($squares, {
        translateX: [
          { to: stagger('-.75rem', { grid, from, axis: 'x' }) },
          { to: 0, ease: 'inOutQuad' },
        ],
        translateY: [
          { to: stagger('-.75rem', { grid, from, axis: 'y' }) },
          { to: 0, ease: 'inOutQuad' },
        ],
        opacity: [
          { to: 0.5 },
          { to: 1 },
        ],
        delay: stagger(85, { grid, from }),
        onComplete: () => {
          if (isMounted) {
            animateGrid();
          }
        },
      });
    }

    animateGrid();

    return () => {
      isMounted = false;
      if (animRef.current) {
        try {
          animRef.current.pause();
          animRef.current.revert();
        } catch {
          // ignore
        }
      }
    };
  }, [columns, rows, totalSquares]);

  const handleSquareClick = (index: number) => {
    if (!containerRef.current) return;
    const $squares = containerRef.current.querySelectorAll('.square');
    const grid = [columns, rows] as const;

    if (animRef.current) {
      try {
        animRef.current.pause();
      } catch {
        // ignore
      }
    }

    animRef.current = animate($squares, {
      translateX: [
        { to: stagger('-.75rem', { grid, from: index, axis: 'x' }) },
        { to: 0, ease: 'inOutQuad' },
      ],
      translateY: [
        { to: stagger('-.75rem', { grid, from: index, axis: 'y' }) },
        { to: 0, ease: 'inOutQuad' },
      ],
      opacity: [
        { to: 0.35 },
        { to: 1 },
      ],
      delay: stagger(75, { grid, from: index }),
      onComplete: () => {
        const $sq = containerRef.current?.querySelectorAll('.square');
        if (!$sq) return;
        const resumeLoop = () => {
          const from = utils.random(0, totalSquares - 1);
          animRef.current = animate($sq, {
            translateX: [
              { to: stagger('-.75rem', { grid, from, axis: 'x' }) },
              { to: 0, ease: 'inOutQuad' },
            ],
            translateY: [
              { to: stagger('-.75rem', { grid, from, axis: 'y' }) },
              { to: 0, ease: 'inOutQuad' },
            ],
            opacity: [
              { to: 0.5 },
              { to: 1 },
            ],
            delay: stagger(85, { grid, from }),
            onComplete: resumeLoop,
          });
        };
        resumeLoop();
      },
    });
  };

  return (
    <div
      ref={containerRef}
      className={`relative flex flex-col items-center justify-center p-3 sm:p-5 rounded-2xl bg-neutral-950/70 border border-neutral-800/80 backdrop-blur-md shadow-2xl overflow-hidden group ${className}`}
    >
      {/* Top Header Tag */}
      <div className="w-full flex items-center justify-between gap-4 mb-3 pb-2 border-b border-neutral-800/60 text-[10px] uppercase font-mono tracking-wider text-neutral-400">
        <div className="flex items-center gap-1.5">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
          </span>
          <span className="text-red-400 font-semibold tracking-widest">Anime.js Stagger Grid</span>
        </div>
        <div className="text-neutral-500 font-sans hidden sm:block">
          Axis: <span className="text-neutral-300 font-mono">X / Y</span> • Grid: <span className="text-neutral-300 font-mono">11×4</span>
        </div>
      </div>

      {/* Grid of 11x4 squares */}
      <div
        className="grid gap-1.5 sm:gap-2 p-2 sm:p-3"
        style={{
          gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
        }}
      >
        {squaresArray.map((idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => handleSquareClick(idx)}
            title={`Square #${idx + 1} (click to trigger ripple)`}
            className="square w-5 h-5 sm:w-7 sm:h-7 md:w-8 md:h-8 rounded-md bg-gradient-to-br from-red-500 to-rose-700 shadow-[0_2px_8px_rgba(239,68,68,0.25)] border border-red-400/30 hover:border-white hover:brightness-125 transition-[filter,border-color] duration-150 cursor-pointer focus:outline-none"
          />
        ))}
      </div>

      {/* Footer info hint */}
      <div className="mt-2 text-[9px] text-neutral-500 font-mono text-center">
        Click any square to ripple from point
      </div>
    </div>
  );
};

export default StaggerGrid;
