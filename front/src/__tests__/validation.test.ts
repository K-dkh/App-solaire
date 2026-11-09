import { describe, expect, it } from '@jest/globals';

import type { InstallationFormValues } from '../domain/types';
import { EMPTY_FORM, toFormValues, toInstallation, validateInstallation } from '../domain/validation';

const VALID: InstallationFormValues = {
  ...EMPTY_FORM,
  address: '84000 Avignon',
  panelCount: '10',
  peakPowerKwc: '4',
  surfaceM2: '19',
  tiltDeg: '30',
  costEur: '9 000',
  subsidiesEur: '800',
  electricityPriceEurPerKwh: '0,20',
};

describe('validateInstallation (FCT-10, FCT-12)', () => {
  it('accepts a complete installation', () => {
    expect(validateInstallation(VALID)).toEqual({});
  });

  it('requires an address or a position', () => {
    expect(validateInstallation({ ...VALID, address: '' }).address).toBeDefined();
    expect(
      validateInstallation({ ...VALID, address: '', coordinates: { latitude: 43.95, longitude: 4.81 } }).address,
    ).toBeUndefined();
  });

  it('rejects non-positive costs and prices', () => {
    const errors = validateInstallation({ ...VALID, costEur: '0', electricityPriceEurPerKwh: '-1' });
    expect(errors.costEur).toBeDefined();
    expect(errors.electricityPriceEurPerKwh).toBeDefined();
  });

  it('rejects a tilt outside 0–90°', () => {
    expect(validateInstallation({ ...VALID, tiltDeg: '95' }).tiltDeg).toBeDefined();
  });

  it('rejects a non-integer panel count', () => {
    expect(validateInstallation({ ...VALID, panelCount: '2,5' }).panelCount).toBeDefined();
  });

  it('rejects subsidies higher than the cost', () => {
    expect(validateInstallation({ ...VALID, subsidiesEur: '10 000' }).subsidiesEur).toBeDefined();
  });

  it('treats subsidies as optional', () => {
    expect(validateInstallation({ ...VALID, subsidiesEur: '' })).toEqual({});
  });
});

describe('toInstallation / toFormValues', () => {
  it('round-trips the form values', () => {
    const installation = toInstallation(VALID);
    expect(installation.costEur).toBe(9000);
    expect(installation.peakPowerWc).toBe(4000);
    expect(installation.electricityPriceEurPerKwh).toBe(0.2);
    expect(installation.name).toBe('Mon installation');
    expect(toInstallation(toFormValues(installation), installation).costEur).toBe(9000);
  });
});
