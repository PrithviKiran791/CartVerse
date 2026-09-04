# CartVerse — Next-Gen PC Hardware & Custom PC Builder Studio

<div align="center">

![CartVerse Logo](frontend/src/assets/icons/Spin_logo.png)

### **BUILD. SHOP. PLAY.**

A modern, high-performance gaming PC configuration and e-commerce platform engineered with React 19, TypeScript, Vite, and Tailwind CSS. Featuring real-time socket compatibility matrix validation, dynamic wattage headroom calculation, interactive 3D hardware showcases, and a technical brutalist design system.

[![Vite](https://img.shields.io/badge/Vite-8.2.2-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![React](https://img.shields.io/badge/React-19.2.8-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.3.3-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-E31B23?style=for-the-badge)](#license)

</div>

---

## 📌 Table of Contents

- [Overview](#-overview)
- [Key Features](#-key-features)
  - [1. Real-Time Custom PC Builder Studio](#1-real-time-custom-pc-builder-studio)
  - [2. Comprehensive Hardware Catalog](#2-comprehensive-hardware-catalog)
  - [3. CartVerse Turbine Fan Loading System](#3-cartverse-turbine-fan-loading-system)
  - [4. Dynamic Font Engine](#4-dynamic-font-engine)
  - [5. Interactive 3D Visual Showcases](#5-interactive-3d-visual-showcases)
  - [6. Slide-Over Cart & Checkout](#6-slide-over-cart--checkout)
- [Design Philosophy & Color System](#-design-philosophy--color-system)
- [Architecture & Directory Structure](#-architecture--directory-structure)
- [Compatibility & Calculation Engine](#-compatibility--calculation-engine)
- [Getting Started](#-getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Development](#development)
  - [Production Build](#production-build)
- [Tech Stack Details](#-tech-stack-details)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🚀 Overview

**CartVerse** is an all-in-one hardware intelligence and e-commerce platform tailored specifically for gamers, workstation architects, and PC builders. Finding compatible computer parts without encountering physical clearance conflicts, pin socket mismatches, or power supply shortages is notoriously complex. CartVerse eliminates guesswork by verifying compatibility across CPU sockets, motherboard form factors, DDR generations, and PSU wattage headroom in real-time.

---

## ⚡ Key Features

### 1. Real-Time Custom PC Builder Studio
- **Pin & Socket Verification**: Prevents invalid combinations across AMD (AM4, AM5, sTR5, SP3) and Intel (LGA1200, LGA1700, LGA1851, LGA4677) platforms.
- **Memory Matching Engine**: Ensures memory slots match motherboard DDR architecture (DDR4 vs DDR5) and maximum clock speeds.
- **Dynamic Wattage Headroom Gauge**: Computes live total system wattage consumption based on component TDP curves with an integrated 20% safe thermal headroom buffer.
- **Form Factor Clearance**: Validates motherboard form factor clearances against cabinet chassis constraints (Mini-ITX, Micro-ATX, ATX, E-ATX).
- **Interactive Component Slot Cards**: Instant replacement, removal, and pricing updates with official Indian market MSRP in INR (₹).
- **Shareable Build URLs**: Export and share customized rig configurations with encoded state parameters.

### 2. Comprehensive Hardware Catalog
- **500+ Verified Components**: High-fidelity catalog spanning CPUs, GPUs, Motherboards, RAM, NVMe SSDs, Cases, PSUs, Monitors, Keyboards, Mice, and Audio Gear.
- **Pre-Built Apex Rigs**: Handcrafted boutique builds with categorized performance tiers (*Ultra Flagship*, *High Performance*, *Mid-Tower Gaming*, *Creator Studio*).
- **Multi-Facet Filtering**: Filter by category, manufacturer, socket type, chipset, memory type, price range, and rating.
- **Keyboard-Accessible Quick Search**: Modal search engine accessible via shortcut (`Cmd/Ctrl + K`) for instant hardware lookup.

### 3. CartVerse Turbine Fan Loading System
- **Minimalist Hardware Aesthetic**: High-contrast, technical brutalist loading experience inspired by PC hardware telemetry.
- **Continuous GPU Clockwise Rotation**: Custom-animated rotating fan turbine logo (`Spin_logo.png`) executing smooth 360° transform loops with zero layout shift.
- **Intelligent Route Navigation Detection**: Automatically triggers a smooth ~350ms loading overlay when transitioning across routes without blocking initial homepage render.
- **Accessibility Friendly**: Fully honors `prefers-reduced-motion` with subtle opacity pulsation.

### 4. Dynamic Font Engine
- **Global Font Provider (`FontProvider`)**: Provides application-wide typography switching persisted in `localStorage`.
- **Supported Typefaces**: Inter, Roboto, Open Sans, Arial, Times New Roman, and JetBrains Mono.
- **Header Font Selector**: Live interactive typography popover in the top navigation bar.

### 5. Interactive 3D Visual Showcases
- **3D DepthCarousel**: Multi-card perspective carousel rendering 3D tilted depth layers for flagship pre-built rigs.
- **DriftWall Hardware Gallery**: Draggable, hovering 3D component grid showcasing verified graphics cards and processors.
- **MaskedHeading & TextType**: Cinematic cyclic background texture animations and terminal typewriter headers.
- **PillNav Navigation**: Floating responsive pill navigation bar with hover glow indicators.

### 6. Slide-Over Cart & Checkout
- **Zustand & LocalStorage Cart State**: Persistent shopping cart with real-time tax calculation and discount support.
- **Interactive Slide-Over Drawer**: Add individual components or complete assembled rigs directly to cart with one click.
- **Checkout Modal**: Streamlined multi-step checkout with delivery address capture, payment method selection, and instant order placement with celebratory confetti animations.

---

## 🎨 Design Philosophy & Color System

CartVerse is engineered with a **Technical Brutalist** aesthetic:
- **Sharp Geometry**: Minimal border radius (`rounded-none` to `rounded-md`), structural borders, and clean grid alignment.
- **Monospace Metadata**: Critical specs, socket names, wattage figures, and status telemetry are rendered with monospace typography.
- **High Contrast Palette**: Dominant deep black background, crisp white typography, and strategic CartVerse Red accents.

| Color Name | Hex Code | Purpose |
| :--- | :--- | :--- |
| **Black** | `#080808` / `#0A0A0C` | Primary background canvas |
| **Dark Grey** | `#151515` / `#1F1F24` | Surface cards, modals, and input fields |
| **Grey** | `#666666` | Secondary metadata and technical labels |
| **Light Grey**| `#BDBDBD` | Subheadings and active controls |
| **White** | `#F5F5F5` | Primary typography and headings |
| **CartVerse Red**| `#E31B23` | Primary accent, CTA buttons, active alerts |

---

## 📁 Architecture & Directory Structure

```text
CartVerse/
├── .gitignore
├── README.md
└── frontend/
    ├── public/
    │   ├── web_icon.png           # CartVerse favicon & browser tab icon
    │   └── Spin_logo.png          # Turbine fan asset
    ├── src/
    │   ├── assets/
    │   │   ├── Components/        # 80+ Local hardware asset images
    │   │   │   ├── CPU_Image/     # Intel & AMD processors
    │   │   │   ├── GPU/           # NVIDIA & Radeon graphics cards
    │   │   │   ├── Motherboards/  # ASUS, MSI, Gigabyte motherboards
    │   │   │   ├── Pre-Built PC/  # Signature custom gaming rigs
    │   │   │   └── ...            # Peripherals, cases, PSUs, displays
    │   │   └── icons/             # Custom branding & web icons
    │   ├── components/
    │   │   ├── cart/              # CartDrawer, CheckoutModal
    │   │   ├── catalog/           # ProductCard, FilterSidebar, CategorySection
    │   │   ├── common/            # DepthCarousel, DriftWall, TextType, FontSelector
    │   │   ├── layout/            # Header, PillNav, Footer, Navbar
    │   │   ├── LoadingScreen/     # LoadingScreen, RouteLoadingHandler
    │   │   ├── pc-builder/        # PCBuilderStudio, CompatibilityBar, WattageGauge
    │   │   ├── reviews/           # ProductReviewsSection, ProductComments
    │   │   └── ui/                # MagneticButton, NoiseBackground, 3D cards
    │   ├── data/
    │   │   └── mockProducts.ts    # 500+ Verified hardware items with full specs
    │   ├── pages/
    │   │   ├── HomePage.tsx       # Landing page with hero & 3D showcases
    │   │   ├── PCBuilderPage.tsx  # Interactive builder studio page
    │   │   ├── ProductsPage.tsx   # Catalog & hardware filter engine
    │   │   ├── ProductDetailsPage.tsx # Individual component breakdown
    │   │   └── CartPage.tsx       # Full cart review & checkout route
    │   ├── store/
    │   │   ├── useCartStore.ts    # Zustand cart state management
    │   │   ├── usePCBuilderStore.ts # Rig configuration & selection state
    │   │   └── useUIStore.ts      # Modals, drawers, and quick search state
    │   ├── types/
    │   │   ├── hardware.ts        # TypeScript interfaces for all PC parts
    │   │   └── reviews.ts         # Review & ratings data models
    │   ├── utils/
    │   │   ├── assetRegistry.ts   # Dynamic Vite image resolver & SVG fallback engine
    │   │   ├── compatibilityEngine.ts # Core socket & wattage validator
    │   │   └── formatters.ts      # Indian currency (INR ₹) & wattage formatters
    │   ├── App.tsx                # Master app router & providers
    │   ├── index.css              # Global styles & Tailwind v4 directives
    │   └── main.tsx               # Client React root entrypoint
    ├── package.json
    ├── tailwind.config.js
    └── vite.config.js
```

---

## ⚙️ Compatibility & Calculation Engine

The CartVerse compatibility engine validates configurations across five critical dimensions:

1. **CPU & Motherboard Socket Matching**:
   $$\text{Match}(\text{CPU}_{\text{socket}}, \text{Motherboard}_{\text{socket}}) \implies \text{VALID}$$
2. **RAM DDR Architecture**:
   $$\text{RAM}_{\text{DDR}} = \text{Motherboard}_{\text{DDR}} \implies \text{COMPATIBLE}$$
3. **Power Headroom Estimation**:
   $$\text{Total System Wattage} = \sum \text{TDP}_{\text{parts}} + 65\text{W (Base System Board + Peripherals)}$$
   $$\text{Recommended PSU} = \text{Total System Wattage} \times 1.20 \quad (20\% \text{ safety margin})$$
4. **Form Factor Fitting**:
   Ensures motherboard dimension class fits within the chassis support profile (e.g. ATX motherboard cannot be fitted inside a Mini-ITX chassis).

---

## 🛠️ Getting Started

### Prerequisites
- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher (or pnpm / yarn)
- **Git**

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/PrithviKiran791/CartVerse.git
   cd CartVerse/frontend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

### Development

Run the Vite development server with Hot Module Replacement (HMR):
```bash
npm run dev
```
The application will launch at:
`http://localhost:5173/`

### Production Build

Compile and bundle production-optimized assets:
```bash
npm run build
```

Preview the production build locally:
```bash
npm run preview
```

---

## 💻 Tech Stack Details

- **UI Framework**: [React 19](https://react.dev/)
- **Build Tool**: [Vite 8](https://vitejs.dev/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **State Management**: [Zustand](https://github.com/pmndrs/zustand)
- **Routing**: [React Router v7](https://reactrouter.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Animations & Effects**: CSS3 GPU keyframes, [Framer Motion](https://www.framer.com/motion/), [Canvas Confetti](https://www.npmjs.com/package/canvas-confetti)

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!
1. Fork the repository
2. Create your branch: `git checkout -b feature/AmazingFeature`
3. Commit your changes: `git commit -m "Add AmazingFeature"`
4. Push to the branch: `git push origin feature/AmazingFeature`
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.

---

<div align="center">
  <sub>Built with ❤️ for gamers & builders by <a href="https://github.com/PrithviKiran791">Prithvi Kiran</a></sub>
</div>
