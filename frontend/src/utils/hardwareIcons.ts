import React from 'react';

// Custom Hardware Icon Assets from src/assets/icons/Server
import cpuIcon from '../assets/icons/Server/cpu.png';
import gpuIcon from '../assets/icons/Server/video-card.png';
import motherboardIcon from '../assets/icons/Server/motherboard.png';
import ramIcon from '../assets/icons/Server/ram-memory.png';
import ssdIcon from '../assets/icons/Server/ssd.png';
import hddIcon from '../assets/icons/Server/hard-disk.png';
import psuIcon from '../assets/icons/Server/power-supply.png';
import cabinetIcon from '../assets/icons/Server/Cabinet.png';
import pcTowerIcon from '../assets/icons/Server/pc-tower.png';
import coolerDedicatedIcon from '../assets/icons/Server/cooler.png';
import coolantIcon from '../assets/icons/Server/snowflake.png';
import monitorIcon from '../assets/icons/Server/Monitor.png';
import monitorAltIcon from '../assets/icons/Server/monitor (1).png';
import keyboardIcon from '../assets/icons/Server/wired-keyboard.png';
import mouseIcon from '../assets/icons/Server/computer-mouse.png';
import headphoneIcon from '../assets/icons/Server/headphone.png';
import desktopIcon from '../assets/icons/Server/Desktop.png';
import serverOldIcon from '../assets/icons/Server/Server.png';
import serverNewIcon from '../assets/icons/Server/server (1).png';
import server2Icon from '../assets/icons/Server/Server_2.png';
import aiOldIcon from '../assets/icons/Server/AI.png';
import aiNewIcon from '../assets/icons/Server/ai (1).png';
import supercomputerIcon from '../assets/icons/Server/supercomputer.png';
import databaseIcon from '../assets/icons/Server/Database.png';
import searchIcon from '../assets/icons/Server/search.png';
import processorSpeedIcon from '../assets/icons/Server/processor.png';
import renderIcon from '../assets/icons/Server/3D RENDER.png';
import flashIcon from '../assets/icons/Server/flash.png';
import serviceIcon from '../assets/icons/Server/Service.pnh.png';
import gameConsoleIcon from '../assets/icons/Server/game-console.png';
import gameControllerIcon from '../assets/icons/Server/game-controller.png';
import speakerIcon from '../assets/icons/Server/loud-speaker.png';
import mousepadIcon from '../assets/icons/Server/mousepad.png';
import webcamIcon from '../assets/icons/Server/webcam.png';
import usbIcon from '../assets/icons/Server/usb-connection.png';
import xboxIcon from '../assets/icons/Server/xbox.png';

export const HARDWARE_ICONS: Record<string, string> = {
  // Processor / CPU
  cpu: cpuIcon,
  cpu2: cpuIcon,
  processor: cpuIcon,
  processors: cpuIcon,

  // Graphics Cards / GPU
  gpu: gpuIcon,
  'graphics card': gpuIcon,
  'graphics cards': gpuIcon,
  videocard: gpuIcon,

  // Motherboard
  motherboard: motherboardIcon,
  motherboards: motherboardIcon,

  // RAM / Memory
  ram: ramIcon,
  memory: ramIcon,

  // Storage
  ssd: ssdIcon,
  nvme: ssdIcon,
  'solid state drive': ssdIcon,
  primarystorage: ssdIcon,
  hdd: hddIcon,
  'hard disk': hddIcon,
  'hard drives': hddIcon,
  secondarystorage: hddIcon,

  // Power & Chassis
  psu: psuIcon,
  powersupply: psuIcon,
  'power supply': psuIcon,
  cabinet: cabinetIcon,
  case: cabinetIcon,
  chassis: cabinetIcon,
  tower: pcTowerIcon,
  'pc tower': pcTowerIcon,

  // Thermal & Cooling (cooler.png dedicated for coolers, snowflake.png for coolants & fluids)
  cooler: coolerDedicatedIcon,
  cooling: coolerDedicatedIcon,
  fan: coolerDedicatedIcon,
  aio: coolerDedicatedIcon,
  coolers: coolerDedicatedIcon,
  coolant: coolantIcon,
  fluid: coolantIcon,
  fluids: coolantIcon,

  // Peripherals
  monitor: monitorIcon,
  display: monitorIcon,
  displays: monitorIcon,
  monitors: monitorIcon,
  keyboard: keyboardIcon,
  keyboards: keyboardIcon,
  mouse: mouseIcon,
  mice: mouseIcon,
  mousepad: mousepadIcon,
  mousepads: mousepadIcon,
  deskmat: mousepadIcon,
  deskmats: mousepadIcon,
  controller: gameControllerIcon,
  controllers: gameControllerIcon,
  gamepad: gameControllerIcon,
  gamepads: gameControllerIcon,
  xbox: xboxIcon,
  webcam: webcamIcon,
  webcams: webcamIcon,
  camera: webcamIcon,
  cables: usbIcon,
  cable: usbIcon,
  usb: usbIcon,
  console: gameConsoleIcon,
  consoles: gameConsoleIcon,
  headphones: headphoneIcon,
  headset: headphoneIcon,
  audio: headphoneIcon,
  speakers: speakerIcon,
  speaker: speakerIcon,

  // Systems & Infrastructure (512x512 assets: pc-tower, server (1), supercomputer, database)
  prebuilt: pcTowerIcon,
  desktop: pcTowerIcon,
  desktops: pcTowerIcon,
  workstation: pcTowerIcon,
  rig: pcTowerIcon,
  rigs: pcTowerIcon,
  server: serverNewIcon,
  servers: serverNewIcon,
  infrastructure: serverNewIcon,
  supercomputer: supercomputerIcon,
  supercomputers: supercomputerIcon,
  ai: supercomputerIcon,
  aitraining: supercomputerIcon,
  aichip: aiNewIcon,
  database: databaseIcon,
  speed: processorSpeedIcon,
  search: searchIcon,
  render: renderIcon,
  rendering: renderIcon,
  vfx: renderIcon,
  flash: flashIcon,
  zap: flashIcon,
  service: serviceIcon,
  support: serviceIcon,
  warranty: serviceIcon,
  rma: serviceIcon,
  networkcard: serverNewIcon,
  raidcontroller: databaseIcon,
};

