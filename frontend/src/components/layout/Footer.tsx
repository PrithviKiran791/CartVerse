import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Truck, RotateCcw, Wrench, Zap, Cpu, Mail, Phone, MapPin } from 'lucide-react';
import webIcon from '../../assets/icons/web_icon.png';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-neutral-950 border-t border-neutral-800/80 text-neutral-400 text-sm mt-auto">
      {/* Value pillars banner */}
      <div className="bg-neutral-900/40 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-red-950/40 border border-red-900/50 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5 text-red-500" />
            </div>
            <div>
              <h4 className="text-white font-bold text-xs">100% Genuine Parts</h4>
              <p className="text-[11px] text-neutral-400">Direct Indian distributor stock with official warranty.</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-red-950/40 border border-red-900/50 flex items-center justify-center shrink-0">
              <Wrench className="w-5 h-5 text-red-500" />
            </div>
            <div>
              <h4 className="text-white font-bold text-xs">Compatibility Engine</h4>
              <p className="text-[11px] text-neutral-400">Live socket, PSU & clearance validation.</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-red-950/40 border border-red-900/50 flex items-center justify-center shrink-0">
              <Truck className="w-5 h-5 text-red-500" />
            </div>
            <div>
              <h4 className="text-white font-bold text-xs">Insured Express Shipping</h4>
              <p className="text-[11px] text-neutral-400">Multi-layer protective packaging across India.</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-red-950/40 border border-red-900/50 flex items-center justify-center shrink-0">
              <RotateCcw className="w-5 h-5 text-red-500" />
            </div>
            <div>
              <h4 className="text-white font-bold text-xs">7-Day DOA Replacement</h4>
              <p className="text-[11px] text-neutral-400">Direct brand RMA support & replacement.</p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
