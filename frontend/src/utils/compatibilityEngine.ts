import { PCBuildState, CompatibilityReport, CompatibilityIssue, Product, BuilderSlotKey, ServerBuildState, ServerSlotKey } from '../types/hardware';

const SYSTEM_BASE_OVERHEAD_WATTS = 100;
const RAM_PER_STICK_WATTS = 15;
const STORAGE_DRIVE_WATTS = 10;
const COOLER_WATTS = 20;

/**
 * Calculates total estimated system power consumption (TDP) in Watts
 */
export const calculateEstimatedWattage = (build: PCBuildState): number => {
  let wattage = 0;

  // Base motherboard / chipset / fans overhead if core components exist
  if (build.cpu || build.motherboard) {
    wattage += SYSTEM_BASE_OVERHEAD_WATTS;
  }

  if (build.cpu?.specs.tdp) {
    wattage += build.cpu.specs.tdp;
  }

  if (build.gpu?.specs.tdp) {
    wattage += build.gpu.specs.tdp;
  }

  if (build.ram) {
    wattage += RAM_PER_STICK_WATTS;
  }

  if (build.primaryStorage) {
    wattage += STORAGE_DRIVE_WATTS;
  }

  if (build.secondaryStorage) {
    wattage += STORAGE_DRIVE_WATTS;
  }

  if (build.cooler) {
    wattage += COOLER_WATTS;
  }

  return Math.max(wattage, build.cpu || build.gpu ? wattage : 0);
};

/**
 * Calculates recommended PSU wattage with a safe 25-30% headroom buffer rounded to nearest 50W
 */
export const calculateRecommendedPsuWattage = (estimatedWattage: number): number => {
  if (estimatedWattage === 0) return 550;
  const target = estimatedWattage * 1.25;
  return Math.max(550, Math.ceil(target / 50) * 50);
};

/**
 * Validates full PC build for physical, electrical, and architectural compatibility
 */
