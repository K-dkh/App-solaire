import { afterEach, beforeEach, describe, expect, it, jest } from '@jest/globals';

import type { Installation, InstallationFormValues } from '../../domain/types';
import { EMPTY_FORM, toFormValues, toInstallation, validateInstallation } from '../../domain/validation';

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

  it('does not accept an address made only of spaces', () => {
    expect(validateInstallation({ ...VALID, address: '   ' }).address).toBe(
      'Indiquez une adresse ou utilisez votre position.',
    );
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

  describe('TC-07-02: panel count, peak power and surface must be strictly positive', () => {
    it.each([
      ['panelCount', 'Le nombre de panneaux'],
      ['peakPowerKwc', 'La puissance crête'],
      ['surfaceM2', 'La surface'],
    ] as const)('%s', (field, label) => {
      expect(validateInstallation({ ...VALID, [field]: '0' })[field]).toBe(`${label} doit être strictement positif.`);
      expect(validateInstallation({ ...VALID, [field]: '-1' })[field]).toBe(`${label} doit être strictement positif.`);
    });
  });

  it('TC-07-03: accepts a tilt of 0° and of 90°', () => {
    expect(validateInstallation({ ...VALID, tiltDeg: '0' }).tiltDeg).toBeUndefined();
    expect(validateInstallation({ ...VALID, tiltDeg: '90' }).tiltDeg).toBeUndefined();
  });

  it('TC-07-04: rejects a tilt of -1° and of 91°', () => {
    expect(validateInstallation({ ...VALID, tiltDeg: '-1' }).tiltDeg).toBe("L'inclinaison doit être supérieur ou égal à 0.");
    expect(validateInstallation({ ...VALID, tiltDeg: '91' }).tiltDeg).toBe("L'inclinaison doit être inférieur ou égal à 90.");
  });

  it('TC-10-02: rejects a negative cost, price or subsidy', () => {
    const errors = validateInstallation({
      ...VALID,
      costEur: '-9000',
      subsidiesEur: '-1',
      electricityPriceEurPerKwh: '-0,2',
    });
    expect(errors.costEur).toBe('Le coût doit être strictement positif.');
    expect(errors.subsidiesEur).toBe('Le montant des aides doit être supérieur ou égal à 0.');
    expect(errors.electricityPriceEurPerKwh).toBe('Le prix du kWh doit être strictement positif.');
  });

  it('reports every missing mandatory field of an empty form', () => {
    const errors = validateInstallation(EMPTY_FORM);
    expect(Object.keys(errors).sort()).toEqual(
      ['address', 'costEur', 'electricityPriceEurPerKwh', 'panelCount', 'peakPowerKwc', 'surfaceM2'].sort(),
    );
    expect(errors.panelCount).toBe('Le nombre de panneaux est obligatoire et doit être un nombre.');
  });

  it('rejects text that is not a number', () => {
    expect(validateInstallation({ ...VALID, surfaceM2: 'vingt' }).surfaceM2).toBe(
      'La surface est obligatoire et doit être un nombre.',
    );
  });

  it('rejects unrealistic values above the maximum', () => {
    const errors = validateInstallation({
      ...VALID,
      panelCount: '1001',
      peakPowerKwc: '1001',
      electricityPriceEurPerKwh: '5,01',
    });
    expect(errors.panelCount).toBe('Le nombre de panneaux doit être inférieur ou égal à 1000.');
    expect(errors.peakPowerKwc).toBe('La puissance crête doit être inférieur ou égal à 1000.');
    expect(errors.electricityPriceEurPerKwh).toBe('Le prix du kWh doit être inférieur ou égal à 5.');
  });

  it('accepts values equal to the maximum', () => {
    expect(validateInstallation({ ...VALID, panelCount: '1000', peakPowerKwc: '1000', electricityPriceEurPerKwh: '5' })).toEqual(
      {},
    );
  });

  it('accepts subsidies equal to the cost', () => {
    expect(validateInstallation({ ...VALID, subsidiesEur: '9000' }).subsidiesEur).toBeUndefined();
  });

  it('does not compare subsidies with an invalid cost', () => {
    const errors = validateInstallation({ ...VALID, costEur: '', subsidiesEur: '500' });
    expect(errors.costEur).toBeDefined();
    expect(errors.subsidiesEur).toBeUndefined();
  });
});

