import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useTournament } from './useTournament';
import type { Team } from '../types';

const mockTeams: Team[] = [
  { id: '1', name: 'Team 1', players: [{ name: 'P1' }, { name: 'P2' }] },
  { id: '2', name: 'Team 2', players: [{ name: 'P3' }, { name: 'P4' }] },
  { id: '3', name: 'Team 3', players: [{ name: 'P5' }, { name: 'P6' }] },
];

describe('useTournament robustness', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should throw an error if starting with less than 2 teams', () => {
    const { result } = renderHook(() => useTournament());
    expect(() => {
      act(() => {
        result.current.startTournament([]);
      });
    }).toThrow('At least 2 teams are required to start a tournament');
  });

  it('should re-generate the next match when current match is changed', () => {
    const { result } = renderHook(() => useTournament());
    
    act(() => {
      result.current.startTournament(mockTeams);
    });

    expect(result.current.state.active?.history.length).toBe(2);
    
    // Force change current match to something else
    act(() => {
      result.current.changeCurrentMatch(mockTeams[1].id, mockTeams[2].id);
    });

    expect(result.current.state.active?.history.length).toBe(2);
  });

  it('should only archive matches with results in closeJourney', () => {
    const { result } = renderHook(() => useTournament());
    
    act(() => {
      result.current.startTournament(mockTeams);
    });

    // Initial: [m0, m1]. currentRoundIndex = 0.
    
    // Finish match 0
    act(() => {
      result.current.finishMatch({ winnerTeamId: mockTeams[0].id, score: '6-0' });
    });

    // After finish: [m0(result), m1, m2]. currentRoundIndex = 1.
    expect(result.current.state.active?.history.length).toBe(3);
    expect(result.current.state.active?.history[0].result).toBeDefined();
    expect(result.current.state.active?.history[1].result).toBeUndefined();
    expect(result.current.state.active?.history[2].result).toBeUndefined();

    act(() => {
      result.current.closeJourney();
    });

    // Should only contain m0(result)
    expect(result.current.state.journeys.length).toBe(1);
    expect(result.current.state.journeys[0].history.length).toBe(1);
    expect(result.current.state.journeys[0].history[0].result).toBeDefined();
  });

  it('should handle localStorage quota errors gracefully', () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const setItemSpy = vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('Quota exceeded');
    });

    const { result } = renderHook(() => useTournament());
    
    act(() => {
      result.current.startTournament(mockTeams);
    });

    expect(setItemSpy).toHaveBeenCalled();
    expect(consoleSpy).toHaveBeenCalledWith('Failed to save to localStorage:', expect.any(Error));
  });

  it('should ignore invalid state in localStorage', () => {
    localStorage.setItem('sale_padel_day_state_v2', '{"invalid": "data"}');
    const { result } = renderHook(() => useTournament());
    
    expect(result.current.state.active).toBeNull();
    expect(result.current.state.journeys).toEqual([]);
  });
});
