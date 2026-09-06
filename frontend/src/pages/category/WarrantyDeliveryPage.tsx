import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ShieldCheck,
  Truck,
  RotateCcw,
  FileCheck,
  Search,
  ExternalLink,
  ChevronRight,
  CheckCircle2,
  Clock,
  Package,
  AlertTriangle
} from 'lucide-react';
import { BreadcrumbNav } from '../../components/navigation/BreadcrumbNav';
import ShapeGrid from '../../components/common/ShapeGrid';
import FadeContent from '../../components/common/FadeContent';

export const WarrantyDeliveryPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'warranty' | 'shipping' | 'returns' | 'rma' | 'tracking'>('warranty');
  const [trackingNumber, setTrackingNumber] = useState('');
  const [trackingResult, setTrackingResult] = useState<string | null>(null);

  const handleTrackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (trackingNumber.trim()) {
      setTrackingResult(`Simulated Status for ${trackingNumber.toUpperCase()}: In Transit via BlueDart Express (Expected Delivery in 24-48 Hours). Insured for 100% replacement value.`);
    }
  };

  const sections = [
    {
      id: 'warranty',
      title: 'WARRANTY INFORMATION',
      subtitle: 'Understand Product Coverage & Eligibility',
      icon: ShieldCheck,
      desc: '100% Genuine Indian Warranty with official manufacturer authorization across AMD, Intel, NVIDIA, ASUS, MSI, Gigabyte, Sony, Microsoft, and Nintendo.',
      highlights: [
        'Direct Brand RMA Support across 450+ authorized service centers throughout India.',
        'Zero gray-market policy: Every SKU comes with a valid GST invoice with matched serial numbers.',
        'Processors & Motherboards: 3 Years Standard Warranty; Power Supplies: Up to 10 Years.',
        'Monitors: Zero-Bright-Dot panel guarantees on premium OLED and Fast-IPS displays.',
      ],
    },
    {
      id: 'shipping',
      title: 'SHIPPING & LOGISTICS',
      subtitle: 'Insured Transit & Anti-Static Secure Packaging',
      icon: Truck,
      desc: 'Pan-India air express and insured road surface shipping using ESD-shielded packaging, custom wooden outer crates, and expanding insta-pack foam for pre-built rigs.',
      highlights: [
        'Free insured shipping on orders above ₹5,000 across all tier 1, 2 & 3 pin codes.',
        'Same-day dispatch for all orders placed before 2:00 PM IST Monday through Saturday.',
        'Transit Insurance: Complete 100% coverage against physical transit damage or loss.',
        'Heavy Rig Crating: High-density polyethylene corner cushions and sealed GPU braces.',
      ],
    },
    {
      id: 'returns',
      title: 'RETURNS & DOA REPLACEMENTS',
      subtitle: '7-Day Dead-On-Arrival Replacement Policy',
      icon: RotateCcw,
      desc: 'Seamless replacement protocol for defective hardware received out of the box, with complimentary reverse pickup from your doorstep.',
      highlights: [
        '7-day DOA replacement window from the verified date of courier delivery.',
        'Zero questions asked on factory silicon defects verified by diagnostic tests.',
        'Instant credit or dispatch of replacement unit within 48 hours of inspection.',
        'Full refund guarantee if replacement unit is unavailable in authorized inventory.',
      ],
    },
    {
      id: 'rma',
      title: 'RMA CLAIM PROCESS',
      subtitle: 'Fast-Track Official Service Desk Assistance',
      icon: FileCheck,
      desc: 'CartVerse partners directly with national distributors (Savex, Rashi Peripherals, Kaizen, Supertron) to expedite service tickets for your convenience.',
      highlights: [
        'Step 1: Locate your invoice and component serial number from your CartVerse profile.',
        'Step 2: Submit an RMA ticket with defect description and photos/videos.',
        'Step 3: Receive doorstep pickup or nearest authorized manufacturer dropoff token.',
        'Average RMA turnaround time: 7 to 10 working days with live SMS tracking.',
      ],
    },
    {
      id: 'tracking',
      title: 'DELIVERY TRACKING',
      subtitle: 'Real-Time Courier Waybill Lookup',
      icon: Package,
      desc: 'Track air-waybills directly across BlueDart, Delhivery, DTDC, and FedEx priority air freight with live GPS checkpoint milestones.',
      highlights: [
        'Real-time transit updates sent via automated SMS and WhatsApp alerts.',
        'OTP verification required at delivery for high-value silicon and complete builds.',
        'Pre-delivery scheduling calls by delivery agents for residential handoff.',
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-[#0A0A0C] text-neutral-100 relative pb-20">
      <div className="absolute top-0 left-0 right-0 h-[400px] overflow-hidden pointer-events-none opacity-20 z-0">
        <ShapeGrid
          speed={0.3}
          squareSize={40}
          direction="diagonal"
          borderColor="rgba(227, 27, 35, 0.15)"
          hoverFillColor="#E31B23"
          shape="square"
          hoverTrailAmount={2}
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <BreadcrumbNav
          items={[{ label: 'WARRANTY & DELIVERY' }]}
          backTo={{ label: 'DASHBOARD', href: '/products' }}
        />

        {/* Page Header */}
        <FadeContent blur={true} duration={800} easing="ease-out" initialOpacity={0}>
          <div className="border-b border-neutral-800 pb-8 mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-red-950/60 border border-red-800/40 text-red-400 text-xs font-mono font-bold uppercase tracking-widest mb-3">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>OFFICIAL TRUST & LOGISTICS PORTAL</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white uppercase font-sans">
              WARRANTY & DELIVERY
            </h1>
            <p className="mt-2 text-sm sm:text-base text-neutral-400 max-w-2xl font-mono uppercase tracking-wider">
              100% AUTHENTIC INVENTORY, PAN-INDIA INSURED SHIPPING, DIRECT RMA & TRACKING.
            </p>
          </div>
        </FadeContent>

        {/* Quick Navigation Cards */}
        <FadeContent blur={true} duration={850} delay={100} easing="ease-out" initialOpacity={0}>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mb-10">
            {sections.map((sec) => {
              const Icon = sec.icon;
              const isSelected = activeTab === sec.id;
              return (
                <button
                  key={sec.id}
                  onClick={() => setActiveTab(sec.id as any)}
                  className={`p-4 rounded-xl border text-left transition-all duration-200 cursor-pointer flex flex-col justify-between ${
                    isSelected
                      ? 'border-red-600 bg-red-950/20 text-white shadow-[0_4px_20px_rgba(227,27,35,0.25)]'
                      : 'border-neutral-800 bg-[#120F17] text-neutral-400 hover:border-neutral-700 hover:text-white'
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <Icon className={`w-5 h-5 ${isSelected ? 'text-red-500' : 'text-neutral-400'}`} />
                    {isSelected && <span className="w-2 h-2 rounded-full bg-red-500" />}
                  </div>
                  <div className="text-xs font-mono font-bold uppercase tracking-wider">
                    {sec.id}
                  </div>
                </button>
              );
            })}
          </div>
        </FadeContent>

        {/* Detailed Modular Information Display */}
        <FadeContent blur={true} duration={900} delay={150} easing="ease-out" initialOpacity={0}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Selected Section Information */}
            <div className="lg:col-span-2 space-y-6">
              {sections
                .filter((s) => s.id === activeTab)
                .map((sec) => {
                  const Icon = sec.icon;
                  return (
                    <div
                      key={sec.id}
                      className="border border-neutral-800 bg-[#120F17] rounded-xl p-6 sm:p-8 space-y-6"
                    >
                      <div className="flex items-center gap-3">
                        <div className="p-3 bg-red-950/60 border border-red-800/40 text-red-500 rounded-lg">
                          <Icon className="w-6 h-6" />
                        </div>
                        <div>
                          <h2 className="text-2xl font-black text-white uppercase tracking-tight">
                            {sec.title}
                          </h2>
                          <p className="text-xs text-neutral-400 font-mono">{sec.subtitle}</p>
                        </div>
                      </div>

                      <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed">
                        {sec.desc}
                      </p>

                      <div className="border-t border-neutral-800/80 pt-4 space-y-3">
                        <span className="text-xs font-mono font-bold uppercase tracking-widest text-red-400">
                          KEY PROTOCOLS & COVERAGE:
                        </span>
                        <ul className="space-y-2.5 text-xs text-neutral-300">
                          {sec.highlights.map((h, idx) => (
                            <li key={idx} className="flex items-start gap-2.5">
                              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                              <span>{h}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Interactive Tracking Input inside tracking tab */}
                      {sec.id === 'tracking' && (
                        <div className="border-t border-neutral-800/80 pt-6">
                          <form onSubmit={handleTrackSubmit} className="space-y-3">
                            <label className="text-xs font-mono font-bold uppercase tracking-wider text-neutral-400">
                              ENTER WAYBILL / AIRWAY NUMBER
                            </label>
                            <div className="flex gap-2">
                              <input
                                type="text"
                                value={trackingNumber}
                                onChange={(e) => setTrackingNumber(e.target.value)}
                                placeholder="e.g. CV-BLUEDART-894210"
                                className="flex-1 px-4 py-2.5 bg-neutral-900 border border-neutral-800 rounded-lg text-xs font-mono text-white placeholder-neutral-500 focus:outline-none focus:border-red-500"
                              />
                              <button
                                type="submit"
                                className="px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white font-mono font-bold text-xs uppercase tracking-wider rounded-lg transition-colors cursor-pointer"
                              >
                                TRACK
                              </button>
                            </div>
                          </form>

                          {trackingResult && (
                            <div className="mt-4 p-4 rounded-lg bg-red-950/40 border border-red-800/50 text-xs font-mono text-neutral-200">
                              {trackingResult}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
            </div>

            {/* Right Side Trust Badges & FAQ */}
            <div className="space-y-6">
              <div className="border border-neutral-800 bg-[#120F17] rounded-xl p-6 space-y-4">
                <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-widest text-emerald-400">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>100% INDIAN GST INVOICE</span>
                </div>
                <h3 className="text-base font-black text-white">
                  Serial Number Verification
                </h3>
                <p className="text-xs text-neutral-400 leading-relaxed">
                  CartVerse serial numbers are registered in distributor databases before packing. You can claim RMA at any authorized brand service station across India simply by presenting our invoice.
                </p>
              </div>

              <div className="border border-neutral-800 bg-[#120F17] rounded-xl p-6 space-y-4">
                <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-widest text-cyan-400">
                  <Clock className="w-4 h-4" />
                  <span>SUPPORT DESK HOURS</span>
                </div>
                <div className="space-y-2 text-xs font-mono text-neutral-300">
                  <div className="flex justify-between">
                    <span className="text-neutral-500">Monday - Friday:</span>
                    <span>10:00 AM - 8:00 PM IST</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-500">Saturday:</span>
                    <span>10:00 AM - 5:00 PM IST</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-500">Sunday / Holidays:</span>
                    <span className="text-neutral-500">Email RMA Desk Only</span>
                  </div>
                </div>
              </div>

              <div className="border border-neutral-800 bg-[#120F17] rounded-xl p-6 space-y-4">
                <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-widest text-red-500">
                  <AlertTriangle className="w-4 h-4" />
                  <span>TRANSIT DAMAGE PROTOCOL</span>
                </div>
                <p className="text-xs text-neutral-400 leading-relaxed">
                  Always record an unboxing video before cutting the tamper-evident security tape. In the rare event of transit damage, video documentation guarantees immediate replacement dispatch without waiting for courier investigation.
                </p>
              </div>
            </div>
          </div>
        </FadeContent>
      </div>
    </div>
  );
};

export default WarrantyDeliveryPage;
