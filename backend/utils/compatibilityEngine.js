const SYSTEM_BASE_OVERHEAD_WATTS = 100;
const RAM_PER_STICK_WATTS = 15;
const STORAGE_DRIVE_WATTS = 10;
const COOLER_WATTS = 20;

/**
 * Calculates total estimated system power consumption (TDP) in Watts
 */
export const calculateEstimatedWattage = (build = {}) => {
  let wattage = 0;

  if (build.cpu || build.motherboard) {
    wattage += SYSTEM_BASE_OVERHEAD_WATTS;
  }

  if (build.cpu?.specs?.tdp) {
    wattage += Number(build.cpu.specs.tdp) || 0;
  }

  if (build.gpu?.specs?.tdp) {
    wattage += Number(build.gpu.specs.tdp) || 0;
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
 * Calculates recommended PSU wattage with safe headroom buffer rounded to nearest 50W
 */
export const calculateRecommendedPsuWattage = (estimatedWattage = 0) => {
  if (estimatedWattage === 0) return 550;
  const target = estimatedWattage * 1.25;
  return Math.max(550, Math.ceil(target / 50) * 50);
};

/**
 * Validates full PC build for physical, electrical, and architectural compatibility
 */
export const validateBuild = (build = {}) => {
  const issues = [];
  const warnings = [];
  const errors = [];

  const estimatedWattage = calculateEstimatedWattage(build);
  const recommendedPsuWattage = calculateRecommendedPsuWattage(estimatedWattage);

  // 1. CPU <-> Motherboard Socket Match
  if (build.cpu && build.motherboard) {
    const cpuSocket = build.cpu.specs?.socket;
    const moboSocket = build.motherboard.specs?.socket;

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

  // 2. Motherboard <-> RAM Generation Match
  if (build.motherboard && build.ram) {
    const moboRamType = build.motherboard.specs?.ramType;
    const ramType = build.ram.specs?.ramType;

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
    const gpuLength = build.gpu.specs?.gpuLengthMm;
    const maxGpuLength = build.cabinet.specs?.maxGpuLengthMm;

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
    const moboForm = build.motherboard.specs?.formFactor;
    const supportedForms = build.cabinet.specs?.supportedFormFactors;

    if (moboForm && Array.isArray(supportedForms) && !supportedForms.includes(moboForm)) {
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
    const radSize = build.cooler.specs?.radiatorSizeMm;
    const supportedRads = build.cabinet.specs?.radiatorSupportMm;

    if (radSize && Array.isArray(supportedRads) && !supportedRads.includes(radSize)) {
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

  // 6. Power Supply Wattage & Safety Headroom
  let psuHeadroomPercentage = 100;
  if (build.psu && estimatedWattage > 0) {
    const psuWattage = build.psu.specs?.wattage || 0;
    const requiredWithHeadroom = estimatedWattage * 1.2;
    psuHeadroomPercentage = psuWattage > 0 ? Math.round(((psuWattage - estimatedWattage) / psuWattage) * 100) : 0;

    if (psuWattage < estimatedWattage) {
      const msg = `Critical Power Deficit: PSU rating (${psuWattage}W) is lower than estimated system consumption (${estimatedWattage}W).`;
      errors.push(msg);
      issues.push({
        type: 'error',
        category: 'power',
        title: 'Insufficient Power Supply',
        message: msg,
      });
    } else if (psuWattage < requiredWithHeadroom) {
      const msg = `Low PSU Headroom: Selected ${psuWattage}W PSU gives less than recommended 20% safety margin. Recommended: ${recommendedPsuWattage}W+.`;
      warnings.push(msg);
      issues.push({
        type: 'warning',
        category: 'power',
        title: 'Low Power Supply Headroom',
        message: msg,
      });
    }
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
 * Calculates estimated power draw for an enterprise rack server
 */
export const calculateEstimatedServerWattage = (build = {}) => {
  let wattage = 150; // Server baseboard / IPMI / cooling fans overhead

  if (build.cpu1?.specs?.tdp) {
    wattage += Number(build.cpu1.specs.tdp) || 0;
  }
  if (build.cpu2?.specs?.tdp) {
    wattage += Number(build.cpu2.specs.tdp) || 0;
  }
  if (build.gpu1?.specs?.tdp) {
    wattage += Number(build.gpu1.specs.tdp) || 0;
  }
  if (build.gpu2?.specs?.tdp) {
    wattage += Number(build.gpu2.specs.tdp) || 0;
  }

  // ECC RDIMM modules (15W per channel bank)
  if (build.ram) {
    const sticks = build.ram.specs?.ramSlots || 4;
    wattage += sticks * 12;
  }

  // Enterprise NVMe U.2 / SAS Storage
  if (build.primaryStorage) {
    wattage += 20;
  }
  if (build.secondaryStorage) {
    wattage += 20;
  }

  return wattage;
};

/**
 * Calculates N+1 / N+N redundant power metrics for enterprise servers
 */
export const calculateServerPsuMetrics = (build = {}) => {
  const estimatedWattage = calculateEstimatedServerWattage(build);
  const psu = build.psu;
  const redundancyMode = build.chassis?.psuRedundancy || psu?.psuRedundancy || 'N+1';

  if (!psu || !psu.specs?.wattage) {
    return {
      estimatedWattage,
      moduleWattage: 0,
      moduleCount: 0,
      effectiveRedundantWattage: 0,
      totalCapacityWattage: 0,
      redundancyMode,
      hasFailoverHeadroom: false,
      failoverHeadroomPercentage: 0,
      isPsuOverloaded: true,
    };
  }

  const moduleWattage = Number(psu.specs.wattage) || 800;
  const moduleCount = redundancyMode === 'N+N' ? 4 : redundancyMode === 'N+1' ? 2 : 1;
  const activeN = redundancyMode === 'single' ? 1 : moduleCount - 1;

  const effectiveRedundantWattage = moduleWattage * activeN;
  const totalCapacityWattage = moduleWattage * moduleCount;

  const hasFailoverHeadroom = effectiveRedundantWattage >= estimatedWattage;
  const failoverHeadroomPercentage =
    effectiveRedundantWattage > 0
      ? Math.round(((effectiveRedundantWattage - estimatedWattage) / effectiveRedundantWattage) * 100)
      : 0;

  return {
    estimatedWattage,
    moduleWattage,
    moduleCount,
    effectiveRedundantWattage,
    totalCapacityWattage,
    redundancyMode,
    hasFailoverHeadroom,
    failoverHeadroomPercentage,
    isPsuOverloaded: estimatedWattage > effectiveRedundantWattage,
  };
};

/**
 * Validates enterprise server build against dual-socket, ECC RDIMM, 1U-4U rack clearance & N+1 power rules
 */
export const validateServerBuild = (build = {}) => {
  const issues = [];
  const warnings = [];
  const errors = [];

  const estimatedWattage = calculateEstimatedServerWattage(build);
  const psuMetrics = calculateServerPsuMetrics(build);

  // 1. Dual-Socket Validation
  const moboSockets = build.motherboard?.socketCount || 1;
  if (moboSockets === 2) {
    if (!build.cpu1) {
      const msg = 'Dual-Socket Incomplete: Primary CPU Slot 1 is unpopulated.';
      errors.push(msg);
      issues.push({ type: 'error', category: 'socket', title: 'Primary CPU Missing', message: msg });
    }
    if (!build.cpu2) {
      const msg = 'Dual-Socket Asymmetry: Selected motherboard requires 2 CPUs to activate all PCIe lanes and memory channels.';
      warnings.push(msg);
      issues.push({ type: 'warning', category: 'socket', title: 'Secondary CPU Recommended', message: msg });
    }
    if (build.cpu1 && build.cpu2 && build.cpu1.id !== build.cpu2.id) {
      const msg = `Dual-Socket Mismatch: CPU 1 (${build.cpu1.name}) and CPU 2 (${build.cpu2.name}) must be identical silicon SKUs.`;
      errors.push(msg);
      issues.push({ type: 'error', category: 'socket', title: 'Mismatched Dual CPUs', message: msg });
    }
  } else if (moboSockets === 1 && build.cpu2) {
    const msg = `Socket Overflow: Motherboard (${build.motherboard?.name}) only has 1 socket, but CPU 2 is assigned.`;
    errors.push(msg);
    issues.push({ type: 'error', category: 'socket', title: 'Extra CPU Assigned', message: msg });
  }

  // 2. Socket Architecture Match (SP5, LGA4677, etc.)
  if (build.motherboard) {
    const moboSocket = build.motherboard.specs?.socket;
    if (build.cpu1 && build.cpu1.specs?.socket && build.cpu1.specs.socket !== moboSocket) {
      const msg = `Socket Conflict: CPU 1 (${build.cpu1.specs.socket}) does not match server motherboard socket (${moboSocket}).`;
      errors.push(msg);
      issues.push({ type: 'error', category: 'socket', title: 'CPU 1 Socket Mismatch', message: msg });
    }
    if (build.cpu2 && build.cpu2.specs?.socket && build.cpu2.specs.socket !== moboSocket) {
      const msg = `Socket Conflict: CPU 2 (${build.cpu2.specs.socket}) does not match server motherboard socket (${moboSocket}).`;
      errors.push(msg);
      issues.push({ type: 'error', category: 'socket', title: 'CPU 2 Socket Mismatch', message: msg });
    }
  }

  // 3. ECC RDIMM / LRDIMM Requirement
  if (build.ram) {
    const memType = build.ram.memoryType || build.ram.specs?.memoryType;
    if (memType === 'UDIMM' || (!build.ram.eccSupport && !build.ram.specs?.eccSupport)) {
      const msg = `Memory Class Error: Enterprise server boards require Registered ECC RDIMM or LRDIMM memory. Consumer unbuffered UDIMM (${build.ram.name}) is unsupported.`;
      errors.push(msg);
      issues.push({ type: 'error', category: 'memory', title: 'Non-ECC Memory Rejected', message: msg });
    }
  }

  // 4. Rack Unit Height & Clearance
  if (build.chassis) {
    const rackUnits = build.chassis.rackUnits || 2;
    if (rackUnits === 1) {
      const checkDoubleWidthGpu = (gpu, name) => {
        if (!gpu) return;
        const widthSlots = gpu.specs?.expansionSlotsRequired || (gpu.name.includes('RTX 6000') || gpu.name.includes('MI210') ? 2 : 1);
        if (widthSlots > 1) {
          const msg = `Chassis Clearance Conflict: Accelerator ${gpu.name} is a double-width card and cannot fit in a 1U chassis. Minimum 2U chassis required.`;
          errors.push(msg);
          issues.push({ type: 'error', category: 'clearance', title: `Chassis Height Incompatible (${name})`, message: msg });
        }
      };
      checkDoubleWidthGpu(build.gpu1, 'GPU 1');
      checkDoubleWidthGpu(build.gpu2, 'GPU 2');
    }
  }

  // 5. N+1 Power Failover Math
  if (build.psu) {
    if (psuMetrics.isPsuOverloaded) {
      const msg = `Power Redundancy Deficit: System peak consumption (${estimatedWattage}W) exceeds effective N+1 failover capacity (${psuMetrics.effectiveRedundantWattage}W). System will fail in the event of a single PSU outage.`;
      errors.push(msg);
      issues.push({ type: 'error', category: 'power', title: 'Insufficient N+1 Power', message: msg });
    } else if (psuMetrics.failoverHeadroomPercentage < 15) {
      const msg = `Low Failover Margin: Operating with only ${psuMetrics.failoverHeadroomPercentage}% headroom under single-PSU failover conditions.`;
      warnings.push(msg);
      issues.push({ type: 'warning', category: 'power', title: 'Tight Redundancy Buffer', message: msg });
    }
  }

  return {
    isCompatible: errors.length === 0,
    warnings,
    errors,
    issues,
    estimatedWattage,
    psuMetrics,
  };
};

