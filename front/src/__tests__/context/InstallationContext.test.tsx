import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { act, renderHook, waitFor } from '@testing-library/react-native';

import { InstallationProvider, useInstallation } from '../../context/InstallationContext';
import { loadInstallation, saveInstallation } from '../../storage/installationStorage';
import { makeInstallation } from '../helpers/fixtures';

// The real storage module is used, on top of the in-memory AsyncStorage mock (jest.setup.js).
async function renderInstallationHook() {
  const hook = await renderHook(() => useInstallation(), { wrapper: InstallationProvider });
  await waitFor(() => expect(hook.result.current.isLoading).toBe(false));
  return hook;
}

describe('InstallationContext', () => {
  beforeEach(async () => {
    jest.restoreAllMocks();
    await AsyncStorage.clear();
  });

  it('is loading until the local storage has been read', async () => {
    // The storage answers only when the test decides it, to observe the loading state.
    let answer!: (value: string | null) => void;
    jest.spyOn(AsyncStorage, 'getItem').mockReturnValueOnce(
      new Promise((resolve) => {
        answer = resolve;
      }),
    );

    const { result } = await renderHook(() => useInstallation(), { wrapper: InstallationProvider });
    expect(result.current.isLoading).toBe(true);

    await act(async () => answer(null));
    expect(result.current.isLoading).toBe(false);
  });

  it('starts without installation on a new device', async () => {
    const { result } = await renderInstallationHook();

    expect(result.current.installation).toBeNull();
  });

  it('TC-07-05: gives back the installation saved during a previous session', async () => {
    const saved = makeInstallation();
    await saveInstallation(saved);

    const { result } = await renderInstallationHook();

    expect(result.current.installation).toEqual(saved);
  });

  it('saves an installation on the device and shares it with every screen', async () => {
    const { result } = await renderInstallationHook();
    const installation = makeInstallation();

    await act(() => result.current.save(installation));

    expect(result.current.installation).toEqual(installation);
    await expect(loadInstallation()).resolves.toEqual(installation);
  });

  it('removes the installation from the device', async () => {
    await saveInstallation(makeInstallation());
    const { result } = await renderInstallationHook();

    await act(() => result.current.remove());

    expect(result.current.installation).toBeNull();
    await expect(loadInstallation()).resolves.toBeNull();
  });

  it('keeps the previous installation when saving fails', async () => {
    const previous = makeInstallation();
    await saveInstallation(previous);
    const { result } = await renderInstallationHook();
    jest.spyOn(AsyncStorage, 'setItem').mockRejectedValueOnce(new Error('disk full'));

    await expect(act(() => result.current.save(makeInstallation({ costEur: 1 })))).rejects.toThrow('disk full');

    expect(result.current.installation).toEqual(previous);
  });

  it('cannot be used outside InstallationProvider', async () => {
    // React logs the error thrown during rendering: silence it to keep the test output readable.
    jest.spyOn(console, 'error').mockImplementation(() => {});

    await expect(renderHook(() => useInstallation())).rejects.toThrow(
      'useInstallation must be used inside InstallationProvider',
    );
  });
});
