import type { TournamentState } from '../../types';

export interface StoragePort {
  save(state: TournamentState): Promise<void>;
  load(): Promise<TournamentState | null>;
}