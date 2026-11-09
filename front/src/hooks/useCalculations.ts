import { useEffect, useState } from 'react';

import type { Installation } from '../domain/types';
import { fetchCalculations } from '../services/api';
import type { CalculationResult } from '../services/api';

export type CalculationState =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'ok'; result: CalculationResult }
  | { status: 'offline' };

/**
 * Asks the team's API for production, savings and payback (FCT-31, FCT-42, FCT-43).
 * Falls back to "offline" when the API is not running, so the screens never break.
 */
export function useCalculations(installation: Installation | null): CalculationState {
  // The answer is stored with the version of the installation it belongs to:
  // when the installation changes, the old answer no longer matches and we show "loading".
  const [answer, setAnswer] = useState<{ key: string; state: CalculationState } | null>(null);
  const key = installation ? `${installation.id}:${installation.updatedAt}` : null;

  useEffect(() => {
    if (!installation || !key) {
      return;
    }
    let cancelled = false;
    fetchCalculations(installation)
      .then((result) => {
        if (!cancelled) setAnswer({ key, state: { status: 'ok', result } });
      })
      .catch(() => {
        if (!cancelled) setAnswer({ key, state: { status: 'offline' } });
      });
    return () => {
      cancelled = true;
    };
  }, [installation, key]);

  if (!key) {
    return { status: 'idle' };
  }
  return answer?.key === key ? answer.state : { status: 'loading' };
}
