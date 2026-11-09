import { jest } from '@jest/globals';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { renderRouter } from 'expo-router/testing-library';

import type { Installation } from '../../domain/types';
import type { CalculationResult } from '../../services/api';
import { saveInstallation } from '../../storage/installationStorage';

export const API_RESULT: CalculationResult = {
  yieldPct: 21.05,
  annualProductionKwh: 4800,
  annualSavingsEur: 1050,
  paybackYears: 8.5,
};

interface RenderAppOptions {
  /** Installation already saved on the device before the app starts. */
  installation?: Installation;
  /** Answer of the API, or "offline" when it cannot be reached. */
  api?: CalculationResult | 'offline';
}

/**
 * Starts the whole app (real routes of src/app) at the given URL.
 * The device storage is emptied first and the API is replaced by a mock of fetch.
 */
export async function renderApp(initialUrl: string, { installation, api = API_RESULT }: RenderAppOptions = {}) {
  await AsyncStorage.clear();
  if (installation) {
    await saveInstallation(installation);
  }

  const fetchMock = jest.fn<typeof fetch>(() =>
    api === 'offline'
      ? Promise.reject(new TypeError('Network request failed'))
      : Promise.resolve(new Response(JSON.stringify(api), { status: 200 })),
  );
  globalThis.fetch = fetchMock as unknown as typeof fetch;

  const result = await renderRouter('./src/app', { initialUrl });
  return { ...result, fetchMock };
}