/**
 * Set of icon keys that are monochrome line art (black stroke with transparency).
 * When rendered in dark themes, these need inversion so they stand out crisply in white.
 */
export const MONOCHROME_HARDWARE_KEYS = new Set([
  'cooler',
  'cooling',
  'fan',
  'aio',
  'coolers',
  'cabinet',
  'case',
  'chassis',
  'psu',
  'powersupply',
  'ram',
  'memory',
  'keyboard',
  'keyboards',
  'mouse',
  'mice',
  'mousepad',
  'mousepads',
  'deskmat',
  'deskmats',
  'webcam',
  'webcams',
  'camera',
  'cables',
  'cable',
  'usb',
  'headphones',
  'headset',
  'audio',
  'speakers',
  'speaker',
  'monitor',
  'display',
  'displays',
  'monitors',
  'console',
  'consoles',
  'xbox',
  'database',
  'server',
  'servers',
  'supercomputer',
  'supercomputers',
  'ai',
  'search',
  'service',
  'support',
  'warranty',
  'rma',
  'desktop',
  '3drender',
  'render',
  'rendering',
]);

/**
 * Checks whether an icon is monochrome line-art that needs dark-mode inversion
 */
export function isMonochromeHardwareIcon(name: string): boolean {
  if (!name) return false;
  const key = name.toLowerCase().replace(/[^a-z0-9]/g, '');
  return MONOCHROME_HARDWARE_KEYS.has(key);
}

/**
 * Resolve a custom hardware icon URL by category or slot name
 */
export function getHardwareIcon(name: string): string | undefined {
  if (!name) return undefined;
  const key = name.toLowerCase().replace(/[^a-z0-9]/g, '');
  const raw = HARDWARE_ICONS[key] || HARDWARE_ICONS[name.toLowerCase()];
  if (!raw) return undefined;
  if (typeof raw === 'string') return raw;
  if (typeof raw === 'object' && 'default' in raw) return (raw as any).default;
  return String(raw);
}

interface HardwareIconProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  name: string;
  fallback?: React.ReactNode;
}

export const HardwareIcon: React.FC<HardwareIconProps> = ({
  name,
  className = 'w-6 h-6 object-contain',
  alt,
  fallback,
  ...rest
}) => {
  const src = getHardwareIcon(name);
  if (src) {
    const isMono = isMonochromeHardwareIcon(name);
    const filterClass = isMono ? 'dark:invert dark:brightness-125' : '';
    return React.createElement('img', {
      src,
      alt: alt || `${name} icon`,
      className: `${className} ${filterClass}`.trim(),
      loading: 'lazy',
      ...rest,
    });
  }
  return fallback ? (React.isValidElement(fallback) ? fallback : React.createElement(React.Fragment, null, fallback)) : null;
};

export default HardwareIcon;
