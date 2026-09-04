import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

export interface HoverEffectItem {
  title: string;
  description: string;
  link?: string;
  icon?: React.ReactNode;
  badge?: string;
}

export const HoverEffect = ({
  items,
  className = '',
}: {
  items: HoverEffectItem[];
  className?: string;
}) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <div
      className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 py-6 gap-2 ${className}`}
    >
      {items.map((item, idx) => {
        const content = (
          <>
            <AnimatePresence>
              {hoveredIndex === idx && (
                <motion.span
                  className="absolute inset-0 h-full w-full bg-red-600/15 dark:bg-red-500/[0.18] block rounded-3xl z-0 border border-red-500/40 shadow-[0_0_25px_rgba(227,27,35,0.25)]"
                  layoutId="hoverBackground"
                  initial={{ opacity: 0 }}
                  animate={{
                    opacity: 1,
                    transition: { duration: 0.15 },
                  }}
                  exit={{
                    opacity: 0,
                    transition: { duration: 0.15, delay: 0.2 },
                  }}
                />
              )}
            </AnimatePresence>
            <Card>
              {item.badge && (
                <span className="inline-block px-2.5 py-0.5 text-[10px] font-mono font-bold uppercase text-red-400 bg-red-950/80 border border-red-800/50 rounded-full mb-3">
                  {item.badge}
                </span>
              )}
              {item.icon && (
                <div className="w-10 h-10 rounded-xl bg-neutral-900 border border-neutral-800 flex items-center justify-center text-red-500 mb-3 group-hover:border-red-500/50 group-hover:bg-red-950/30 transition-colors">
                  {item.icon}
                </div>
              )}
              <CardTitle>{item.title}</CardTitle>
              <CardDescription>{item.description}</CardDescription>
            </Card>
          </>
        );

        return item.link ? (
          <a
            href={item.link}
            key={item?.link || idx}
            className="relative group block p-2 h-full w-full"
            onMouseEnter={() => setHoveredIndex(idx)}
            onMouseLeave={() => setHoveredIndex(null)}
          >
            {content}
          </a>
        ) : (
          <div
            key={idx}
            className="relative group block p-2 h-full w-full cursor-pointer"
            onMouseEnter={() => setHoveredIndex(idx)}
            onMouseLeave={() => setHoveredIndex(null)}
          >
            {content}
          </div>
        );
      })}
    </div>
  );
};

export const Card = ({
  className = '',
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) => {
  return (
    <div
      className={`rounded-2xl h-full w-full p-5 overflow-hidden bg-[#0A0A0C] border border-neutral-800/90 group-hover:border-red-500/40 relative z-20 transition-colors duration-300 shadow-xl ${className}`}
    >
      <div className="relative z-50">
        <div className="p-2">{children}</div>
      </div>
    </div>
  );
};

export const CardTitle = ({
  className = '',
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) => {
  return (
    <h4 className={`text-zinc-100 font-bold tracking-wide mt-2 text-lg group-hover:text-red-400 transition-colors ${className}`}>
      {children}
    </h4>
  );
};

export const CardDescription = ({
  className = '',
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) => {
  return (
    <p
      className={`text-zinc-400 tracking-wide leading-relaxed text-sm mt-3 font-normal ${className}`}
    >
      {children}
    </p>
  );
};

export default HoverEffect;
