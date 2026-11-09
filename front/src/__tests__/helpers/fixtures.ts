import type { Installation } from '../../domain/types';

/**
 * A complete, valid installation used by the tests: 10 monocrystalline panels,
 * 4 kWc on 19 m² in Avignon. Any field can be overridden.
 */
export function makeInstallation(overrides: Partial<Installation> = {}): Installation {
  return {
    id: 'inst-1',
    name: 'Ma maison',
    address: '12 rue des Lilas, Avignon',
    coordinates: { latitude: 43.95, longitude: 4.81 },
    panelType: 'monocrystalline',
    panelCount: 10,
    peakPowerWc: 4000,
    surfaceM2: 19,
    orientation: 'S',
    tiltDeg: 30,
    costEur: 9000,
    subsidiesEur: 1000,
    electricityPriceEurPerKwh: 0.25,
    createdAt: '2026-11-09T10:00:00.000Z',
    updatedAt: '2026-11-09T10:00:00.000Z',
    ...overrides,
  };
}
