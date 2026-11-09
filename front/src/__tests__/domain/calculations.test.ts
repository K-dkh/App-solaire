import { describe, expect, it } from '@jest/globals';

import {
  computeNetCost,
  computeYieldPct,
  formatNumber,
  formatYearsAndMonths,
  parseFrenchNumber,
  roundCoordinates,
} from '../../domain/calculations';

// Intl uses non-breaking spaces as thousands separators in French: normalise them to compare.
const normaliseSpaces = (text: string) => text.replace(/\s/g, ' ');

describe('computeYieldPct (FCT-17, FCT-30)', () => {
  // Reference values from the Sprint 1 test plan, computed by hand from the formula.
  it.each([
    ['TC-17-01', 400, 1.9, 21.05],
    ['TC-17-02', 300, 1.6, 18.75],
  ])('%s: %d Wc on %d m² gives %d %%', (_id, peakPowerWc, surfaceM2, expected) => {
    expect(computeYieldPct(peakPowerWc, surfaceM2)).toBeCloseTo(expected, 2);
  });

  it('computes the yield of a whole installation (4 kWc on 19 m²)', () => {
    expect(computeYieldPct(4000, 19)).toBeCloseTo(21.05, 2);
  });

  it('returns 0 % for a zero peak power', () => {
    expect(computeYieldPct(0, 1.9)).toBe(0);
  });

  it('TC-17-03: rejects a zero or negative surface instead of dividing by zero', () => {
    expect(() => computeYieldPct(400, 0)).toThrow('Surface must be strictly positive');
    expect(() => computeYieldPct(400, -1)).toThrow('Surface must be strictly positive');
  });

  it('rejects a surface or a peak power that is not a number', () => {
    expect(() => computeYieldPct(400, Number.NaN)).toThrow('Surface must be strictly positive');
    expect(() => computeYieldPct(Number.NaN, 1.9)).toThrow('Peak power must be positive');
  });

  it('rejects a negative peak power', () => {
    expect(() => computeYieldPct(-400, 1.9)).toThrow('Peak power must be positive');
  });
});

describe('computeNetCost', () => {
  it('deducts subsidies and never goes below zero', () => {
    expect(computeNetCost(9000, 1000)).toBe(8000);
    expect(computeNetCost(1000, 2000)).toBe(0);
  });

  it('returns the full cost when there is no subsidy', () => {
    expect(computeNetCost(9000, 0)).toBe(9000);
  });

  it('returns 0 when subsidies equal the cost', () => {
    expect(computeNetCost(9000, 9000)).toBe(0);
  });
});

describe('parseFrenchNumber', () => {
  it('accepts commas, dots and spaces', () => {
    expect(parseFrenchNumber('0,25')).toBe(0.25);
    expect(parseFrenchNumber('9 000')).toBe(9000);
    expect(parseFrenchNumber('1.5')).toBe(1.5);
  });

  it('ignores spaces around the number', () => {
    expect(parseFrenchNumber('  12 ')).toBe(12);
  });

  it('keeps the sign of negative numbers', () => {
    expect(parseFrenchNumber('-1,5')).toBe(-1.5);
  });

  it('returns NaN for empty or invalid input', () => {
    expect(parseFrenchNumber('')).toBeNaN();
    expect(parseFrenchNumber('   ')).toBeNaN();
    expect(parseFrenchNumber('abc')).toBeNaN();
    expect(parseFrenchNumber('12 kWc')).toBeNaN();
  });
});

describe('roundCoordinates (GDPR)', () => {
  it('keeps two decimals (~1 km)', () => {
    expect(roundCoordinates({ latitude: 43.949317, longitude: 4.805528 })).toEqual({
      latitude: 43.95,
      longitude: 4.81,
    });
  });

  it('also rounds negative coordinates (west of Greenwich)', () => {
    expect(roundCoordinates({ latitude: 48.123456, longitude: -1.678912 })).toEqual({
      latitude: 48.12,
      longitude: -1.68,
    });
  });

  it('does not change coordinates that are already rounded', () => {
    expect(roundCoordinates({ latitude: 43.95, longitude: 4.81 })).toEqual({ latitude: 43.95, longitude: 4.81 });
  });
});

describe('formatNumber', () => {
  it('uses a comma as decimal separator and a space between thousands', () => {
    expect(normaliseSpaces(formatNumber(1234.5))).toBe('1 234,5');
  });

  it('rounds to one decimal by default', () => {
    expect(formatNumber(21.0526)).toBe('21,1');
  });

  it('respects the requested number of decimals', () => {
    expect(formatNumber(21.0526, 2)).toBe('21,05');
    expect(normaliseSpaces(formatNumber(8899.6, 0))).toBe('8 900');
  });

  it('does not add useless decimals', () => {
    expect(formatNumber(15, 2)).toBe('15');
  });
});

describe('formatYearsAndMonths (FCT-24)', () => {
  it('formats a payback period', () => {
    expect(formatYearsAndMonths(8.5)).toBe('8 ans et 6 mois');
    expect(formatYearsAndMonths(1)).toBe('1 an');
    expect(formatYearsAndMonths(0.25)).toBe('3 mois');
  });

  // Reference values from the Sprint 1 test plan: 9000 € / 600 €/an and 9000 € / 800 €/an.
  it('TC-24-01: 15 years is displayed without months', () => {
    expect(formatYearsAndMonths(9000 / 600)).toBe('15 ans');
  });

  it('TC-24-02: 11.25 years is displayed as 11 years and 3 months', () => {
    expect(formatYearsAndMonths(9000 / 800)).toBe('11 ans et 3 mois');
  });

  it('uses the singular for one year', () => {
    expect(formatYearsAndMonths(1.5)).toBe('1 an et 6 mois');
  });

  it('rounds to the nearest month, and carries over to the next year', () => {
    expect(formatYearsAndMonths(11.99)).toBe('12 ans');
  });
});
