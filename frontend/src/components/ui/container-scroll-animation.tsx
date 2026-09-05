import React, { useRef, useState, useEffect } from 'react';
import { useScroll, useTransform, motion, MotionValue } from 'framer-motion';

export const ContainerScroll = ({
  titleComponent,
  children,
  className = '',
}: {
  titleComponent: string | React.ReactNode;
  children: React.ReactNode;
  className?: string;
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  });

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const scaleDimensions = () => {
    return isMobile ? [0.85, 0.98] : [1.02, 1];
  };

  const rotate = useTransform(scrollYProgress, [0, 0.5], [15, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5], scaleDimensions());
  const translate = useTransform(scrollYProgress, [0, 0.5], [40, 0]);

  return (
    <div
      className={`min-h-[35rem] md:min-h-[45rem] flex items-center justify-center relative p-2 md:p-8 ${className}`}
      ref={containerRef}
    >
      <div
        className="py-6 md:py-12 w-full relative"
        style={{
          perspective: '1000px',
        }}
      >
        <Header translate={translate} titleComponent={titleComponent} />
        <Card rotate={rotate} translate={translate} scale={scale}>
          {children}
        </Card>
      </div>
    </div>
  );
};

export const Header = ({
  translate,
  titleComponent,
}: {
  translate: MotionValue<number>;
  titleComponent: React.ReactNode;
}) => {
  return (
    <motion.div
      style={{
        translateY: translate,
      }}
      className="max-w-5xl mx-auto text-center mb-6"
    >
      {titleComponent}
    </motion.div>
  );
};

export const Card = ({
  rotate,
  scale,
  children,
}: {
  rotate: MotionValue<number>;
  scale: MotionValue<number>;
  translate: MotionValue<number>;
  children: React.ReactNode;
}) => {
  return (
    <motion.div
      style={{
        rotateX: rotate,
        scale,
        boxShadow:
          '0 20px 50px -10px rgba(0,0,0,0.8), 0 0 30px 2px rgba(227,27,35,0.15)',
      }}
      className="max-w-5xl mx-auto w-full border border-neutral-800/90 p-3 sm:p-6 bg-neutral-950/90 rounded-[28px] shadow-2xl backdrop-blur-xl"
    >
      <div className="h-full w-full overflow-hidden rounded-2xl bg-neutral-900/80 border border-neutral-800/60 p-2 sm:p-4">
        {children}
      </div>
    </motion.div>
  );
};

export default ContainerScroll;