export const validateBuild = (build: PCBuildState): CompatibilityReport => {
  const issues: CompatibilityIssue[] = [];
  const warnings: string[] = [];
  const errors: string[] = [];

  const estimatedWattage = calculateEstimatedWattage(build);
  const recommendedPsuWattage = calculateRecommendedPsuWattage(estimatedWattage);

  // 1. CPU <-> Motherboard Socket Match
  if (build.cpu && build.motherboard) {
    const cpuSocket = build.cpu.specs.socket;
    const moboSocket = build.motherboard.specs.socket;

    if (cpuSocket && moboSocket && cpuSocket !== moboSocket) {
      const msg = `Socket Mismatch: CPU ${build.cpu.name} requires ${cpuSocket} socket, but Motherboard ${build.motherboard.name} has ${moboSocket} socket.`;
      errors.push(msg);
      issues.push({
        type: 'error',
        category: 'socket',
        title: 'CPU & Motherboard Incompatible',
        message: msg,
      });
    }
  }

  // 2. Motherboard <-> RAM Generation & Slots Match
  if (build.motherboard && build.ram) {
    const moboRamType = build.motherboard.specs.ramType;
    const ramType = build.ram.specs.ramType;

    if (moboRamType && ramType && moboRamType !== ramType) {
      const msg = `Memory Generation Conflict: Motherboard requires ${moboRamType}, but selected RAM is ${ramType}.`;
      errors.push(msg);
      issues.push({
        type: 'error',
        category: 'memory',
        title: 'RAM Generation Mismatch',
        message: msg,
      });
    }
  }

  // 3. GPU Length <-> Cabinet Clearance
  if (build.gpu && build.cabinet) {
    const gpuLength = build.gpu.specs.gpuLengthMm;
    const maxGpuLength = build.cabinet.specs.maxGpuLengthMm;

    if (gpuLength && maxGpuLength && gpuLength > maxGpuLength) {
      const msg = `Physical Clearance Issue: GPU length (${gpuLength}mm) exceeds Cabinet maximum supported GPU clearance (${maxGpuLength}mm).`;
      errors.push(msg);
      issues.push({
        type: 'error',
        category: 'clearance',
        title: 'GPU Exceeds Cabinet Clearance',
        message: msg,
      });
    } else if (gpuLength && maxGpuLength && gpuLength > maxGpuLength - 15) {
      const msg = `Tight GPU Fit: GPU length (${gpuLength}mm) is within 15mm of max cabinet clearance (${maxGpuLength}mm). Cable routing may be tight.`;
      warnings.push(msg);
      issues.push({
        type: 'warning',
        category: 'clearance',
        title: 'Tight GPU Clearance',
        message: msg,
      });
    }
  }

  // 4. Motherboard Form Factor <-> Cabinet Support
  if (build.motherboard && build.cabinet) {
    const moboForm = build.motherboard.specs.formFactor;
    const supportedForms = build.cabinet.specs.supportedFormFactors;

    if (moboForm && supportedForms && !supportedForms.includes(moboForm)) {
      const msg = `Form Factor Mismatch: Cabinet does not support ${moboForm} motherboards. Supported form factors: ${supportedForms.join(', ')}.`;
      errors.push(msg);
      issues.push({
        type: 'error',
        category: 'formfactor',
        title: 'Motherboard Does Not Fit Cabinet',
        message: msg,
      });
    }
  }

  // 5. Liquid Cooler Radiator <-> Cabinet Support
  if (build.cooler && build.cabinet) {
    const radSize = build.cooler.specs.radiatorSizeMm;
    const supportedRads = build.cabinet.specs.radiatorSupportMm;

    if (radSize && supportedRads && !supportedRads.includes(radSize)) {
      const msg = `Radiator Incompatible: Cabinet does not support ${radSize}mm radiator mounts. Supported: ${supportedRads.join(', ')}mm.`;
      errors.push(msg);
      issues.push({
        type: 'error',
        category: 'cooler',
        title: 'Radiator Mount Mismatch',
        message: msg,
      });
    }
  }

  // 6. Power Supply Wattage & Safety Headroom (20% safety margin)
  let psuHeadroomPercentage = 100;
  if (build.psu && estimatedWattage > 0) {
    const psuWattage = build.psu.specs.wattage || 0;
    const requiredWithHeadroom = estimatedWattage * 1.2;
    psuHeadroomPercentage = psuWattage > 0 ? Math.round(((psuWattage - estimatedWattage) / psuWattage) * 100) : 0;

    if (psuWattage < estimatedWattage) {
      const msg = `Critical Power Deficit: PSU rating (${psuWattage}W) is lower than estimated system consumption (${estimatedWattage}W). System will shut down under load!`;
      errors.push(msg);
      issues.push({
        type: 'error',
        category: 'power',
        title: 'Insufficient Power Supply',
        message: msg,
      });
    } else if (psuWattage < requiredWithHeadroom) {
      const msg = `Low PSU Headroom: Selected ${psuWattage}W PSU gives less than recommended 20% safety margin for transient spikes. Recommended: ${recommendedPsuWattage}W+.`;
      warnings.push(msg);
      issues.push({
        type: 'warning',
        category: 'power',
        title: 'Low Power Supply Headroom',
        message: msg,
      });
    }
  }

  // 7. General build advisories
  if (build.cpu && !build.cooler && (build.cpu.specs.tdp || 0) > 105) {
    const msg = `High TDP CPU (${build.cpu.specs.tdp}W) detected without an aftermarket cooler. Dedicated AIO or air cooler is strongly advised.`;
    warnings.push(msg);
    issues.push({
      type: 'warning',
      category: 'cooler',
      title: 'High TDP CPU Cooler Advisory',
      message: msg,
    });
  }

  const isCompatible = errors.length === 0;

  return {
    isCompatible,
    warnings,
    errors,
    issues,
    estimatedWattage,
    recommendedPsuWattage,
    psuHeadroomPercentage,
  };
};

/**
 * Checks whether a product from catalog is compatible with current build slots
 */
export const isComponentCompatibleWithBuild = (
  product: Product,
  slotKey: BuilderSlotKey,
  build: PCBuildState
): { isCompatible: boolean; reason?: string } => {
  // Test hypothetical state
  const testBuild: PCBuildState = { ...build, [slotKey]: product };
  const report = validateBuild(testBuild);

  if (report.errors.length > 0) {
    return {
      isCompatible: false,
      reason: report.errors[0],
    };
  }

  return { isCompatible: true };
};

// ==========================================
// ENTERPRISE SERVER COMPATIBILITY ENGINE
// ==========================================

const SERVER_BASE_OVERHEAD_WATTS = 160; // Dual fans, IPMI/BMC controller, PCIe switches, chipset
const SERVER_RDIMM_WATTS = 14;
const SERVER_NVME_U2_WATTS = 15;
const SERVER_FAN_ARRAY_WATTS = 45;

