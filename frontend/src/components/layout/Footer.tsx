import React from 'react';
import webIcon from '../../assets/icons/web_icon.png';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#0A0A0C] border-t border-neutral-900 py-6 text-neutral-500 text-xs mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2.5">
          <img src={webIcon} alt="CartVerse" className="w-5 h-5 object-contain" />
          <span className="font-mono font-bold tracking-tight text-neutral-300">
            CART<span className="text-red-600">VERSE</span>
          </span>
          <span className="text-neutral-600">|</span>
          <span className="text-neutral-500 font-mono text-[11px]">BUILD. SHOP. PLAY.</span>
        </div>
        <p className="font-mono text-[11px] text-neutral-600">
          © {new Date().getFullYear()} CartVerse Hardware. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
