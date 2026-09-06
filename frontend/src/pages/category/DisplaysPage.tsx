import React from 'react';
import { Link } from 'react-router-dom';
import { Tv, Monitor, ArrowRight, Eye, Zap, Sparkles } from 'lucide-react';
import { BreadcrumbNav } from '../../components/navigation/BreadcrumbNav';
import ShapeGrid from '../../components/common/ShapeGrid';
import FadeContent from '../../components/common/FadeContent';
import { getComponentImage } from '../../utils/assetRegistry';

export const DisplaysPage: React.FC = () => {
  const oledImg = getComponentImage('Monitors/Samsung Odyssey OLED G8 (G80SD).jpeg', 'monitor');
  const asusImg = getComponentImage('Monitors/ASUS ROG Swift PG27AQDM.jpg', 'monitor');
  const zowieImg = getComponentImage('Monitors/BenQ Zowie XL2546K.jpg', 'monitor');
  const g9Img = getComponentImage('Monitors/Samsung Odyssey G9.jpg', 'monitor');

  const displayCategories = [
    {
      id: 'oled',
      title: 'OLED & QD-OLED',
      subtitle: 'Infinite Contrast & 0.03ms Response',
      route: '/displays/oled',
      image: oledImg,
      badge: '0.03ms GtG · Pure Blacks',
      desc: 'Self-lit organic pixels producing true inky blacks, HDR1000 peak highlights, and virtually instantaneous pixel response times for ghost-free competitive gameplay.',
      tags: ['QD-OLED', '99% DCI-P3', 'Sub-Millisecond Response'],
    },
    {
      id: '4k',
      title: '4K ULTRA HD (3840x2160)',
      subtitle: 'Workstation Clarity & Next-Gen Console Ready',
      route: '/displays/4k',
      image: oledImg,
      badge: '3840 x 2160 UHD',
      desc: 'Razor-sharp pixel density perfect for immersive AAA gaming, 4K video editing, and native 4K 120Hz HDMI 2.1 support for PS5 and Xbox Series X.',
      tags: ['HDMI 2.1', 'VESA DisplayHDR', 'Creator Color Tuned'],
    },
    {
      id: '1440p',
      title: '1440p QHD (2560x1440)',
      subtitle: 'The Definitive PC Gaming Sweet Spot',
      route: '/displays/1440p',
      image: asusImg,
      badge: '2560 x 1440 Sweet Spot',
      desc: 'Balanced 2K resolution maximizing graphical sharpness while maintaining blisteringly fast 165Hz to 240Hz framerates with RTX 4070 / 7800 XT GPUs.',
      tags: ['165Hz - 240Hz', 'G-Sync Compatible', 'Crisp PPI'],
    },
    {
      id: '1080p',
      title: '1080p ESPORTS FHD',
      subtitle: 'Maximum Framerates & Motion Clarity',
      route: '/displays/1080p',
      image: zowieImg,
      badge: 'Esports Tournament Standard',
      desc: 'High-frequency 1920x1080 panels optimized for CS2, Valorant, Apex Legends, and Overwatch, minimizing system latency and maximizing target acquisition.',
      tags: ['240Hz - 540Hz', 'DyAc+ Clarity', 'Zero Ghosting'],
    },
    {
      id: 'ips',
      title: 'FAST-IPS PANELS',
      subtitle: 'Wide Viewing Angles & sRGB Accuracy',
      route: '/displays/ips',
      image: asusImg,
      badge: '1ms Fast IPS',
      desc: 'Color-accurate IPS liquid crystals with wide 178° viewing angles, 99% sRGB color gamut coverage, and anti-glare coatings for professional day-to-night sessions.',
      tags: ['Accurate Colors', 'Factory Calibrated', '178° Viewing'],
    },
    {
      id: 'ultrawide',
      title: 'CURVED ULTRAWIDE (21:9 / 32:9)',
      subtitle: '1000R Panoramic Field of View',
      route: '/displays/ultrawide',
      image: g9Img,
      badge: '21:9 & 32:9 Super Ultrawide',
      desc: 'Wraparound curved displays wrapping your peripheral vision, replacing cumbersome dual-monitor setups and opening expansive desktop timeline real estate.',
      tags: ['1000R Ergonomic Curve', 'Picture-by-Picture', 'Simulation Ready'],
    },
    {
      id: 'high-refresh',
      title: '240Hz+ HIGH REFRESH RATE',
      subtitle: 'Fluid Tournament Tracking Speed',
      route: '/displays/high-refresh',
      image: zowieImg,
      badge: '240Hz - 360Hz - 540Hz',
      desc: 'Extreme refresh rate displays delivering continuous frame transitions with ultra-low input lag, giving competitive players an instant visual edge in battle.',
      tags: ['Sub-1ms Latency', 'ELMB-Sync', 'Adaptive VRR'],
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
          items={[{ label: 'DISPLAYS' }]}
          backTo={{ label: 'DASHBOARD', href: '/products' }}
        />

        <FadeContent blur={true} duration={800} easing="ease-out" initialOpacity={0}>
          <div className="border-b border-neutral-800 pb-8 mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-indigo-950/60 border border-indigo-800/40 text-indigo-400 text-xs font-mono font-bold uppercase tracking-widest mb-3">
              <Tv className="w-3.5 h-3.5" />
              <span>OPTICAL PERFORMANCE & PANEL ARCHITECTURE</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white uppercase font-sans">
              DISPLAYS & MONITORS
            </h1>
            <p className="mt-2 text-sm sm:text-base text-neutral-400 max-w-2xl font-mono uppercase tracking-wider">
              DISCOVER GAMING MONITORS BY RESOLUTION, PANEL SILICON & REFRESH RATE.
            </p>
          </div>
        </FadeContent>

        <FadeContent blur={true} duration={900} delay={100} easing="ease-out" initialOpacity={0}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayCategories.map((cat) => (
              <Link
                key={cat.id}
                to={cat.route}
                className="group relative flex flex-col justify-between overflow-hidden rounded-xl border border-neutral-800 bg-[#120F17] p-6 hover:border-indigo-500/80 transition-all duration-300 hover:shadow-[0_10px_35px_-10px_rgba(99,102,241,0.25)] cursor-pointer"
              >
                <div className="absolute right-[-15px] bottom-[-15px] w-52 h-52 pointer-events-none opacity-20 group-hover:opacity-55 group-hover:scale-105 transition-all duration-300">
                  <img
                    src={cat.image}
                    alt={cat.title}
                    className="w-full h-full object-contain filter drop-shadow-[0_8px_16px_rgba(0,0,0,0.8)]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#120F17] via-transparent to-transparent" />
                </div>

                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-indigo-400 bg-indigo-950/80 px-2.5 py-0.5 rounded border border-indigo-800/40">
                      {cat.badge}
                    </span>
                  </div>

                  <h3 className="text-2xl font-black text-white tracking-tight uppercase group-hover:text-indigo-400 transition-colors">
                    {cat.title}
                  </h3>
                  <div className="text-xs font-bold text-neutral-300 mb-2 font-mono">
                    {cat.subtitle}
                  </div>

                  <p className="text-xs text-neutral-400 mb-6 leading-relaxed">
                    {cat.desc}
                  </p>

                  <div className="flex flex-wrap gap-1.5 text-[10px] font-mono text-neutral-400 mb-6">
                    {cat.tags.map((t, idx) => (
                      <span key={idx} className="bg-neutral-900 px-2 py-0.5 rounded border border-neutral-800">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="relative z-10 pt-4 border-t border-neutral-800/80 flex items-center justify-between">
                  <span className="text-xs font-mono font-bold uppercase tracking-widest text-indigo-400 group-hover:text-indigo-300 flex items-center gap-2">
                    EXPLORE {cat.title}
                    <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1.5 transition-transform" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </FadeContent>
      </div>
    </div>
  );
};

export default DisplaysPage;
