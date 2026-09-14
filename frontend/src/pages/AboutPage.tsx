import React from 'react';
import { Cpu, HeartHandshake, ShieldCheck, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import Topography from '../components/ui/Topography';
import { useTheme } from '../context/ThemeContext';

/**
 * AboutPage
 * Minimalist manifesto and technical overview of CartVerse.
 * Integrates dynamic theme persistence, red topography background, and CartVerse Red typography.
 */
export default function AboutPage() {
  const { isDarkMode } = useTheme();

  return (
    <main className="min-h-screen relative bg-[#FAFAFA] text-[#111111] dark:bg-[#080808] dark:text-[#F5F5F5] transition-colors duration-200 overflow-hidden merriweather-about">
      {/* Red Topography Elevation Lines Background Animation */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0 opacity-90 dark:opacity-85">
        <Topography
          lowColor="#800810"
          midColor="#E31B23"
          highColor="#FF4D5A"
          speed={0.35}
          morphAmount={3.0}
          morphSpeed={0.06}
          bands={6.0}
          thickness={0.03}
          scale={1.5}
          pixelSize={1}
          glow={0.8}
          colorMode="elevation"
          contrast={1.0}
          brightness={1.35}
          fillBands={false}
          opacity={0.85}
          grain={true}
          grainIntensity={0.04}
          mouseInteraction={true}
          mouseRadius={0.35}
          mouseStrength={0.5}
        />
      </div>

      <div className="relative z-10">
        {/* Navigation Breadcrumb */}
        <div className="max-w-3xl mx-auto px-6 pt-8">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-[#E31B23] hover:text-[#FF3B48] transition-colors"
          >
            <ArrowLeft size={14} /> Back to Store
          </Link>
        </div>

        {/* Hero */}
        <section className="max-w-3xl mx-auto px-6 pt-16 pb-16">
          <h1 className="text-4xl md:text-5xl font-semibold leading-tight mb-6">
            We help you build a PC you don't have to worry about.
          </h1>
          <p className="text-red-600 dark:text-red-400 text-lg leading-relaxed">
            CartVerse is a place to shop for PC parts and put together a
            complete build without guessing whether everything will actually
            fit and work together. Pick your parts, and we'll tell you plainly
            if something doesn't match.
          </p>
        </section>

        <div className="border-t border-red-950/30 dark:border-red-950/60" />

        {/* Why we built it */}
        <section className="max-w-3xl mx-auto px-6 py-16 grid md:grid-cols-[160px_1fr] gap-8">
          <p className="text-xs text-[#E31B23] uppercase tracking-wide">
            Why we started
          </p>
          <div className="space-y-4 text-red-600 dark:text-red-400 leading-relaxed">
            <p>
              Buying PC parts on your own is confusing. It's easy to pick a
              processor and a motherboard that don't fit together, or a power
              supply that's too weak for the rest of your build. Most stores
              just sell you the parts and leave the rest to you.
            </p>
            <p>
              We built CartVerse so that part of the process is handled for
              you. As you add components to a build, we quietly check that
              they belong together, and let you know before you check out —
              not after the box arrives.
            </p>
          </div>
        </section>

        <div className="border-t border-red-950/30 dark:border-red-950/60" />

        {/* What we care about */}
        <section className="max-w-3xl mx-auto px-6 py-16">
          <p className="text-xs text-[#E31B23] uppercase tracking-wide mb-8">
            What we care about
          </p>
          <div className="grid sm:grid-cols-3 gap-8">
            <Value
              icon={<ShieldCheck size={20} />}
              title="No surprises"
              body="If two parts won't work together, we tell you clearly, before you buy."
            />
            <Value
              icon={<Cpu size={20} />}
              title="Real parts, real prices"
              body="Every component listed is one you can actually buy, priced in rupees."
            />
            <Value
              icon={<HeartHandshake size={20} />}
              title="Built for beginners too"
              body="You shouldn't need years of experience to put together a good PC."
            />
          </div>
        </section>

        <div className="border-t border-red-950/30 dark:border-red-950/60" />

        {/* Simple facts, styled like a spec sheet since that's the site's language */}
        <section className="max-w-3xl mx-auto px-6 py-16">
          <p className="text-xs text-[#E31B23] uppercase tracking-wide mb-6">
            A few facts
          </p>
          <dl className="text-sm divide-y divide-red-950/30 dark:divide-red-950/50 border border-red-950/30 dark:border-red-950/50 rounded-md overflow-hidden bg-white/40 dark:bg-black/40 backdrop-blur-sm">
            <Fact label="What it is" value="A PC parts store and build planner" />
            <Fact label="Catalog size" value="500+ components" />
            <Fact label="Currency" value="Indian Rupees (₹)" />
            <Fact label="Also sells" value="Desks and chairs for your setup" />
          </dl>
        </section>

        {/* Closing */}
        <section className="max-w-3xl mx-auto px-6 py-20 text-center">
          <p className="text-[#111111] dark:text-[#F5F5F5] text-xl mb-6">
            Have a question, or something isn't working right?
          </p>
          <div className="flex items-center justify-center gap-4 flex-wrap">
            <Link
              to="/builder"
              className="inline-block bg-[#E31B23] text-white px-6 py-3 rounded-md font-medium hover:opacity-90 transition-opacity"
            >
              Start PC Build
            </Link>
            <a
              href="mailto:support@cartverse.com"
              className="inline-block border border-red-500/40 dark:border-red-500/50 text-[#111111] dark:text-[#F5F5F5] px-6 py-3 rounded-md font-medium hover:border-[#E31B23] hover:text-[#E31B23] transition-colors"
            >
              Get in touch
            </a>
          </div>
        </section>
      </div>
    </main>
  );
}

function Value({
  icon,
  title,
  body,
}: {
  icon: React.ReactNode;
  title: string;
  body: string;
}) {
  return (
    <div>
      <div className="text-[#E31B23] mb-3">{icon}</div>
      <h3 className="text-[#111111] dark:text-[#F5F5F5] font-medium mb-2">{title}</h3>
      <p className="text-red-600 dark:text-red-400 text-sm leading-relaxed">{body}</p>
    </div>
  );
}

function Fact({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between px-4 py-3">
      <span className="text-[#E31B23] font-medium">{label}</span>
      <span className="text-[#111111] dark:text-[#F5F5F5]">{value}</span>
    </div>
  );
}