/**
 * Calculates total estimated server system power consumption (TDP) in Watts
 */
export const calculateEstimatedServerWattage = (build: ServerBuildState): number => {
  let wattage = 0;

  if (build.cpu || build.cpu2 || build.motherboard) {
    wattage += SERVER_BASE_OVERHEAD_WATTS + SERVER_FAN_ARRAY_WATTS;
  }

  if (build.cpu?.specs.tdp) {
    wattage += build.cpu.specs.tdp;
  }

  if (build.cpu2?.specs.tdp) {
    wattage += build.cpu2.specs.tdp;
  }

  if (build.gpu?.specs.tdp) {
    wattage += build.gpu.specs.tdp;
  }

  if (build.ram) {
    wattage += SERVER_RDIMM_WATTS * 4; // Server nodes typically populate multi-channel RDIMMs
  }

  if (build.primaryStorage) {
    wattage += SERVER_NVME_U2_WATTS;
  }

  if (build.secondaryStorage) {
    wattage += SERVER_NVME_U2_WATTS;
  }

  if (build.networkCard) {
    wattage += 25; // 25G/100G NIC
  }

  if (build.raidController) {
    wattage += 30; // Hardware RAID controller ASIC
  }

  return Math.max(wattage, build.cpu || build.gpu ? wattage : 0);
};

/**
 * Calculates server PSU redundancy metrics and failover headroom
 */
export const calculateServerPsuMetrics = (
  estimatedWattage: number,
  psu: Product | null
): {
  recommendedPsuWattage: number;
  psuHeadroomPercentage: number;
  redundancyMode: 'single' | 'N+1' | 'N+N';
  perModuleLoadWatts: number;
  isRedundantSafe: boolean;
} => {
  if (estimatedWattage === 0) {
    return {
      recommendedPsuWattage: 800,
      psuHeadroomPercentage: 100,
      redundancyMode: 'N+1',
      perModuleLoadWatts: 0,
      isRedundantSafe: true,
    };
  }

  const recommendedPsuWattage = Math.max(800, Math.ceil((estimatedWattage * 1.3) / 100) * 100);
  const psuWattage = psu?.specs.wattage || 0;
  const redundancyMode = psu?.psuRedundancy || (psu?.specs.psuRedundancy as 'single' | 'N+1' | 'N+N') || 'single';

  // N+1 redundancy: 1 module acts as live failover backup, remaining N modules share load
  const activeModules = redundancyMode === 'N+1' ? 1 : redundancyMode === 'N+N' ? 2 : 1;
  const perModuleLoadWatts = Math.round(estimatedWattage / activeModules);

  const psuHeadroomPercentage =
    psuWattage > 0 ? Math.round(((psuWattage - estimatedWattage) / psuWattage) * 100) : 0;

  const isRedundantSafe = redundancyMode !== 'single' && psuWattage >= estimatedWattage * 1.15;

  return {
    recommendedPsuWattage,
    psuHeadroomPercentage,
    redundancyMode,
    perModuleLoadWatts,
    isRedundantSafe,
  };
};

/**
 * Validates enterprise server build for multi-socket, ECC RDIMM, 1U-4U rack clearance, and N+1 power
 */
