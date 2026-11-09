import { afterEach, beforeEach, describe, expect, it, jest } from '@jest/globals';

import { API_URL, fetchCalculations, toCalculationRequest } from '../../services/api';
import { makeInstallation } from '../helpers/fixtures';

// The API is never called for real: fetch is replaced by a mock (see the test strategy, section 3).
const fetchMock = jest.fn<typeof fetch>();

function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json' } });
}

beforeEach(() => {
  fetchMock.mockReset();
  globalThis.fetch = fetchMock as unknown as typeof fetch;
});

describe('API_URL', () => {
  const original = process.env.EXPO_PUBLIC_API_URL;

  afterEach(() => {
    // Assigning undefined would store the string "undefined": delete the variable instead.
    if (original === undefined) {
      delete process.env.EXPO_PUBLIC_API_URL;
    } else {
      process.env.EXPO_PUBLIC_API_URL = original;
    }
  });

  it('points to the local Spring API by default', () => {
    expect(API_URL).toBe('http://localhost:8080');
  });

  it('can be changed with EXPO_PUBLIC_API_URL', () => {
    process.env.EXPO_PUBLIC_API_URL = 'http://192.168.1.20:8080';
    // The URL is read when the module is loaded: load a fresh copy of it.
    jest.isolateModules(() => {
      // eslint-disable-next-line @typescript-eslint/no-require-imports -- Jest can only reload a module with require()
      const api = require('../../services/api') as typeof import('../../services/api');
      expect(api.API_URL).toBe('http://192.168.1.20:8080');
    });
  });
});

describe('toCalculationRequest', () => {
  it('sends the installation parameters with the orientation as an azimuth', () => {
    expect(toCalculationRequest(makeInstallation({ orientation: 'SE' }))).toEqual({
      latitude: 43.95,
      longitude: 4.81,
      panelType: 'monocrystalline',
      panelCount: 10,
      peakPowerWc: 4000,
      surfaceM2: 19,
      azimuthDeg: 135,
      tiltDeg: 30,
      costEur: 9000,
      subsidiesEur: 1000,
      electricityPriceEurPerKwh: 0.25,
    });
  });

  it('never sends personal data: no id, name or address (ADR-006)', () => {
    const request = toCalculationRequest(makeInstallation());
    expect(request).not.toHaveProperty('id');
    expect(request).not.toHaveProperty('name');
    expect(request).not.toHaveProperty('address');
  });

  it('sends null coordinates when the position is unknown', () => {
    const request = toCalculationRequest(makeInstallation({ coordinates: null }));
    expect(request.latitude).toBeNull();
    expect(request.longitude).toBeNull();
  });
});

describe('fetchCalculations', () => {
  const RESULT = { yieldPct: 21.05, annualProductionKwh: 4800, annualSavingsEur: 1050, paybackYears: 8.5 };

  it('posts the request as JSON to /api/v1/calculations', async () => {
    fetchMock.mockResolvedValueOnce(jsonResponse(RESULT));
    const installation = makeInstallation();

    await fetchCalculations(installation);

    expect(fetchMock).toHaveBeenCalledTimes(1);
    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toBe('http://localhost:8080/api/v1/calculations');
    expect(init?.method).toBe('POST');
    expect(init?.headers).toEqual({ 'Content-Type': 'application/json' });
    expect(JSON.parse(init?.body as string)).toEqual(toCalculationRequest(installation));
    expect(init?.signal).toBeInstanceOf(AbortSignal);
  });

  it('returns the results computed by the API', async () => {
    fetchMock.mockResolvedValueOnce(jsonResponse(RESULT));

    await expect(fetchCalculations(makeInstallation())).resolves.toEqual(RESULT);
  });

  it('replaces the results the API does not compute yet with null', async () => {
    fetchMock.mockResolvedValueOnce(jsonResponse({ yieldPct: 21.05 }));

    await expect(fetchCalculations(makeInstallation())).resolves.toEqual({
      yieldPct: 21.05,
      annualProductionKwh: null,
      annualSavingsEur: null,
      paybackYears: null,
    });
  });

  it('fails with the HTTP status when the API answers with an error', async () => {
    fetchMock.mockResolvedValueOnce(jsonResponse({ message: 'Bad request' }, 400));

    await expect(fetchCalculations(makeInstallation())).rejects.toThrow('API responded with status 400');
  });

  it('fails when the API cannot be reached', async () => {
    fetchMock.mockRejectedValueOnce(new TypeError('Network request failed'));

    await expect(fetchCalculations(makeInstallation())).rejects.toThrow('Network request failed');
  });

  describe('timeout', () => {
    beforeEach(() => {
      jest.useFakeTimers();
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    it('aborts the request after 5 seconds without an answer', async () => {
      // This fetch only settles when the request is aborted, like a server that never answers.
      fetchMock.mockImplementationOnce(
        (_url, init) =>
          new Promise<Response>((_resolve, reject) => {
            init?.signal?.addEventListener('abort', () => reject(new Error('Aborted')));
          }),
      );

      const promise = fetchCalculations(makeInstallation());
      const assertion = expect(promise).rejects.toThrow('Aborted');

      jest.advanceTimersByTime(4999);
      expect(fetchMock.mock.calls[0][1]?.signal?.aborted).toBe(false);
      jest.advanceTimersByTime(1);

      await assertion;
    });

    it('cancels the timer once the API has answered', async () => {
      fetchMock.mockResolvedValueOnce(jsonResponse(RESULT));

      await fetchCalculations(makeInstallation());

      expect(jest.getTimerCount()).toBe(0);
    });
  });
});
