import AsyncStorage from '@react-native-async-storage/async-storage';

import type { Installation } from '../domain/types';

// ADR-006: client data stays on the client's device, the company never stores it.
// AsyncStorage maps to localStorage on the web and to app storage on mobile.
// TODO(ADR-006): encrypt this payload with a key protected by the user's PIN
// (expo-secure-store on mobile) once the PO answers the multi-device question.
const STORAGE_KEY = 'app-solaire/installation/v1';

export async function loadInstallation(): Promise<Installation | null> {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Installation) : null;
  } catch (error) {
    console.warn('Could not read the installation from local storage', error);
    return null;
  }
}

export async function saveInstallation(installation: Installation): Promise<void> {
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(installation));
}

export async function deleteInstallation(): Promise<void> {
  await AsyncStorage.removeItem(STORAGE_KEY);
}
