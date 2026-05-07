import type { TournamentState } from '../../../types';
import type { StoragePort } from '../../../core/ports/storage.port';

export interface MockStorageOptions {
  /** Initial state to load (simulates persisted state) */
  initialState?: TournamentState | null;
  /** If true, save() will throw to simulate quota errors */
  shouldThrowOnSave?: boolean;
}

export const createMockStorageAdapter = (options: MockStorageOptions = {}): StoragePort & { reset: () => void } => {
  const { initialState = null, shouldThrowOnSave = false } = options;

  let currentState: TournamentState | null = initialState;

  return {
    save: async (state: TournamentState): Promise<void> => {
      try {
        if (shouldThrowOnSave) {
          throw new Error('Quota exceeded');
        }
        currentState = state;
      } catch (error) {
        console.error('Failed to save:', error);
        // Fail silently to keep app functional
      }
    },

    load: async (): Promise<TournamentState | null> => {
      return currentState;
    },

    reset: (): void => {
      currentState = initialState;
    },
  };
};