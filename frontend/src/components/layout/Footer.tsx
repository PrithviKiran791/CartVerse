import React from 'react';
import webIcon from '../../assets/icons/web_icon.png';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-white dark:bg-[#0A0A0C] border-t border-neutral-200 dark:border-neutral-900 py-6 text-neutral-600 dark:text-neutral-500 text-xs mt-auto transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-xl bg-neutral-900 border border-neutral-700/60 p-1 flex items-center justify-center shadow-sm">
            <img src={webIcon} alt="CartVerse" className="w-full h-full object-contain rounded-lg" />
          </div>
          <span className="font-mono font-bold tracking-tight text-neutral-800 dark:text-neutral-300">
            CART<span className="text-red-600">VERSE</span>
          </span>
          <span className="text-neutral-400 dark:text-neutral-600">|</span>
          <span className="text-neutral-600 dark:text-neutral-500 font-mono text-[11px]">BUILD. SHOP. PLAY.</span>
        </div>
        <p className="font-mono text-[11px] text-neutral-500 dark:text-neutral-600">
          © {new Date().getFullYear()} CartVerse Hardware. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
