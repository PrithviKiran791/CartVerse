import React, { useState } from 'react';
import { ShoppingCart, Share2, FileText, RotateCcw, Zap, CheckCircle } from 'lucide-react';
import { usePCBuilderStore } from '../../store/usePCBuilderStore';
import { formatCurrency, formatWattage } from '../../utils/formatters';
import { useUIStore } from '../../store/useUIStore';
import { ShareBuildModal } from './ShareBuildModal';
import { MagneticButton } from '../ui/magnetic-button';
import { NoiseBackground } from '../ui/noise-background';
import confetti from 'canvas-confetti';

export const BuildSummaryBar: React.FC = () => {
  const {
    build,
    getTotalPrice,
    getEstimatedWattage,
    getFilledSlotsCount,
    getTotalCoreSlotsCount,
    getCompatibilityReport,
    resetBuild,
    addToCartAsBundle,
    getShareableUrl,
  } = usePCBuilderStore();

  const { addToast } = useUIStore();
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

  const totalPrice = getTotalPrice();
  const estimatedWattage = getEstimatedWattage();
  const filledSlots = getFilledSlotsCount();
  const totalCore = getTotalCoreSlotsCount();
  const report = getCompatibilityReport();

  const handleAddBuildToCart = () => {
    if (filledSlots === 0) {
      addToast({
        type: 'warning',
        title: 'Empty Build',
        message: 'Please choose at least one hardware component before adding to cart.',
      });
      return;
    }

    if (!report.isCompatible) {
      addToast({
        type: 'error',
        title: 'Compatibility Conflict',
        message: 'Please resolve hardware conflicts before checkout.',
      });
      return;
    }

    // Trigger celebration confetti
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.8 },
      });
    } catch (e) {
      // Ignore if confetti not supported
    }

    addToCartAsBundle();
    addToast({
      type: 'success',
      title: 'Complete Build Added to Cart',
      message: 'Your custom configuration has been bundled with free assembly & 18% GST invoice.',
    });
  };

  return (
    <>
      <div className="sticky bottom-0 z-30 w-full bg-neutral-950/95 backdrop-blur-2xl border-t border-neutral-800 shadow-2xl py-4 px-4 sm:px-6 lg:px-8 transition-all">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Left: Totals & Wattage metrics */}
          <div className="flex flex-wrap items-center justify-between md:justify-start gap-4 sm:gap-6 w-full md:w-auto">
            {/* Total Price */}
            <div>
              <span className="text-[10px] uppercase font-mono tracking-wider text-neutral-400 block">
                Total Custom Build Cost
              </span>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl sm:text-3xl font-black font-mono text-white">
                  {formatCurrency(totalPrice)}
                </span>
                <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-800/60">
                  Incl. 18% GST
                </span>
              </div>
            </div>

            {/* Estimated TDP Wattage */}
            <div className="border-l border-neutral-800 pl-4 sm:pl-6 hidden sm:block">
              <span className="text-[10px] uppercase font-mono tracking-wider text-neutral-400 block">
                Estimated System TDP
              </span>
              <div className="flex items-center gap-1.5 text-base font-bold font-mono text-amber-400">
                <Zap className="w-4 h-4" />
                <span>{formatWattage(estimatedWattage)}</span>
              </div>
            </div>

            {/* Slots status */}
            <div className="border-l border-neutral-800 pl-4 sm:pl-6 hidden lg:block">
              <span className="text-[10px] uppercase font-mono tracking-wider text-neutral-400 block">
                Components Assigned
              </span>
              <span className="text-xs font-mono font-bold text-neutral-300">
                {filledSlots} Selected Components
              </span>
            </div>
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-2 sm:gap-3 w-full md:w-auto justify-end">
            {/* Reset */}
            {filledSlots > 0 && (
              <button
                onClick={resetBuild}
                className="p-2.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-neutral-400 hover:text-red-400 transition-colors border border-neutral-800 cursor-pointer"
                title="Reset Build"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            )}

            {/* Share / Export */}
            <MagneticButton>
              <button
                onClick={() => setIsShareModalOpen(true)}
                className="px-3 sm:px-4 py-2.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-neutral-200 hover:text-white text-xs font-bold transition-all border border-neutral-800 flex items-center gap-1.5 cursor-pointer"
              >
                <Share2 className="w-4 h-4 text-red-400" />
                <span>Share / Export</span>
              </button>
            </MagneticButton>

            {/* Add Complete Build to Cart */}
            <MagneticButton>
              <NoiseBackground containerClassName="rounded-xl shadow-xl">
                <button
                  onClick={handleAddBuildToCart}
                  disabled={filledSlots === 0 || !report.isCompatible}
                  className={`px-5 sm:px-6 py-2.5 rounded-xl text-xs sm:text-sm font-black transition-all flex items-center gap-2 cursor-pointer ${
                    filledSlots === 0 || !report.isCompatible
                      ? 'bg-neutral-800 text-neutral-500 border border-neutral-700 cursor-not-allowed'
                      : 'bg-red-600 hover:bg-red-500 text-white border border-red-500'
                  }`}
                >
                  <ShoppingCart className="w-4 h-4" />
                  <span>Add Complete Build to Cart</span>
                </button>
              </NoiseBackground>
            </MagneticButton>
          </div>
        </div>
      </div>

      {/* Share / PDF Modal */}
      <ShareBuildModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        build={build}
        totalPrice={totalPrice}
        estimatedWattage={estimatedWattage}
        shareUrl={getShareableUrl()}
      />
    </>
  );
};

export default BuildSummaryBar;
