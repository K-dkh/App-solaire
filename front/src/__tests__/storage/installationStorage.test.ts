import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { deleteInstallation, loadInstallation, saveInstallation } from '../../storage/installationStorage';
import { makeInstallation } from '../helpers/fixtures';

// AsyncStorage is replaced by an in-memory mock in jest.setup.js.
const STORAGE_KEY = 'app-solaire/installation/v1';

describe('installationStorage (ADR-006)', () => {
  beforeEach(async () => {
    await AsyncStorage.clear();
    jest.restoreAllMocks();
  });

  it('returns null when no installation has been saved yet', async () => {
    await expect(loadInstallation()).resolves.toBeNull();
  });

  it('TC-07-05: reloads the installation that was saved', async () => {
    const installation = makeInstallation();

    await saveInstallation(installation);

    await expect(loadInstallation()).resolves.toEqual(installation);
  });

  it('stores the installation as JSON under a versioned key', async () => {
    await saveInstallation(makeInstallation());

    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    expect(raw).not.toBeNull();
    expect(JSON.parse(raw as string).id).toBe('inst-1');
  });

  it('replaces the previous installation when saving again', async () => {
    await saveInstallation(makeInstallation({ costEur: 9000 }));
    await saveInstallation(makeInstallation({ costEur: 10000 }));

    await expect(loadInstallation()).resolves.toMatchObject({ costEur: 10000 });
  });

  it('deletes the installation from the device', async () => {
    await saveInstallation(makeInstallation());

    await deleteInstallation();

    await expect(loadInstallation()).resolves.toBeNull();
  });

  it('returns null instead of crashing when the stored data is corrupted', async () => {
    const warn = jest.spyOn(console, 'warn').mockImplementation(() => {});
    await AsyncStorage.setItem(STORAGE_KEY, '{not json');

    await expect(loadInstallation()).resolves.toBeNull();
    expect(warn).toHaveBeenCalledWith('Could not read the installation from local storage', expect.any(SyntaxError));
  });

  it('returns null instead of crashing when the storage cannot be read', async () => {
    jest.spyOn(console, 'warn').mockImplementation(() => {});
    jest.spyOn(AsyncStorage, 'getItem').mockRejectedValueOnce(new Error('disk error'));

    await expect(loadInstallation()).resolves.toBeNull();
  });

  it('lets a write error reach the caller, so the screen can react', async () => {
    jest.spyOn(AsyncStorage, 'setItem').mockRejectedValueOnce(new Error('disk full'));

    await expect(saveInstallation(makeInstallation())).rejects.toThrow('disk full');
  });
});
