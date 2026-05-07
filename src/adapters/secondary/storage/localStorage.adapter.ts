import type { TournamentState } from '../../../types';
import type { StoragePort } from '../../../core/ports/storage.port';

export const STORAGE_KEY = 'sale_padel_day_state_v2';

export const isValidState = (data: unknown): data is TournamentState => {
  if (!data || typeof data !== 'object') return false;
  const state = data as TournamentState;
  if (state.active !== null) {
    if (typeof state.active !== 'object') return false;
    if (!Array.isArray(state.active.teams)) return false;
    if (!Array.isArray(state.active.history)) return false;
    if (typeof state.active.currentRoundIndex !== 'number') return false;
  }
  if (!Array.isArray(state.journeys)) return false;
  return true;
};

export const createLocalStorageAdapter = (): StoragePort => ({
  save: async (state: TournamentState): Promise<void> => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (error) {
      console.error('Failed to save to localStorage:', error);
      // Fail silently to keep app functional
    }
  },

  load: async (): Promise<TournamentState | null> => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (!saved) return null;

      const parsed = JSON.parse(saved);
      if (isValidState(parsed)) {
        return parsed;
      }
      return null;
    } catch (error) {
      console.error('Failed to load tournament state from localStorage:', error);
      return null;
    }
  },
});