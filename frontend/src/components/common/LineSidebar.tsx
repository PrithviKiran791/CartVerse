import React, { useState, useRef, useCallback } from 'react';

export interface LineSidebarProps {
  items: string[];
  accentColor?: string;
  textColor?: string;
  markerColor?: string;
  showIndex?: boolean;
  showMarker?: boolean;
  proximityRadius?: number;
  maxShift?: number;
  falloff?: 'smooth' | 'linear';
  markerLength?: number;
  markerGap?: number;
  tickScale?: number;
  scaleTick?: boolean;
  itemGap?: number;
  fontSize?: number; // in rem
  smoothing?: number;
  defaultActive?: number;
  onItemClick?: (index: number, label: string) => void;
  className?: string;
}

export const LineSidebar: React.FC<LineSidebarProps> = ({
  items = ['Overview', 'Components', 'Animations', 'Backgrounds', 'Showcase'],
  accentColor = '#A855F7',
  textColor = '#c4c4c4',
  markerColor = '#6c6c6c',
  showIndex = true,
  showMarker = true,
  proximityRadius = 100,
  maxShift = 30,
  falloff = 'smooth',
  markerLength = 60,
  markerGap = 0,
  tickScale = 0.5,
  scaleTick = true,
  itemGap = 20,
  fontSize = 1.1,
  smoothing = 100,
  defaultActive = 0,
  onItemClick,
  className = '',
}) => {
  const [activeIndex, setActiveIndex] = useState<number>(defaultActive);
  const [mouseY, setMouseY] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const relativeY = e.clientY - rect.top;
    setMouseY(relativeY);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setMouseY(null);
  }, []);

  const handleClick = (index: number, label: string) => {
    setActiveIndex(index);
    if (onItemClick) {
      onItemClick(index, label);
    }
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`relative flex flex-col font-mono select-none ${className}`}
      style={{ gap: `${itemGap}px` }}
    >
      {items.map((label, idx) => {
        const isActive = activeIndex === idx;

        // Calculate proximity shift & tick scale based on mouse Y distance
        let shiftX = 0;
        let currentScale = 1;

        if (mouseY !== null && containerRef.current && itemRefs.current[idx]) {
          const itemElem = itemRefs.current[idx];
          if (itemElem) {
            const itemTop = itemElem.offsetTop;
            const itemHeight = itemElem.offsetHeight;
            const itemCenterY = itemTop + itemHeight / 2;

            const dist = Math.abs(mouseY - itemCenterY);

            if (dist < proximityRadius) {
              const ratio = 1 - dist / proximityRadius;
              const factor =
                falloff === 'smooth'
                  ? ratio * ratio * (3 - 2 * ratio) // Cubic smooth step
                  : ratio;

              shiftX = maxShift * factor;
              if (scaleTick) {
                currentScale = 1 + tickScale * factor;
              }
            }
          }
        }

        return (
          <div
            key={idx}
            ref={(el) => (itemRefs.current[idx] = el)}
            onClick={() => handleClick(idx, label)}
            className="flex items-center gap-3 cursor-pointer group transition-transform"
            style={{
              transform: `translateX(${shiftX}px)`,
              transition: `transform ${smoothing}ms cubic-bezier(0.16, 1, 0.3, 1), color 200ms ease`,
            }}
          >
            {/* Optional Tick Marker Line */}
            {showMarker && (
              <div
                className="transition-all duration-200"
                style={{
                  width: `${markerLength}px`,
                  height: '2px',
                  backgroundColor: isActive ? accentColor : markerColor,
                  marginRight: `${markerGap}px`,
                  transform: `scaleY(${currentScale})`,
                  transformOrigin: 'left center',
                }}
              />
            )}

            {/* Optional Index Counter (01, 02...) */}
            {showIndex && (
              <span
                className="text-xs font-bold font-mono transition-colors"
                style={{ color: isActive ? accentColor : markerColor }}
              >
                {String(idx + 1).padStart(2, '0')}
              </span>
            )}

            {/* Label Text */}
            <span
              className="font-bold tracking-wide transition-colors uppercase"
              style={{
                fontSize: `${fontSize}rem`,
                color: isActive ? accentColor : textColor,
              }}
            >
              {label}
            </span>
          </div>
        );
      })}
    </div>
  );
};

export default LineSidebar;
