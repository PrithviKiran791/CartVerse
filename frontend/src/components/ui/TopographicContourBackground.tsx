import React from 'react';
import './TopographicContourBackground.css';

interface TopographicContourBackgroundProps {
  className?: string;
}

export const TopographicContourBackground: React.FC<TopographicContourBackgroundProps> = ({ className = '' }) => {
  return (
    <div className={`topographic-bg-container ${className}`} aria-hidden="true">
      <svg
        className="topographic-contour-svg"
        viewBox="0 0 1440 960"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          <linearGradient id="contourRedGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#E5252A" stopOpacity="0.09" />
            <stop offset="50%" stopColor="#0A0A0A" stopOpacity="0.07" />
            <stop offset="100%" stopColor="#E5252A" stopOpacity="0.08" />
          </linearGradient>
          <linearGradient id="contourGreyGrad" x1="100%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#0A0A0A" stopOpacity="0.08" />
            <stop offset="50%" stopColor="#E5252A" stopOpacity="0.07" />
            <stop offset="100%" stopColor="#0A0A0A" stopOpacity="0.06" />
          </linearGradient>
        </defs>

        {/* Primary Drift Layer */}
        <g className="contour-layer-1">
          {/* Ridge Cluster Top-Left */}
          <path
            d="M-80,180 C120,130 260,260 380,190 C500,120 620,240 760,180 C900,120 1060,280 1200,210 C1340,140 1420,220 1520,190"
            stroke="url(#contourRedGrad)"
            strokeWidth="1"
          />
          <path
            d="M-90,240 C110,190 270,320 400,250 C530,180 630,300 780,240 C930,180 1080,340 1220,270 C1360,200 1430,280 1530,250"
            stroke="url(#contourGreyGrad)"
            strokeWidth="1"
          />
          <path
            d="M-70,300 C130,250 280,380 420,310 C560,240 650,360 800,300 C950,240 1100,400 1240,330 C1380,260 1450,340 1540,310"
            stroke="url(#contourRedGrad)"
            strokeWidth="1"
          />
          <path
            d="M-60,360 C150,310 290,440 440,370 C590,300 670,420 820,360 C970,300 1120,460 1260,390 C1400,320 1470,400 1550,370"
            stroke="url(#contourGreyGrad)"
            strokeWidth="1"
          />

          {/* Organic Topographic Isobars / Loops Center-Right */}
          <path
            d="M780,480 C860,430 980,450 1040,510 C1100,570 1080,660 1020,700 C960,740 840,730 790,670 C740,610 700,530 780,480 Z"
            stroke="url(#contourRedGrad)"
            strokeWidth="1"
          />
          <path
            d="M810,500 C870,460 960,470 1010,520 C1060,570 1040,640 990,670 C940,700 850,690 810,640 C770,590 750,540 810,500 Z"
            stroke="url(#contourGreyGrad)"
            strokeWidth="1"
          />
          <path
            d="M840,520 C880,490 940,500 980,530 C1020,560 1010,610 970,630 C930,650 860,650 840,610 C820,570 800,550 840,520 Z"
            stroke="url(#contourRedGrad)"
            strokeWidth="1"
          />
          <path
            d="M870,540 C890,520 930,520 950,550 C970,580 950,600 920,610 C890,620 860,600 870,570 Z"
            stroke="url(#contourGreyGrad)"
            strokeWidth="1"
          />

          {/* Basin & Elevation Waves Bottom-Left */}
          <path
            d="M-60,540 C140,490 260,630 420,570 C580,510 680,670 840,610 C1000,550 1140,710 1300,650 C1440,590 1510,670 1560,640"
            stroke="url(#contourRedGrad)"
            strokeWidth="1"
          />
          <path
            d="M-50,600 C150,550 270,690 440,630 C610,570 700,730 860,670 C1020,610 1160,770 1320,710 C1460,650 1520,730 1570,700"
            stroke="url(#contourGreyGrad)"
            strokeWidth="1"
          />
          <path
            d="M-40,660 C160,610 280,750 460,690 C640,630 720,790 880,730 C1040,670 1180,830 1340,770 C1480,710 1530,790 1580,760"
            stroke="url(#contourRedGrad)"
            strokeWidth="1"
          />
          <path
            d="M-30,720 C170,670 290,810 480,750 C670,690 740,850 900,790 C1060,730 1200,890 1360,830 C1500,770 1540,850 1590,820"
            stroke="url(#contourGreyGrad)"
            strokeWidth="1"
          />
          <path
            d="M-20,780 C180,730 300,870 500,810 C700,750 760,910 920,850 C1080,790 1220,950 1380,890 C1520,830 1550,910 1600,880"
            stroke="url(#contourRedGrad)"
            strokeWidth="1"
          />
        </g>

        {/* Secondary Counter-Drift Layer */}
        <g className="contour-layer-2">
          {/* Topographic Caldera / Island Top-Right */}
          <path
            d="M1020,120 C1120,60 1280,90 1340,160 C1400,230 1370,320 1290,360 C1210,400 1080,380 1030,300 C980,220 920,180 1020,120 Z"
            stroke="url(#contourRedGrad)"
            strokeWidth="1"
          />
          <path
            d="M1050,150 C1130,100 1250,120 1300,180 C1350,240 1320,300 1260,330 C1200,360 1100,340 1060,280 C1020,220 970,200 1050,150 Z"
            stroke="url(#contourGreyGrad)"
            strokeWidth="1"
          />
          <path
            d="M1080,180 C1140,140 1220,150 1260,200 C1300,250 1280,280 1230,300 C1180,320 1120,310 1090,260 C1060,210 1020,220 1080,180 Z"
            stroke="url(#contourRedGrad)"
            strokeWidth="1"
          />

          {/* West Basin Concentric Rings */}
          <path
            d="M140,420 C220,370 340,390 390,460 C440,530 410,610 340,650 C270,690 170,670 120,600 C70,530 60,470 140,420 Z"
            stroke="url(#contourGreyGrad)"
            strokeWidth="1"
          />
          <path
            d="M160,450 C220,410 310,420 350,470 C390,520 370,580 320,610 C270,640 190,630 150,580 C110,530 100,490 160,450 Z"
            stroke="url(#contourRedGrad)"
            strokeWidth="1"
          />
          <path
            d="M180,480 C220,450 280,460 310,500 C340,540 330,570 290,590 C250,610 200,600 170,560 C140,520 140,510 180,480 Z"
            stroke="url(#contourGreyGrad)"
            strokeWidth="1"
          />

          {/* Deep Transverse Flow Lines */}
          <path
            d="M-80,40 C160,110 320,-20 540,50 C760,120 920,-10 1140,60 C1360,130 1440,20 1540,70"
            stroke="url(#contourGreyGrad)"
            strokeWidth="1"
          />
          <path
            d="M-60,860 C180,800 360,930 580,870 C800,810 960,940 1180,880 C1400,820 1480,910 1560,870"
            stroke="url(#contourRedGrad)"
            strokeWidth="1"
          />
        </g>
      </svg>
    </div>
  );
};

export default TopographicContourBackground;
