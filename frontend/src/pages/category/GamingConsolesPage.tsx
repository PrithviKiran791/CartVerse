import React from 'react';
import { Link } from 'react-router-dom';
import { Gamepad2, ArrowRight, ShieldCheck, Sparkles, Tv } from 'lucide-react';
import { BreadcrumbNav } from '../../components/navigation/BreadcrumbNav';
import ShapeGrid from '../../components/common/ShapeGrid';
import FadeContent from '../../components/common/FadeContent';
import playstationGif from '../../assets/icons/Playstation.gif';
import xboxGif from '../../assets/icons/Xbox.gif';
import nintendoGif from '../../assets/icons/nintendo.gif';

export const GamingConsolesPage: React.FC = () => {
  const platforms = [
    {
      id: 'playstation',
      brand: 'SONY',
      name: 'PLAYSTATION',
      tagline: 'Play Has No Limits',
      route: '/gaming-consoles/playstation',
      image: playstationGif,
      accentColor: 'border-blue-500/80',
      badgeColor: 'text-blue-400 bg-blue-950/80 border-blue-800/40',
      badge: 'Sony Interactive Silicon',
      desc: 'PlayStation 5 Pro, PS5 Digital, PS4 Pro and classic legacy hardware editions featuring 5.5 GB/s ultra-fast NVMe storage, Tempest 3D audio and PSSR machine learning upscaling.',
      models: ['PS5 Pro (2TB)', 'PS5 Slim Disc / Digital', 'PlayStation 4 Pro'],
    },
    {
      id: 'xbox',
      brand: 'MICROSOFT',
      name: 'XBOX',
      tagline: 'Power Your Dreams',
      route: '/gaming-consoles/xbox',
      image: xboxGif,
      accentColor: 'border-emerald-500/80',
      badgeColor: 'text-emerald-400 bg-emerald-950/80 border-emerald-800/40',
      badge: 'Velocity Architecture',
      desc: 'Xbox Series X and Series S consoles powered by custom AMD Zen 2 RDNA 2 silicon, Quick Resume technology, native 4K 120Hz gaming, and backwards compatibility spanning four generations.',
      models: ['Xbox Series X (1TB)', 'Xbox Series S (512GB/1TB)', 'Xbox One X'],
    },
    {
      id: 'nintendo',
      brand: 'NINTENDO',
      name: 'NINTENDO',
      tagline: 'Play Anywhere, Anytime',
      route: '/gaming-consoles/nintendo',
      image: nintendoGif,
      accentColor: 'border-red-500/80',
      badgeColor: 'text-[#FF1E2D] bg-red-950/80 border-red-800/40',
      badge: 'Hybrid & Handheld',
      desc: 'Nintendo Switch OLED, Switch Lite, and portable dual-screen systems designed for seamless transitions between television docking and vibrant on-the-go gaming.',
      models: ['Switch OLED (White / Neon)', 'Nintendo Switch Lite', 'Nintendo 3DS XL'],
    },
  ];

  return (
    <div className="min-h-screen bg-[#0A0A0C] text-neutral-100 relative pb-20">
      <div className="absolute top-0 left-0 right-0 h-[400px] overflow-hidden pointer-events-none opacity-20 z-0">
        <ShapeGrid
          speed={0.3}
          squareSize={40}
          direction="diagonal"
          borderColor="rgba(255, 30, 45, 0.15)"
          hoverFillColor="#FF1E2D"
          shape="square"
          hoverTrailAmount={2}
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <BreadcrumbNav
          items={[{ label: 'GAMING CONSOLES' }]}
          backTo={{ label: 'DASHBOARD', href: '/products' }}
        />

        <FadeContent blur={true} duration={800} easing="ease-out" initialOpacity={0}>
          <div className="border-b-2 border-neutral-800 pb-8 mb-12 flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-none bg-[#FF1E2D]/15 border-2 border-[#FF1E2D] text-[#FF1E2D] text-xs font-mono font-bold uppercase tracking-widest mb-3 shadow-[2px_2px_0px_0px_#FF1E2D]">
                <Gamepad2 className="w-3.5 h-3.5" />
                <span>// DEDICATED CONSOLE PLATFORMS</span>
              </div>
              <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white uppercase font-sans">
                GAMING CONSOLES
              </h1>
              <p className="mt-2 text-xs sm:text-sm text-neutral-400 max-w-2xl font-mono uppercase tracking-wider">
                [PLATFORMS] // SONY PLAYSTATION, MICROSOFT XBOX & NINTENDO ECOSYSTEMS
              </p>
            </div>
          </div>
        </FadeContent>

        <FadeContent blur={true} duration={900} delay={100} easing="ease-out" initialOpacity={0}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {platforms.map((p) => {
              const shadowColor = p.id === 'playstation' ? '#2563EB' : p.id === 'xbox' ? '#10B981' : '#FF1E2D';
              const hoverBorder = p.id === 'playstation' ? 'hover:border-blue-500' : p.id === 'xbox' ? 'hover:border-emerald-500' : 'hover:border-[#FF1E2D]';
              const hoverTextColor = p.id === 'playstation' ? 'group-hover:text-blue-400' : p.id === 'xbox' ? 'group-hover:text-emerald-400' : 'group-hover:text-[#FF1E2D]';
              const badgeBorder = p.id === 'playstation' ? 'border-blue-500 text-blue-400 bg-blue-950/80 shadow-[2px_2px_0px_0px_#2563EB]' : p.id === 'xbox' ? 'border-emerald-500 text-emerald-400 bg-emerald-950/80 shadow-[2px_2px_0px_0px_#10B981]' : 'border-[#FF1E2D] text-[#FF1E2D] bg-red-950/80 shadow-[2px_2px_0px_0px_#FF1E2D]';

              return (
                <Link
                  key={p.id}
                  to={p.route}
                  className={`group relative flex flex-col justify-between overflow-hidden rounded-none border-2 border-neutral-700 bg-[#120F17] p-6 sm:p-8 ${hoverBorder} transition-all duration-200 shadow-[4px_4px_0px_0px_#000000] dark:shadow-[4px_4px_0px_0px_${shadowColor}] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_0px_#000000] dark:hover:shadow-[6px_6px_0px_0px_${shadowColor}] cursor-pointer`}
                >
                  <div className="absolute right-0 bottom-0 w-64 h-48 sm:w-72 sm:h-52 pointer-events-none opacity-85 group-hover:opacity-100 group-hover:scale-105 transition-all duration-300 overflow-hidden rounded-none">
                    <img
                      src={p.image}
                      alt={p.name}
                      className="w-full h-full object-cover object-center filter drop-shadow-[0_10px_24px_rgba(0,0,0,0.9)]"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-[#120F17] via-[#120F17]/50 to-transparent" />
                  </div>

                  <div className="relative z-10">
                    <div className="flex items-center justify-between mb-4">
                      <span className={`text-[10px] font-mono font-bold uppercase tracking-widest px-2.5 py-1 rounded-none border-2 ${badgeBorder}`}>
                        {p.badge}
                      </span>
                      <span className="text-xs text-neutral-400 font-mono">[{p.brand}]</span>
                    </div>

                    <h3 className={`text-3xl font-black text-white tracking-tight uppercase ${hoverTextColor} transition-colors font-sans`}>
                      {p.name}
                    </h3>
                    <div className="text-xs font-bold text-neutral-300 mb-3 font-mono">
                      {p.tagline}
                    </div>

                    <p className="text-xs text-neutral-400 mb-6 leading-relaxed">
                      {p.desc}
                    </p>

                    <div className="space-y-1.5 mb-6">
                      {p.models.map((m, idx) => (
                        <div key={idx} className="text-xs font-mono text-neutral-300 flex items-center gap-2">
                          <span className="w-1.5 h-1.5 bg-[#FF1E2D]" />
                          <span>{m}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="relative z-10 pt-4 border-t-2 border-neutral-800 flex items-center justify-between">
                    <span className={`text-xs font-mono font-bold uppercase tracking-widest ${hoverTextColor} group-hover:text-white flex items-center gap-2`}>
                      EXPLORE {p.name}
                      <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1.5 transition-transform" />
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        </FadeContent>
      </div>
    </div>
  );
};

export default GamingConsolesPage;
