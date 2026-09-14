import React, { useRef, useState, useEffect } from 'react';
import { useScroll, useTransform, motion, MotionValue } from 'framer-motion';
import { useScrollContainer } from '../../context/ScrollContainerContext';
import { cn } from '@/lib/utils';

export const ContainerScroll = ({
  titleComponent,
  children,
  className = '',
  cardClassName = '',
}: {
  titleComponent?: string | React.ReactNode;
  children: React.ReactNode;
  className?: string;
  cardClassName?: string;
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollContainerRef } = useScrollContainer();
  const { scrollYProgress } = useScroll({
    target: containerRef,
    container: scrollContainerRef?.current ? (scrollContainerRef as React.RefObject<HTMLElement>) : undefined,
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
    return isMobile ? [0.94, 1] : [1.02, 1];
  };

  const rotate = useTransform(scrollYProgress, [0, 0.45], [16, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.45], scaleDimensions());
  const translate = useTransform(scrollYProgress, [0, 0.45], [30, 0]);

  return (
    <div
      className={cn("w-full flex flex-col items-center justify-center relative py-4 sm:py-8 mb-12", className)}
      ref={containerRef}
    >
      <div
        className="w-full relative"
        style={{
          perspective: '1200px',
        }}
      >
        {titleComponent && <Header translate={translate} titleComponent={titleComponent} />}
        <Card rotate={rotate} translate={translate} scale={scale} className={cardClassName}>
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
  className = '',
}: {
  rotate: MotionValue<number>;
  scale: MotionValue<number>;
  translate?: MotionValue<number>;
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <motion.div
      style={{
        rotateX: rotate,
        scale,
      }}
      className={cn(
        "max-w-6xl mx-auto w-full border-2 sm:border-[3px] border-neutral-900 dark:border-neutral-700 bg-neutral-950/95 backdrop-blur-xl rounded-none sm:rounded-md p-6 sm:p-8 shadow-[10px_10px_0px_0px_#000000] dark:shadow-[10px_10px_0px_0px_#FF1E2D] transition-shadow",
        className
      )}
    >
      {children}
    </motion.div>
  );
};

export function HeroScrollDemo() {
  return (
    <div className="flex flex-col overflow-hidden bg-[#0A0A0C]">
      <ContainerScroll
        titleComponent={
          <>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-semibold text-neutral-200">
              Unleash the power of <br />
              <span className="text-4xl sm:text-6xl md:text-[5.5rem] font-black font-sans uppercase tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-purple-400 to-cyan-400 mt-2 leading-none block">
                Scroll Animations
              </span>
            </h1>
          </>
        }
      >
        <img
          src="/linear.webp"
          alt="hero"
          height={720}
          width={1400}
          className="mx-auto rounded-2xl object-cover h-full w-full object-left-top shadow-2xl"
          draggable={false}
        />
      </ContainerScroll>
    </div>
  );
}

export default ContainerScroll;
