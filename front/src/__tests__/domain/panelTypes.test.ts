import { describe, expect, it } from '@jest/globals';

import { computeYieldPct } from '../../domain/calculations';
import { getOrientationLabel, getPanelType, ORIENTATIONS, PANEL_TYPES } from '../../domain/panelTypes';
import type { PanelTypeId } from '../../domain/types';

describe('PANEL_TYPES catalogue (FCT-11)', () => {
  it('offers the three panel types of the mock-up', () => {
    expect(PANEL_TYPES.map((type) => type.id)).toEqual(['monocrystalline', 'polycrystalline', 'thin-film']);
  });

  it.each(PANEL_TYPES)('$label has positive typical values', (type) => {
    expect(type.unitPeakPowerWc).toBeGreaterThan(0);
    expect(type.unitSurfaceM2).toBeGreaterThan(0);
    expect(type.typicalEfficiencyPct).toBeGreaterThan(0);
    expect(type.temperatureCoefficientPctPerC).toBeLessThan(0);
  });

  // The typical efficiency shown to the user must match the power and surface used to pre-fill the form.
  it.each(PANEL_TYPES)('$label: typical efficiency is consistent with power and surface', (type) => {
    expect(computeYieldPct(type.unitPeakPowerWc, type.unitSurfaceM2)).toBeCloseTo(type.typicalEfficiencyPct, 0);
  });
});

describe('getPanelType', () => {
  it.each(PANEL_TYPES)('finds $id', (type) => {
    expect(getPanelType(type.id)).toBe(type);
  });

  it('throws on an unknown panel type', () => {
    expect(() => getPanelType('unknown' as PanelTypeId)).toThrow('Unknown panel type: unknown');
  });
});

describe('ORIENTATIONS', () => {
  it('lists the 8 compass directions, 45° apart, starting from the north', () => {
    expect(ORIENTATIONS.map((o) => o.azimuthDeg)).toEqual([0, 45, 90, 135, 180, 225, 270, 315]);
  });

  it('places the south at 180°, as expected by PVGIS', () => {
    expect(ORIENTATIONS.find((o) => o.id === 'S')?.azimuthDeg).toBe(180);
  });
});

describe('getOrientationLabel', () => {
  it('returns the French label of an orientation', () => {
    expect(getOrientationLabel('S')).toBe('Sud');
    expect(getOrientationLabel('NW')).toBe('Nord-Ouest');
  });
});
