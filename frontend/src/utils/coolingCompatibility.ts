import { CoolingProduct, CoolerSpecs } from '../types/cooling';
import { Product } from '../types/hardware';

export interface CoolingValidationResult {
  isCompatible: boolean;
  errors: string[];
  warnings: string[];
  tdpHeadroomPercent: number;
}

/**
 * Validates a selected cooler against the active CPU and Cabinet selection.
 */
export function validateCoolerSelection(
  coolerProduct: CoolingProduct | null,
  cpu: Product | null,
  cabinet: Product | null
): CoolingValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];
  let tdpHeadroomPercent = 100;

  if (!coolerProduct || coolerProduct.category !== 'cooler' || !coolerProduct.coolerSpecs) {
    return { isCompatible: true, errors, warnings, tdpHeadroomPercent: 0 };
  }

  const specs: CoolerSpecs = coolerProduct.coolerSpecs;

  // 1. Socket Mounting Verification
  if (cpu && cpu.specs.socket) {
    const isSocketSupported = specs.supportedSockets.includes(
      cpu.specs.socket as 'AM4' | 'AM5' | 'LGA1200' | 'LGA1700' | 'LGA1851'
    );
    if (!isSocketSupported) {
      errors.push(
        `Socket conflict: ${coolerProduct.name} does not include a mounting bracket for socket ${cpu.specs.socket}.`
      );
    }
  }

  // 2. TDP Thermal Dissipation Headroom
  if (cpu && cpu.specs.tdp) {
    const cpuTdp = cpu.specs.tdp;
    const coolerTdp = specs.ratedTdpWatts;
    tdpHeadroomPercent = Math.round(((coolerTdp - cpuTdp) / coolerTdp) * 100);

    if (coolerTdp < cpuTdp) {
      errors.push(
        `Thermal Throttling Hazard: ${coolerProduct.name} is rated for ${coolerTdp}W, but ${cpu.name} outputs up to ${cpuTdp}W TDP.`
      );
    } else if (coolerTdp < cpuTdp * 1.15) {
      warnings.push(
        `Low Thermal Margin: Only ${tdpHeadroomPercent}% headroom above CPU TDP. Under sustained boost loads, fan acoustics will be loud.`
      );
    }
  }

  // 3. Air Cooler Height vs Cabinet Clearance
  if (specs.coolerType === 'air' && specs.heightMm && cabinet) {
    const maxCaseHeight = (cabinet.specs as any)?.maxCpuCoolerHeightMm || 165;
    if (specs.heightMm > maxCaseHeight) {
      errors.push(
        `Physical Clearance Failure: Cooler height (${specs.heightMm}mm) exceeds ${cabinet.name} max allowance (${maxCaseHeight}mm). Case side panel will not close.`
      );
    }
  }

  // 4. Liquid AIO Radiator Mount Clearance
  if (specs.coolerType === 'aio_liquid' && specs.radiatorSizeMm && cabinet) {
    const supportedRads = cabinet.specs.radiatorSupportMm || [120, 240, 280, 360];
    if (!supportedRads.includes(specs.radiatorSizeMm)) {
      errors.push(
        `Radiator Incompatible: ${cabinet.name} does not have bracket mounting slots for a ${specs.radiatorSizeMm}mm radiator.`
      );
    }

    // Check extra-thick radiators (e.g. Arctic Liquid Freezer 38mm core)
    if (specs.radiatorThicknessMm && specs.radiatorThicknessMm > 30) {
      warnings.push(
        `Thick Radiator Alert: This radiator is ${specs.radiatorThicknessMm}mm thick (standard is 27mm). Ensure your motherboard VRM heat-spreaders do not collide with top-mounted fans.`
      );
    }
  }

  return {
    isCompatible: errors.length === 0,
    errors,
    warnings,
    tdpHeadroomPercent
  };
}