export const validateServerBuild = (build: ServerBuildState): CompatibilityReport => {
  const issues: CompatibilityIssue[] = [];
  const warnings: string[] = [];
  const errors: string[] = [];

  const estimatedWattage = calculateEstimatedServerWattage(build);
  const psuMetrics = calculateServerPsuMetrics(estimatedWattage, build.psu);

  // 1. Socket & Multi-Socket Matching
  if (build.motherboard) {
    const moboSockets = build.motherboard.socketCount || (build.motherboard.specs.socketCount as 1 | 2 | 4) || 1;
    const moboSocketType = build.motherboard.specs.socket;

    // CPU 1 Socket Match
    if (build.cpu && moboSocketType && build.cpu.specs.socket !== moboSocketType) {
      const msg = `Socket Mismatch: Primary CPU requires ${build.cpu.specs.socket}, but Motherboard socket is ${moboSocketType}.`;
      errors.push(msg);
      issues.push({
        type: 'error',
        category: 'socket',
        title: 'CPU & Motherboard Socket Conflict',
        message: msg,
      });
    }

    // CPU 2 Socket Match
    if (build.cpu2 && moboSocketType && build.cpu2.specs.socket !== moboSocketType) {
      const msg = `Socket Mismatch: Secondary CPU requires ${build.cpu2.specs.socket}, but Motherboard socket is ${moboSocketType}.`;
      errors.push(msg);
      issues.push({
        type: 'error',
        category: 'socket',
        title: 'Secondary CPU Socket Conflict',
        message: msg,
      });
    }

    // Dual-Socket Rule
    if (moboSockets === 2) {
      if (build.cpu && !build.cpu2) {
        const msg = `Dual-Socket Motherboard requires exactly 2 matching CPUs (currently 1 installed). Populate CPU Socket 2 or choose a single-socket board.`;
        errors.push(msg);
        issues.push({
          type: 'error',
          category: 'socket',
          title: 'Unpopulated Dual-Socket Board',
          message: msg,
        });
      } else if (!build.cpu && build.cpu2) {
        const msg = `Primary CPU socket must be populated first before secondary socket.`;
        errors.push(msg);
        issues.push({
          type: 'error',
          category: 'socket',
          title: 'Primary Socket Empty',
          message: msg,
        });
      } else if (build.cpu && build.cpu2) {
        if (build.cpu.id !== build.cpu2.id && build.cpu.specs.socket !== build.cpu2.specs.socket) {
          const msg = `Dual-Socket CPU Mismatch: Both CPUs must be identical SKUs (${build.cpu.name} vs ${build.cpu2.name}). Asymmetric CPU pairings cause fatal QPI/UPI synchronization failures.`;
          errors.push(msg);
          issues.push({
            type: 'error',
            category: 'socket',
            title: 'Mismatched Dual CPUs',
            message: msg,
          });
        }
      }
    } else if (moboSockets === 1 && build.cpu2) {
      const msg = `Single-Socket Motherboard cannot support a secondary processor. Please remove CPU 2.`;
      errors.push(msg);
      issues.push({
        type: 'error',
        category: 'socket',
        title: 'Extra CPU on Single-Socket Board',
        message: msg,
      });
    }
  }

  // 2. ECC RDIMM / LRDIMM Validation
  if (build.motherboard && build.ram) {
    const moboRamType = build.motherboard.specs.ramType;
    const ramType = build.ram.specs.ramType;
    const isEcc = build.ram.eccSupport === true || (build.ram.specs.eccSupport as boolean) === true;
    const memType = build.ram.memoryType || build.ram.specs.memoryType;

    // Reject consumer UDIMM or non-ECC memory on server boards
    if (!isEcc || memType === 'UDIMM' || build.ram.productClass === 'consumer') {
      const msg = `ECC Validation Error: Server Motherboard requires ECC Registered RDIMM or LRDIMM memory. Consumer non-ECC UDIMM (${build.ram.name}) is rejected.`;
      errors.push(msg);
      issues.push({
        type: 'error',
        category: 'memory',
        title: 'Non-ECC Memory Rejected',
        message: msg,
      });
    }

    // DDR4 vs DDR5 check
    if (moboRamType && ramType && moboRamType !== ramType) {
      const msg = `Memory Generation Conflict: Server motherboard requires ${moboRamType} RDIMMs, but selected kit is ${ramType}.`;
      errors.push(msg);
      issues.push({
        type: 'error',
        category: 'memory',
        title: 'RDIMM Generation Mismatch',
        message: msg,
      });
    }
  }

  // 3. Rack Unit Physical Clearance & GPU Form Factor
  if (build.cabinet && build.gpu) {
    const chassisRackUnits = build.cabinet.rackUnits || (build.cabinet.specs.rackUnits as number) || 1;
    const gpuRequiredU = build.gpu.rackUnits || (build.gpu.specs.rackUnits as number) || 2;
    const gpuLength = build.gpu.specs.gpuLengthMm || 0;
    const maxGpuLength = build.cabinet.specs.maxGpuLengthMm || 300;

    // 1U Chassis cannot accommodate 2U+ full-height double-width compute cards (H100, RTX 6000, MI210)
    if (chassisRackUnits < gpuRequiredU) {
      const msg = `Chassis Clearance Error: Selected Accelerator (${build.gpu.name}) requires minimum ${gpuRequiredU}U vertical clearance, exceeding ${chassisRackUnits}U rackmount chassis capacity. Upgrade to a 2U or 4U chassis.`;
      errors.push(msg);
      issues.push({
        type: 'error',
        category: 'clearance',
        title: 'Accelerator Exceeds Rack Unit Height',
        message: msg,
      });
    }

    // Physical length check
    if (gpuLength > maxGpuLength) {
      const msg = `Physical Length Issue: Accelerator length (${gpuLength}mm) exceeds chassis maximum clearance (${maxGpuLength}mm).`;
      errors.push(msg);
      issues.push({
        type: 'error',
        category: 'clearance',
        title: 'Accelerator Too Long for Chassis',
        message: msg,
      });
    }
  }

  // 4. Motherboard Form Factor <-> Chassis Rack Support
  if (build.motherboard && build.cabinet) {
    const moboForm = build.motherboard.specs.formFactor;
    const supportedForms = build.cabinet.specs.supportedFormFactors;

    if (moboForm && supportedForms && !supportedForms.includes(moboForm)) {
      const msg = `Chassis Compatibility: Chassis does not support ${moboForm} server motherboards. Supported form factors: ${supportedForms.join(', ')}.`;
      errors.push(msg);
      issues.push({
        type: 'error',
        category: 'formfactor',
        title: 'Server Board Form Factor Incompatible',
        message: msg,
      });
    }
  }

  // 5. PSU Redundancy & Wattage Math
  if (build.psu && estimatedWattage > 0) {
    const psuWattage = build.psu.specs.wattage || 0;
    const redundancy = build.psu.psuRedundancy || (build.psu.specs.psuRedundancy as 'single' | 'N+1' | 'N+N') || 'single';

    if (psuWattage < estimatedWattage) {
      const msg = `Critical Power Deficit: Selected server PSU output (${psuWattage}W) is lower than estimated system consumption (${estimatedWattage}W). System will trip under compute load.`;
      errors.push(msg);
      issues.push({
        type: 'error',
        category: 'power',
        title: 'Insufficient Server Power Supply',
        message: msg,
      });
    } else if (redundancy === 'single') {
      const msg = `Single PSU module detected. Enterprise server best practice recommends N+1 hot-swap redundant power modules to ensure continuous uptime during power-rail failover.`;
      warnings.push(msg);
      issues.push({
        type: 'warning',
        category: 'power',
        title: 'Lack of N+1 Power Redundancy',
        message: msg,
      });
    } else {
      // Redundant mode active
      if (psuWattage < estimatedWattage * 1.2) {
        const msg = `N+1 Redundancy Advisory: System consumption (${estimatedWattage}W) is close to single-module capacity (${psuWattage}W). Recommend 20%+ headroom for transient accelerator spikes.`;
        warnings.push(msg);
        issues.push({
          type: 'warning',
          category: 'power',
          title: 'Tight N+1 Power Headroom',
          message: msg,
        });
      }
    }
  }

  // 6. Thermal Advisory for Multi-CPU High-TDP
  const totalCpuTdp = (build.cpu?.specs.tdp || 0) + (build.cpu2?.specs.tdp || 0);
  if (totalCpuTdp > 400 && !build.cooler) {
    const msg = `High combined CPU TDP (${totalCpuTdp}W) detected. Dedicated server active copper heatsinks or chassis fan duct shroud is required.`;
    warnings.push(msg);
    issues.push({
      type: 'warning',
      category: 'cooler',
      title: 'High Server TDP Thermal Notice',
      message: msg,
    });
  }

  const isCompatible = errors.length === 0;

  return {
    isCompatible,
    warnings,
    errors,
    issues,
    estimatedWattage,
    recommendedPsuWattage: psuMetrics.recommendedPsuWattage,
    psuHeadroomPercentage: psuMetrics.psuHeadroomPercentage,
  };
};

/**
 * Checks whether a candidate server component from catalog is compatible with current server build
 */
export const isServerComponentCompatibleWithBuild = (
  product: Product,
  slotKey: ServerSlotKey,
  build: ServerBuildState
): { isCompatible: boolean; reason?: string } => {
  const testBuild: ServerBuildState = { ...build, [slotKey]: product };
  const report = validateServerBuild(testBuild);

  if (report.errors.length > 0) {
    return {
      isCompatible: false,
      reason: report.errors[0],
    };
  }

  return { isCompatible: true };
};

