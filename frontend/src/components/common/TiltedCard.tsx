import React, { useRef, useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

export interface TiltedCardProps {
  imageSrc: string;
  altText?: string;
  captionText?: string;
  containerHeight?: string;
  containerWidth?: string;
  imageHeight?: string;
  imageWidth?: string;
  rotateAmplitude?: number;
  scaleOnHover?: number;
  showMobileWarning?: boolean;
  showTooltip?: boolean;
  displayOverlayContent?: boolean;
  overlayContent?: React.ReactNode;
  className?: string;
}

export const TiltedCard: React.FC<TiltedCardProps> = ({
  imageSrc,
  altText = 'Tilted Card Image',
  captionText,
  containerHeight = '300px',
  containerWidth = '300px',
  imageHeight = '300px',
  imageWidth = '300px',
  rotateAmplitude = 12,
  scaleOnHover = 1.05,
  showMobileWarning = false,
  showTooltip = true,
  displayOverlayContent = false,
  overlayContent,
  className = '',
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });

  // Motion values for smooth 3D tilt
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const springConfig = { damping: 20, stiffness: 200, mass: 0.5 };
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [rotateAmplitude, -rotateAmplitude]), springConfig);
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-rotateAmplitude, rotateAmplitude]), springConfig);
  const scale = useSpring(isHovered ? scaleOnHover : 1, springConfig);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;

    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    // Normalize between -0.5 and 0.5
    x.set(mouseX / width - 0.5);
    y.set(mouseY / height - 0.5);

    setTooltipPos({ x: mouseX, y: mouseY });
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    x.set(0);
    y.set(0);
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`relative inline-block perspective-1000 ${className}`}
      style={{
        width: containerWidth,
        height: containerHeight,
        perspective: '1000px',
      }}
    >
      <motion.div
        className="w-full h-full relative rounded-2xl overflow-hidden shadow-2xl border border-neutral-800 bg-neutral-900 group cursor-pointer"
        style={{
          rotateX,
          rotateY,
          scale,
          transformStyle: 'preserve-3d',
        }}
      >
        {/* Card Main Image */}
        <img
          src={imageSrc}
          alt={altText}
          className="w-full h-full object-cover transition-all duration-300"
          style={{
            width: imageWidth,
            height: imageHeight,
          }}
        />

        {/* Optional Overlay Content */}
        {displayOverlayContent && overlayContent && (
          <div
            className="absolute inset-0 z-10 flex flex-col justify-end p-4 bg-gradient-to-t from-black/80 via-black/30 to-transparent text-white"
            style={{ transform: 'translateZ(30px)' }}
          >
            {overlayContent}
          </div>
        )}

        {/* Caption Text fallback */}
        {!displayOverlayContent && captionText && (
          <div
            className="absolute bottom-0 left-0 right-0 p-3 bg-neutral-950/80 backdrop-blur-md text-xs font-mono text-white font-bold"
            style={{ transform: 'translateZ(20px)' }}
          >
            {captionText}
          </div>
        )}
      </motion.div>

      {/* Floating Tooltip following cursor */}
      {showTooltip && isHovered && captionText && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          className="absolute pointer-events-none z-30 bg-neutral-950 text-white font-mono text-xs px-3 py-1.5 rounded-lg border border-neutral-700 shadow-xl whitespace-nowrap"
          style={{
            left: tooltipPos.x + 12,
            top: tooltipPos.y + 12,
          }}
        >
          {captionText}
        </motion.div>
      )}
    </div>
  );
};

export default TiltedCard;
