import React, { useEffect, useRef } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { animate, utils } from 'animejs';
import webIcon from '../../assets/icons/web_icon.png';

export const Footer: React.FC = () => {
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  const footerRef = useRef<HTMLElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const animationsRef = useRef<any[]>([]);

  useEffect(() => {
    const $container = containerRef.current;
    if (!$container || isHomePage) {
      if ($container) $container.innerHTML = '';
      return;
    }

    $container.innerHTML = '';
    animationsRef.current = [];

    // Create 150 vibrant red particles on non-homepage routes
    function addAnimation() {
      if (!$container) return;
      const $particle = document.createElement('div');
      $particle.classList.add('particle', 'resume-red-particle');
      $particle.style.position = 'absolute';
      $particle.style.left = '50%';
      $particle.style.top = '50%';
      $particle.style.width = '7px';
      $particle.style.height = '7px';
      $particle.style.marginLeft = '-3.5px';
      $particle.style.marginTop = '-3.5px';
      $particle.style.borderRadius = '50%';
      $particle.style.backgroundColor = '#FF1E2D';
      $particle.style.boxShadow = '0 0 8px #FF1E2D, 0 0 16px #FF1E2D, 0 0 24px rgba(255, 30, 45, 0.85)';
      $particle.style.pointerEvents = 'none';
      $particle.style.willChange = 'transform';
      $particle.style.zIndex = '1';

      $container.appendChild($particle);

      const anim = animate($particle, {
        x: utils.random(-10, 10, 2) + 'rem',
        y: utils.random(-3, 3, 2) + 'rem',
        scale: [{ from: 0, to: 1 }, { to: 0 }],
        loop: true,
        delay: utils.random(0, 1000),
      });

      animationsRef.current.push(anim);
    }

    for (let i = 0; i < 150; i++) {
      addAnimation();
    }

    // IntersectionObserver: Pause animations when footer is out of viewport
    let observer: IntersectionObserver | null = null;
    if (footerRef.current && typeof IntersectionObserver !== 'undefined') {
      observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              animationsRef.current.forEach((anim) => {
                try {
                  anim.resume?.();
                } catch {
                  // ignore
                }
              });
            } else {
              animationsRef.current.forEach((anim) => {
                try {
                  anim.pause?.();
                } catch {
                  // ignore
                }
              });
            }
          });
        },
        { threshold: 0.01 }
      );

      observer.observe(footerRef.current);
    }

    return () => {
      observer?.disconnect();
      animationsRef.current.forEach((anim) => {
        try {
          anim.pause?.();
          anim.revert?.();
        } catch {
          // ignore
        }
      });
      animationsRef.current = [];
      if ($container) {
        $container.innerHTML = '';
      }
    };
  }, [isHomePage]);

  return (
    <footer
      ref={footerRef}
      className="relative overflow-hidden bg-white dark:bg-[#0A0A0C] border-t border-neutral-200 dark:border-neutral-900 py-6 text-neutral-600 dark:text-neutral-500 text-xs mt-auto transition-colors duration-200 min-h-[84px]"
    >
      {!isHomePage && (
        <>
          {/* Inline styles ensuring pure vibrant red particles without interference */}
          <style>{`
            .resume-red-particle::before {
              display: none !important;
            }
          `}</style>

          {/* Red Ambient Core Glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-16 bg-red-600/10 rounded-full blur-2xl pointer-events-none" />

          {/* Anime.js Red Particle Container */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden">
            <div ref={containerRef} className="container relative w-full h-full flex items-center justify-center pointer-events-none" />
          </div>
        </>
      )}

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Branding */}
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-xl bg-neutral-900 border border-neutral-700/60 p-1 flex items-center justify-center shadow-sm">
            <img src={webIcon} alt="CartVerse" className="w-full h-full object-contain rounded-lg" />
          </div>
          <span className="font-sans font-bold tracking-tight text-neutral-800 dark:text-neutral-300">
            CART<span className="text-[#FF1E2D]">VERSE</span>
          </span>
          <span className="text-[#FF1E2D]/50 font-bold">|</span>
          <span className="text-[#FF1E2D] font-sans font-bold text-[11px] tracking-wider">BUILD. SHOP. PLAY.</span>
        </div>

        {/* Footer Navigation Links */}
        <div className="flex items-center gap-4 text-xs font-mono uppercase tracking-wider">
          <Link to="/about" className="hover:text-[#FF1E2D] transition-colors font-bold text-neutral-700 dark:text-neutral-300">
            About Us
          </Link>
          <span className="text-neutral-400 dark:text-neutral-700">•</span>
          <Link to="/products" className="hover:text-[#FF1E2D] transition-colors font-medium">
            Catalog
          </Link>
          <span className="text-neutral-400 dark:text-neutral-700">•</span>
          <Link to="/builder" className="hover:text-[#FF1E2D] transition-colors font-medium">
            PC Builder
          </Link>
          <span className="text-neutral-400 dark:text-neutral-700">•</span>
          <Link to="/servers" className="hover:text-[#FF1E2D] transition-colors font-medium">
            Servers
          </Link>
        </div>

        {/* Copyright */}
        <p className="font-sans text-[11px] text-[#FF1E2D] font-medium tracking-wide">
          © {new Date().getFullYear()} CartVerse Hardware. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
