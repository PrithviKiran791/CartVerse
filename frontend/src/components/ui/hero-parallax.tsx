import React from 'react';
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  MotionValue,
} from 'framer-motion';

import Typography from './Typography';

export interface ParallaxProduct {
  title: string;
  link: string;
  thumbnail: string;
  category?: string;
  price?: string;
}

export const HeroParallax = ({
  products,
  headerTitle = "The Ultimate Hardware & Custom Studio",
  headerSubtitle = "Explore top-tier GPUs, CPUs, Pre-Built Rigs, and custom PC Builder components with real-time socket & wattage compatibility."
}: {
  products: ParallaxProduct[];
  headerTitle?: string;
  headerSubtitle?: string;
}) => {
  const firstRow = products.slice(0, 5);
  const secondRow = products.slice(5, 10);
  const thirdRow = products.slice(10, 15);
  const ref = React.useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  });

  const springConfig = { stiffness: 300, damping: 30, bounce: 0 };

  const translateX = useSpring(
    useTransform(scrollYProgress, [0, 1], [0, 1000]),
    springConfig
  );
  const translateXReverse = useSpring(
    useTransform(scrollYProgress, [0, 1], [0, -1000]),
    springConfig
  );
  const rotateX = useSpring(
    useTransform(scrollYProgress, [0, 0.2], [15, 0]),
    springConfig
  );
  const opacity = useSpring(
    useTransform(scrollYProgress, [0, 0.2], [0.2, 1]),
    springConfig
  );
  const rotateZ = useSpring(
    useTransform(scrollYProgress, [0, 0.2], [20, 0]),
    springConfig
  );
  const translateY = useSpring(
    useTransform(scrollYProgress, [0, 0.2], [-700, 500]),
    springConfig
  );

  return (
    <div
      ref={ref}
      className="h-[280vh] py-20 overflow-hidden antialiased relative flex flex-col self-auto [perspective:1000px] [transform-style:preserve-3d] bg-[#0A0A0C]"
    >
      <Header title={headerTitle} subtitle={headerSubtitle} />
      <motion.div
        style={{
          rotateX,
          rotateZ,
          translateY,
          opacity,
        }}
        className=""
      >
        <motion.div className="flex flex-row-reverse space-x-reverse space-x-12 sm:space-x-20 mb-12 sm:mb-20">
          {firstRow.map((product) => (
            <ProductCard
              product={product}
              translate={translateX}
              key={product.title}
            />
          ))}
        </motion.div>
        <motion.div className="flex flex-row space-x-12 sm:space-x-20 mb-12 sm:mb-20">
          {secondRow.map((product) => (
            <ProductCard
              product={product}
              translate={translateXReverse}
              key={product.title}
            />
          ))}
        </motion.div>
        <motion.div className="flex flex-row-reverse space-x-reverse space-x-12 sm:space-x-20">
          {thirdRow.map((product) => (
            <ProductCard
              product={product}
              translate={translateX}
              key={product.title}
            />
          ))}
        </motion.div>
      </motion.div>
    </div>
  );
};

export const Header = ({ title, subtitle }: { title: string; subtitle: string }) => {
  return (
    <div className="max-w-7xl relative mx-auto py-12 md:py-24 px-4 w-full left-0 top-0 z-10">
      <div className="inline-flex items-center gap-2 bg-red-950/70 border border-red-500/40 px-3.5 py-1.5 rounded-full text-xs font-mono text-red-400 font-bold mb-4">
        <span>CARTVERSE 3D PARALLAX SHOWCASE</span>
      </div>
      <Typography type="h1" className="text-3xl md:text-7xl font-black text-white leading-tight tracking-tight">
        {title}
      </Typography>
      <Typography type="lead" color="muted" className="max-w-2xl text-base md:text-xl mt-6 font-medium">
        {subtitle}
      </Typography>
    </div>
  );
};

export const ProductCard = ({
  product,
  translate,
}: {
  product: ParallaxProduct;
  translate: MotionValue<number>;
}) => {
  return (
    <motion.div
      style={{
        x: translate,
      }}
      whileHover={{
        y: -20,
      }}
      key={product.title}
      className="group/product h-80 sm:h-96 w-[22rem] sm:w-[28rem] relative flex-shrink-0 rounded-2xl overflow-hidden border border-neutral-800 bg-neutral-900 shadow-2xl"
    >
      <a
        href={product.link}
        className="block group-hover/product:shadow-2xl w-full h-full p-4 flex items-center justify-center bg-neutral-950/80"
      >
        <img
          src={product.thumbnail}
          className="object-contain h-full w-full transition-transform duration-500 group-hover/product:scale-105"
          alt={product.title}
          loading="lazy"
        />
      </a>
      <div className="absolute inset-0 h-full w-full opacity-0 group-hover/product:opacity-80 bg-gradient-to-t from-black via-black/70 to-transparent pointer-events-none transition duration-300"></div>
      <div className="absolute bottom-4 left-4 right-4 opacity-0 group-hover/product:opacity-100 transition duration-300 flex flex-col gap-1">
        {product.category && (
          <span className="text-[10px] font-mono font-bold uppercase text-red-400 tracking-wider">
            {product.category}
          </span>
        )}
        <h2 className="text-white font-bold text-base sm:text-lg line-clamp-1">
          {product.title}
        </h2>
        {product.price && (
          <span className="text-xs font-mono font-bold text-white bg-red-600 px-2 py-0.5 rounded w-max">
            {product.price}
          </span>
        )}
      </div>
    </motion.div>
  );
};

export default HeroParallax;
