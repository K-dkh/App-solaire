import type { Orientation, PanelTypeId } from './types';

export interface PanelType {
  id: PanelTypeId;
  label: string;
  /** Typical efficiency, as a percentage. */
  typicalEfficiencyPct: number;
  /** Typical power of one panel, in watt-peak. */
  unitPeakPowerWc: number;
  /** Typical surface of one panel, in square metres. */
  unitSurfaceM2: number;
  /** Power loss per degree above 25 °C, in %/°C. */
  temperatureCoefficientPctPerC: number;
}

// Typical market values used to pre-fill the form (FCT-11).
// TODO(FCT-51): load this catalogue from the API once the admin catalogue exists.
export const PANEL_TYPES: PanelType[] = [
  {
    id: 'monocrystalline',
    label: 'Monocristallin',
    typicalEfficiencyPct: 21,
    unitPeakPowerWc: 400,
    unitSurfaceM2: 1.9,
    temperatureCoefficientPctPerC: -0.35,
  },
  {
    id: 'polycrystalline',
    label: 'Polycristallin',
    typicalEfficiencyPct: 17,
    unitPeakPowerWc: 300,
    unitSurfaceM2: 1.75,
    temperatureCoefficientPctPerC: -0.4,
  },
  {
    id: 'thin-film',
    label: 'Couche mince',
    typicalEfficiencyPct: 11.5,
    unitPeakPowerWc: 150,
    unitSurfaceM2: 1.3,
    temperatureCoefficientPctPerC: -0.25,
  },
];

export function getPanelType(id: PanelTypeId): PanelType {
  const found = PANEL_TYPES.find((type) => type.id === id);
  if (!found) {
    throw new Error(`Unknown panel type: ${id}`);
  }
  return found;
}

export const ORIENTATIONS: { id: Orientation; label: string; azimuthDeg: number }[] = [
  { id: 'N', label: 'Nord', azimuthDeg: 0 },
  { id: 'NE', label: 'Nord-Est', azimuthDeg: 45 },
  { id: 'E', label: 'Est', azimuthDeg: 90 },
  { id: 'SE', label: 'Sud-Est', azimuthDeg: 135 },
  { id: 'S', label: 'Sud', azimuthDeg: 180 },
  { id: 'SW', label: 'Sud-Ouest', azimuthDeg: 225 },
  { id: 'W', label: 'Ouest', azimuthDeg: 270 },
  { id: 'NW', label: 'Nord-Ouest', azimuthDeg: 315 },
];

export function getOrientationLabel(id: Orientation): string {
  return ORIENTATIONS.find((o) => o.id === id)?.label ?? id;
}