describe('toInstallation / toFormValues', () => {
  const NOW = new Date('2026-11-09T10:00:00.000Z');

  beforeEach(() => {
    jest.useFakeTimers({ now: NOW });
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('round-trips the form values', () => {
    const installation = toInstallation(VALID);
    expect(installation.costEur).toBe(9000);
    expect(installation.peakPowerWc).toBe(4000);
    expect(installation.electricityPriceEurPerKwh).toBe(0.2);
    expect(installation.name).toBe('Mon installation');
    expect(toInstallation(toFormValues(installation), installation).costEur).toBe(9000);
  });

  it('converts every field of a new installation', () => {
    const installation = toInstallation({ ...VALID, name: '  Ma maison  ', address: ' 84000 Avignon ', peakPowerKwc: '3,6' });
    const expected: Installation = {
      id: `inst-${NOW.getTime()}`,
      name: 'Ma maison',
      address: '84000 Avignon',
      coordinates: null,
      panelType: 'monocrystalline',
      panelCount: 10,
      peakPowerWc: 3600,
      surfaceM2: 19,
      orientation: 'S',
      tiltDeg: 30,
      costEur: 9000,
      subsidiesEur: 800,
      electricityPriceEurPerKwh: 0.2,
      createdAt: NOW.toISOString(),
      updatedAt: NOW.toISOString(),
    };
    expect(installation).toEqual(expected);
  });

  it('stores 0 € of subsidies when the field is left empty', () => {
    expect(toInstallation({ ...VALID, subsidiesEur: '' }).subsidiesEur).toBe(0);
  });

  it('keeps the id and the creation date when an installation is edited', () => {
    const existing = toInstallation(VALID);
    jest.setSystemTime(new Date('2026-12-01T08:00:00.000Z'));

    const edited = toInstallation({ ...VALID, costEur: '10 000' }, existing);

    expect(edited.id).toBe(existing.id);
    expect(edited.createdAt).toBe(existing.createdAt);
    expect(edited.updatedAt).toBe('2026-12-01T08:00:00.000Z');
    expect(edited.costEur).toBe(10000);
  });

  it('writes decimals with a comma and converts Wc back to kWc for the form', () => {
    const values = toFormValues(toInstallation({ ...VALID, peakPowerKwc: '3,6', surfaceM2: '17,5' }));
    expect(values.peakPowerKwc).toBe('3,6');
    expect(values.surfaceM2).toBe('17,5');
    expect(values.electricityPriceEurPerKwh).toBe('0,2');
  });

  it('leaves the subsidies field empty when there is no subsidy', () => {
    expect(toFormValues(toInstallation({ ...VALID, subsidiesEur: '' })).subsidiesEur).toBe('');
  });

  it('gives form values that are valid again', () => {
    expect(validateInstallation(toFormValues(toInstallation(VALID)))).toEqual({});
  });
});

describe('EMPTY_FORM', () => {
  it('pre-selects a south-facing monocrystalline installation tilted at 30°', () => {
    expect(EMPTY_FORM).toMatchObject({ panelType: 'monocrystalline', orientation: 'S', tiltDeg: '30', coordinates: null });
  });
});

describe('editing an installation (FCT-13)', () => {
  it('keeps the id and creation date and applies the changes', () => {
    const original = toInstallation({ ...VALID, coordinates: { latitude: 43.95, longitude: 4.81 } });
    const edited = toInstallation({ ...toFormValues(original), tiltDeg: '35', costEur: '9 500' }, original);
    expect(edited.id).toBe(original.id);
    expect(edited.createdAt).toBe(original.createdAt);
    expect(edited.tiltDeg).toBe(35);
    expect(edited.costEur).toBe(9500);
    expect(edited.coordinates).toEqual({ latitude: 43.95, longitude: 4.81 });
  });

  it('converts the stored peak power back to kWc for the form', () => {
    const original = toInstallation({ ...VALID, peakPowerKwc: '3,6' });
    expect(toFormValues(original).peakPowerKwc).toBe('3,6');
  });
});
