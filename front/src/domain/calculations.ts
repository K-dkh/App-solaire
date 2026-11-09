import type { Coordinates } from './types';

/**
 * Panel yield (FCT-30): Yield (%) = Peak power (Wc) / (Surface (m²) × 1000) × 100.
 * 1000 W/m² is the standard test irradiance.
 * The API computes the same value; this local version lets the screens work offline.
 */
export function computeYieldPct(peakPowerWc: number, surfaceM2: number): number {
  if (!Number.isFinite(surfaceM2) || surfaceM2 <= 0) {
    throw new Error('Surface must be strictly positive');
  }
  if (!Number.isFinite(peakPowerWc) || peakPowerWc < 0) {
    throw new Error('Peak power must be positive');
  }
  return (peakPowerWc / (surfaceM2 * 1000)) * 100;
}

/** Net cost of the installation once subsidies are deducted (never negative). */
export function computeNetCost(costEur: number, subsidiesEur: number): number {
  return Math.max(costEur - subsidiesEur, 0);
}

/**
 * Rounds coordinates to 2 decimals (~1.1 km) so the exact home address is never stored (GDPR).
 */
export function roundCoordinates(coords: Coordinates): Coordinates {
  const round = (value: number) => Math.round(value * 100) / 100;
  return { latitude: round(coords.latitude), longitude: round(coords.longitude) };
}

/** Parses a number typed by a French user: accepts "1,5" as well as "1.5". */
export function parseFrenchNumber(raw: string): number {
  const cleaned = raw.trim().replace(/\s/g, '').replace(',', '.');
  if (cleaned === '') {
    return Number.NaN;
  }
  return Number(cleaned);
}

/** Formats a number the French way, e.g. 1234.5 -> "1 234,5". */
export function formatNumber(value: number, maxDecimals = 1): string {
  return new Intl.NumberFormat('fr-FR', { maximumFractionDigits: maxDecimals }).format(value);
}

/** Formats a payback period given in years, e.g. 8.5 -> "8 ans et 6 mois". */
export function formatYearsAndMonths(years: number): string {
  const totalMonths = Math.round(years * 12);
  const y = Math.floor(totalMonths / 12);
  const m = totalMonths % 12;
  const yearsText = `${y} an${y > 1 ? 's' : ''}`;
  if (m === 0) {
    return yearsText;
  }
  return y === 0 ? `${m} mois` : `${yearsText} et ${m} mois`;
}
