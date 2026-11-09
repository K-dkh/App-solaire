import { describe, expect, it } from '@jest/globals';

import {
  computeNetCost,
  computeYieldPct,
  formatYearsAndMonths,
  parseFrenchNumber,
  roundCoordinates,
} from '../../domain/calculations';

describe('computeYieldPct (FCT-30)', () => {
  it('computes the yield of a 400 Wc panel on 1.9 m²', () => {
    expect(computeYieldPct(400, 1.9)).toBeCloseTo(21.05, 2);
  });

  it('rejects a zero or negative surface', () => {
    expect(() => computeYieldPct(400, 0)).toThrow();
    expect(() => computeYieldPct(400, -1)).toThrow();
  });
});

describe('computeNetCost', () => {
  it('deducts subsidies and never goes below zero', () => {
    expect(computeNetCost(9000, 1000)).toBe(8000);
    expect(computeNetCost(1000, 2000)).toBe(0);
  });
});

describe('parseFrenchNumber', () => {
  it('accepts commas, dots and spaces', () => {
    expect(parseFrenchNumber('0,25')).toBe(0.25);
    expect(parseFrenchNumber('9 000')).toBe(9000);
    expect(parseFrenchNumber('1.5')).toBe(1.5);
  });

  it('returns NaN for empty or invalid input', () => {
    expect(parseFrenchNumber('')).toBeNaN();
    expect(parseFrenchNumber('abc')).toBeNaN();
  });
});

describe('roundCoordinates (GDPR)', () => {
  it('keeps two decimals (~1 km)', () => {
    expect(roundCoordinates({ latitude: 43.949317, longitude: 4.805528 })).toEqual({
      latitude: 43.95,
      longitude: 4.81,
    });
  });
});

describe('formatYearsAndMonths', () => {
  it('formats a payback period', () => {
    expect(formatYearsAndMonths(8.5)).toBe('8 ans et 6 mois');
    expect(formatYearsAndMonths(1)).toBe('1 an');
    expect(formatYearsAndMonths(0.25)).toBe('3 mois');
  });
});
