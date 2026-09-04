import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Copy, Check, Printer, Share2, FileText, Download } from 'lucide-react';
import { PCBuildState } from '../../types/hardware';
import { formatCurrency, generateBuildTextSpec, printBuildSpec } from '../../utils/formatters';
import { useUIStore } from '../../store/useUIStore';

interface ShareBuildModalProps {
  isOpen: boolean;
  onClose: () => void;
  build: PCBuildState;
  totalPrice: number;
  estimatedWattage: number;
  shareUrl: string;
}

export const ShareBuildModal: React.FC<ShareBuildModalProps> = ({
  isOpen,
  onClose,
  build,
  totalPrice,
  estimatedWattage,
  shareUrl,
}) => {
  const { addToast } = useUIStore();
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedSpec, setCopiedSpec] = useState(false);

  if (!isOpen) return null;

  const textSpec = generateBuildTextSpec(build, totalPrice, estimatedWattage);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopiedLink(true);
    addToast({
      type: 'success',
      title: 'Link Copied',
      message: 'Shareable PC build link copied to your clipboard.',
    });
    setTimeout(() => setCopiedLink(false), 3000);
  };

  const handleCopySpec = () => {
    navigator.clipboard.writeText(textSpec);
    setCopiedSpec(true);
    addToast({
      type: 'success',
      title: 'Spec Sheet Copied',
      message: 'Monospace build breakdown copied for forums, Discord & Reddit.',
    });
    setTimeout(() => setCopiedSpec(false), 3000);
  };

  const handlePrint = () => {
    printBuildSpec(build, totalPrice, estimatedWattage);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/85 backdrop-blur-md"
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-2xl bg-neutral-900 border border-neutral-800 rounded-3xl shadow-2xl overflow-hidden z-10 flex flex-col max-h-[90vh]"
        >
          {/* Header */}
          <div className="p-6 border-b border-neutral-800 flex items-center justify-between bg-neutral-950/70">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-red-600/20 border border-red-500/40 flex items-center justify-center text-red-500">
                <Share2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Share & Export Custom Build</h3>
                <p className="text-xs text-neutral-400">Total: {formatCurrency(totalPrice)} | {estimatedWattage}W Estimated</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-6 overflow-y-auto space-y-6">
            {/* Shareable Link Section */}
            <div>
              <label className="text-xs font-bold text-neutral-300 uppercase tracking-wider block mb-2">
                Direct Shareable Link
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  readOnly
                  value={shareUrl}
                  className="flex-1 bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-2.5 text-xs text-neutral-300 font-mono select-all outline-none"
                />
                <button
                  onClick={handleCopyLink}
                  className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 cursor-pointer ${
                    copiedLink
                      ? 'bg-emerald-600 text-white'
                      : 'bg-red-600 hover:bg-red-500 text-white'
                  }`}
                >
                  {copiedLink ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  <span>{copiedLink ? 'Copied!' : 'Copy Link'}</span>
                </button>
              </div>
            </div>

            {/* Formatted Text Spec */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-bold text-neutral-300 uppercase tracking-wider">
                  Text Specification & Invoice
                </label>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleCopySpec}
                    className="text-xs font-semibold text-neutral-400 hover:text-white flex items-center gap-1 bg-neutral-800 px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
                  >
                    {copiedSpec ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <FileText className="w-3.5 h-3.5" />}
                    <span>{copiedSpec ? 'Copied' : 'Copy Text'}</span>
                  </button>

                  <button
                    onClick={handlePrint}
                    className="text-xs font-bold text-white flex items-center gap-1 bg-neutral-800 hover:bg-neutral-750 px-3 py-1.5 rounded-lg transition-colors border border-neutral-700 cursor-pointer"
                  >
                    <Printer className="w-3.5 h-3.5 text-red-400" />
                    <span>Print / PDF</span>
                  </button>
                </div>
              </div>

              <pre className="bg-neutral-950 border border-neutral-800 p-4 rounded-xl text-[11px] font-mono text-neutral-300 overflow-x-auto whitespace-pre leading-relaxed select-all">
                {textSpec}
              </pre>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default ShareBuildModal;
