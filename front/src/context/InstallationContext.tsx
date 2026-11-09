import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';

import type { Installation } from '../domain/types';
import { deleteInstallation, loadInstallation, saveInstallation } from '../storage/installationStorage';

interface InstallationContextValue {
  installation: Installation | null;
  isLoading: boolean;
  save: (installation: Installation) => Promise<void>;
  remove: () => Promise<void>;
}

const InstallationContext = createContext<InstallationContextValue | undefined>(undefined);

/** Holds the client's installation for every screen and keeps it in local storage. */
export function InstallationProvider({ children }: { children: ReactNode }) {
  const [installation, setInstallation] = useState<Installation | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadInstallation()
      .then(setInstallation)
      .finally(() => setIsLoading(false));
  }, []);

  const save = useCallback(async (next: Installation) => {
    await saveInstallation(next);
    setInstallation(next);
  }, []);

  const remove = useCallback(async () => {
    await deleteInstallation();
    setInstallation(null);
  }, []);

  const value = useMemo(
    () => ({ installation, isLoading, save, remove }),
    [installation, isLoading, save, remove],
  );

  return <InstallationContext.Provider value={value}>{children}</InstallationContext.Provider>;
}

export function useInstallation(): InstallationContextValue {
  const context = useContext(InstallationContext);
  if (!context) {
    throw new Error('useInstallation must be used inside InstallationProvider');
  }
  return context;
}
