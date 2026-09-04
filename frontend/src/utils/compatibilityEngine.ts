import { PCBuildState, CompatibilityReport, CompatibilityIssue, Product, BuilderSlotKey } from '../types/hardware';

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
