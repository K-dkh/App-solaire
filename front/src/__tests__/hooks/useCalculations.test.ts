import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { renderHook, waitFor } from '@testing-library/react-native';

import type { Installation } from '../../domain/types';
import { useCalculations } from '../../hooks/useCalculations';
import type { CalculationResult } from '../../services/api';
import { fetchCalculations } from '../../services/api';
import { makeInstallation } from '../helpers/fixtures';

jest.mock('../../services/api');
const fetchMock = jest.mocked(fetchCalculations);

const RESULT: CalculationResult = { yieldPct: 21.05, annualProductionKwh: 4800, annualSavingsEur: 1050, paybackYears: 8.5 };

/** A promise that the test resolves by hand, to control the order of the API answers. */
function deferred<T>() {
  let resolve!: (value: T) => void;
  const promise = new Promise<T>((res) => {
    resolve = res;
  });
  return { promise, resolve };
}

describe('useCalculations (FCT-31, FCT-42, FCT-43)', () => {
  beforeEach(() => {
    fetchMock.mockReset();
  });

  it('stays idle and does not call the API without an installation', async () => {
    const { result } = await renderHook(() => useCalculations(null));

    expect(result.current).toEqual({ status: 'idle' });
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('is loading, then returns the results of the API', async () => {
    const answer = deferred<CalculationResult>();
    fetchMock.mockReturnValueOnce(answer.promise);
    const installation = makeInstallation();

    const { result } = await renderHook(() => useCalculations(installation));
    expect(result.current).toEqual({ status: 'loading' });

    answer.resolve(RESULT);
    await waitFor(() => expect(result.current).toEqual({ status: 'ok', result: RESULT }));
    expect(fetchMock).toHaveBeenCalledWith(installation);
  });

  it('switches to offline when the API does not answer, instead of failing', async () => {
    fetchMock.mockRejectedValueOnce(new Error('Network request failed'));
    // Created once, as in the app where the installation comes from the context.
    const installation = makeInstallation();

    const { result } = await renderHook(() => useCalculations(installation));

    await waitFor(() => expect(result.current).toEqual({ status: 'offline' }));
  });

  it('asks the API again when the installation is edited', async () => {
    fetchMock.mockResolvedValueOnce(RESULT);
    const { result, rerender } = await renderHook((installation: Installation) => useCalculations(installation), {
      initialProps: makeInstallation(),
    });
    await waitFor(() => expect(result.current.status).toBe('ok'));

    const updated = { ...RESULT, paybackYears: 7 };
    const answer = deferred<CalculationResult>();
    fetchMock.mockReturnValueOnce(answer.promise);
    await rerender(makeInstallation({ costEur: 8000, updatedAt: '2026-11-10T10:00:00.000Z' }));

    // The old results belong to the old version of the installation: they are no longer shown.
    expect(result.current).toEqual({ status: 'loading' });
    answer.resolve(updated);
    await waitFor(() => expect(result.current).toEqual({ status: 'ok', result: updated }));
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });

  it('ignores a late answer that belongs to a previous version of the installation', async () => {
    const first = deferred<CalculationResult>();
    const second = deferred<CalculationResult>();
    fetchMock.mockReturnValueOnce(first.promise).mockReturnValueOnce(second.promise);

    const { result, rerender } = await renderHook((installation: Installation) => useCalculations(installation), {
      initialProps: makeInstallation(),
    });
    await rerender(makeInstallation({ updatedAt: '2026-11-10T10:00:00.000Z' }));

    second.resolve({ ...RESULT, paybackYears: 7 });
    await waitFor(() => expect(result.current.status).toBe('ok'));
    first.resolve({ ...RESULT, paybackYears: 99 });
    await first.promise;

    expect(result.current).toEqual({ status: 'ok', result: { ...RESULT, paybackYears: 7 } });
  });

  it('goes back to idle when the installation is deleted', async () => {
    fetchMock.mockResolvedValueOnce(RESULT);
    const { result, rerender } = await renderHook(
      (installation: Installation | null) => useCalculations(installation),
      { initialProps: makeInstallation() as Installation | null },
    );
    await waitFor(() => expect(result.current.status).toBe('ok'));

    await rerender(null);

    expect(result.current).toEqual({ status: 'idle' });
  });
});
