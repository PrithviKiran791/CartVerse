import React, { useState } from 'react';
import { cn } from '../../lib/utils';

export interface InteractiveGridPatternProps extends React.SVGProps<SVGSVGElement> {
  width?: number;
  height?: number;
  squares?: [number, number]; // [horizontal, vertical]
  className?: string;
  squaresClassName?: string;
}

export function InteractiveGridPattern({
  width = 40,
  height = 40,
  squares = [24, 24],
  className,
  squaresClassName,
  ...props
}: InteractiveGridPatternProps) {
  const [horizontal, vertical] = squares;
  const [hoveredSquare, setHoveredSquare] = useState<number | null>(null);

  return (
    <svg
      width={width * horizontal}
      height={height * vertical}
      className={cn(
        'absolute inset-0 h-full w-full border border-neutral-800/40 stroke-neutral-800/40 pointer-events-auto',
        className
      )}
      {...props}
    >
      <defs>
        <pattern
          id="interactive-grid-pattern"
          width={width}
          height={height}
          patternUnits="userSpaceOnUse"
          x={-1}
          y={-1}
        >
          <path
            d={`M.5 ${height}V.5H${width}`}
            fill="none"
            strokeDasharray="0"
          />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#interactive-grid-pattern)" />
      <svg x={-1} y={-1} className="overflow-visible">
        {Array.from({ length: horizontal * vertical }).map((_, index) => {
          const x = (index % horizontal) * width;
          const y = Math.floor(index / horizontal) * height;
          return (
            <rect
              key={index}
              x={x}
              y={y}
              width={width}
              height={height}
              className={cn(
                'stroke-neutral-800/40 transition-all duration-100 ease-in-out [&:not(:hover)]:duration-700 cursor-crosshair',
                hoveredSquare === index ? 'fill-red-600/40 stroke-red-500' : 'fill-transparent',
                squaresClassName
              )}
              onMouseEnter={() => setHoveredSquare(index)}
              onMouseLeave={() => setHoveredSquare(null)}
            />
          );
        })}
      </svg>
    </svg>
  );
}

export default InteractiveGridPattern;
