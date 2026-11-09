import { ORIENTATIONS } from '../domain/panelTypes';
import type { Installation } from '../domain/types';

// Base URL of the team's Spring API. Set it in a .env file at the project root:
//   EXPO_PUBLIC_API_URL=http://192.168.1.20:8080
// On a phone, use the computer's local IP address, not "localhost".
export const API_URL = process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:8080';

const TIMEOUT_MS = 5000;

/** Results the dashboard expects from the API (FCT-31, FCT-42, FCT-43). */
export interface CalculationResult {
  yieldPct: number | null;
  annualProductionKwh: number | null;
  annualSavingsEur: number | null;
  paybackYears: number | null;
}

/**
 * Request body sent to the API. ADR-006: the API stores nothing, it only
 * computes from the parameters it receives. No name and no address are sent.
 *
 * PROVISIONAL CONTRACT: field names and the endpoint below must be checked
 * with Sheinez against the Swagger documentation of the API (S1-03).
 */
export function toCalculationRequest(installation: Installation) {
  return {
    latitude: installation.coordinates?.latitude ?? null,
    longitude: installation.coordinates?.longitude ?? null,
    panelType: installation.panelType,
    panelCount: installation.panelCount,
    peakPowerWc: installation.peakPowerWc,
    surfaceM2: installation.surfaceM2,
    azimuthDeg: ORIENTATIONS.find((o) => o.id === installation.orientation)?.azimuthDeg ?? 180,
    tiltDeg: installation.tiltDeg,
    costEur: installation.costEur,
    subsidiesEur: installation.subsidiesEur,
    electricityPriceEurPerKwh: installation.electricityPriceEurPerKwh,
  };
}

export async function fetchCalculations(installation: Installation): Promise<CalculationResult> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    const response = await fetch(`${API_URL}/api/v1/calculations`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(toCalculationRequest(installation)),
      signal: controller.signal,
    });
    if (!response.ok) {
      throw new Error(`API responded with status ${response.status}`);
    }
    const data = (await response.json()) as Partial<CalculationResult>;
    return {
      yieldPct: data.yieldPct ?? null,
      annualProductionKwh: data.annualProductionKwh ?? null,
      annualSavingsEur: data.annualSavingsEur ?? null,
      paybackYears: data.paybackYears ?? null,
    };
  } finally {
    clearTimeout(timer);
  }
}
